export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string;
          name: string;
          initials: string;
          color: string;
          role: string;
          skills: string[];
          status: "working" | "break" | "offline" | "time-off" | "meeting";
          current_task: string | null;
          efficiency_score: number;
          work_hours_today: number;
          break_minutes_today: number;
          desk_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          initials: string;
          color: string;
          role: string;
          skills?: string[];
          status?: "working" | "break" | "offline" | "time-off" | "meeting";
          current_task?: string | null;
          efficiency_score?: number;
          work_hours_today?: number;
          break_minutes_today?: number;
          desk_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          initials?: string;
          color?: string;
          role?: string;
          skills?: string[];
          status?: "working" | "break" | "offline" | "time-off" | "meeting";
          current_task?: string | null;
          efficiency_score?: number;
          work_hours_today?: number;
          break_minutes_today?: number;
          desk_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "employees_desk_id_fkey";
            columns: ["desk_id"];
            isOneToOne: false;
            referencedRelation: "desks";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string;
          progress: number;
          status: "active" | "planning" | "completed";
          created_at: string;
          team_ids: string[];
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          progress?: number;
          status?: "active" | "planning" | "completed";
          created_at?: string;
          team_ids?: string[];
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          progress?: number;
          status?: "active" | "planning" | "completed";
          created_at?: string;
          team_ids?: string[];
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          tag: string;
          status: "done" | "in-progress" | "todo" | "ai-suggested";
          assignee_id: string | null;
          estimated_hours: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          tag?: string;
          status?: "done" | "in-progress" | "todo" | "ai-suggested";
          assignee_id?: string | null;
          estimated_hours?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          tag?: string;
          status?: "done" | "in-progress" | "todo" | "ai-suggested";
          assignee_id?: string | null;
          estimated_hours?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_assignee_id_fkey";
            columns: ["assignee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          }
        ];
      };
      desks: {
        Row: {
          id: string;
          label: string;
        };
        Insert: {
          id?: string;
          label: string;
        };
        Update: {
          id?: string;
          label?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          role: "manager" | "employee";
          employee_id: string | null;
          display_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          role: "manager" | "employee";
          employee_id?: string | null;
          display_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          role?: "manager" | "employee";
          employee_id?: string | null;
          display_name?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_employee_id_fkey";
            columns: ["employee_id"];
            isOneToOne: false;
            referencedRelation: "employees";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
