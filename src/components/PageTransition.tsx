"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, type ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [stage, setStage] = useState<"enter" | "idle" | "exit">("enter");
  const prevPath = useRef(pathname);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial mount — play enter animation
  useEffect(() => {
    setStage("enter");
    const t = setTimeout(() => setStage("idle"), 400);
    return () => clearTimeout(t);
  }, []);

  // Route change — play enter animation (each page is its own mount,
  // so we only need enter; the old page unmounts instantly)
  useEffect(() => {
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setStage("enter");
      timeoutRef.current = setTimeout(() => setStage("idle"), 400);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  return (
    <div className={`page-transition page-transition--${stage}`}>
      {children}
    </div>
  );
}
