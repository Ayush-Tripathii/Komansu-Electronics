"use client";

import { useEffect, useRef } from "react";
import { CLIENT_TYPES, PRINCIPLES } from "@/lib/content";
import { gsap, isFinePointer, prefersReducedMotion, registerGsap } from "@/lib/gsap";

const TINTS = ["linear-gradient(150deg,#ffffff,#efedfb)", "linear-gradient(150deg,#ffffff,#fdeee6)", "linear-gradient(150deg,#ffffff,#eaf0ff)"];

/** Principles as stacking cards: each pins, and settles back as the next slides over it. */
export function PrinciplesStack() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-pcard]");
      cards.forEach((c, i) => {
        if (i === cards.length - 1) return;
        gsap.to(c.firstElementChild, {
          scale: 0.92,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 25%", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={root} className="relative">
      {PRINCIPLES.map((p, i) => (
        <div key={p.title} data-pcard className="sticky pb-6" style={{ top: 120 + i * 28 }}>
          <article
            className="relative grid origin-top gap-10 overflow-hidden rounded-[32px] border border-line p-9 shadow-[var(--shadow-soft)] sm:p-14 lg:min-h-[420px] lg:grid-cols-12"
            style={{ background: TINTS[i] }}
          >
            <span className="font-display text-[clamp(5rem,12vw,11rem)] font-medium leading-[0.8] tracking-[-0.06em] text-brand/10 lg:col-span-4">0{i + 1}</span>
            <div className="lg:col-span-7 lg:col-start-6 lg:self-end">
              <h3 className="t-h2">{p.title}</h3>
              <p className="lead mt-6">{p.body}</p>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}

/** Industry and client chips with a magnetic hover. */
export function ClientCloud() {
  const root = useRef<HTMLUListElement>(null);
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const chips = Array.from(root.current!.querySelectorAll<HTMLElement>("[data-chip]"));
    const offs = chips.map((c) => {
      const move = (e: PointerEvent) => {
        const r = c.getBoundingClientRect();
        gsap.to(c, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.5, ease: "power3.out" });
      };
      const leave = () => gsap.to(c, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.4)" });
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerleave", leave);
      return () => {
        c.removeEventListener("pointermove", move);
        c.removeEventListener("pointerleave", leave);
      };
    });
    return () => offs.forEach((f) => f());
  }, []);
  return (
    <ul ref={root} data-stagger className="flex flex-wrap gap-3">
      {CLIENT_TYPES.map((c, i) => (
        <li key={c} data-rise>
          <span
            data-chip
            className={`group relative inline-flex cursor-default items-center overflow-hidden rounded-full border px-6 py-3.5 text-[clamp(1rem,1.5vw,1.35rem)] font-medium tracking-[-0.02em] transition-colors duration-500 ${
              i >= 6 ? "border-brand/25 text-brand" : "border-line-strong text-ink"
            } hover:text-white`}
          >
            <span aria-hidden="true" className="absolute inset-0 translate-y-full rounded-full bg-brand transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
            <span className="relative">{c}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
