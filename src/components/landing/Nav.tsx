"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // find the snap container
    const snapEl = document.querySelector(".snap-container") as HTMLElement | null;
    containerRef.current = snapEl;

    const handler = () => {
      if (snapEl) setScrolled(snapEl.scrollTop > 40);
    };

    snapEl?.addEventListener("scroll", handler);
    window.addEventListener("scroll", handler);
    return () => {
      snapEl?.removeEventListener("scroll", handler);
      window.removeEventListener("scroll", handler);
    };
  }, []);

  const handleAnchor = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    const snapEl = containerRef.current || document.querySelector(".snap-container");
    if (target && snapEl) {
      const top = (target as HTMLElement).offsetTop;
      snapEl.scrollTo({ top, behavior: "smooth" });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav id="nav" className={scrolled ? "scrolled" : ""}>
        <div className="nav-inner container">
          <a href="#" className="logo">
            <span style={{ fontSize: "2.1rem", fontWeight: 800, letterSpacing: "-0.03em", display: "flex", alignItems: "center", lineHeight: 1, color: "#1a1a2e" }}>
              Ne
              <span style={{ background: "linear-gradient(135deg,#6366f1,#a78bfa,#c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>x</span>
              ofi
            </span>
          </a>

          <ul className="nav-links">
            {[["#features","Features"],["#how-it-works","How It Works"],["#office","Virtual Office"],["#analytics","Analytics"]].map(([href, label]) => (
              <li key={href}>
                <a href={href} onClick={(e) => handleAnchor(e, href)}>{label}</a>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <Link href="/employee" className="btn btn-ghost">Log In</Link>
            <a href="#waitlist" onClick={(e) => handleAnchor(e, "#waitlist")} className="btn btn-primary">Get Early Access</a>
          </div>

          <button
            className="mobile-menu-btn"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span style={mobileOpen ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
            <span style={mobileOpen ? { opacity: 0 } : {}} />
            <span style={mobileOpen ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${mobileOpen ? " active" : ""}`}>
        <ul>
          {[["#features","Features"],["#how-it-works","How It Works"],["#office","Virtual Office"],["#analytics","Analytics"]].map(([href, label]) => (
            <li key={href}>
              <a href={href} onClick={(e) => handleAnchor(e, href)}>{label}</a>
            </li>
          ))}
          <li>
            <a href="#waitlist" onClick={(e) => handleAnchor(e, "#waitlist")} className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
              Get Early Access
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
