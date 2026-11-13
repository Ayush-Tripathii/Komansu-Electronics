"use client";

import { useEffect, useRef, useState } from "react";
import { SERVICES } from "@/lib/content";
import { gsap, registerGsap, ScrollTrigger } from "@/lib/gsap";
import { Check, RevealImage } from "@/components/ui/kit";
import { CctvMultiview } from "./CctvMultiview";
import { Tripwire } from "./Tripwire";
import { FireDemo } from "./FireDemo";
import { AccessDemo } from "./AccessDemo";
import { NetworkDemo } from "./NetworkDemo";
import { Blueprint } from "./Blueprint";

const DEMOS: Record<string, { node: React.ReactNode; caption: string }> = {
  cctv: { node: <CctvMultiview />, caption: "Hover a feed to bring it into focus." },
  iva: { node: <Tripwire />, caption: "Directional filtering: only entering the zone raises an alarm." },
  "fire-alarm-paga": { node: <FireDemo />, caption: "Hold your cursor near a detector to trigger the full alarm sequence." },
  "access-control": { node: <AccessDemo />, caption: "Hover a door to present a card. One of them will refuse you." },
  "data-networks": { node: <NetworkDemo />, caption: "Click any switch — redundant links take over the traffic." },
  "elv-design": { node: <Blueprint />, caption: "Scroll to watch the drawing set build itself." },
};

/** Sticky discipline tabs with a sliding indicator that tracks the section in view. */
export function ServiceTabs() {
  const [active, setActive] = useState(0);
  const bar = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const btns = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    registerGsap();
    const triggers = SERVICES.map((s, i) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  useEffect(() => {
    const b = btns.current[active];
    const wrap = bar.current;
    if (!b || !wrap || !pill.current) return;
    gsap.to(pill.current, { x: b.offsetLeft, width: b.offsetWidth, duration: 0.6, ease: "expo.out" });
    wrap.scrollTo({ left: b.offsetLeft - 24, behavior: "smooth" });
  }, [active]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const lenis = (window as unknown as { __lenis?: { scrollTo(t: Element, o?: object): void } }).__lenis;
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -140, duration: 1.6 });
    else el.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="sticky top-[92px] z-40 mt-10">
      <div className="shell">
        <nav aria-label="Service disciplines" ref={bar} className="no-scrollbar relative mx-auto flex w-fit max-w-full overflow-x-auto rounded-full border border-white/70 bg-white/70 p-1.5 shadow-[0_20px_50px_-30px_rgba(42,27,110,.35)] backdrop-blur-xl">
          <span ref={pill} aria-hidden="true" className="absolute left-0 top-1.5 h-[calc(100%-12px)] rounded-full bg-brand" style={{ width: 0 }} />
          {SERVICES.map((s, i) => (
            <a
              key={s.id}
              ref={(el) => {
                btns.current[i] = el;
              }}
              href={`#${s.id}`}
              onClick={(e) => go(e, s.id)}
              aria-current={active === i ? "true" : undefined}
              className={`relative z-10 whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-medium transition-colors duration-500 sm:px-5 ${active === i ? "text-white" : "text-ink-2 hover:text-ink"}`}
            >
              {s.short}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function ServiceModules() {
  return (
    <div className="mt-10">
      {SERVICES.map((s, i) => {
        const demo = DEMOS[s.id];
        const flip = i % 2 === 1;
        return (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-36 border-b border-line py-24 last:border-0 sm:py-32">
            <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
              <div className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
                <div className="lg:sticky lg:top-44">
                  <div data-rise className="flex items-center gap-4">
                    <span className="font-display text-[15px] font-medium text-brand">{String(i + 1).padStart(2, "0")}</span>
                    <span className="h-px w-10 bg-line-strong" />
                    <span className="text-[14px] font-medium text-ink-3">{s.standard}</span>
                  </div>
                  <h2 id={`${s.id}-t`} data-split className="t-h2 mt-6">
                    {s.title}
                  </h2>
                  <p data-rise className="body mt-6 text-[17px] leading-relaxed">
                    {s.body}
                  </p>
                  <ul data-stagger className="mt-9 grid gap-3">
                    {s.points.map((p) => (
                      <li key={p} data-rise className="group flex items-start gap-3.5 text-[15.5px] text-ink">
                        <Check className="mt-[-2px] transition-colors duration-500 group-hover:bg-brand group-hover:text-white" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={`lg:col-span-7 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-6"}`}>
                <RevealImage src={s.image} alt={s.alt} className="mb-5 aspect-[16/8] w-full" parallax />
                <div data-rise>{demo.node}</div>
                <p data-rise className="mt-4 flex items-center gap-2 text-[14px] text-ink-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {demo.caption}
                </p>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
