"use client";
import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import { Employee } from "@/lib/types";
import { Project, Task } from "@/lib/types";
import {
  useProjects,
  useEmployees,
  createProject as createProjectInDb,
  createTask as createTaskInDb,
  updateTask as updateTaskInDb,
  updateProject as updateProjectInDb,
  deleteProject as deleteProjectInDb,
} from "@/lib/useSupabase";
import { getSupabase } from "@/lib/supabase";
import { CheckIcon, PlayIcon, ClipboardIcon, AiSparkleIcon } from "@/components/Icons";
import PageTransition from "@/components/PageTransition";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  done:          { bg: "rgba(16,185,129,0.1)",  color: "#10b981", label: "Done" },
  "in-progress": { bg: "rgba(99,102,241,0.1)",  color: "#6366f1", label: "In Progress" },
  todo:          { bg: "rgba(0,0,0,0.05)",       color: "var(--text-muted)", label: "To Do" },
  "ai-suggested":{ bg: "rgba(245,158,11,0.1)",   color: "#f59e0b", label: "AI Suggested" },
};

const PROJECT_STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  active:    { bg: "rgba(99,102,241,0.1)",  color: "#6366f1" },
  planning:  { bg: "rgba(245,158,11,0.1)",  color: "#f59e0b" },
  completed: { bg: "rgba(16,185,129,0.1)",  color: "#10b981" },
};

interface BlueprintTask {
  title: string;
  tag: string;
  estimatedHours: number;
  priority: string;
  phase?: string;
  complexity?: string;
}

interface BlueprintPhase {
  name: string;
  description: string;
  estimatedHours: number;
  order: number;
}

interface BlueprintRisk {
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  likelihood: "high" | "medium" | "low";
  mitigation: string;
}

interface EffortBreakdown {
  frontend: number;
  backend: number;
  devops: number;
  qa: number;
  design: number;
  other: number;
}

interface FullBlueprint {
  executiveSummary: string;
  totalEstimatedHours: number;
  estimatedWeeks: number;
  teamSizeRecommendation: number;
  confidenceScore: number;
  phases: BlueprintPhase[];
  tasks: BlueprintTask[];
  risks: BlueprintRisk[];
  effortBreakdown: EffortBreakdown;
  techStackSuggestions: string[];
}

function TaskRow({ task, employees }: { task: Task; employees: Employee[] }) {
  const s = STATUS_STYLES[task.status];
  const assignee = employees.find((e) => e.id === task.assigneeId);
  return (
    <div className={`bp-row${task.status === "ai-suggested" ? " highlight" : ""}`}>
      <span className={`bp-check${task.status === "done" ? " done" : task.status === "ai-suggested" ? " ai" : ""}`}
            style={task.status === "in-progress" ? { background: "#6366f1", color: "#fff" } : task.status === "todo" ? { background: "rgba(0,0,0,0.06)", color: "var(--text-muted)" } : {}}>
        {task.status === "done" ? <CheckIcon size={11} /> : task.status === "ai-suggested" ? "AI" : task.status === "in-progress" ? <PlayIcon size={10} /> : "–"}
      </span>
      <span style={{ flex: 1 }}>{task.title}</span>
      {assignee && (
        <div title={assignee.name} style={{ width: 22, height: 22, borderRadius: "50%", background: assignee.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.6rem", fontWeight: 700, flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.8)" }}>
          {assignee.initials}
        </div>
      )}
      {task.estimatedHours && (
        <span style={{ fontSize: "0.6875rem", color: "var(--text-muted)", flexShrink: 0 }}>{task.estimatedHours}h</span>
      )}
      <span className={`bp-tag${task.status === "ai-suggested" ? " new" : ""}`}>{task.tag}</span>
      <span style={{ fontSize: "0.6875rem", padding: "2px 8px", borderRadius: 100, background: s.bg, color: s.color, fontWeight: 600, flexShrink: 0 }}>
        {s.label}
      </span>
    </div>
  );
}

export default function ProjectsPage() {
  const { projects, loading: projLoading, refetch: refetchProjects } = useProjects();
  const { employees, loading: empLoading } = useEmployees();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [blueprint, setBlueprint] = useState<FullBlueprint | null>(null);
  const [blueprintTasks, setBlueprintTasks] = useState<BlueprintTask[]>([]);
  const [aiError, setAiError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [planTab, setPlanTab] = useState<"summary" | "tasks" | "risks">("summary");

  /* ─── Edit-project state ─── */
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState<string>("planning");
  const [editSaving, setEditSaving] = useState(false);

  /* ─── Delete-confirm state ─── */
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = projects.find((p) => p.id === selectedId) ?? projects[0] ?? null;

  const generateBlueprint = async () => {
    if (!newName) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/ai/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      const fullBp: FullBlueprint = {
        executiveSummary: data.executiveSummary || "",
        totalEstimatedHours: data.totalEstimatedHours || 0,
        estimatedWeeks: data.estimatedWeeks || 0,
        teamSizeRecommendation: data.teamSizeRecommendation || 0,
        confidenceScore: data.confidenceScore || 0,
        phases: data.phases || [],
        tasks: data.tasks || [],
        risks: data.risks || [],
        effortBreakdown: data.effortBreakdown || { frontend: 0, backend: 0, devops: 0, qa: 0, design: 0, other: 0 },
        techStackSuggestions: data.techStackSuggestions || [],
      };
      setBlueprint(fullBp);
      setBlueprintTasks(fullBp.tasks);
      setAiGenerated(true);
      setPlanTab("summary");
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setAiLoading(false);
    }
  };

  /* ─── Create Project (with loading guard + dedup) ─── */
  const createProject = async () => {
    if (isCreating) return; // prevent double-click
    setIsCreating(true);
    setAiError("");
    try {
      // Dedup: check if a project with same name already exists
      const dup = projects.find(
        (p) => p.name.trim().toLowerCase() === newName.trim().toLowerCase()
      );
      if (dup) {
        setAiError(`A project named "${dup.name}" already exists.`);
        setIsCreating(false);
        return;
      }

      const { data: proj } = await createProjectInDb({
        name: newName.trim(),
        description: newDesc.trim(),
        status: "planning",
        team_ids: [],
      });
      if (proj) {
        const projectId = (proj as Record<string, unknown>).id as string;
        for (const task of blueprintTasks) {
          await createTaskInDb({
            project_id: projectId,
            title: task.title,
            tag: task.tag,
            status: "ai-suggested",
            estimated_hours: task.estimatedHours,
          });
        }
        await refetchProjects();
        setSelectedId(projectId);
      }
      resetCreateModal();
    } catch {
      setAiError("Failed to create project. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  /* ─── Editable blueprint helpers ─── */
  const updateBlueprintTask = (index: number, field: keyof BlueprintTask, value: string | number) => {
    setBlueprintTasks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const removeBlueprintTask = (index: number) => {
    setBlueprintTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const addBlueprintTask = () => {
    setBlueprintTasks((prev) => [
      ...prev,
      { title: "New Task", tag: "general", estimatedHours: 1, priority: "medium", phase: blueprint?.phases[0]?.name || "Phase 1", complexity: "moderate" },
    ]);
  };

  const resetCreateModal = () => {
    setShowCreate(false);
    setNewName("");
    setNewDesc("");
    setAiGenerated(false);
    setBlueprint(null);
    setBlueprintTasks([]);
    setAiError("");
    setPlanTab("summary");
  };

  /* ─── Edit project ─── */
  const openEditProject = (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(p);
    setEditName(p.name);
    setEditDesc(p.description);
    setEditStatus(p.status);
  };

  const saveEditProject = async () => {
    if (!editingProject || editSaving) return;
    setEditSaving(true);
    try {
      await updateProjectInDb(editingProject.id, {
        name: editName.trim(),
        description: editDesc.trim(),
        status: editStatus as "active" | "planning" | "completed",
      });
      await refetchProjects();
      setEditingProject(null);
    } finally {
      setEditSaving(false);
    }
  };

  /* ─── Delete project ─── */
  const confirmDeleteProject = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteProjectInDb(deleteTarget.id);
      if (selectedId === deleteTarget.id) setSelectedId(null);
      await refetchProjects();
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const acceptSuggestion = async (taskId: string) => {
    await updateTaskInDb(taskId, { status: "todo" });
    await refetchProjects();
  };

  const dismissSuggestion = async (taskId: string) => {
    await getSupabase().from("tasks").delete().eq("id", taskId);
    await refetchProjects();
  };

  const teamMembers = selected ? selected.teamIds.map((id) => employees.find((e) => e.id === id)).filter(Boolean) : [];

  if (projLoading || empLoading) {
    return (
      <div className="app-layout">
        <AppHeader />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Loading projects…
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <AppHeader />
      <PageTransition>
      <div style={{ padding: "32px 24px", maxWidth: 1400, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "300px 1fr", gap: 24, alignItems: "start" }}>

        {/* Project list sidebar */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Projects</h2>
            <button
              className="btn btn-primary"
              style={{ fontSize: "0.75rem", padding: "6px 14px" }}
              onClick={() => setShowCreate(true)}
            >
              + New
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {projects.map((p) => {
              const sty = PROJECT_STATUS_STYLES[p.status];
              return (
                <div
                  key={p.id}
                  className={`glass-card visible`}
                  style={{ padding: "16px 18px", cursor: "pointer", border: selected?.id === p.id ? "1px solid rgba(99,102,241,0.25)" : undefined, background: selected?.id === p.id ? "rgba(99,102,241,0.04)" : undefined, transition: "var(--transition)", borderRadius: 16 }}
                  onClick={() => setSelectedId(p.id)}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: "0.875rem", flexShrink: 1 }}>{p.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: "0.65rem", padding: "2px 8px", borderRadius: 100, background: sty.bg, color: sty.color, fontWeight: 600, textTransform: "capitalize" }}>{p.status}</span>
                      <button
                        title="Edit project"
                        onClick={(e) => openEditProject(p, e)}
                        style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(0,0,0,0.06)", background: "transparent", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", transition: "background 0.2s", fontFamily: "var(--font)" }}
                      >
                        ✎
                      </button>
                      <button
                        title="Delete project"
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
                        style={{ width: 24, height: 24, borderRadius: 6, border: "1px solid rgba(239,68,68,0.15)", background: "transparent", cursor: "pointer", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", transition: "background 0.2s", fontFamily: "var(--font)" }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 4, display: "block" }}>
                    {p.tasks.filter((t) => t.status === "done").length}/{p.tasks.length} tasks · {p.progress}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project detail */}
        {selected ? (
        <div>
          <div className="glass-card visible" style={{ padding: 28, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                  <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>{selected.name}</h1>
                  <span style={{ fontSize: "0.75rem", padding: "3px 10px", borderRadius: 100, background: PROJECT_STATUS_STYLES[selected.status].bg, color: PROJECT_STATUS_STYLES[selected.status].color, fontWeight: 600, textTransform: "capitalize" }}>
                    {selected.status}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{selected.description}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <span style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent)" }}>{selected.progress}%</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>complete</span>
              </div>
            </div>

            <div className="progress-bar-track" style={{ height: 8, marginBottom: 20 }}>
              <div className="progress-bar-fill" style={{ width: `${selected.progress}%` }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>Team:</span>
              {teamMembers.map((emp) => emp && (
                <div key={emp.id} title={emp.name} style={{ width: 32, height: 32, borderRadius: "50%", background: emp.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.75rem", fontWeight: 700, border: "2px solid rgba(255,255,255,0.8)", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  {emp.initials}
                </div>
              ))}
              {teamMembers.length === 0 && <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>No team assigned yet</span>}
            </div>
          </div>

          {/* Task Blueprint */}
          <div className="glass-card visible" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><ClipboardIcon size={16} style={{ color: "var(--accent)" }} /> Task Blueprint</h2>
              <div style={{ display: "flex", gap: 8 }}>
                {selected.tasks.filter((t) => t.status === "ai-suggested").length > 0 && (
                  <span className="glass-pill" style={{ fontSize: "0.7rem" }}>
                    <span className="badge-dot" />
                    {selected.tasks.filter((t) => t.status === "ai-suggested").length} AI suggestions
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selected.tasks.filter((t) => t.status !== "ai-suggested").map((task) => (
                <TaskRow key={task.id} task={task} employees={employees} />
              ))}

              {selected.tasks.filter((t) => t.status === "ai-suggested").length > 0 && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8, marginBottom: 4 }}>
                    <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.15)" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#6366f1", background: "rgba(99,102,241,0.08)", padding: "2px 10px", borderRadius: 100, display: "inline-flex", alignItems: "center", gap: 4 }}><AiSparkleIcon size={12} /> AI Suggestions</span>
                    <div style={{ flex: 1, height: 1, background: "rgba(99,102,241,0.15)" }} />
                  </div>
                  {selected.tasks.filter((t) => t.status === "ai-suggested").map((task) => (
                    <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <TaskRow task={task} employees={employees} />
                      </div>
                      <button
                        onClick={() => acceptSuggestion(task.id)}
                        style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.08)", color: "#10b981", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", flexShrink: 0 }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => dismissSuggestion(task.id)}
                        style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)", background: "transparent", color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", flexShrink: 0 }}
                      >
                        Dismiss
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        ) : null}
      </div>

      {/* Create Project Modal */}
      {showCreate && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(240,238,245,0.65)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => { if (!isCreating) { resetCreateModal(); } }}
        >
          <div
            className="glass-card visible"
            style={{ maxWidth: aiGenerated ? 920 : 560, width: "100%", padding: aiGenerated ? 0 : 36, cursor: "auto", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", transition: "max-width 0.4s ease" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ─── Input Phase ─── */}
            {!aiGenerated && (
              <div style={{ padding: aiGenerated ? 36 : 0 }}>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>New Project</h2>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Describe your idea and our AI will generate a data-driven execution plan.</p>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "var(--text-muted)" }}>PROJECT NAME</label>
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Customer Portal Redesign"
                    disabled={isCreating}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 10, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(20px)", fontFamily: "var(--font)", fontSize: "0.9375rem", outline: "none", color: "var(--text)", opacity: isCreating ? 0.5 : 1 }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "var(--text-muted)" }}>DESCRIPTION / IDEA</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Describe the project scope, tech stack, goals..."
                    rows={3}
                    disabled={isCreating}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 10, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(20px)", fontFamily: "var(--font)", fontSize: "0.9375rem", outline: "none", resize: "vertical", color: "var(--text)", opacity: isCreating ? 0.5 : 1 }}
                  />
                </div>

                {aiError && (
                  <p style={{ color: "#ef4444", fontSize: "0.8rem", textAlign: "center", marginBottom: 12 }}>{aiError}</p>
                )}

                <button
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginBottom: 12 }}
                  onClick={generateBlueprint}
                  disabled={!newName || aiLoading}
                >
                  {aiLoading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      Generating Execution Plan...
                    </>
                  ) : <><AiSparkleIcon size={15} style={{ verticalAlign: "middle" }} /> Generate AI Execution Plan</>}
                </button>
                <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center" }} onClick={() => resetCreateModal()}>
                  Cancel
                </button>
              </div>
            )}

            {/* ─── Execution Plan View ─── */}
            {aiGenerated && blueprint && (
              <>
                {/* Header bar */}
                <div style={{ padding: "24px 32px 0", flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800 }}>AI</div>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Execution Plan</h2>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{newName}</p>
                    </div>
                    {/* Confidence gauge */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ position: "relative", width: 44, height: 44 }}>
                        <svg width="44" height="44" viewBox="0 0 44 44" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="4" />
                          <circle
                            cx="22" cy="22" r="18" fill="none"
                            stroke={blueprint.confidenceScore >= 80 ? "#10b981" : blueprint.confidenceScore >= 60 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="4"
                            strokeDasharray={`${(blueprint.confidenceScore / 100) * 113.1} 113.1`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 800, color: blueprint.confidenceScore >= 80 ? "#10b981" : blueprint.confidenceScore >= 60 ? "#f59e0b" : "#ef4444" }}>
                          {blueprint.confidenceScore}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", lineHeight: 1.3 }}>
                        <div style={{ fontWeight: 700 }}>Confidence</div>
                        <div>Score</div>
                      </div>
                    </div>
                  </div>

                  {/* KPI Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
                    {[
                      { label: "Total Hours", value: `${blueprint.totalEstimatedHours}h`, color: "#6366f1" },
                      { label: "Timeline", value: `${blueprint.estimatedWeeks} wks`, color: "#8b5cf6" },
                      { label: "Team Size", value: `${blueprint.teamSizeRecommendation}`, color: "#06b6d4" },
                      { label: "Risks", value: `${blueprint.risks.length}`, color: blueprint.risks.some(r => r.severity === "critical") ? "#ef4444" : "#f59e0b" },
                    ].map((kpi) => (
                      <div key={kpi.label} style={{ padding: "12px 14px", borderRadius: 12, background: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.6)", textAlign: "center" }}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                        <div style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--text-muted)", marginTop: 2 }}>{kpi.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Tab bar */}
                  <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    {(["summary", "tasks", "risks"] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setPlanTab(tab)}
                        style={{
                          padding: "10px 18px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          fontFamily: "var(--font)",
                          background: "none",
                          border: "none",
                          borderBottom: planTab === tab ? "2px solid #6366f1" : "2px solid transparent",
                          color: planTab === tab ? "#6366f1" : "var(--text-muted)",
                          cursor: "pointer",
                          textTransform: "capitalize",
                          transition: "all 0.2s",
                        }}
                      >
                        {tab === "summary" ? "Summary" : tab === "tasks" ? `Tasks (${blueprintTasks.length})` : `Risks (${blueprint.risks.length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab content (scrollable) */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 32px 24px" }}>
                  {aiError && (
                    <p style={{ color: "#ef4444", fontSize: "0.8rem", textAlign: "center", marginBottom: 12 }}>{aiError}</p>
                  )}

                  {/* ═══ Summary Tab ═══ */}
                  {planTab === "summary" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {/* Executive Summary */}
                      <div style={{ padding: 18, borderRadius: 14, background: "linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.06))", border: "1px solid rgba(99,102,241,0.12)" }}>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6366f1", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Executive Summary</div>
                        <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--text)" }}>{blueprint.executiveSummary}</p>
                      </div>

                      {/* Phases */}
                      <div>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Project Phases</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {blueprint.phases.map((phase, i) => {
                            const pct = blueprint.totalEstimatedHours > 0 ? Math.round((phase.estimatedHours / blueprint.totalEstimatedHours) * 100) : 0;
                            const phaseColors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"];
                            const c = phaseColors[i % phaseColors.length];
                            return (
                              <div key={i} style={{ padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.6)" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ width: 22, height: 22, borderRadius: 7, background: c + "18", color: c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 800 }}>{i + 1}</span>
                                    <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{phase.name}</span>
                                  </div>
                                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: c }}>{phase.estimatedHours}h</span>
                                </div>
                                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 8, lineHeight: 1.5 }}>{phase.description}</p>
                                <div style={{ height: 4, borderRadius: 2, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                                  <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: c, transition: "width 0.6s ease" }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Effort Breakdown */}
                      <div>
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Effort Breakdown</div>
                        <div style={{ padding: 16, borderRadius: 12, background: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.6)" }}>
                          {/* Stacked bar */}
                          <div style={{ height: 28, borderRadius: 8, overflow: "hidden", display: "flex", marginBottom: 14 }}>
                            {(() => {
                              const effortColors: Record<string, string> = { frontend: "#6366f1", backend: "#8b5cf6", devops: "#06b6d4", qa: "#10b981", design: "#f59e0b", other: "#94a3b8" };
                              const entries = Object.entries(blueprint.effortBreakdown).filter(([, v]) => v > 0);
                              return entries.map(([key, value]) => (
                                <div
                                  key={key}
                                  title={`${key}: ${value}%`}
                                  style={{ width: `${value}%`, background: effortColors[key] || "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, color: "#fff", minWidth: value > 4 ? 0 : 0, transition: "width 0.6s ease" }}
                                >
                                  {value >= 10 ? `${value}%` : ""}
                                </div>
                              ));
                            })()}
                          </div>
                          {/* Legend */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px" }}>
                            {(() => {
                              const effortColors: Record<string, string> = { frontend: "#6366f1", backend: "#8b5cf6", devops: "#06b6d4", qa: "#10b981", design: "#f59e0b", other: "#94a3b8" };
                              return Object.entries(blueprint.effortBreakdown).filter(([, v]) => v > 0).map(([key, value]) => (
                                <div key={key} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                  <div style={{ width: 8, height: 8, borderRadius: 2, background: effortColors[key] || "#94a3b8" }} />
                                  <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "capitalize" }}>{key}</span>
                                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text)" }}>{value}%</span>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Tech Stack */}
                      {blueprint.techStackSuggestions.length > 0 && (
                        <div>
                          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>Suggested Tech Stack</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {blueprint.techStackSuggestions.map((tech) => (
                              <span key={tech} style={{ padding: "6px 14px", borderRadius: 100, background: "rgba(99,102,241,0.08)", color: "#6366f1", fontSize: "0.75rem", fontWeight: 700, border: "1px solid rgba(99,102,241,0.15)" }}>
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ═══ Tasks Tab ═══ */}
                  {planTab === "tasks" && (
                    <div>
                      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tasks by Phase (click to edit)</span>
                        <button
                          onClick={addBlueprintTask}
                          disabled={isCreating}
                          style={{ fontSize: "0.7rem", padding: "3px 10px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.06)", color: "#6366f1", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)" }}
                        >
                          + Add Task
                        </button>
                      </div>

                      {/* Group tasks by phase */}
                      {(() => {
                        const phaseNames = blueprint.phases.map(p => p.name);
                        const grouped = new Map<string, { task: BlueprintTask; idx: number }[]>();
                        blueprintTasks.forEach((t, idx) => {
                          const key = t.phase || "Ungrouped";
                          if (!grouped.has(key)) grouped.set(key, []);
                          grouped.get(key)!.push({ task: t, idx });
                        });
                        // sort by phase order
                        const orderedKeys = [...phaseNames.filter(n => grouped.has(n)), ...[...grouped.keys()].filter(k => !phaseNames.includes(k))];
                        return orderedKeys.map((phaseName) => (
                          <div key={phaseName} style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6366f1", marginBottom: 6 }}>{phaseName}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {(grouped.get(phaseName) || []).map(({ task: t, idx: i }) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)" }}>
                                  {/* Priority dot */}
                                  <span
                                    title={t.priority}
                                    style={{
                                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                                      background: t.priority === "critical" ? "#ef4444" : t.priority === "high" ? "#f59e0b" : t.priority === "medium" ? "#6366f1" : "#94a3b8",
                                    }}
                                  />
                                  <input
                                    value={t.title}
                                    onChange={(e) => updateBlueprintTask(i, "title", e.target.value)}
                                    style={{ flex: 1, fontSize: "0.8rem", fontWeight: 500, background: "transparent", border: "1px solid transparent", borderRadius: 6, padding: "2px 6px", fontFamily: "var(--font)", outline: "none", color: "var(--text)", transition: "border-color 0.2s" }}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.3)")}
                                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                                  />
                                  {/* Complexity badge */}
                                  <span style={{
                                    fontSize: "0.6rem", fontWeight: 700, padding: "2px 7px", borderRadius: 6, flexShrink: 0,
                                    background: t.complexity === "complex" ? "rgba(239,68,68,0.08)" : t.complexity === "moderate" ? "rgba(245,158,11,0.08)" : "rgba(16,185,129,0.08)",
                                    color: t.complexity === "complex" ? "#ef4444" : t.complexity === "moderate" ? "#f59e0b" : "#10b981",
                                  }}>
                                    {t.complexity || "moderate"}
                                  </span>
                                  <input
                                    type="number"
                                    value={t.estimatedHours}
                                    min={0.5}
                                    step={0.5}
                                    onChange={(e) => updateBlueprintTask(i, "estimatedHours", parseFloat(e.target.value) || 0)}
                                    style={{ width: 44, fontSize: "0.65rem", color: "var(--text-muted)", background: "transparent", border: "1px solid transparent", borderRadius: 6, padding: "2px 4px", fontFamily: "var(--font)", outline: "none", textAlign: "center", transition: "border-color 0.2s" }}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.3)")}
                                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                                  />
                                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>h</span>
                                  <input
                                    value={t.tag}
                                    onChange={(e) => updateBlueprintTask(i, "tag", e.target.value)}
                                    style={{ width: 72, fontSize: "0.6rem", padding: "2px 8px", borderRadius: 100, background: "rgba(245,158,11,0.1)", color: "#f59e0b", fontWeight: 600, border: "1px solid transparent", fontFamily: "var(--font)", outline: "none", textAlign: "center", transition: "border-color 0.2s" }}
                                    onFocus={(e) => (e.target.style.borderColor = "rgba(245,158,11,0.3)")}
                                    onBlur={(e) => (e.target.style.borderColor = "transparent")}
                                  />
                                  <button
                                    onClick={() => removeBlueprintTask(i)}
                                    title="Remove task"
                                    style={{ width: 22, height: 22, borderRadius: 6, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)", color: "#ef4444", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "var(--font)", lineHeight: 1 }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()}
                      {blueprintTasks.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", padding: 16 }}>No tasks. Add some or regenerate the plan.</p>
                      )}
                    </div>
                  )}

                  {/* ═══ Risks Tab ═══ */}
                  {planTab === "risks" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {blueprint.risks.map((risk, i) => {
                        const sevColor = risk.severity === "critical" ? "#ef4444" : risk.severity === "high" ? "#f59e0b" : risk.severity === "medium" ? "#6366f1" : "#94a3b8";
                        const likeColor = risk.likelihood === "high" ? "#ef4444" : risk.likelihood === "medium" ? "#f59e0b" : "#10b981";
                        return (
                          <div key={i} style={{ padding: 16, borderRadius: 14, background: "rgba(255,255,255,0.45)", border: `1px solid ${sevColor}20` }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{
                                  fontSize: "0.6rem", fontWeight: 800, padding: "3px 8px", borderRadius: 6, textTransform: "uppercase", letterSpacing: "0.03em",
                                  background: sevColor + "14", color: sevColor,
                                }}>
                                  {risk.severity}
                                </span>
                                <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{risk.title}</span>
                              </div>
                              <span style={{ fontSize: "0.6rem", fontWeight: 700, color: likeColor, padding: "3px 8px", borderRadius: 6, background: likeColor + "14" }}>
                                {risk.likelihood} likelihood
                              </span>
                            </div>
                            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 10 }}>{risk.description}</p>
                            <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.12)" }}>
                              <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.04em" }}>Mitigation</span>
                              <p style={{ fontSize: "0.78rem", color: "var(--text)", lineHeight: 1.5, marginTop: 4 }}>{risk.mitigation}</p>
                            </div>
                          </div>
                        );
                      })}
                      {blueprint.risks.length === 0 && (
                        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", padding: 16 }}>No risks identified.</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer action bar */}
                <div style={{ padding: "16px 32px 24px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: 10, flexShrink: 0 }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1, justifyContent: "center", opacity: isCreating ? 0.6 : 1 }}
                    onClick={createProject}
                    disabled={isCreating || blueprintTasks.length === 0}
                  >
                    {isCreating ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                          <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Creating…
                      </>
                    ) : (
                      <><CheckIcon size={14} /> Create Project</>
                    )}
                  </button>
                  <button className="btn btn-glass" onClick={() => { setAiGenerated(false); setBlueprint(null); setBlueprintTasks([]); setAiError(""); }} disabled={isCreating}>
                    Regenerate
                  </button>
                  <button className="btn btn-ghost" onClick={() => { if (!isCreating) resetCreateModal(); }} disabled={isCreating}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* ─── Edit Project Modal ─── */}
      {editingProject && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(240,238,245,0.65)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => { if (!editSaving) setEditingProject(null); }}
        >
          <div
            className="glass-card visible"
            style={{ maxWidth: 480, width: "100%", padding: 36, cursor: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: 20 }}>Edit Project</h2>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "var(--text-muted)" }}>NAME</label>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                disabled={editSaving}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 10, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(20px)", fontFamily: "var(--font)", fontSize: "0.9375rem", outline: "none", color: "var(--text)" }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "var(--text-muted)" }}>DESCRIPTION</label>
              <textarea
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                rows={3}
                disabled={editSaving}
                style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 10, background: "rgba(255,255,255,0.35)", backdropFilter: "blur(20px)", fontFamily: "var(--font)", fontSize: "0.9375rem", outline: "none", resize: "vertical", color: "var(--text)" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "var(--text-muted)" }}>STATUS</label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["planning", "active", "completed"] as const).map((s) => {
                  const sty = PROJECT_STATUS_STYLES[s];
                  return (
                    <button
                      key={s}
                      onClick={() => setEditStatus(s)}
                      disabled={editSaving}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 10,
                        border: editStatus === s ? `1.5px solid ${sty.color}` : "1.5px solid rgba(0,0,0,0.06)",
                        background: editStatus === s ? sty.bg : "transparent",
                        color: editStatus === s ? sty.color : "var(--text-muted)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        textTransform: "capitalize",
                        fontFamily: "var(--font)",
                        transition: "all 0.2s",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={saveEditProject} disabled={editSaving || !editName.trim()}>
                {editSaving ? "Saving…" : "Save Changes"}
              </button>
              <button className="btn btn-ghost" onClick={() => setEditingProject(null)} disabled={editSaving}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteTarget && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(240,238,245,0.65)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => { if (!isDeleting) setDeleteTarget(null); }}
        >
          <div
            className="glass-card visible"
            style={{ maxWidth: 400, width: "100%", padding: 36, cursor: "auto", textAlign: "center" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(239,68,68,0.1)", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 16px", fontWeight: 700 }}>!</div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: 8 }}>Delete Project?</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: 24 }}>
              <strong>{deleteTarget.name}</strong> and all its tasks will be permanently deleted. This can&apos;t be undone.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                className="btn"
                style={{ background: "#ef4444", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 10, fontWeight: 700, cursor: "pointer", fontFamily: "var(--font)", fontSize: "0.85rem", opacity: isDeleting ? 0.6 : 1 }}
                onClick={confirmDeleteProject}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
              <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </PageTransition>
    </div>
  );
}
