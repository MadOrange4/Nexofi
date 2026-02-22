export default function Analytics() {
  const leaderboard = [
    { rank: "gold", init: "S", bg: "#6366f1", name: "Sarah K.", score: "97.2" },
    { rank: "silver", init: "R", bg: "#8b5cf6", name: "Raj P.", score: "94.8" },
    { rank: "bronze", init: "A", bg: "#ec4899", name: "Ana M.", score: "91.5" },
    { rank: "", init: "M", bg: "#f59e0b", name: "Mike T.", score: "89.1" },
  ];

  const rings = [
    { progress: 78, color: "#6366f1", label: "Focus Time" },
    { progress: 92, color: "#10b981", label: "Tasks Done" },
    { progress: 15, color: "#f59e0b", label: "Break Time" },
  ];

  return (
    <section id="analytics" className="section section-alt snap-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag glass-pill"><span className="badge-dot" /> Analytics &amp; Insights</span>
          <h2>Data-driven decisions,<br /><span className="gradient-text">effortlessly</span></h2>
          <p>Every minute of work produces insight. Nexofi transforms raw activity data into clear, actionable analytics.</p>
        </div>

        <div className="analytics-grid">
          {/* Bar chart */}
          <div className="glass-card analytics-card">
            <div className="analytics-header">
              <h4>Team Efficiency</h4>
              <span className="analytics-badge up">↑ 12%</span>
            </div>
            <div className="analytics-chart bar-chart">
              <div className="bar-group">
                {[["70%","Mon"],["85%","Tue"],["60%","Wed"],["90%","Thu"],["95%","Fri"]].map(([h, label], i) => (
                  <div key={label} className={`bar${i === 4 ? " accent" : ""}`} style={{ height: h }} data-label={label} />
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="glass-card analytics-card">
            <div className="analytics-header">
              <h4>Top Performers</h4>
              <span className="analytics-badge">This week</span>
            </div>
            <div className="leaderboard">
              {leaderboard.map((p) => (
                <div key={p.name} className="lb-row">
                  <span className={`lb-rank${p.rank ? ` ${p.rank}` : ""}`}>{leaderboard.indexOf(p) + 1}</span>
                  <div className="os-avatar small" style={{ background: p.bg }}>{p.init}</div>
                  <span className="lb-name">{p.name}</span>
                  <span className="lb-score">{p.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily rings */}
          <div className="glass-card analytics-card">
            <div className="analytics-header">
              <h4>Daily Breakdown</h4>
              <span className="analytics-badge">Today</span>
            </div>
            <div className="daily-stats">
              {rings.map((r) => (
                <div key={r.label} className="daily-stat">
                  <div className="daily-ring" style={{ "--progress": r.progress, "--color": r.color } as React.CSSProperties}>
                    <svg viewBox="0 0 36 36">
                      <path d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <path d="M18 2.0845a15.9155 15.9155 0 010 31.831 15.9155 15.9155 0 010-31.831" fill="none" stroke={r.color} strokeWidth="3" strokeDasharray={`${r.progress}, 100`} strokeLinecap="round" />
                    </svg>
                    <span>{r.progress}%</span>
                  </div>
                  <p>{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
