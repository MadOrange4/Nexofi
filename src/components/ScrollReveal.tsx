"use client";
import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const snapEl = document.querySelector(".snap-container");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            const siblings = parent
              ? Array.from(parent.children).filter(
                  (el) =>
                    el.classList.contains("glass-card") ||
                    el.classList.contains("step-card") ||
                    el.classList.contains("section-header")
                )
              : [];
            const idx = siblings.indexOf(entry.target as Element);
            setTimeout(
              () => entry.target.classList.add("visible"),
              idx >= 0 ? idx * 80 : 0
            );
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: snapEl as Element | null,
        rootMargin: "0px 0px -60px 0px",
        threshold: 0.1,
      }
    );

    document
      .querySelectorAll(".glass-card, .step-card, .section-header")
      .forEach((el) => {
        if (el.closest("#hero")) {
          el.classList.add("visible");
          return;
        }
        obs.observe(el);
      });

    return () => obs.disconnect();
  }, []);

  return null;
}
