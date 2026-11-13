"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { Flip } from "gsap/Flip";
import { PROJECTS } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

const FILTERS = ["All", ...PROJECTS.map((p) => p.sector)];
const STATES = [
  { name: "Delhi", cities: ["Pitampura", "Jehangirpuri", "Prashant Vihar"] },
  { name: "Haryana", cities: ["Kundli", "Bawal", "Wazirpur", "Pataudi"] },
  { name: "Madhya Pradesh", cities: ["Bhopal", "B.H.E.L.", "Ratanpur"] },
];

export function PortfolioGrid() {
  const [filter, setFilter] = useState("All");
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  const shown = PROJECTS.filter((p) => filter === "All" || p.sector === filter);
  const activeStates = new Set(shown.flatMap((p) => p.states));

  const choose = (f: string) => {
    if (f === filter) return;
    if (!prefersReducedMotion()) {
      gsap.registerPlugin(Flip);
      flipState.current = Flip.getState(grid.current!.querySelectorAll("[data-pcard]"));
    }
    setFilter(f);
  };

  useLayoutEffect(() => {
    const i = FILTERS.indexOf(filter);
    const b = btns.current[i];
    if (b && pill.current) gsap.to(pill.current, { x: b.offsetLeft, width: b.offsetWidth, duration: 0.6, ease: "expo.out" });
    const st = flipState.current;
    if (!st) return;
    flipState.current = null;
    Flip.from(st, {
      duration: 0.9,
      ease: "expo.inOut",
      absolute: true,
      scale: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out", delay: 0.2 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.5, ease: "power2.in" }),
    });
  }, [filter]);

  return (
    <>
      {/* coverage */}
      <div data-stagger className="grid gap-4 md:grid-cols-3">
        {STATES.map((s) => {
          const on = activeStates.has(s.name);
          const count = PROJECTS.flatMap((p) => p.clients).filter((c) => (s.name === "Madhya Pradesh" ? /Bhopal/.test(c) : s.name === "Haryana" ? /Haryana|Kundli/.test(c) : /Delhi/.test(c))).length;
          return (
            <div
              key={s.name}
              data-rise
              className={`relative overflow-hidden rounded-[26px] border p-7 transition-[background-color,border-color,opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${on ? "border-brand/20 bg-surface opacity-100" : "border-line bg-transparent opacity-45"}`}
            >
              <div className="flex items-center justify-between">
                <span className="relative flex h-3 w-3">
                  <span className={`absolute inset-0 rounded-full bg-accent ${on ? "animate-ping" : ""}`} />
                  <span className="relative h-3 w-3 rounded-full bg-accent" />
                </span>
                <span className="text-[13px] font-medium text-ink-3">{count} client sites listed</span>
              </div>
              <h3 className="mt-10 font-display text-[clamp(1.8rem,2.6vw,2.6rem)] font-medium tracking-[-0.04em]">{s.name}</h3>
              <p className="mt-2 text-[15px] text-ink-2">{s.cities.join(" · ")}</p>
            </div>
          );
        })}
      </div>

      {/* filters */}
      <div className="sticky top-[92px] z-30 mt-16 flex justify-center">
        <div role="tablist" aria-label="Filter projects by sector" className="no-scrollbar relative flex max-w-full overflow-x-auto rounded-full border border-white/70 bg-white/75 p-1.5 shadow-[0_20px_50px_-30px_rgba(42,27,110,.35)] backdrop-blur-xl">
          <span ref={pill} aria-hidden="true" className="absolute left-0 top-1.5 h-[calc(100%-12px)] rounded-full bg-brand" style={{ width: 0 }} />
          {FILTERS.map((f, i) => (
            <button
              key={f}
              ref={(el) => {
                btns.current[i] = el;
              }}
              type="button"
              role="tab"
              aria-selected={filter === f}
              onClick={() => choose(f)}
              className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors duration-500 sm:px-5 ${filter === f ? "text-white" : "text-ink-2 hover:text-ink"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* grid */}
      <div ref={grid} className="mt-10 grid gap-5 md:grid-cols-2" aria-live="polite">
        {shown.map((p, i) => (
          <article key={p.id} data-pcard className={`group relative overflow-hidden rounded-[28px] border border-line bg-surface p-3 ${shown.length > 2 && i === 0 ? "md:col-span-2" : ""}`}>
            <div className={`relative overflow-hidden rounded-[20px] bg-bg-soft ${shown.length > 2 && i === 0 ? "aspect-[16/7]" : "aspect-[16/10]"}`} data-cursor="none">
              <Image
                src={p.image}
                alt={`${p.title} — on-site camera views`}
                fill
                sizes="(min-width:768px) 50vw, 100vw"
                className="scale-[1.28] object-cover grayscale-[.85] transition-[filter,transform] duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.36] group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(18,19,42,.55))]" />
              {/* frame that draws on hover */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[14px] border-2 border-white/0 transition-colors duration-700 group-hover:border-white/80" />
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3.5 py-1.5 text-[13px] font-medium text-ink backdrop-blur">{p.sector}</span>
              <div className="absolute bottom-5 left-5 flex flex-wrap gap-2">
                {p.tags.map((t, k) => (
                  <span
                    key={t}
                    className="translate-y-3 rounded-full bg-white px-3 py-1.5 text-[12.5px] font-medium text-brand opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ transitionDelay: `${k * 60}ms` }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <h3 className="t-h3 max-w-[18ch]">{p.title}</h3>
              <ul className="space-y-1.5 text-[15px] text-ink-2">
                {p.clients.map((c, k) => (
                  <li key={c} className="flex gap-2.5 transition-transform duration-500 group-hover:translate-x-1" style={{ transitionDelay: `${k * 50}ms` }}>
                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {c}
                  </li>
                ))}
              </ul>
              {/* tags also present as text for touch */}
              <p className="text-[13px] text-ink-3 sm:col-span-2 lg:hidden">{p.tags.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
