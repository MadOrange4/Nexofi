import { TargetIcon, MonitorIcon, CoffeeIcon, BarChartIcon } from "@/components/Icons";

export default function VirtualOffice() {
  return (
    <section id="office" className="section snap-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag glass-pill"><span className="badge-dot" /> Virtual Office</span>
          <h2>Your team, visualized<br /><span className="gradient-text">like never before</span></h2>
          <p>A beautiful 2D workplace where remote feels like in-person. Every employee, every desk, every status at a glance.</p>
        </div>

        <div className="glass-card office-showcase">
          <div className="office-showcase-grid">
            {/* Meeting room */}
            <div className="os-zone meeting-room">
              <div className="zone-label" style={{ display: "flex", alignItems: "center", gap: 5 }}><TargetIcon size={14} /> Sprint Planning</div>
              <div className="os-avatars">
                {[["#6366f1","S","Sarah"],["#f59e0b","M","Mike"],["#10b981","J","James"]].map(([bg, init, name]) => (
                  <div key={name} className="os-person">
                    <div className="os-avatar" style={{ background: bg }}>{init}</div>
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dev zone */}
            <div className="os-zone work-area">
              <div className="zone-label" style={{ display: "flex", alignItems: "center", gap: 5 }}><MonitorIcon size={14} /> Development Zone</div>
              <div className="os-desks">
                {[
                  { bg: "#ec4899", init: "A", name: "Ana", task: "Frontend refactor", status: "working" },
                  { bg: "#8b5cf6", init: "R", name: "Raj", task: "API endpoints", status: "working" },
                  { bg: "#f43f5e", init: "L", name: "Lisa", task: "Coffee break", status: "on-break" },
                ].map((d) => (
                  <div key={d.name} className={`os-desk${d.status === "on-break" ? " break-desk" : " active"}`}>
                    <div className="os-avatar small" style={{ background: d.bg }}>{d.init}</div>
                    <div className="os-desk-info">
                      <span className="name">{d.name}</span>
                      <span className="task">{d.task}</span>
                    </div>
                    <div className={`os-status-badge ${d.status === "on-break" ? "on-break" : "working"}`}>
                      {d.status === "on-break" ? "Break" : "Working"}
                    </div>
                  </div>
                ))}
                <div className="os-desk empty-desk">
                  <div className="os-desk-info">
                    <span className="name">Open Desk</span>
                    <span className="task" />
                  </div>
                </div>
              </div>
            </div>

            {/* Break room */}
            <div className="os-zone break-room">
              <div className="zone-label" style={{ display: "flex", alignItems: "center", gap: 5 }}><CoffeeIcon size={14} /> Break Room</div>
              <div className="os-avatars">
                <div className="os-person">
                  <div className="os-avatar" style={{ background: "#f43f5e" }}>L</div>
                  <span>Lisa</span>
                </div>
              </div>
            </div>

            {/* Status panel */}
            <div className="os-zone status-panel">
              <div className="zone-label" style={{ display: "flex", alignItems: "center", gap: 5 }}><BarChartIcon size={14} /> Live Status</div>
              <div className="status-rows">
                {[["online","5 online"],["away","1 on break"],["offline","2 offline"],["meeting","3 in meeting"]].map(([cls, label]) => (
                  <div key={label} className="status-row">
                    <span className={`status-indicator ${cls}`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
