export type EmployeeStatus = "working" | "break" | "offline" | "time-off" | "meeting";

export interface Employee {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
  skills: string[];
  status: EmployeeStatus;
  currentTask?: string;
  efficiencyScore: number;
  workHoursToday: number;
  breakMinutesToday: number;
  deskId?: string;
}

export interface Task {
  id: string;
  title: string;
  tag: string;
  status: "done" | "in-progress" | "todo" | "ai-suggested";
  assigneeId?: string;
  estimatedHours?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  tasks: Task[];
  teamIds: string[];
  createdAt: string;
  status: "active" | "planning" | "completed";
}
