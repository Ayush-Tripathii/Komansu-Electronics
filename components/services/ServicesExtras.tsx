"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IVA_DEMOS, PROCESS, STANDARDS } from "@/lib/content";
import { gsap, isFinePointer, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/ui/MagneticButton";

/* ---------------- IVA demos + lightbox ---------------- */
export function IvaDemos() {
  const [open, setOpen] = useState<{ i: number; x: number; y: number } | null>(null);
  return (
    <>
      <div data-stagger className="grid gap-5 sm:grid-cols-2">
        {IVA_DEMOS.map((d, i) => (
          <DemoCard key={d.title} d={d} onOpen={(x, y) => setOpen({ i, x, y })} />
        ))}
      </div>
      {open && <Lightbox demo={IVA_DEMOS[open.i]} origin={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function DemoCard({ d, onOpen }: { d: (typeof IVA_DEMOS)[number]; onOpen: (x: number, y: number) => void }) {
  const vid = useRef<HTMLVideoElement>(null);
  const play = () => {
    if (!isFinePointer() || prefersReducedMotion() || !vid.current) return;
    vid.current.play().catch(() => {});
  };
  const stop = () => vid.current?.pause();
  const inner = (
    <>
      <div className="relative aspect-video overflow-hidden rounded-[20px] bg-[linear-gradient(150deg,#e8e5f6,#fde8dd)]">
        {d.type === "video" ? (
          <video ref={vid} src={`${d.src}#t=0.6`} muted loop playsInline preload="metadata" className="h-full w-full scale-[1.02] object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110" aria-hidden="true" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="relative h-[70%] w-[42%] rotate-[-4deg] rounded-xl bg-white shadow-[var(--shadow-soft)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-0 group-hover:scale-105">
              <div className="absolute inset-4 space-y-2">
                <span className="block h-2 w-2/3 rounded bg-brand/70" />
                {[90, 75, 85, 60, 80, 70].map((w, k) => (
                  <span key={k} className="block h-1.5 rounded bg-ink/10" style={{ width: `${w}%` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[12.5px] font-medium text-ink backdrop-blur">{d.kind}</span>
        <span className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-brand shadow-[var(--shadow-soft)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-110">
          {d.type === "video" ? (
            <svg width="16" height="16" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 2.5v9l7.5-4.5z" fill="currentColor" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 1.5v8M3.5 6 7 9.5 10.5 6M2 12.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </span>
      </div>
      <div className="px-2 pb-2 pt-6">
        <h3 className="t-h3">{d.title}</h3>
        <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{d.body}</p>
      </div>
    </>
  );
  const cls = "group block rounded-[28px] border border-line bg-surface p-3 text-left transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lift)]";
  return d.type === "pdf" ? (
    <a data-rise href={d.src} target="_blank" rel="noopener" data-cursor-label="Open PDF" className={cls}>
      {inner}
    </a>
  ) : (
    <button data-rise type="button" data-cursor="play" onPointerEnter={play} onPointerLeave={stop} onClick={(e) => onOpen(e.clientX, e.clientY)} className={cls} aria-label={`Play ${d.title} demo`}>
      {inner}
    </button>
  );
}

function Lightbox({ demo, origin, onClose }: { demo: (typeof IVA_DEMOS)[number]; origin: { x: number; y: number }; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    if (prefersReducedMotion()) return onClose();
    gsap.to(root.current, { clipPath: `circle(0% at ${origin.x}px ${origin.y}px)`, duration: 0.6, ease: "expo.inOut", onComplete: onClose });
  }, [onClose, origin]);
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    const prev = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    if (!prefersReducedMotion()) gsap.fromTo(root.current, { clipPath: `circle(0% at ${origin.x}px ${origin.y}px)` }, { clipPath: `circle(150% at ${origin.x}px ${origin.y}px)`, duration: 0.9, ease: "expo.inOut" });
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("keydown", key);
      lenis?.start();
      prev?.focus();
    };
  }, [close, origin]);
  return createPortal(
    <div ref={root} role="dialog" aria-modal="true" aria-label={demo.title} className="fixed inset-0 z-[230] flex items-center justify-center bg-[rgba(245,243,238,.86)] p-4 backdrop-blur-2xl sm:p-10" onClick={(e) => e.target === e.currentTarget && close()}>
      <div className="w-full max-w-6xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-ink-3">{demo.kind}</p>
            <p className="font-display text-2xl font-medium tracking-[-0.03em]">{demo.title}</p>
          </div>
          <button ref={closeBtn} type="button" onClick={close} className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[var(--shadow-soft)] transition-transform duration-500 hover:rotate-90" aria-label="Close video">
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
        <video src={demo.src} controls autoPlay playsInline className="aspect-video w-full rounded-[24px] bg-ink shadow-[var(--shadow-lift)]" />
      </div>
    </div>,
    document.body
  );
}

/* ---------------- How We Deliver: pinned cable timeline ---------------- */
const STEP_W = 440;
export function ProcessTimeline() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const cable = useRef<SVGPathElement>(null);

  const pts = PROCESS.map((_, i) => ({ x: 120 + i * STEP_W, y: i % 2 ? 380 : 140 }));
  let d = `M0 260`;
  pts.forEach((p, i) => {
    const prevX = i ? pts[i - 1].x : 0;
    const mid = (prevX + p.x) / 2;
    d += ` C${mid} ${i ? pts[i - 1].y : 260} ${mid} ${p.y} ${p.x} ${p.y}`;
  });
  const endX = pts[pts.length - 1].x + 160;
  d += ` H${endX}`;
  const totalW = endX + 120;

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth + 80;
      gsap.set(cable.current, { strokeDasharray: 1, strokeDashoffset: 1 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist() * 1.1}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.to(t, { x: () => -dist(), ease: "none" }, 0).to(cable.current, { strokeDashoffset: 0, ease: "none" }, 0);
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((s) => {
        gsap.from(s, { opacity: 0.25, scale: 0.94, ease: "none", scrollTrigger: { trigger: s, containerAnimation: tl, start: "left 85%", end: "left 50%", scrub: true } });
      });
    });
    mm.add("(max-width: 1023px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth + 40;
      gsap.set(cable.current, { strokeDasharray: 1, strokeDashoffset: 1 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist() * 1.15}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      tl.to(t, { x: () => -dist(), ease: "none" }, 0).to(cable.current, { strokeDashoffset: 0, ease: "none" }, 0);
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((s) => {
        gsap.from(s, { opacity: 0.25, scale: 0.94, ease: "none", scrollTrigger: { trigger: s, containerAnimation: tl, start: "left 90%", end: "left 40%", scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div>
    <section ref={root} aria-labelledby="process-t" className="relative overflow-hidden bg-bg-soft flex flex-col justify-center h-screen min-h-[640px] py-6 sm:py-8 lg:h-screen lg:py-0">
      <div className="lg:flex lg:h-full lg:flex-col lg:justify-center">
        <div className="shell flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span data-rise className="eyebrow">
              Our Approach
            </span>
            <h2 id="process-t" data-split className="t-h2 mt-3 sm:mt-5">
              How We <span className="serif text-brand">Deliver</span>
            </h2>
          </div>
          <div className="lg:max-w-[46ch]">
            <p data-rise className="body text-[15px] sm:text-[16px]">
              Every project follows a structured workflow — from initial site survey and design through procurement, installation supervision, testing &amp; commissioning, and final as-built documentation handover.
            </p>
            <div data-rise className="mt-4 sm:mt-6">
              <MagneticButton href="/contact" variant="primary" size="sm">
                Discuss Your Project
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* horizontal track: mobile & desktop */}
        <div className="relative mt-8 sm:mt-10 block overflow-hidden lg:overflow-visible">
          <div ref={track} className="relative h-[520px]" style={{ width: totalW }}>
            <svg className="absolute inset-0 h-full" width={totalW} viewBox={`0 0 ${totalW} 520`} aria-hidden="true">
              <path d={d} fill="none" stroke="rgba(42,27,110,.12)" strokeWidth="10" strokeLinecap="round" />
              <path ref={cable} d={d} pathLength={1} fill="none" stroke="url(#cable-g)" strokeWidth="6" strokeLinecap="round" />
              <defs>
                <linearGradient id="cable-g" x1="0" x2="1">
                  <stop offset="0" stopColor="#2a1b6e" />
                  <stop offset=".6" stopColor="#4936c9" />
                  <stop offset="1" stopColor="#f2541b" />
                </linearGradient>
              </defs>
              <g transform={`translate(${endX} 260)`}>
                <rect x="0" y="-22" width="54" height="44" rx="10" fill="#f2541b" />
                <rect x="54" y="-10" width="16" height="6" rx="2" fill="#f2541b" />
                <rect x="54" y="4" width="16" height="6" rx="2" fill="#f2541b" />
              </g>
            </svg>
            {PROCESS.map((p, i) => (
              <div key={p} data-step className="absolute w-[290px] sm:w-[330px]" style={{ left: pts[i].x - 40, top: i % 2 ? 250 : 0 }}>
                <div className="relative rounded-[24px] border border-line bg-surface p-6 sm:p-7 shadow-[var(--shadow-soft)]">
                  <span className="font-display text-[48px] sm:text-[56px] font-medium leading-none tracking-[-0.05em] text-brand/15">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-3 sm:mt-4 font-display text-[19px] sm:text-[21px] font-medium leading-snug tracking-[-0.02em]">{p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

/* ---------------- Standards & codes ---------------- */
export function Standards() {
  return (
    <div data-stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STANDARDS.map((s, i) => (
        <article key={s.code} data-rise tabIndex={0} className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[28px] border border-line bg-surface p-8 outline-none transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-2 hover:shadow-[var(--shadow-lift)] focus-visible:-translate-y-2">
          <span className="text-[14px] font-medium text-ink-3">0{i + 1}</span>
          <div>
            <h3 className="font-display text-[clamp(1.8rem,2.4vw,2.4rem)] font-medium leading-[1.02] tracking-[-0.04em] text-ink transition-colors duration-500 group-hover:text-brand">{s.code}</h3>
            <p className="mt-4 text-[15.5px] text-ink-2">{s.name}</p>
          </div>
          {/* approval stamp */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-5 top-5 flex h-24 w-24 scale-150 rotate-[-28deg] items-center justify-center rounded-full border-2 border-dashed border-accent text-center text-[11px] font-semibold uppercase leading-tight tracking-[0.12em] text-accent-deep opacity-0 transition-all duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] group-hover:rotate-[-12deg] group-hover:scale-100 group-hover:opacity-90 group-focus-visible:scale-100 group-focus-visible:opacity-90"
          >
            Built
            <br />
            to code
          </span>
        </article>
      ))}
    </div>
  );
}
