"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

type Node = { id: string; x: number; y: number; label: string; kind: "core" | "dist" | "access" | "ap" };
const NODES: Node[] = [
  { id: "core", x: 400, y: 60, label: "Core", kind: "core" },
  { id: "d1", x: 230, y: 170, label: "Building A", kind: "dist" },
  { id: "d2", x: 570, y: 170, label: "Building B", kind: "dist" },
  { id: "a1", x: 110, y: 300, label: "Floor 1", kind: "access" },
  { id: "a2", x: 310, y: 300, label: "Floor 2", kind: "access" },
  { id: "a3", x: 490, y: 300, label: "Floor 3", kind: "access" },
  { id: "a4", x: 690, y: 300, label: "Floor 4", kind: "access" },
  { id: "p1", x: 70, y: 420, label: "", kind: "ap" },
  { id: "p2", x: 200, y: 420, label: "", kind: "ap" },
  { id: "p3", x: 330, y: 420, label: "", kind: "ap" },
  { id: "p4", x: 470, y: 420, label: "", kind: "ap" },
  { id: "p5", x: 600, y: 420, label: "", kind: "ap" },
  { id: "p6", x: 730, y: 420, label: "", kind: "ap" },
];
// [from, to, fibre?]
const EDGES: [string, string, boolean][] = [
  ["core", "d1", true],
  ["core", "d2", true],
  ["d1", "d2", true],
  ["d1", "a1", true],
  ["d1", "a2", true],
  ["d1", "a3", false],
  ["d2", "a2", false],
  ["d2", "a3", true],
  ["d2", "a4", true],
  ["d2", "a1", false],
  ["a1", "p1", false],
  ["a1", "p2", false],
  ["a2", "p3", false],
  ["a3", "p4", false],
  ["a4", "p5", false],
  ["a4", "p6", false],
];
// primary edges carry traffic until a node fails; redundant ones wake up
const REDUNDANT = new Set(["d1-a3", "d2-a2", "d2-a1", "d1-d2"]);
const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const key = (e: [string, string, boolean]) => `${e[0]}-${e[1]}`;

export function NetworkDemo() {
  const svg = useRef<SVGSVGElement>(null);
  const [down, setDown] = useState<string | null>(null);
  const downRef = useRef<string | null>(null);
  const mouse = useRef({ x: -999, y: -999 });

  useEffect(() => {
    const root = svg.current!;
    const reduced = prefersReducedMotion();
    const packets = Array.from({ length: 34 }, (_, i) => ({ e: i % EDGES.length, t: Math.random(), v: 0.25 + Math.random() * 0.35, el: root.querySelector<SVGCircleElement>(`[data-pk="${i}"]`)! }));
    let raf = 0;
    let prev = performance.now();
    let visible = false;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(root);

    const active = (i: number) => {
      const e = EDGES[i];
      const d = downRef.current;
      if (d && (e[0] === d || e[1] === d)) return false;
      if (REDUNDANT.has(key(e))) return !!d;
      return true;
    };
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      packets.forEach((p) => {
        if (!active(p.e)) {
          // hop to a live edge
          p.e = (p.e + 3) % EDGES.length;
          p.t = 0;
          p.el.setAttribute("opacity", "0");
          return;
        }
        const [a, b, fibre] = EDGES[p.e];
        const A = byId[a];
        const B = byId[b];
        const x = A.x + (B.x - A.x) * p.t;
        const y = A.y + (B.y - A.y) * p.t;
        const near = Math.hypot(mouse.current.x - x, mouse.current.y - y) < 110;
        p.t += dt * p.v * (fibre ? 1.6 : 0.9) * (near ? 2.4 : 1);
        if (p.t > 1) {
          p.t = 0;
          p.e = (p.e + 1 + Math.floor(Math.random() * 4)) % EDGES.length;
        }
        p.el.setAttribute("cx", x.toFixed(1));
        p.el.setAttribute("cy", y.toFixed(1));
        p.el.setAttribute("opacity", "1");
        p.el.setAttribute("fill", fibre ? "#4936c9" : "#f2541b");
      });
    };
    if (!reduced) raf = requestAnimationFrame(tick);
    else {
      visible = true;
      tick(performance.now() + 16);
      cancelAnimationFrame(raf);
    }
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const toggle = (id: string) => {
    const next = downRef.current === id ? null : id;
    downRef.current = next;
    setDown(next);
  };

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouse.current = { x: ((e.clientX - r.left) / r.width) * 800, y: ((e.clientY - r.top) / r.height) * 480 };
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-line bg-[linear-gradient(160deg,#ffffff,#f3f1fb)] p-3 sm:p-5">
      <svg ref={svg} viewBox="0 0 800 480" className="w-full" onPointerMove={onMove} onPointerLeave={() => (mouse.current = { x: -999, y: -999 })} role="group" aria-label="Network topology — select a switch to simulate a failure">
        {/* AP coverage */}
        {NODES.filter((n) => n.kind === "ap").map((n, i) => (
          <g key={`cov${n.id}`} aria-hidden="true">
            <circle cx={n.x} cy={n.y} r="58" fill="rgba(73,54,201,.05)" />
            <circle cx={n.x} cy={n.y} r="20" fill="none" stroke="rgba(73,54,201,.35)" className="net-ring" style={{ animationDelay: `${i * 0.5}s` }} />
          </g>
        ))}
        {EDGES.map((e) => {
          const A = byId[e[0]];
          const B = byId[e[1]];
          const k = key(e);
          const dead = down && (e[0] === down || e[1] === down);
          const red = REDUNDANT.has(k);
          return (
            <line
              key={k}
              x1={A.x}
              y1={A.y}
              x2={B.x}
              y2={B.y}
              stroke={dead ? "rgba(198,61,12,.35)" : e[2] ? "rgba(73,54,201,.45)" : "rgba(18,19,42,.22)"}
              strokeWidth={e[2] ? 2 : 1.4}
              strokeDasharray={dead ? "3 6" : red && !down ? "4 6" : undefined}
              className="transition-[stroke] duration-500"
              aria-hidden="true"
            />
          );
        })}
        {Array.from({ length: 34 }, (_, i) => (
          <circle key={i} data-pk={i} r="3.6" opacity="0" aria-hidden="true" />
        ))}
        {NODES.map((n) => {
          const off = down === n.id;
          const clickable = n.kind === "dist" || n.kind === "access";
          const size = n.kind === "core" ? 30 : n.kind === "dist" ? 24 : n.kind === "access" ? 19 : 9;
          return (
            <g
              key={n.id}
              transform={`translate(${n.x} ${n.y})`}
              className={clickable ? "cursor-pointer" : ""}
              onClick={clickable ? () => toggle(n.id) : undefined}
              onKeyDown={clickable ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(n.id)) : undefined}
              tabIndex={clickable ? 0 : undefined}
              role={clickable ? "button" : undefined}
              aria-pressed={clickable ? off : undefined}
              aria-label={clickable ? `${n.label} switch${off ? " (failed — select to restore)" : ""}` : undefined}
              data-cursor-label={clickable ? (off ? "Restore" : "Fail link") : undefined}
            >
              {n.kind === "ap" ? (
                <circle r={size} fill="#fff" stroke="#4936c9" strokeWidth="2" />
              ) : (
                <rect x={-size} y={-size * 0.62} width={size * 2} height={size * 1.24} rx="8" fill={off ? "#fde8dd" : n.kind === "core" ? "#2a1b6e" : "#fff"} stroke={off ? "#c63d0c" : "#2a1b6e"} strokeWidth="1.6" className="transition-[fill] duration-500" />
              )}
              {n.kind !== "ap" && (
                <text y={n.kind === "core" ? 5 : -size * 0.62 - 9} textAnchor="middle" fontSize="13" fontWeight="500" fill={n.kind === "core" ? "#fff" : off ? "#c63d0c" : "#4a4e66"}>
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-2">
        <div className="flex gap-4 text-[13px] text-ink-2">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-2" /> Fibre
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" /> Copper
          </span>
        </div>
        <p aria-live="polite" className={`rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors duration-500 ${down ? "bg-accent-soft text-accent-deep" : "bg-brand-soft text-brand"}`}>
          {down ? `${byId[down].label} offline — traffic rerouted automatically` : "Click a switch to simulate a failure"}
        </p>
      </div>
    </div>
  );
}
