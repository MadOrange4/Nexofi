"use client";
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

/* ─── Types ─── */
export interface AuthUser {
  id: string;
  username: string;
  role: "manager" | "employee";
  employeeId: string | null;
  displayName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => "Not initialised",
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

/* ─── Helpers ─── */
const STORAGE_KEY = "nexofi_auth_user";

function saveUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}
function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}
function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ─── Public routes (no auth required) ─── */
const PUBLIC_PATHS = ["/", "/login"];

/* ─── Provider ─── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  /* Hydrate from localStorage on mount */
  useEffect(() => {
    const stored = loadUser();
    setUser(stored);
    setLoading(false);
  }, []);

  /* Redirect logic */
  useEffect(() => {
    if (loading) return;

    const isPublic = PUBLIC_PATHS.includes(pathname);

    if (!user && !isPublic) {
      router.replace("/login");
      return;
    }

    if (user && pathname === "/login") {
      router.replace(user.role === "manager" ? "/dashboard" : "/employee");
      return;
    }

    // Role-based route protection
    if (user) {
      const managerRoutes = ["/dashboard", "/projects"];
      const employeeRoutes = ["/employee"];

      if (user.role === "employee" && managerRoutes.includes(pathname)) {
        router.replace("/employee");
      }
      if (user.role === "manager" && employeeRoutes.includes(pathname)) {
        router.replace("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) return data.error || "Login failed";

      const authUser = data.user as AuthUser;
      setUser(authUser);
      saveUser(authUser);
      router.replace(authUser.role === "manager" ? "/dashboard" : "/employee");
      return null; // no error
    } catch {
      return "Network error. Please try again.";
    }
  }, [router]);

  const logout = useCallback(() => {
    setUser(null);
    clearUser();
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
