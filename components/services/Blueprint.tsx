"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

/** Revision cloud: a scalloped loop around a rectangle */
function cloud(x: number, y: number, w: number, h: number, s = 16) {
  let d = `M${x} ${y}`;
  const arc = (x2: number, y2: number) => (d += ` A${s / 1.6} ${s / 1.6} 0 0 1 ${x2} ${y2}`);
  for (let i = s; i <= w; i += s) arc(x + i, y);
  for (let i = s; i <= h; i += s) arc(x + w, y + i);
  for (let i = s; i <= w; i += s) arc(x + w - i, y + h);
  for (let i = s; i <= h; i += s) arc(x, y + h - i);
  return d;
}

/**
 * An AutoCAD-style ELV layout that draws itself as you scroll: walls, doors,
 * cable routes, devices, dimensions, a revision cloud and the title block.
 */
export function Blueprint({ tall = false }: { tall?: boolean }) {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    registerGsap();
    const el = root.current!;
    const lines = el.querySelectorAll<SVGGeometryElement>("[data-draw]");
    const fades = el.querySelectorAll("[data-fade]");
    if (prefersReducedMotion()) return;
    gsap.set(lines, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(fades, { opacity: 0 });
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 80%", end: tall ? "bottom 40%" : "bottom 60%", scrub: 0.8 } });
    tl.to(el.querySelectorAll("[data-draw='wall']"), { strokeDashoffset: 0, duration: 1, stagger: 0.05 })
      .to(el.querySelectorAll("[data-draw='door']"), { strokeDashoffset: 0, duration: 0.4, stagger: 0.05 }, "-=0.3")
      .to(el.querySelectorAll("[data-draw='cable']"), { strokeDashoffset: 0, duration: 0.8, stagger: 0.08 })
      .to(el.querySelectorAll("[data-fade='dev']"), { opacity: 1, duration: 0.3, stagger: 0.04 }, "-=0.5")
      .to(el.querySelectorAll("[data-draw='dim']"), { strokeDashoffset: 0, duration: 0.4, stagger: 0.05 })
      .to(el.querySelectorAll("[data-fade='txt']"), { opacity: 1, duration: 0.3, stagger: 0.04 }, "-=0.2")
      .to(el.querySelectorAll("[data-draw='cloud']"), { strokeDashoffset: 0, duration: 0.6 })
      .to(el.querySelectorAll("[data-fade='tb']"), { opacity: 1, duration: 0.3, stagger: 0.06 });
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [tall]);

  const P = { pathLength: 1 } as const;
  const ink = "#2a1b6e";
  return (
    <svg ref={root} viewBox="0 0 900 600" className="h-auto w-full" role="img" aria-label="An ELV layout drawing with walls, cable routes, devices, dimensions, a revision cloud and a title block">
      <rect width="900" height="600" rx="24" fill="#fbfaf7" />
      <g fill="none" stroke={ink} strokeLinecap="round" strokeLinejoin="round">
        {/* walls */}
        <path data-draw="wall" {...P} strokeWidth="4" d="M60 60H660V420H60Z" />
        <path data-draw="wall" {...P} strokeWidth="2.5" d="M300 60V250M300 300V420M460 60V180M460 230V420M60 250H250M460 250H660" />
        {/* doors */}
        <path data-draw="door" {...P} strokeWidth="1.5" d="M250 250A50 50 0 0 1 300 300M460 180A50 50 0 0 1 510 230" />
        {/* cable routes */}
        <path data-draw="cable" {...P} stroke="#f2541b" strokeWidth="2" strokeDasharray="1" d="M620 390H520V110H140V200" />
        <path data-draw="cable" {...P} stroke="#4936c9" strokeWidth="2" d="M620 380H380V340H140" />
        <path data-draw="cable" {...P} stroke="#4936c9" strokeWidth="2" d="M380 340V110" />
      </g>
      {/* devices */}
      <g stroke={ink} strokeWidth="1.6" fill="#fff">
        {[
          [140, 110],
          [380, 110],
          [520, 160],
          [140, 340],
          [380, 230],
          [580, 320],
        ].map(([x, y], i) => (
          <g key={i} data-fade="dev">
            <circle cx={x} cy={y} r="11" />
            <path d={`M${x - 5} ${y}h10M${x} ${y - 5}v10`} />
          </g>
        ))}
        <g data-fade="dev">
          <rect x="600" y="360" width="44" height="44" rx="6" fill="#2a1b6e" />
        </g>
      </g>
      {/* dimensions */}
      <g stroke="#62677d" strokeWidth="1" fill="none">
        <path data-draw="dim" {...P} d="M60 470H660M60 462V478M660 462V478" />
        <path data-draw="dim" {...P} d="M700 60V420M692 60H708M692 420H708" />
        <path data-draw="dim" {...P} d="M520 160L590 120H640" />
      </g>
      <g fontSize="13" fill="#4a4e66" fontWeight="500">
        <text data-fade="txt" x="330" y="494">
          24 000
        </text>
        <text data-fade="txt" x="712" y="246">
          14 400
        </text>
        <text data-fade="txt" x="598" y="112">
          Smoke detector, typ.
        </text>
        <text data-fade="txt" x="110" y="90">
          Office
        </text>
        <text data-fade="txt" x="330" y="90">
          Lobby
        </text>
        <text data-fade="txt" x="490" y="90">
          Plant room
        </text>
        <text data-fade="txt" x="90" y="290">
          Store
        </text>
      </g>
      {/* revision cloud */}
      <path data-draw="cloud" {...P} d={cloud(345, 190, 96, 82)} fill="none" stroke="#f2541b" strokeWidth="1.8" />
      <g data-fade="txt">
        <path d="M447 196l14-10 14 10z" fill="none" stroke="#f2541b" strokeWidth="1.6" />
        <text x="456" y="203" fontSize="10" fill="#c63d0c" fontWeight="600">
          C
        </text>
      </g>
      {/* title block */}
      <g>
        <rect data-fade="tb" x="60" y="512" width="780" height="60" rx="8" fill="#fff" stroke="rgba(42,27,110,.25)" />
        <text data-fade="tb" x="80" y="547" fontSize="15" fontWeight="600" fill={ink}>
          Komansu Electronics Pvt. Ltd.
        </text>
        <text data-fade="tb" x="340" y="547" fontSize="13" fill="#4a4e66">
          ELV layout — ground floor
        </text>
        <text data-fade="tb" x="560" y="547" fontSize="13" fill="#4a4e66">
          Revision C
        </text>
        <text data-fade="tb" x="690" y="547" fontSize="13" fill="#4a4e66">
          Scale 1:100
        </text>
      </g>
      {/* legend */}
      <g fontSize="12.5" fill="#4a4e66">
        <g data-fade="txt">
          <line x1="740" y1="300" x2="770" y2="300" stroke="#f2541b" strokeWidth="2" />
          <text x="778" y="304">
            Fire loop
          </text>
        </g>
        <g data-fade="txt">
          <line x1="740" y1="326" x2="770" y2="326" stroke="#4936c9" strokeWidth="2" />
          <text x="778" y="330">
            Data
          </text>
        </g>
      </g>
    </svg>
  );
}
