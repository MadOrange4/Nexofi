"use client";
import { useState, useEffect, useCallback } from "react";
import AppHeader from "@/components/AppHeader";
import { Employee } from "@/lib/types";
import { useEmployees, useDesks, useProjects } from "@/lib/useSupabase";
import { CoffeeIcon, LightningIcon, AiSparkleIcon, BuildingIcon, OnlineDotIcon, PalmTreeIcon } from "@/components/Icons";
import PageTransition from "@/components/PageTransition";
import VirtualOfficeFloor from "@/components/VirtualOfficeFloor";

const STATUS_COLOR: Record<string, string> = {
  working: "#10b981",
  break: "#f59e0b",
  offline: "#94a3b8",
  "time-off": "#94a3b8",
  meeting: "#6366f1",
};

const STATUS_LABEL: Record<string, string> = {
  working: "Working",
  break: "Break",
  offline: "Offline",
  "time-off": "Time Off",
  meeting: "Meeting",
};

export default function DashboardPage() {
  const { employees, loading: empLoading } = useEmployees();
  const { desks, loading: deskLoading } = useDesks();
  const { projects, loading: projLoading } = useProjects();
  const [selected, setSelected] = useState<Employee | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [insights, setInsights] = useState<{ title: string; body: string; type: string }[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);

  const fetchInsights = useCallback(async () => {
    if (employees.length === 0 || projects.length === 0) return;
    setInsightsLoading(true);
    try {
      const res = await fetch("/api/ai/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employees: employees.map(e => ({ name: e.name, role: e.role, status: e.status, currentTask: e.currentTask, efficiencyScore: e.efficiencyScore, workHoursToday: e.workHoursToday, breakMinutesToday: e.breakMinutesToday, skills: e.skills })),
          projects: projects.map(p => ({ name: p.name, status: p.status, progress: p.progress, tasks: p.tasks })),
        }),
      });
      const data = await res.json();
      if (res.ok && data.insights) setInsights(data.insights);
    } catch {
      // Silently fail — keep showing empty or stale insights
    } finally {
      setInsightsLoading(false);
    }
  }, [employees, projects]);

  useEffect(() => {
    if (!empLoading && !projLoading && employees.length > 0) {
      fetchInsights();
    }
  }, [empLoading, projLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  const online = employees.filter((e) => e.status === "working" || e.status === "meeting");
  const onBreak = employees.filter((e) => e.status === "break");
  const offline = employees.filter((e) => e.status === "offline" || e.status === "time-off");

  if (empLoading || deskLoading || projLoading) {
    return (
      <div className="app-layout">
        <AppHeader />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Loading office…
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <AppHeader />
      <PageTransition>
      <div style={{ padding: "20px 24px", maxWidth: 1400, margin: "0 auto", width: "100%" }}>
        {/* Page header + inline stats */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Manager Dashboard</h1>
            <span className="glass-pill" style={{ fontSize: "0.7rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse-dot 2s infinite" }} />
              Live
            </span>
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginLeft: 4 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { label: "Online", value: online.length, color: "#10b981", icon: <OnlineDotIcon size={8} style={{ color: "#10b981" }} /> },
              { label: "Break", value: onBreak.length, color: "#f59e0b", icon: <CoffeeIcon size={13} style={{ color: "#f59e0b" }} /> },
              { label: "Off", value: offline.length, color: "#94a3b8", icon: <PalmTreeIcon size={13} style={{ color: "#94a3b8" }} /> },
              { label: "Efficiency", value: `${employees.length > 0 ? (employees.reduce((s,e)=>s+e.efficiencyScore,0)/employees.length).toFixed(1) : "0"}%`, color: "#6366f1", icon: <LightningIcon size={13} style={{ color: "#6366f1" }} /> },
            ].map((s) => (
              <div key={s.label} className="stat-pill">
                <span style={{ display: "flex", alignItems: "center" }}>{s.icon}</span>
                <span style={{ fontWeight: 800, color: s.color, fontSize: "0.85rem" }}>{s.value}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* Active Projects */}
            <div className="glass-card visible" style={{ padding: "14px 16px" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 10 }}>Active Projects</h3>
              {projects.filter((p) => p.status !== "completed").map((proj) => (
                <div key={proj.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{proj.name}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{proj.progress}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${proj.progress}%` }} />
                  </div>
                  <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 2, display: "block" }}>
                    {proj.tasks.filter((t) => t.status === "done").length}/{proj.tasks.length} tasks
                  </span>
                </div>
              ))}
            </div>

            {/* Leaderboard */}
            <div className="glass-card visible" style={{ padding: "14px 16px" }}>
              <h3 style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}><LightningIcon size={14} style={{ color: "var(--accent)" }} /> Efficiency Board</h3>
              <div className="leaderboard">
                {employees
                  .filter((e) => e.efficiencyScore > 0)
                  .sort((a, b) => b.efficiencyScore - a.efficiencyScore)
                  .slice(0, 5)
                  .map((emp, i) => {
                    const rankClass = i === 0 ? "gold" : i === 1 ? "silver" : i === 2 ? "bronze" : "";
                    return (
                      <div key={emp.id} className="lb-row">
                        <span className={`lb-rank${rankClass ? ` ${rankClass}` : ""}`}>{i + 1}</span>
                        <div className="os-avatar small" style={{ background: emp.color }}>{emp.initials}</div>
                        <span className="lb-name">{emp.name}</span>
                        <span className="lb-score">{emp.efficiencyScore}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

          </div>

          {/* 2D Office Canvas */}
          <div>
            <div className="office-canvas">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h2 style={{ fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><BuildingIcon size={16} style={{ color: "var(--accent)" }} /> Virtual Office Floor</h2>
                {/* Filter tabs */}
                <div style={{ display: "flex", gap: 6 }}>
                  {["all","working","break","offline"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 100,
                        border: "1px solid",
                        borderColor: filter === f ? "var(--accent)" : "rgba(255,255,255,0.4)",
                        background: filter === f ? "var(--accent-bg)" : "transparent",
                        color: filter === f ? "var(--accent)" : "var(--text-muted)",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "var(--font)",
                        transition: "var(--transition)",
                        textTransform: "capitalize",
                      }}
                    >
                      {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive SVG office floor */}
              <VirtualOfficeFloor employees={employees} onSelect={setSelected} filter={filter} />

              {/* AI Insights — horizontal strip */}
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 8, fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  <AiSparkleIcon size={13} style={{ color: "var(--accent)" }} /> AI Insights
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {insightsLoading ? (
                    [0,1,2].map((i) => (
                      <div key={i} className="ai-suggestion" style={{ padding: "8px 10px", opacity: 0.5 }}>
                        <div className="ai-icon" style={{ animation: "spin 2s linear infinite" }}>AI</div>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.4 }}>Analyzing team data…</p>
                      </div>
                    ))
                  ) : insights.length > 0 ? (
                    insights.slice(0, 3).map((ins, i) => (
                      <div key={i} className="ai-suggestion" style={{ padding: "8px 10px", borderColor: ins.type === "warning" ? "rgba(239,68,68,0.15)" : ins.type === "positive" ? "rgba(16,185,129,0.15)" : undefined }}>
                        <div className="ai-icon" style={{ background: ins.type === "warning" ? "rgba(239,68,68,0.1)" : ins.type === "positive" ? "rgba(16,185,129,0.1)" : undefined, color: ins.type === "warning" ? "#ef4444" : ins.type === "positive" ? "#10b981" : undefined }}>
                          {ins.type === "warning" ? "!" : ins.type === "positive" ? "✓" : "AI"}
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                          <strong style={{ color: "var(--text)" }}>{ins.title}</strong> — {ins.body}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="ai-suggestion" style={{ padding: "8px 10px", gridColumn: "span 3" }}>
                      <div className="ai-icon">AI</div>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        <strong style={{ color: "var(--text)" }}>Insights ready</strong> — <button onClick={fetchInsights} style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font)", fontSize: "0.7rem", fontWeight: 600, padding: 0 }}>Generate AI insights</button> for your team.
                      </p>
                    </div>
                  )}
                  {insights.length > 0 && (
                    <button
                      onClick={fetchInsights}
                      disabled={insightsLoading}
                      style={{ gridColumn: "span 3", padding: "6px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.04)", color: "var(--accent)", fontSize: "0.7rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}
                    >
                      <AiSparkleIcon size={11} /> Refresh Insights
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Detail Modal */}
        {selected && (
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(240,238,245,0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => setSelected(null)}
          >
            <div
              className="glass-card visible"
              style={{ maxWidth: 440, width: "100%", padding: 32, cursor: "auto" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div className="desk-avatar" style={{ background: selected.color, width: 52, height: 52, fontSize: "1.125rem" }}>{selected.initials}</div>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{selected.name}</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{selected.role}</p>
                </div>
                <div style={{ marginLeft: "auto" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.5)", fontSize: "0.8rem", fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLOR[selected.status] }} />
                    {STATUS_LABEL[selected.status]}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[
                  { label: "Work Time", value: `${selected.workHoursToday}h` },
                  { label: "Break Time", value: `${selected.breakMinutesToday}m` },
                  { label: "Efficiency", value: `${selected.efficiencyScore}%` },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.25)", borderRadius: 12, padding: "14px 8px" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--accent)" }}>{s.value}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Current Task */}
              {selected.currentTask && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)" }}>CURRENT TASK</p>
                  <div style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: 10, padding: "10px 14px", fontSize: "0.875rem", fontWeight: 500 }}>
                    {selected.currentTask}
                  </div>
                </div>
              )}

              {/* Skills */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: 8, color: "var(--text-muted)" }}>SKILLS</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {selected.skills.map((s) => (
                    <span key={s} className="skill-badge">{s}</span>
                  ))}
                </div>
              </div>

              <button
                className="btn btn-glass"
                style={{ width: "100%" }}
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      </PageTransition>
    </div>
  );
}
