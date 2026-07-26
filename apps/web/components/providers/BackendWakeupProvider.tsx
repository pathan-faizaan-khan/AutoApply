/**
 * BackendWakeupProvider — Landing Page (web app)
 *
 * Silently wakes both Render services the moment a visitor lands on the page.
 * Designed specifically for Render free-tier: fires parallel pings with
 * 30 s retry intervals, up to 3 attempts (~90 s total).
 *
 * Shows a minimal, glassmorphic status pill in the bottom-right corner
 * only while services are waking. Disappears once both are awake.
 */

"use client";

import { useBackendWakeup } from "../../lib/useBackendWakeup";
import { useEffect, useState } from "react";

// ─── URLs ──────────────────────────────────────────────────────────────────
// Health endpoints — lightweight, no auth, instant response when awake.
// Replace with the real Render service URLs.
const WAKEUP_CONFIGS = [
  {
    name: "API",
    url:
      process.env.NEXT_PUBLIC_BACKEND_URL?.replace("localhost:5000", "autoapply-backend-wkqq.onrender.com")
        .replace("127.0.0.1:5000", "autoapply-backend-wkqq.onrender.com")
        .replace("http://", "https://") + "/api/health" ||
      "https://autoapply-backend-wkqq.onrender.com/api/health",
  },
  {
    name: "ML",
    url:
      process.env.NEXT_PUBLIC_FASTAPI_URL?.replace("localhost:8001", "autoapply-scraper-backend.onrender.com")
        .replace("127.0.0.1:8001", "autoapply-scraper-backend.onrender.com")
        .replace("http://", "https://") + "/health" ||
      "https://autoapply-scraper-backend.onrender.com/health",
  },
];

// ─── Status icon helpers ────────────────────────────────────────────────────
const STATUS_META = {
  idle:    { emoji: "🌙", label: "Standby",   color: "#6b7280" },
  pinging: { emoji: "📡", label: "Waking…",   color: "#f59e0b" },
  warming: { emoji: "♨️", label: "Warming…",  color: "#f97316" },
  awake:   { emoji: "✅", label: "Online",    color: "#22c55e" },
  failed:  { emoji: "⚠️", label: "Offline",   color: "#ef4444" },
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

  // Show pill while services are waking, hide 3s after all awake
  useEffect(() => {
    if (anyActive) {
      setVisible(true);
    } else if (allAwake && !dismissed) {
      const id = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(id);
    }
  }, [anyActive, allAwake, dismissed]);

  return (
    <>
      {children}

      {/* ── Status pill ──────────────────────────────────────────── */}
      {visible && !dismissed && (
        <div
          style={{
            position: "fixed",
            bottom: "1.5rem",
            right: "1.5rem",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: "0.375rem",
            animation: "wakeup-slide-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          {/* Pill container */}
          <div
            style={{
              background: "rgba(15, 15, 25, 0.75)",
              backdropFilter: "blur(16px) saturate(1.8)",
              WebkitBackdropFilter: "blur(16px) saturate(1.8)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              padding: "0.625rem 0.875rem",
              minWidth: "9rem",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.375rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                Backend Status
              </span>
              <button
                onClick={() => { setDismissed(true); setVisible(false); }}
                aria-label="Dismiss backend status"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.7rem",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ✕
              </button>
            </div>

            {entries.map(([name, state]) => {
              const meta = STATUS_META[state.status];
              return (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.25rem 0",
                  }}
                >
                  {/* Dot indicator */}
                  <span
                    style={{
                      width: "0.45rem",
                      height: "0.45rem",
                      borderRadius: "50%",
                      background: meta.color,
                      flexShrink: 0,
                      boxShadow:
                        state.status === "pinging" || state.status === "warming"
                          ? `0 0 6px ${meta.color}`
                          : "none",
                      animation:
                        state.status === "pinging" || state.status === "warming"
                          ? "wakeup-pulse 1.2s ease-in-out infinite"
                          : "none",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: "system-ui, sans-serif",
                      flex: 1,
                    }}
                  >
                    {name}
                  </span>
                  <span style={{ fontSize: "0.65rem", color: meta.color, fontWeight: 600 }}>
                    {state.status === "warming"
                      ? `retry ${state.attempt}`
                      : meta.label}
                  </span>
                </div>
              );
            })}

            {/* Progress bar while warming */}
            {anyActive && (
              <div
                style={{
                  marginTop: "0.5rem",
                  height: "2px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "9999px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #f59e0b, #f97316, #f59e0b)",
                    backgroundSize: "200% 100%",
                    animation: "wakeup-shimmer 1.5s linear infinite",
                    borderRadius: "9999px",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Keyframe animations (injected once) ──────────────────── */}
      <style>{`
        @keyframes wakeup-slide-in {
          from { opacity: 0; transform: translateY(12px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes wakeup-pulse {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes wakeup-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
}
