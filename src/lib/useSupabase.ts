"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { getSupabase } from "./supabase";
import type { Employee, EmployeeStatus, Project, Task } from "./types";
import type { Database } from "./database.types";

// ── Mappers: DB row → front-end type ─────────────────────

function toEmployee(row: Record<string, unknown>): Employee {
  return {
    id: row.id as string,
    name: row.name as string,
    initials: row.initials as string,
    color: row.color as string,
    role: row.role as string,
    skills: (row.skills as string[]) ?? [],
    status: row.status as EmployeeStatus,
    currentTask: (row.current_task as string) ?? undefined,
    efficiencyScore: Number(row.efficiency_score),
    workHoursToday: Number(row.work_hours_today),
    breakMinutesToday: Number(row.break_minutes_today),
    deskId: (row.desk_id as string) ?? undefined,
  };
}

function toTask(row: Record<string, unknown>): Task {
  return {
    id: row.id as string,
    title: row.title as string,
    tag: row.tag as string,
    status: row.status as Task["status"],
    assigneeId: (row.assignee_id as string) ?? undefined,
    estimatedHours: row.estimated_hours != null ? Number(row.estimated_hours) : undefined,
  };
}

function toProject(row: Record<string, unknown>, tasks: Task[]): Project {
  return {
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    progress: Number(row.progress),
    status: row.status as Project["status"],
    createdAt: String(row.created_at).split("T")[0],
    teamIds: (row.team_ids as string[]) ?? [],
    tasks,
  };
}

// ── Hooks ─────────────────────────────────────────────────

let _empChannelId = 0;

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof getSupabase>["channel"]> | null>(null);

  const fetchEmployees = useCallback(async () => {
    const sb = getSupabase();
    const { data } = await sb.from("employees").select("*").order("name");
    if (data) setEmployees(data.map((r) => toEmployee(r as Record<string, unknown>)));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEmployees();

    const sb = getSupabase();
    const id = ++_empChannelId;
    const channel = sb
      .channel(`emp-rt-${id}-${Date.now()}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employees" },
        () => { fetchEmployees(); }
      )
      .subscribe((status, err) => {
        console.log("[Nexofi] Employees realtime:", status, err || "");
      });

    channelRef.current = channel;

    return () => {
      sb.removeChannel(channel);
      channelRef.current = null;
    };
  }, [fetchEmployees]);

  return { employees, loading, refetch: fetchEmployees };
}

let _projChannelId = 0;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef<ReturnType<ReturnType<typeof getSupabase>["channel"]> | null>(null);

  const fetchProjects = useCallback(async () => {
    const sb = getSupabase();
    const [{ data: projRows }, { data: taskRows }] = await Promise.all([
      sb.from("projects").select("*").order("created_at"),
      sb.from("tasks").select("*").order("created_at"),
    ]);

    if (projRows && taskRows) {
      const tasksByProject: Record<string, Task[]> = {};
      for (const t of taskRows) {
        const mapped = toTask(t as Record<string, unknown>);
        const pid = (t as Record<string, unknown>).project_id as string;
        (tasksByProject[pid] ??= []).push(mapped);
      }
      setProjects(projRows.map((r: Record<string, unknown>) => toProject(r, tasksByProject[r.id as string] ?? [])));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();

    const sb = getSupabase();
    const id = ++_projChannelId;
    const channel = sb
      .channel(`proj-rt-${id}-${Date.now()}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchProjects())
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => fetchProjects())
      .subscribe((status, err) => {
        console.log("[Nexofi] Projects realtime:", status, err || "");
      });

    channelRef.current = channel;

    return () => {
      sb.removeChannel(channel);
      channelRef.current = null;
    };
  }, [fetchProjects]);

  return { projects, loading, refetch: fetchProjects };
}

export function useDesks() {
  const [desks, setDesks] = useState<{ id: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sb = getSupabase();
      const { data } = await sb.from("desks").select("*").order("id");
      if (data) setDesks(data as { id: string; label: string }[]);
      setLoading(false);
    })();
  }, []);

  return { desks, loading };
}

// ── Mutations ─────────────────────────────────────────────

export async function updateEmployeeStatus(id: string, status: EmployeeStatus) {
  const sb = getSupabase();
  const res = await sb.from("employees").update({ status }).eq("id", id);
  if (res.error) console.error("[Nexofi] updateEmployeeStatus error:", res.error);
  return res;
}

export async function updateEmployee(id: string, data: Database["public"]["Tables"]["employees"]["Update"]) {
  const sb = getSupabase();
  const res = await sb.from("employees").update(data).eq("id", id);
  if (res.error) console.error("[Nexofi] updateEmployee error:", res.error);
  return res;
}

export async function createProject(project: Database["public"]["Tables"]["projects"]["Insert"]) {
  const sb = getSupabase();
  const res = await sb.from("projects").insert(project).select().single();
  if (res.error) console.error("[Nexofi] createProject error:", res.error);
  return res;
}

export async function updateProject(id: string, data: Database["public"]["Tables"]["projects"]["Update"]) {
  const sb = getSupabase();
  const res = await sb.from("projects").update(data).eq("id", id);
  if (res.error) console.error("[Nexofi] updateProject error:", res.error);
  return res;
}

export async function deleteProject(id: string) {
  const sb = getSupabase();
  const res = await sb.from("projects").delete().eq("id", id);
  if (res.error) console.error("[Nexofi] deleteProject error:", res.error);
  return res;
}

export async function createTask(task: Database["public"]["Tables"]["tasks"]["Insert"]) {
  const sb = getSupabase();
  const res = await sb.from("tasks").insert(task).select().single();
  if (res.error) console.error("[Nexofi] createTask error:", res.error);
  return res;
}

export async function updateTask(id: string, data: Database["public"]["Tables"]["tasks"]["Update"]) {
  const sb = getSupabase();
  const res = await sb.from("tasks").update(data).eq("id", id);
  if (res.error) console.error("[Nexofi] updateTask error:", res.error);
  return res;
}
