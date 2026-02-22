"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import AppHeader from "@/components/AppHeader";
import { useAuth } from "@/lib/auth-context";
import { useEmployees, useProjects, updateEmployeeStatus, updateTask as updateTaskInDb } from "@/lib/useSupabase";
import { EmployeeStatus } from "@/lib/types";
import { MonitorIcon, CoffeeIcon, TargetIcon, DoorIcon, ClipboardIcon, AiSparkleIcon, BarChartIcon, SunIcon, CheckIcon } from "@/components/Icons";
import PageTransition from "@/components/PageTransition";

type StatusOption = { value: EmployeeStatus; label: string; icon: React.ReactNode; color: string };
const STATUS_OPTIONS: StatusOption[] = [
  { value: "working",  label: "Working",   icon: <MonitorIcon size={15} />, color: "#10b981" },
  { value: "break",    label: "Break",      icon: <CoffeeIcon size={15} />, color: "#f59e0b" },
  { value: "meeting",  label: "Meeting",    icon: <TargetIcon size={15} />, color: "#6366f1" },
  { value: "offline",  label: "Sign Out",   icon: <DoorIcon size={15} />, color: "#94a3b8" },
];

function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const reset = () => setSeconds(0);
  const fmt = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return { seconds, fmt: fmt(seconds), reset };
}

export default function EmployeePage() {
  const { user } = useAuth();
  const { employees, loading: empLoading } = useEmployees();
  const { projects, loading: projLoading } = useProjects();

  // Use the logged-in user's linked employee, fall back to first employee
  const ME = (user?.employeeId
    ? employees.find((e) => e.id === user.employeeId)
    : employees[0]) ?? null;

  const MY_TASKS = useMemo(() =>
    ME ? projects.flatMap((p) =>
      p.tasks.filter((t) => t.assigneeId === ME.id && t.status !== "ai-suggested").map((t) => ({ ...t, projectName: p.name }))
    ) : []
  , [ME, projects]);

  // AI suggestions = unassigned "ai-suggested" tasks from all projects
  const AI_SUGGESTIONS = useMemo(() =>
    projects.flatMap((p) =>
      p.tasks
        .filter((t) => t.status === "ai-suggested" && !t.assigneeId)
        .map((t) => ({ ...t, projectName: p.name }))
    )
  , [projects]);

  const [checkedIn, setCheckedIn] = useState(false);
  const [status, setStatus] = useState<EmployeeStatus>("offline");
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [skippedSuggestions, setSkippedSuggestions] = useState<Set<string>>(new Set());
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);
  const workTimer = useTimer(status === "working" || status === "meeting");
  const breakTimer = useTimer(status === "break");

  const visibleSuggestions = AI_SUGGESTIONS.filter((s) => !skippedSuggestions.has(s.id));

  const handleCheckIn = () => {
    setCheckedIn(true);
    setStatus("working");
    if (ME) updateEmployeeStatus(ME.id, "working");
  };

  const handleStatus = (s: EmployeeStatus) => {
    if (s === "offline") {
      setCheckedIn(false);
    }
    setStatus(s);
    if (ME) updateEmployeeStatus(ME.id, s);
  };

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const acceptSuggestion = async (taskId: string) => {
    if (!ME || acceptingId) return;
    setAcceptingId(taskId);
    try {
      await updateTaskInDb(taskId, { assignee_id: ME.id, status: "todo" });
      // Realtime subscription in useProjects will auto-refresh MY_TASKS
    } catch {
      // silently fail — task stays in suggestions
    } finally {
      setAcceptingId(null);
    }
  };

  const skipSuggestion = (taskId: string) => {
    setSkippedSuggestions((p) => { const n = new Set(p); n.add(taskId); return n; });
  };

  const unassignTask = async (taskId: string) => {
    if (unassigningId) return;
    setUnassigningId(taskId);
    try {
      await updateTaskInDb(taskId, { assignee_id: null, status: "ai-suggested" });
    } catch {
      // silently fail
    } finally {
      setUnassigningId(null);
    }
  };

  const totalTasks = MY_TASKS.length;
  const doneTasks = [...completedTasks].filter((id) =>
    MY_TASKS.some((t) => t.id === id)
  ).length;
  const efficiencyScore = checkedIn
    ? Math.min(100, Math.round(60 + (doneTasks / Math.max(totalTasks, 1)) * 30 + Math.random() * 5))
    : 0;

  if (empLoading || projLoading || !ME) {
    return (
      <div className="app-layout">
        <AppHeader />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Loading portal…
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <AppHeader />
      <PageTransition>
      <div style={{ padding: "32px 24px", maxWidth: 960, margin: "0 auto", width: "100%" }}>

        {/* Profile header */}
        <div className="glass-card visible" style={{ padding: 28, marginBottom: 24, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: ME.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "1.25rem", border: "3px solid rgba(255,255,255,0.8)", boxShadow: "0 4px 16px rgba(0,0,0,0.12)", flexShrink: 0 }}>
            {ME.initials}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 2 }}>{ME.name}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{ME.role}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {ME.skills.map((s) => <span key={s} className="skill-badge">{s}</span>)}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
            {!checkedIn ? (
              <button className="checkin-btn" onClick={handleCheckIn}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Check In for Today
              </button>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 100, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#10b981", fontWeight: 700, fontSize: "0.875rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulse-dot 2s infinite" }} />
                  Checked In
                </span>
              </div>
            )}
          </div>
        </div>

        {checkedIn && (
          <>
            {/* Status controls */}
            <div className="glass-card visible" style={{ padding: 20, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 14 }}>Update Status</h3>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatus(opt.value)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 18px", borderRadius: 10,
                      border: "1px solid",
                      borderColor: status === opt.value ? opt.color : "rgba(255,255,255,0.4)",
                      background: status === opt.value ? `${opt.color}18` : "rgba(255,255,255,0.3)",
                      color: status === opt.value ? opt.color : "var(--text-muted)",
                      fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
                      fontFamily: "var(--font)", transition: "var(--transition)",
                    }}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timers + today stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 24 }}>
              <div className="glass-card visible" style={{ padding: "20px 22px", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Work Time</div>
                <div style={{ fontVariantNumeric: "tabular-nums", fontSize: "1.5rem", fontWeight: 800, color: "#10b981", fontFamily: "monospace" }}>{workTimer.fmt}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-light)", marginTop: 4 }}>live</div>
              </div>
              <div className="glass-card visible" style={{ padding: "20px 22px", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Break Time</div>
                <div style={{ fontVariantNumeric: "tabular-nums", fontSize: "1.5rem", fontWeight: 800, color: "#f59e0b", fontFamily: "monospace" }}>{breakTimer.fmt}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-light)", marginTop: 4 }}>live</div>
              </div>
              <div className="glass-card visible" style={{ padding: "20px 22px", textAlign: "center" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8 }}>Today&apos;s Efficiency</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--accent)" }}>{efficiencyScore}%</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-light)", marginTop: 4 }}>{doneTasks}/{totalTasks} tasks</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* My tasks */}
              <div className="glass-card visible" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}><ClipboardIcon size={16} style={{ color: "var(--accent)" }} /> My Tasks</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {MY_TASKS.map((task) => {
                    const done = completedTasks.has(task.id);
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(task.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "10px 14px",
                          background: done ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.25)",
                          borderRadius: 10,
                          border: "1px solid",
                          borderColor: done ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.35)",
                          cursor: "pointer",
                          transition: "var(--transition)",
                          opacity: done ? 0.8 : 1,
                        }}
                      >
                        <div style={{
                          width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                          border: "1.5px solid", borderColor: done ? "#10b981" : "rgba(0,0,0,0.15)",
                          background: done ? "#10b981" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: "0.625rem", transition: "var(--transition)",
                        }}>
                          {done && <CheckIcon size={11} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 600, textDecoration: done ? "line-through" : "none", color: done ? "var(--text-muted)" : "var(--text)" }}>
                            {task.title}
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{task.projectName}</div>
                        </div>
                        <span className="bp-tag">{task.tag}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); unassignTask(task.id); }}
                          disabled={unassigningId === task.id}
                          title="Unassign task"
                          style={{
                            width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)",
                            background: "rgba(239,68,68,0.06)", color: "#ef4444", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, fontSize: "0.75rem", fontWeight: 700, fontFamily: "var(--font)",
                            opacity: unassigningId === task.id ? 0.4 : 0.7,
                            transition: "var(--transition)",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* AI Suggestions */}
              <div className="glass-card visible" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}><AiSparkleIcon size={16} style={{ color: "var(--accent)" }} /> AI Suggested Tasks</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>Unassigned tasks from active projects</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {visibleSuggestions.length === 0 && (
                    <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", padding: 20 }}>No suggested tasks right now. Check back later!</p>
                  )}
                  {visibleSuggestions.map((s) => (
                    <div key={s.id} className="ai-suggestion" style={{ flexDirection: "column", alignItems: "stretch", gap: 10 }}>
                      <div style={{ display: "flex", gap: 10 }}>
                        <div className="ai-icon">AI</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "0.8125rem", fontWeight: 600 }}>{s.title}</div>
                          <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{s.tag} · {s.projectName}{s.estimatedHours ? ` · ~${s.estimatedHours}h` : ""}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, paddingLeft: 34 }}>
                        <button
                          onClick={() => acceptSuggestion(s.id)}
                          disabled={acceptingId === s.id}
                          style={{ padding: "4px 14px", borderRadius: 8, border: "1px solid rgba(16,185,129,0.25)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", opacity: acceptingId === s.id ? 0.6 : 1 }}
                        >
                          {acceptingId === s.id ? "Accepting…" : "Accept"}
                        </button>
                        <button
                          onClick={() => skipSuggestion(s.id)}
                          style={{ padding: "4px 14px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", background: "transparent", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)" }}
                        >
                          Skip
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* End of day summary */}
            <div className="glass-card visible" style={{ padding: 24, marginTop: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}><BarChartIcon size={16} style={{ color: "var(--accent)" }} /> Today&apos;s Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
                {[
                  { label: "Work Session", value: workTimer.fmt, sub: "active time", color: "#10b981" },
                  { label: "Break Time", value: breakTimer.fmt, sub: "total breaks", color: "#f59e0b" },
                  { label: "Efficiency Score", value: `${efficiencyScore}%`, sub: "AI calculated", color: "var(--accent)" },
                ].map((s) => (
                  <div key={s.label} style={{ textAlign: "center", background: "rgba(255,255,255,0.2)", borderRadius: 14, padding: "16px" }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: s.color, fontFamily: "monospace", fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Not checked in state */}
        {!checkedIn && (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ marginBottom: 20, display: "flex", justifyContent: "center" }}><SunIcon size={56} style={{ color: "#f59e0b" }} /></div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: 8 }}>Good morning, {ME.name.split(" ")[0]}!</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginBottom: 32 }}>
              Check in to appear on the office map and see your AI-suggested tasks for today.
            </p>
            <button className="checkin-btn" onClick={handleCheckIn}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Check In for Today
            </button>
          </div>
        )}
      </div>
      </PageTransition>
    </div>
  );
}
