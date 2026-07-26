/**
 * BackendWakeupProvider — Dashboard App
 *
 * Silently wakes both Render services when a user opens the dashboard.
 * Designed specifically for Render free-tier: parallel pings with
 * 30 s retry intervals, up to 3 attempts (~90 s total).
 *
 * Shows a compact glassmorphic status badge anchored to the bottom-right.
 * Automatically hides 4 s after all services report "awake".
 * Failed services stay visible so users know something is wrong.
 */

"use client";

import { useBackendWakeup } from "../../lib/useBackendWakeup";
import { useEffect, useState } from "react";

// ─── Config — production Render URLs ───────────────────────────────────────
const WAKEUP_CONFIGS = [
  {
    name: "API",
    url: (() => {
      const base =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://autoapply-backend-wkqq.onrender.com";
      // Swap localhost refs for the real Render URL in production
      return base
        .replace("http://localhost:5000", "https://autoapply-backend-wkqq.onrender.com")
        .replace("http://127.0.0.1:5000", "https://autoapply-backend-wkqq.onrender.com") +
        "/api/health";
    })(),
  },
  {
    name: "ML",
    url: (() => {
      const base =
        process.env.NEXT_PUBLIC_FASTAPI_URL || "https://autoapply-scraper-backend.onrender.com";
      return base
        .replace("http://localhost:8001", "https://autoapply-scraper-backend.onrender.com")
        .replace("http://127.0.0.1:8001", "https://autoapply-scraper-backend.onrender.com") +
        "/health";
    })(),
  },
];

// ─── Metadata per status ────────────────────────────────────────────────────
const STATUS_META = {
  idle:    { label: "Standby",  color: "#4b5563", bg: "rgba(75,85,99,0.15)"    },
  pinging: { label: "Waking…", color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  warming: { label: "Warming…", color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  awake:   { label: "Online",  color: "#22c55e", bg: "rgba(34,197,94,0.12)"   },
  failed:  { label: "Offline", color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
};

export function BackendWakeupProvider({ children }: { children: React.ReactNode }) {
  const states = useBackendWakeup(WAKEUP_CONFIGS);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const entries = Object.entries(states);
  const allAwake = entries.every(([, s]) => s.status === "awake");
  const anyActive = entries.some(
    ([, s]) => s.status === "pinging" || s.status === "warming"
  );
  const anyFailed = entries.some(([, s]) => s.status === "failed");

  // Visibility logic: show while waking, hide 4 s after all awake
  useEffect(() => {
    if (anyActive) {
      setVisible(true);
    } else if (allAwake && !dismissed) {
      const id = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(id);
    } else if (anyFailed) {
      setVisible(true); // stay visible on failure so user sees it
    }
  }, [anyActive, allAwake, anyFailed, dismissed]);

  return (
    <>
      {children}

      {visible && !dismissed && (
        <div
          role="status"
          aria-live="polite"
          aria-label="Backend service status"
          style={{
            position: "fixed",
            bottom: "1.25rem",
            right: "1.25rem",
            zIndex: 9999,
            fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
            animation: "dbu-enter 0.3s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {/* ── Card ────────────────────────────────────────────────── */}
          <div
            style={{
              background: "rgba(10, 10, 18, 0.82)",
              backdropFilter: "blur(20px) saturate(1.6)",
              WebkitBackdropFilter: "blur(20px) saturate(1.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "0.875rem",
              padding: "0.75rem 1rem",
              minWidth: "10rem",
              boxShadow:
                "0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                {/* Server icon */}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="8" rx="2" />
                  <rect x="2" y="14" width="20" height="8" rx="2" />
                  <line x1="6" y1="6" x2="6.01" y2="6" />
                  <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
                <span
                  style={{
                    fontSize: "0.58rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.35)",
                  }}
                >
                  Services
                </span>
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => { setDismissed(true); setVisible(false); }}
                aria-label="Dismiss service status"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "0.3rem",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.6rem",
                  lineHeight: 1,
                  padding: "0.15rem 0.3rem",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.background =
                    "rgba(255,255,255,0.12)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.background =
                    "rgba(255,255,255,0.06)")
                }
              >
                ✕
              </button>
            </div>

            {/* ── Service rows ───────────────────────────────────────── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {entries.map(([name, state]) => {
                const meta = STATUS_META[state.status];
                const isActive =
                  state.status === "pinging" || state.status === "warming";
                return (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      background: meta.bg,
                      borderRadius: "0.45rem",
                      padding: "0.3rem 0.5rem",
                      border: `1px solid ${meta.color}22`,
                    }}
                  >
                    {/* Pulsing dot */}
                    <span
                      style={{
                        width: "0.42rem",
                        height: "0.42rem",
                        borderRadius: "50%",
                        background: meta.color,
                        flexShrink: 0,
                        boxShadow: isActive ? `0 0 5px ${meta.color}` : "none",
                        animation: isActive
                          ? "dbu-pulse 1.1s ease-in-out infinite"
                          : "none",
                      }}
                    />

                    {/* Service name */}
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: 500,
                        flex: 1,
                      }}
                    >
                      {name}
                    </span>

                    {/* Status label + attempt */}
                    <span
                      style={{
                        fontSize: "0.62rem",
                        color: meta.color,
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {state.status === "warming"
                        ? `retry ${state.attempt}/${3}`
                        : meta.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ── Indeterminate progress bar while active ─────────── */}
            {anyActive && (
              <div
                style={{
                  marginTop: "0.6rem",
                  height: "2px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "9999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: "40%",
                    background:
                      "linear-gradient(90deg, transparent, #f59e0b, #f97316, transparent)",
                    animation: "dbu-sweep 1.6s linear infinite",
                    borderRadius: "9999px",
                  }}
                />
              </div>
            )}

            {/* ── Hint text while warming ─────────────────────────── */}
            {anyActive && (
              <p
                style={{
                  margin: "0.4rem 0 0",
                  fontSize: "0.58rem",
                  color: "rgba(255,255,255,0.25)",
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                Render free-tier warming up…
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Keyframes ─────────────────────────────────────────────── */}
      <style>{`
        @keyframes dbu-enter {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0)   scale(1);     }
        }
        @keyframes dbu-pulse {
          0%, 100% { opacity: 1;   transform: scale(1);   }
          50%       { opacity: 0.4; transform: scale(1.5); }
        }
        @keyframes dbu-sweep {
          0%   { transform: translateX(-150%); }
          100% { transform: translateX(350%);  }
        }
      `}</style>
    </>
  );
}
