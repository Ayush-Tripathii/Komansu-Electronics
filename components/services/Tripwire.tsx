"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

// tripwire endpoints in % of the frame
const A = { x: 14, y: 88 };
const B = { x: 86, y: 18 };
const side = (x: number, y: number) => Math.sign((B.x - A.x) * (y - A.y) - (B.y - A.y) * (x - A.x));

type Alert = { kind: "in" | "out"; time: string; id: number };

/**
 * A virtual tripwire across a live scene. Cross it one way → intrusion alert;
 * cross it the other way → logged, no alarm (directional filtering).
 */
export function Tripwire() {
  const frame = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const line = useRef<SVGLineElement>(null);
  const [alert, setAlert] = useState<Alert | null>(null);
  const last = useRef(0);
  const n = useRef(0);

  useEffect(() => {
    const f = frame.current!;
    const reduced = prefersReducedMotion();
    let t0 = 0;
    const at = (px: number, py: number) => {
      // stepped ease = analytics-style jitter-then-lock
      gsap.to(box.current, { left: `${px}%`, top: `${py}%`, duration: 0.28, ease: "steps(3)", overwrite: true });
      const s = side(px, py);
      if (last.current && s && s !== last.current) {
        const kind = s > 0 ? "in" : "out";
        setAlert({ kind, time: new Date().toLocaleTimeString("en-IN", { hour12: false }), id: ++n.current });
        gsap.fromTo(line.current, { attr: { "stroke-width": 7 } }, { attr: { "stroke-width": 2.5 }, duration: 0.8, ease: "expo.out" });
        clearTimeout(t0);
        t0 = window.setTimeout(() => setAlert(null), 3200);
      }
      if (s) last.current = s;
    };

    if (reduced) return;
    if (isFinePointer()) {
      const move = (e: PointerEvent) => {
        const r = f.getBoundingClientRect();
        at(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
      };
      f.addEventListener("pointermove", move);
      return () => f.removeEventListener("pointermove", move);
    }
    // touch: a walker crosses back and forth on its own
    const p = { x: 25, y: 30 };
    const tl = gsap.timeline({ repeat: -1, yoyo: true, onUpdate: () => at(p.x, p.y) });
    tl.to(p, { x: 72, y: 76, duration: 3.2, ease: "sine.inOut" });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={frame} data-cursor="none" className="relative aspect-[5/4] w-full overflow-hidden rounded-[28px] bg-ink-2">
      <Image src="/images/warehouse.jpg" alt="A warehouse floor watched by an analytics camera" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,19,42,.15),rgba(18,19,42,.35))]" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <line ref={line} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={alert?.kind === "in" ? "#f2541b" : "#ffffff"} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeDasharray="10 7" className="transition-[stroke] duration-300" />
        <circle cx={A.x} cy={A.y} r="1.2" fill="#fff" />
        <circle cx={B.x} cy={B.y} r="1.2" fill="#fff" />
      </svg>
      <span className="absolute left-[16%] top-[74%] -rotate-[44deg] rounded-full bg-white/85 px-3 py-1 text-[12px] font-medium text-ink backdrop-blur" aria-hidden="true">
        Restricted zone →
      </span>

      {/* tracked subject box: jitters, then locks */}
      <div ref={box} aria-hidden="true" className="pointer-events-none absolute h-[22%] w-[13%] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-white/90" style={{ left: "25%", top: "30%" }}>
        <span className="absolute -top-6 left-0 whitespace-nowrap rounded bg-white px-1.5 py-0.5 text-[11px] font-semibold text-ink">Person</span>
      </div>

      <div className="absolute right-4 top-4 h-14" aria-live="polite">
        {alert && (
          <div key={alert.id} className={`trip-chip flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)] ${alert.kind === "in" ? "bg-accent text-ink" : "bg-white text-ink"}`}>
            <span className={`h-2 w-2 rounded-full ${alert.kind === "in" ? "animate-pulse bg-ink" : "bg-ok"}`} />
            <span className="text-[14px] font-medium">{alert.kind === "in" ? "Intrusion detected — entering" : "Exit detected — no alarm"}</span>
            <span className="text-[12.5px] tabular-nums opacity-70">{alert.time}</span>
          </div>
        )}
      </div>
      <p className="absolute bottom-4 left-4 max-w-[30ch] rounded-2xl bg-white/85 px-4 py-3 text-[13.5px] leading-snug text-ink backdrop-blur">
        Move across the line. Entering raises an alert; leaving is logged quietly.
      </p>
    </div>
  );
}
