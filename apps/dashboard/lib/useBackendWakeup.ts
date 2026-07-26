/**
 * useBackendWakeup — Render Free-Tier Cold-Start Wake-Up Hook
 *
 * Render free-tier instances spin down after 15 min of inactivity.
 * First request can take 50–90 s to wake the dyno.
 *
 * Strategy (mirrors chrome-extension/background.js):
 *  • Fire a lightweight GET /health ping immediately on mount.
 *  • If the ping fails (503 / network error), retry up to MAX_RETRIES
 *    with RETRY_DELAY_MS between attempts — giving Render enough time
 *    to fully boot before the user actually needs the API.
 *  • AbortSignal.timeout() is used directly per-request (no AbortSignal.any
 *    dependency — avoids TS lib target issues).
 *  • The parent AbortController lets useEffect cleanup abort in-flight waits.
 */

import { useState, useEffect, useRef } from "react";

// ─── Render-tuned constants ────────────────────────────────────────────────
const RETRY_DELAY_MS = 30_000; // 30 s — matches Render's typical boot time
const MAX_RETRIES = 3;      // Up to ~90 s total patience
const REQUEST_TIMEOUT = 55_000; // 55 s per request (Render needs ~50 s max)

export type WakeupStatus =
  | "idle"
  | "pinging"
  | "warming"  // retrying — Render is still booting
  | "awake"
  | "failed";

export interface WakeupConfig {
  /** Absolute URL to ping, e.g. https://…onrender.com/api/health */
  url: string;
  /** Human-readable label shown in the status UI */
  name: string;
}

export interface WakeupState {
  status: WakeupStatus;
  attempt: number;
  error: string | null;
}

// ─── Per-service ping with retry ──────────────────────────────────────────

async function wakeupService(
  config: WakeupConfig,
  onProgress: (patch: Partial<WakeupState>) => void,
  parentSignal: AbortSignal
): Promise<"awake" | "failed"> {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    if (parentSignal.aborted) return "failed";

    onProgress({
      status: attempt === 1 ? "pinging" : "warming",
      attempt,
      error: null,
    });

    try {
      // Use AbortSignal.timeout for per-request timeout (widely supported).
      // Race it against parentSignal manually via a combined controller.
      const requestController = new AbortController();
      const timeoutId = setTimeout(
        () => requestController.abort(new Error("Request timed out")),
        REQUEST_TIMEOUT
      );

      // Propagate parent abort into the per-request controller
      const onParentAbort = () => requestController.abort();
      parentSignal.addEventListener("abort", onParentAbort, { once: true });

      let res: Response;
      try {
        res = await fetch(config.url, {
          method: "GET",
          signal: requestController.signal,
          cache: "no-store",
        });
      } finally {
        clearTimeout(timeoutId);
        parentSignal.removeEventListener("abort", onParentAbort);
      }

      // 401 = auth required → server is awake, just protected
      if (res.ok || res.status === 401) {
        console.info(`[WakeUp] ✅ ${config.name} is awake (attempt ${attempt})`);
        return "awake";
      }

      throw new Error(`HTTP ${res.status}`);

    } catch (err) {
      if (parentSignal.aborted) return "failed";

      lastError = err;
      console.warn(
        `[WakeUp] ⏳ ${config.name} attempt ${attempt}/${MAX_RETRIES} failed:`,
        err instanceof Error ? err.message : String(err)
      );

      // Wait before retrying, but bail early if parent is aborted
      if (attempt < MAX_RETRIES) {
        await new Promise<void>((resolve) => {
          const id = setTimeout(resolve, RETRY_DELAY_MS);
          const onAbort = () => { clearTimeout(id); resolve(); };
          parentSignal.addEventListener("abort", onAbort, { once: true });
        });
      }
    }
  }

  console.error(
    `[WakeUp] ❌ ${config.name} failed after ${MAX_RETRIES} attempts:`,
    lastError
  );
  return "failed";
}

// ─── Hook ─────────────────────────────────────────────────────────────────

export function useBackendWakeup(configs: WakeupConfig[]) {
  // Stable ref so the effect closure always sees the latest configs
  // without needing configs in the dependency array.
  const configsRef = useRef(configs);
  configsRef.current = configs;

  const [states, setStates] = useState<Record<string, WakeupState>>(() =>
    Object.fromEntries(
      configs.map((c) => [c.name, { status: "idle" as WakeupStatus, attempt: 0, error: null }])
    )
  );

  useEffect(() => {
    const controller = new AbortController();

    configsRef.current.forEach((config) => {
      wakeupService(
        config,
        (patch) => {
          setStates((prev) => ({
            ...prev,
            [config.name]: { ...prev[config.name], ...patch } as WakeupState,
          }));
        },
        controller.signal
      )
        .then((result) => {
          setStates((prev) => ({
            ...prev,
            [config.name]: {
              ...prev[config.name],
              status: result,
              error: result === "failed" ? "Backend unreachable" : null,
            } as WakeupState,
          }));
        })
        .catch(() => {
          // Only reached if wakeupService itself throws unexpectedly
          setStates((prev) => ({
            ...prev,
            [config.name]: {
              ...prev[config.name],
              status: "failed" as WakeupStatus,
              error: "Unexpected error",
            } as WakeupState,
          }));
        });
    });

    return () => {
      controller.abort();
    };
  }, []); // Runs once on mount — configsRef keeps the closure fresh

  return states;
}
