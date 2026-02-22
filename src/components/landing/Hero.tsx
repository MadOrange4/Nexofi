import Link from "next/link";
import { LightningIcon, GearIcon } from "@/components/Icons";

export default function Hero() {
  return (
    <header id="hero" className="snap-section">
      <div className="hero-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="container hero-content">
        <div className="hero-badge glass-pill">
          <span className="badge-dot" />
          Project Workflow-Management Reimagined
        </div>

        <h1>
          Your Entire Team.<br />
          <span className="gradient-text">One Virtual Office.</span>
        </h1>

        <p className="hero-sub">
          Nexofi turns remote chaos into visual clarity. Plan projects with AI-generated blueprints,
          manage hybrid teams in a beautiful 2D office space, and track performance all in real time.
        </p>

        <div className="hero-cta">
          <a href="#waitlist" className="btn btn-primary btn-lg">Join the Waitlist</a>
          <a href="#how-it-works" className="btn btn-glass btn-lg">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8.5 7l4 3-4 3V7z" fill="currentColor" />
            </svg>
            See How It Works
          </a>
        </div>

        {/* Hero Office Preview */}
        <div className="hero-visual">
          <div className="glass-card hero-preview">
            <div className="office-preview">
              <div className="office-grid">
                {/* Row 1 */}
                <div className="desk empty" style={{ gridColumn: 1, gridRow: 1 }}>
                  <span className="desk-name desk-name--empty">Open</span>
                  <svg className="desk-figure desk-figure--empty" viewBox="0 0 24 34" fill="none">
                    <circle cx="12" cy="5" r="4" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" />
                    <rect x="6" y="12" width="12" height="13" rx="5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" />
                  </svg>
                </div>

                <div className="desk occupied" style={{ gridColumn: 2, gridRow: 1 }}>
                  <div className="avatar" style={{ background: "#f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem" }}>MK</div>
                  <span className="desk-name">Mike K.</span>
                  <svg className="desk-figure" viewBox="0 0 24 34" fill="none">
                    <circle cx="12" cy="5" r="4" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="6" y="12" width="12" height="13" rx="5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <div className="status-dot online" />
                </div>

                <div className="desk break" style={{ gridColumn: 3, gridRow: 1 }}>
                  <div className="avatar" style={{ background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem" }}>JS</div>
                  <span className="desk-name">James S.</span>
                  <svg className="desk-figure" viewBox="0 0 34 34" fill="none">
                    <circle cx="17" cy="5" r="4" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="11" y="12" width="12" height="13" rx="5" stroke="currentColor" strokeWidth="1.4" />
                    <g>
                      <rect x="25" y="15" width="7" height="8" rx="3.5" stroke="currentColor" strokeWidth="1.2" />
                      <rect x="31.5" y="18" width="1.5" height="3" rx="0.7" stroke="currentColor" strokeWidth="0.8" />
                      <path d="M27.5 14 Q28.5 12.5 27.5 11 Q26.5 9.5 27.5 8" stroke="currentColor" strokeWidth="1.1" fill="none" />
                      <path d="M30.5 14 Q31.5 12.5 30.5 11 Q29.5 9.5 30.5 8" stroke="currentColor" strokeWidth="1.1" fill="none" />
                    </g>
                  </svg>
                  <div className="status-dot away" />
                </div>

                <div className="desk occupied" style={{ gridColumn: 4, gridRow: 1, position: "relative", overflow: "visible" }}>
                  <div className="avatar" style={{ background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem" }}>SK</div>
                  <span className="desk-name">Sarah K.</span>
                  <svg className="desk-figure" viewBox="0 0 24 34" fill="none">
                    <circle cx="12" cy="5" r="4" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="6" y="12" width="12" height="13" rx="5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <div className="status-dot online" />
                  <div className="desk-popup desk-popup--right">
                    <strong>Sarah K.</strong><br />
                    <span className="tooltip-label">Working on</span> Auth Module<br />
                    <span className="efficiency" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><LightningIcon size={12} /> 94% efficiency</span>
                  </div>
                </div>

                {/* Row 2 */}
                <div className="desk occupied" style={{ gridColumn: 1, gridRow: 2, position: "relative", overflow: "visible" }}>
                  <div className="avatar" style={{ background: "#ec4899", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem" }}>AD</div>
                  <span className="desk-name">Ana D.</span>
                  <svg className="desk-figure" viewBox="0 0 24 34" fill="none">
                    <circle cx="12" cy="5" r="4" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="6" y="12" width="12" height="13" rx="5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <div className="status-dot online" />
                  <div className="desk-popup desk-popup--left">
                    <strong>AI Suggestion</strong><br />
                    <span className="tooltip-label">Reassign</span> API task → James<br />
                    <span className="efficiency" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><GearIcon size={12} /> Skill match 97%</span>
                  </div>
                </div>

                <div className="desk occupied" style={{ gridColumn: 2, gridRow: 2 }}>
                  <div className="avatar" style={{ background: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem" }}>RP</div>
                  <span className="desk-name">Raj P.</span>
                  <svg className="desk-figure" viewBox="0 0 24 34" fill="none">
                    <circle cx="12" cy="5" r="4" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="6" y="12" width="12" height="13" rx="5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <div className="status-dot online" />
                </div>

                <div className="desk off" style={{ gridColumn: 3, gridRow: 2 }}>
                  <div className="avatar" style={{ background: "#94a3b8", opacity: 0.4, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem" }}>PS</div>
                  <span className="desk-name">Priya S.</span>
                  <svg className="desk-figure" viewBox="0 0 34 34" fill="none">
                    <circle cx="17" cy="5" r="4" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="11" y="12" width="12" height="13" rx="5" stroke="currentColor" strokeWidth="1.4" />
                    <g>
                      <path d="M22 12 A6 6 0 0 1 34 12" stroke="currentColor" strokeWidth="1.4" fill="none" />
                      <line x1="22" y1="12" x2="34" y2="12" stroke="currentColor" strokeWidth="1.4" />
                      <line x1="28" y1="12" x2="28" y2="27" stroke="currentColor" strokeWidth="1.1" />
                    </g>
                  </svg>
                  <div className="status-dot offline" />
                </div>

                <div className="desk occupied" style={{ gridColumn: 4, gridRow: 2 }}>
                  <div className="avatar" style={{ background: "#f43f5e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1rem" }}>LM</div>
                  <span className="desk-name">Lisa M.</span>
                  <svg className="desk-figure" viewBox="0 0 24 34" fill="none">
                    <circle cx="12" cy="5" r="4" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="6" y="12" width="12" height="13" rx="5" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                  <div className="status-dot online" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
