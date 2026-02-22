"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const MANAGER_LINKS = [
  { href: "/dashboard", label: "Office" },
  { href: "/projects", label: "Projects" },
];

const EMPLOYEE_LINKS = [
  { href: "/employee", label: "My Portal" },
];

export default function AppHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navLinks = user?.role === "manager" ? MANAGER_LINKS : EMPLOYEE_LINKS;

  return (
    <header className="app-header">
      <div className="app-header-inner">
        {/* Logo */}
        <Link href={user?.role === "manager" ? "/dashboard" : "/employee"} style={{ textDecoration: "none" }}>
          <span style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", display: "flex", alignItems: "center", lineHeight: 1, color: "#1a1a2e" }}>
            Ne
            <span style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>x</span>
            ofi
          </span>
        </Link>

        <nav style={{ display: "flex", gap: 4, marginLeft: 8 }}>
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={`app-nav-link${pathname === l.href ? " active" : ""}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {user && (
            <>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                {user.displayName}
                <span style={{ fontSize: "0.65rem", marginLeft: 6, padding: "2px 8px", borderRadius: 100, background: user.role === "manager" ? "rgba(99,102,241,0.1)" : "rgba(16,185,129,0.1)", color: user.role === "manager" ? "#6366f1" : "#10b981", fontWeight: 600, textTransform: "capitalize" }}>
                  {user.role}
                </span>
              </span>
              <button onClick={logout} className="btn btn-ghost" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
