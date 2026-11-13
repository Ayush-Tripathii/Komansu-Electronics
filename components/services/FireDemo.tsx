"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";

const W = 800;
const H = 520;

type Pt = [number, number];
const ZONES: { name: string; rect: [number, number, number, number]; det: Pt[]; spk: Pt[] }[] = [
  { name: "Zone 1", rect: [20, 20, 280, 230], det: [[90, 90], [220, 90], [150, 185]], spk: [[60, 215], [265, 55]] },
  { name: "Zone 2", rect: [300, 20, 260, 230], det: [[360, 85], [490, 165]], spk: [[335, 215], [530, 55]] },
  { name: "Zone 3", rect: [20, 250, 400, 250], det: [[100, 330], [250, 430], [345, 320]], spk: [[55, 465], [390, 465]] },
  { name: "Zone 4", rect: [420, 250, 360, 250], det: [[500, 330], [640, 430], [720, 320]], spk: [[455, 465], [745, 465]] },
];
const PORT_X = 600;

function loopPath(z: number) {
  const y0 = 92 + z * 22;
  let d = `M${PORT_X} ${y0}`;
  let [x, y] = [PORT_X, y0];
  for (const [dx, dy] of ZONES[z].det) {
    d += ` H${dx} V${dy}`;
    [x, y] = [dx, dy];
  }
  void x;
  void y;
  return d;
}

/**
 * The cursor is a heat source. Hold it near a detector: the detector trips, the
 * alarm travels the loop wiring to the panel, the panel announces the zone and
 * that zone's speakers start the evacuation message. Resets after 4s of no heat.
 */
export function FireDemo() {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [zone, setZone] = useState<number | null>(null);
  const [lcd, setLcd] = useState("System normal");
  const zoneRef = useRef<number | null>(null);

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduced = prefersReducedMotion();
    const fine = isFinePointer();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let scale = 1;
    let ox = 0;
    let oy = 0;
    const resize = () => {
      const r = el.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(w / W, h / H);
      ox = (w - W * scale) / 2;
      oy = (h - H * scale) / 2;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = { x: w * 0.3, y: h * 0.7 };
    const pos = { ...target };
    let heat = 0;
    let heatTarget = 0;
    let lastHeatOnDetector = 0;
    const dwell = new Map<string, number>();
    const smoke: { x: number; y: number; vx: number; vy: number; r: number; life: number }[] = [];
    const maxSmoke = w < 700 ? 40 : 80;
    let visible = false;
    let raf = 0;
    let prev = performance.now();
    let typing = 0;
    const timers: gsap.core.Animation[] = [];

    const typeText = (txt: string) => {
      clearInterval(typing);
      let i = 0;
      setLcd("");
      typing = window.setInterval(() => {
        i++;
        setLcd(txt.slice(0, i));
        if (i >= txt.length) clearInterval(typing);
      }, 38);
    };

    const trip = (z: number, d: number) => {
      if (zoneRef.current !== null) return;
      zoneRef.current = z;
      setZone(z);
      const root = svg.current!;
      const det = root.querySelector(`[data-det="${z}-${d}"]`);
      const wire = root.querySelector<SVGPathElement>(`[data-pulse="${z}"]`)!;
      const L = wire.getTotalLength();
      const tl = gsap.timeline();
      tl.to(det, { attr: { r: 13 }, duration: 0.25, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0)
        .set(wire, { opacity: 1, attr: { "stroke-dasharray": `90 ${L + 90}` } }, 0.2)
        .fromTo(wire, { attr: { "stroke-dashoffset": -L } }, { attr: { "stroke-dashoffset": 90 }, duration: 1, ease: "power2.in", repeat: 1 }, 0.2)
        .add(() => typeText(`Fire alarm — ${ZONES[z].name}`), 1.2)
        .to(root.querySelector("[data-led]"), { attr: { fill: "#f2541b" }, duration: 0.2 }, 1.2)
        .to(root.querySelector("[data-led]"), { opacity: 0.25, duration: 0.35, yoyo: true, repeat: -1, ease: "sine.inOut" }, 1.4);
      root.querySelectorAll(`[data-ring="${z}"]`).forEach((ring, i) => {
        tl.fromTo(
          ring,
          { attr: { r: 6 }, opacity: 0.9, stroke: "#f2541b" },
          { attr: { r: 56 }, opacity: 0, stroke: "#12132a", duration: 1.6, ease: "power1.out", repeat: -1, delay: (i % 3) * 0.45 },
          1.7 + Math.floor(i / 3) * 0.2
        );
      });
      tl.fromTo(root.querySelectorAll(`[data-spk="${z}"]`), { attr: { fill: "#ffffff" } }, { attr: { fill: "#f2541b" }, duration: 0.3, stagger: 0.2 }, 1.7);
      timers.push(tl);
    };

    const reset = () => {
      if (zoneRef.current === null) return;
      const root = svg.current!;
      timers.splice(0).forEach((t) => t.kill());
      gsap.set(root.querySelectorAll("[data-ring]"), { opacity: 0 });
      gsap.set(root.querySelectorAll("[data-pulse]"), { opacity: 0 });
      gsap.set(root.querySelectorAll("[data-spk]"), { attr: { fill: "#ffffff" } });
      gsap.set(root.querySelectorAll("[data-det]"), { attr: { r: 8 } });
      gsap.set(root.querySelector("[data-led]"), { opacity: 1, attr: { fill: "#0e9f6e" } });
      zoneRef.current = null;
      setZone(null);
      typeText("System normal");
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      pos.x += (target.x - pos.x) * (1 - Math.pow(0.001, dt));
      pos.y += (target.y - pos.y) * (1 - Math.pow(0.001, dt));
      heat += (heatTarget - heat) * (1 - Math.pow(0.02, dt));
      const R = (70 + Math.sin(now / 700) * 6) * Math.max(0.6, scale) * heat;

      ctx.clearRect(0, 0, w, h);
      if (heat > 0.02) {
        // organic bloom: three offset gradients
        for (let k = 0; k < 3; k++) {
          const a = now / 1600 + k * 2.1;
          const cx = pos.x + Math.cos(a) * R * 0.12;
          const cy = pos.y + Math.sin(a * 1.3) * R * 0.12;
          const rr = R * (1 - k * 0.12);
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr);
          g.addColorStop(0, `rgba(242,84,27,${0.5 * heat})`);
          g.addColorStop(0.35, `rgba(255,150,60,${0.32 * heat})`);
          g.addColorStop(0.7, `rgba(255,215,160,${0.2 * heat})`);
          g.addColorStop(1, "rgba(255,240,220,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.fill();
        }
        // faint char ring
        ctx.strokeStyle = `rgba(90,45,20,${0.07 * heat})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, R * 1.02, 0, Math.PI * 2);
        ctx.stroke();
        // emit smoke
        if (smoke.length < maxSmoke && Math.random() < heat * 0.9) {
          smoke.push({ x: pos.x + (Math.random() - 0.5) * R * 0.5, y: pos.y - R * 0.2, vx: 0, vy: -(30 + Math.random() * 40), r: 8, life: 0 });
        }
      }
      for (let i = smoke.length - 1; i >= 0; i--) {
        const p = smoke[i];
        p.life += dt;
        if (p.life > 2.5) {
          smoke.splice(i, 1);
          continue;
        }
        p.vx += Math.sin((p.y + now * 0.05) / 40) * 12 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.r += 14 * dt;
        ctx.fillStyle = `rgba(80,82,96,${0.07 * (1 - p.life / 2.5)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // detection
      let onDet = false;
      ZONES.forEach((z, zi) =>
        z.det.forEach(([dx, dy], di) => {
          const key = `${zi}-${di}`;
          const sx = ox + dx * scale;
          const sy = oy + dy * scale;
          if (heat > 0.5 && Math.hypot(sx - pos.x, sy - pos.y) < R * 0.75) {
            onDet = true;
            const t = (dwell.get(key) ?? 0) + dt;
            dwell.set(key, t);
            if (t > 0.35) trip(zi, di);
          } else dwell.set(key, 0);
        })
      );
      if (onDet) lastHeatOnDetector = now;
      else if (zoneRef.current !== null && now - lastHeatOnDetector > 4000) reset();
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      prev = performance.now();
    });
    io.observe(el);

    let auto: gsap.core.Timeline | null = null;
    const offs: (() => void)[] = [];
    if (reduced) {
      // static, composed frame
      visible = true;
      heat = heatTarget = 1;
      target.x = pos.x = ox + 250 * scale;
      target.y = pos.y = oy + 400 * scale;
      frame(performance.now());
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(frame);
      if (fine) {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          target.x = e.clientX - r.left;
          target.y = e.clientY - r.top;
          heatTarget = 1;
        };
        const leave = () => (heatTarget = 0);
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        offs.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      } else {
        // touch: heat source drifts across the plan through zone 3
        heatTarget = 1;
        const p = { t: 0 };
        auto = gsap.timeline({ repeat: -1 });
        auto.to(p, {
          t: 1,
          duration: 9,
          ease: "none",
          onUpdate: () => {
            const a = p.t * Math.PI * 2;
            target.x = ox + (220 + Math.cos(a) * 160) * scale;
            target.y = oy + (360 + Math.sin(a * 2) * 70) * scale;
          },
        });
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(typing);
      io.disconnect();
      ro.disconnect();
      auto?.kill();
      offs.forEach((f) => f());
      timers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={wrap} data-cursor-label="Heat" className="relative aspect-[800/520] w-full overflow-hidden rounded-[28px] border border-line bg-[#fbfaf7]">
      <svg ref={svg} viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id="fd-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="rgba(18,19,42,.045)" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#fd-grid)" />
        {/* zones */}
        {ZONES.map((z, i) => (
          <g key={z.name}>
            <rect
              x={z.rect[0]}
              y={z.rect[1]}
              width={z.rect[2]}
              height={z.rect[3]}
              fill={zone === i ? "rgba(242,84,27,.07)" : "transparent"}
              stroke="rgba(18,19,42,.22)"
              strokeWidth="1.5"
              className="transition-[fill] duration-700"
            />
            <text x={z.rect[0] + 14} y={z.rect[1] + 24} fontSize="13" fontWeight="500" fill={zone === i ? "#c63d0c" : "rgba(18,19,42,.5)"}>
              {z.name}
            </text>
          </g>
        ))}
        {/* control room */}
        <rect x="560" y="20" width="220" height="230" fill="rgba(73,54,201,.035)" stroke="rgba(18,19,42,.22)" strokeWidth="1.5" />
        <text x="574" y="44" fontSize="13" fontWeight="500" fill="rgba(18,19,42,.5)">
          Control room
        </text>
        {/* loop wiring */}
        {ZONES.map((_, i) => (
          <g key={i}>
            <path d={loopPath(i)} fill="none" stroke="rgba(73,54,201,.28)" strokeWidth="1.5" strokeDasharray="4 5" />
            <path data-pulse={i} d={loopPath(i)} fill="none" stroke="#f2541b" strokeWidth="4" strokeLinecap="round" opacity="0" />
          </g>
        ))}
        {/* panel */}
        <g>
          <rect x="600" y="70" width="150" height="150" rx="14" fill="#fff" stroke="rgba(18,19,42,.25)" strokeWidth="1.5" />
          <rect x="614" y="86" width="122" height="54" rx="6" fill={zone !== null ? "#fde8dd" : "#eef7f2"} className="transition-[fill] duration-500" />
          <foreignObject x="618" y="90" width="114" height="46">
            <p className="text-[11.5px] font-semibold leading-tight" style={{ color: zone !== null ? "#c63d0c" : "#0b7a55" }}>
              {lcd}
              <span className="ml-0.5 inline-block h-[10px] w-[5px] animate-pulse bg-current align-middle" />
            </p>
          </foreignObject>
          <circle data-led cx="628" cy="162" r="6" fill="#0e9f6e" />
          <text x="642" y="166" fontSize="11.5" fill="rgba(18,19,42,.6)">
            Fire panel
          </text>
          {[0, 1, 2].map((k) => (
            <rect key={k} x={614 + k * 42} y="184" width="34" height="20" rx="5" fill="rgba(18,19,42,.06)" />
          ))}
        </g>
        {/* devices */}
        {ZONES.map((z, zi) => (
          <g key={`d${zi}`}>
            {z.det.map(([x, y], di) => (
              <g key={di}>
                <circle cx={x} cy={y} r="16" fill="none" stroke="rgba(18,19,42,.12)" />
                <circle data-det={`${zi}-${di}`} cx={x} cy={y} r="8" fill={zone === zi ? "#f2541b" : "#fff"} stroke="#12132a" strokeWidth="1.5" className="transition-[fill] duration-300" />
              </g>
            ))}
            {z.spk.map(([x, y], si) => (
              <g key={`s${si}`}>
                {[0, 1, 2].map((k) => (
                  <circle key={k} data-ring={zi} cx={x} cy={y} r="6" fill="none" strokeWidth="1.5" opacity="0" />
                ))}
                <path data-spk={zi} d={`M${x - 7} ${y - 4}h4l6-5v18l-6-5h-4z`} fill="#fff" stroke="#12132a" strokeWidth="1.4" strokeLinejoin="round" />
              </g>
            ))}
          </g>
        ))}
      </svg>
      <canvas ref={canvas} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />

      {/* legend + status */}
      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-[12.5px] text-ink-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-ink" /> Smoke detector
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5">
            <span className="h-[2px] w-4 border-t-2 border-dashed border-brand-2/60" /> Loop wiring
          </span>
        </div>
        <div aria-live="polite" className={`rounded-2xl px-4 py-3 text-[14px] font-medium shadow-[var(--shadow-soft)] transition-all duration-500 ${zone !== null ? "translate-y-0 bg-accent text-ink opacity-100" : "translate-y-3 bg-white text-ink opacity-0"}`}>
          {zone !== null ? `${ZONES[zone].name} · Evacuation tone and voice message playing` : "All zones normal"}
        </div>
      </div>
    </div>
  );
}
