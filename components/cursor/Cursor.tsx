"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

/**
 * Custom cursor: a crisp dot plus a trailing ring.
 *  - links / buttons → ring swells and softens
 *  - [data-cursor="view"|"play"|"drag"] or [data-cursor-label] → ring becomes a
 *    filled indigo disc carrying a short label
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    setOn(true);
    document.documentElement.classList.add("has-cursor");
    const d = dot.current!;
    const r = ring.current!;
    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
    const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3.out" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3.out" });
    let mode = "";

    const setMode = (m: string, label = "") => {
      if (m === mode && (!label || text.current?.textContent === label)) return;
      mode = m;
      if (text.current) text.current.textContent = label;
      const big = m === "label";
      gsap.to(r, {
        width: big ? 96 : m === "link" ? 64 : 38,
        height: big ? 96 : m === "link" ? 64 : 38,
        backgroundColor: big ? "rgba(42,27,110,0.94)" : m === "link" ? "rgba(73,54,201,0.08)" : "rgba(42,27,110,0)",
        borderColor: big ? "rgba(42,27,110,0)" : m === "link" ? "rgba(73,54,201,0.28)" : "rgba(18,19,42,0.28)",
        duration: 0.5,
        ease: "expo.out",
      });
      gsap.to(text.current, { opacity: big ? 1 : 0, scale: big ? 1 : 0.6, duration: 0.4, ease: "expo.out" });
      gsap.to(d, { scale: big ? 0 : m === "link" ? 0.5 : 1, duration: 0.3 });
    };

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
      const t = (e.target as Element | null)?.closest?.("[data-cursor], [data-cursor-label], a, button, input, textarea, select, label") as HTMLElement | null;
      if (!t) return setMode("default");
      const label = t.dataset.cursorLabel;
      const c = t.dataset.cursor;
      if (label) return setMode("label", label);
      if (c === "view") return setMode("label", "View");
      if (c === "play") return setMode("label", "Play");
      if (c === "drag") return setMode("label", "Drag");
      if (c === "none") return setMode("default");
      if (t.matches("input, textarea")) return setMode("default");
      setMode("link");
    };
    const down = () => gsap.to(r, { scale: 0.85, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.5, ease: "elastic.out(1,0.5)" });
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([d, r], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  // reset to default after navigation
  useEffect(() => {
    if (!ring.current || !text.current) return;
    gsap.set(text.current, { opacity: 0 });
    gsap.set(ring.current, { width: 38, height: 38, backgroundColor: "rgba(42,27,110,0)", borderColor: "rgba(18,19,42,0.28)" });
    gsap.set(dot.current, { scale: 1 });
  }, [pathname]);

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-[240] ${on ? "" : "hidden"}`}>
      <div
        ref={ring}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border"
        style={{ width: 38, height: 38, borderColor: "rgba(18,19,42,0.28)" }}
      >
        <span ref={text} className="text-[13px] font-medium tracking-[-0.01em] text-white opacity-0" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-[7px] w-[7px] rounded-full bg-brand" />
    </div>
  );
}
