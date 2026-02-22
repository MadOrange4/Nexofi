"use client";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login, loading: authLoading, user } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // If auth is still loading or user is already logged in (redirect in progress), show nothing
  if (authLoading || user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading…</span>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password || loggingIn) return;
    setError("");
    setLoggingIn(true);
    const err = await login(username, password);
    if (err) {
      setError(err);
      setLoggingIn(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)", padding: 24 }}>
      <div
        className="glass-card visible"
        style={{ maxWidth: 400, width: "100%", padding: 40, textAlign: "center" }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", display: "inline-flex", alignItems: "center", lineHeight: 1, color: "#1a1a2e" }}>
            Ne
            <span style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>x</span>
            ofi
          </span>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: 8 }}>Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16, textAlign: "left" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "var(--text-muted)" }}>USERNAME</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
              autoFocus
              disabled={loggingIn}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 10, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(20px)", fontFamily: "var(--font)", fontSize: "0.9375rem", outline: "none", color: "var(--text)" }}
            />
          </div>

          <div style={{ marginBottom: 24, textAlign: "left" }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "var(--text-muted)" }}>PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loggingIn}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 10, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(20px)", fontFamily: "var(--font)", fontSize: "0.9375rem", outline: "none", color: "var(--text)" }}
            />
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.8rem", marginBottom: 16, padding: "8px 12px", borderRadius: 8, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!username || !password || loggingIn}
            style={{ width: "100%", justifyContent: "center", padding: "12px 20px", fontSize: "0.9375rem" }}
          >
            {loggingIn ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                  <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
