"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

type State = "idle" | "reading" | "granted" | "denied";

function Door({ name, level, deny }: { name: string; level: string; deny?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const leaf = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("idle");
  const timer = useRef<number[]>([]);

  const clear = () => {
    timer.current.forEach(clearTimeout);
    timer.current = [];
  };
  const run = () => {
    if (state !== "idle") return;
    clear();
    setState("reading");
    gsap.to(card.current, { x: 18, rotate: -8, duration: 0.5, ease: "expo.out" });
    timer.current.push(
      window.setTimeout(() => {
        if (deny) {
          setState("denied");
          gsap.fromTo(root.current, { x: 0 }, { keyframes: { x: [-8, 8, -6, 6, -3, 0] }, duration: 0.5, ease: "none" });
        } else {
          setState("granted");
          gsap.to(leaf.current, { rotateY: -70, duration: 1.1, ease: "back.out(1.2)" });
        }
      }, 650)
    );
  };
  const close = () => {
    clear();
    gsap.to(card.current, { x: 0, rotate: 0, duration: 0.6, ease: "expo.out" });
    gsap.to(leaf.current, { rotateY: 0, duration: 0.9, ease: "power3.inOut" });
    timer.current.push(window.setTimeout(() => setState("idle"), 300));
  };

  useEffect(() => {
    // touch & reduced motion: play once on entering view
    if (isFinePointer() && !prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(root.current!);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => clear, []);

  const led = state === "granted" ? "bg-ok" : state === "reading" ? "bg-amber-400" : "bg-accent";
  const msg =
    state === "granted" ? "Card verified · Access granted" : state === "denied" ? "Card not recognised · Access denied" : state === "reading" ? "Reading card…" : "Present card";

  return (
    <div
      ref={root}
      tabIndex={0}
      role="button"
      aria-label={`${name} door — ${deny ? "restricted" : level}. ${msg}`}
      onPointerEnter={run}
      onPointerLeave={close}
      onFocus={run}
      onBlur={close}
      data-cursor-label="Tap card"
      className="group relative flex flex-col overflow-hidden rounded-[24px] border border-line bg-surface p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-[19px] font-medium tracking-[-0.02em]">{name}</p>
          <p className="text-[13px] text-ink-3">{deny ? "Restricted" : level}</p>
        </div>
        {/* reader */}
        <div className="relative flex h-16 w-11 flex-col items-center justify-between rounded-xl border border-line-strong bg-bg py-2">
          <span className={`h-2 w-2 rounded-full transition-colors duration-300 ${led} ${state === "denied" ? "animate-pulse" : ""}`} />
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {[4, 8, 12].map((r, i) => (
              <path
                key={r}
                d={`M${10 - r * 0.7} ${14 - r * 0.7}a${r} ${r} 0 0 1 ${r * 1.4} 0`}
                stroke="currentColor"
                strokeWidth="1.4"
                className={`${state === "reading" ? "animate-ping" : ""} text-ink-3`}
                style={{ animationDelay: `${i * 120}ms`, animationDuration: "1s" }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* doorway */}
      <div className="relative mt-5 aspect-[4/5] overflow-hidden rounded-[16px] bg-[linear-gradient(160deg,#e8e5f6,#fde8dd)]" style={{ perspective: 900 }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
          <span className={`flex h-12 w-12 items-center justify-center rounded-full ${deny ? "bg-accent text-ink" : "bg-ok text-white"}`}>
            {deny ? (
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </span>
          <p className="text-[14px] font-medium">{deny ? "Stays locked" : "Welcome in"}</p>
        </div>
        <div ref={leaf} className="absolute inset-0 origin-left rounded-[16px] border border-line-strong bg-[linear-gradient(180deg,#fff,#f1eee8)] shadow-[inset_-10px_0_30px_-20px_rgba(18,19,42,.3)]" style={{ transformStyle: "preserve-3d" }}>
          <span className="absolute right-4 top-1/2 h-14 w-1.5 -translate-y-1/2 rounded-full bg-ink/70" />
          <span className="absolute inset-x-6 top-6 h-[38%] rounded-lg border border-line" />
          <span className="absolute inset-x-6 bottom-6 h-[38%] rounded-lg border border-line" />
        </div>
        {/* credential */}
        <div ref={card} className="absolute bottom-5 left-5 flex h-12 w-[4.6rem] items-start justify-end rounded-lg bg-brand p-1.5 shadow-[0_14px_30px_-12px_rgba(42,27,110,.7)]">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 13a7 7 0 0 1 10 0M7.5 10.5a3.5 3.5 0 0 1 5 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <p aria-live="polite" className={`mt-4 text-[13.5px] font-medium ${state === "granted" ? "text-ok" : state === "denied" ? "text-accent-deep" : "text-ink-3"}`}>
        {msg}
      </p>
    </div>
  );
}

function Turnstile() {
  const arms = useRef<SVGGElement>(null);
  const [passes, setPasses] = useState(0);
  const rot = useRef(0);
  const spin = () => {
    rot.current += 120;
    gsap.to(arms.current, {
      rotation: rot.current,
      svgOrigin: "60 60",
      duration: 1.1,
      ease: "power4.inOut",
    });
    setPasses((p) => p + 1);
  };
  return (
    <button
      type="button"
      onClick={spin}
      onPointerEnter={() => isFinePointer() && spin()}
      data-cursor-label="Pass"
      className="flex items-center gap-5 rounded-[24px] border border-line bg-surface p-5 text-left sm:col-span-2"
      aria-label="Turnstile — tap to pass a credential"
    >
      <svg width="96" height="96" viewBox="0 0 120 120" aria-hidden="true" className="shrink-0">
        <circle cx="60" cy="60" r="54" fill="#f5f3ee" stroke="rgba(18,19,42,.15)" />
        <g ref={arms}>
          {[0, 120, 240].map((a) => (
            <line key={a} x1="60" y1="60" x2={60 + Math.cos(((a - 90) * Math.PI) / 180) * 44} y2={60 + Math.sin(((a - 90) * Math.PI) / 180) * 44} stroke="#2a1b6e" strokeWidth="7" strokeLinecap="round" />
          ))}
        </g>
        <circle cx="60" cy="60" r="11" fill="#fff" stroke="#2a1b6e" strokeWidth="3" />
      </svg>
      <div>
        <p className="font-display text-[19px] font-medium tracking-[-0.02em]">Turnstile</p>
        <p className="mt-1 text-[14px] text-ink-2">Each valid credential releases one turn — resistance, then release.</p>
        <p className="mt-2 text-[13px] font-medium text-brand tabular-nums" aria-live="polite">
          {passes} {passes === 1 ? "person" : "people"} passed
        </p>
      </div>
    </button>
  );
}

export function AccessDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Door name="Main lobby" level="All staff" />
      <Door name="Server room" level="IT only" deny />
      <Turnstile />
    </div>
  );
}
