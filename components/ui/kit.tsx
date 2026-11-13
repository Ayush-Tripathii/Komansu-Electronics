"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, isFinePointer, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { MagneticButton } from "./MagneticButton";

/* ---------- Section heading ---------- */
export function SectionHead({
  eyebrow,
  title,
  lead,
  align = "left",
  className = "",
  id,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
}) {
  const c = align === "center";
  return (
    <div className={`${c ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && (
        <div data-rise className={c ? "flex justify-center" : ""}>
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2 id={id} data-split className={`t-h2 mt-6 ${c ? "mx-auto max-w-[18ch]" : "max-w-[16ch]"}`}>
        {title}
      </h2>
      {lead && (
        <p data-rise data-delay="0.15" className={`lead mt-7 ${c ? "mx-auto" : ""}`}>
          {lead}
        </p>
      )}
    </div>
  );
}

/* ---------- Page hero (inner pages) ---------- */
export function PageHero({
  eyebrow,
  title,
  sub,
  image,
  alt,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub: string;
  image?: string;
  alt?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-40 sm:pt-48">
      <div className="aurora">
        <i />
        <i />
        <i />
      </div>
      <div className="shell relative">
        <div data-rise="load" data-delay="0.1">
          <span className="eyebrow">{eyebrow}</span>
        </div>
        <h1 data-split="load" data-delay="0.15" className="t-display mt-8 max-w-[14ch]">
          {title}
        </h1>
        <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <p data-rise="load" data-delay="0.45" className="lead">
            {sub}
          </p>
          {children && (
            <div data-rise="load" data-delay="0.55">
              {children}
            </div>
          )}
        </div>
      </div>
      {image && (
        <div className="relative mt-16 sm:mt-24">
          <div data-grow className="relative h-[62vh] min-h-[380px] w-full overflow-hidden sm:h-[86vh]" data-cursor="none">
            <Image src={image} alt={alt ?? ""} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,19,42,.25)] to-transparent" />
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Image with clip reveal + hover zoom ---------- */
export function RevealImage({
  src,
  alt,
  className = "",
  radius = 28,
  sizes = "(min-width:1024px) 50vw, 100vw",
  priority,
  parallax,
}: {
  src: string;
  alt: string;
  className?: string;
  radius?: number;
  sizes?: string;
  priority?: boolean;
  parallax?: boolean;
}) {
  return (
    <div data-reveal className={`group relative overflow-hidden ${className}`} style={{ borderRadius: radius, ["--r" as string]: `${radius}px` }}>
      <div className={parallax ? "absolute inset-x-0 -bottom-[8%] -top-[8%]" : "absolute inset-0"} data-parallax={parallax ? "0.16" : undefined}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
      </div>
    </div>
  );
}

/* ---------- Velocity marquee ---------- */
export function VelocityMarquee({ items, className = "", serifEvery = 2 }: { items: readonly string[]; className?: string; serifEvery?: number }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    registerGsap();
    const el = track.current;
    if (!el || prefersReducedMotion()) return;
    let x = 0;
    let dir = -1;
    let boost = 0;
    const lenis = () => (window as unknown as { __lenis?: { velocity: number } }).__lenis;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const tick = (_: number, dt: number) => {
      if (!visible) return;
      const v = lenis()?.velocity ?? 0;
      if (Math.abs(v) > 0.5) dir = v > 0 ? -1 : 1;
      boost += (Math.min(Math.abs(v) * 0.9, 18) - boost) * 0.08;
      x += dir * (0.035 + boost * 0.02) * dt * 0.06;
      const half = el.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
    };
  }, []);
  const row = (hidden: boolean) =>
    items.map((t, i) => (
      <span key={`${hidden}-${i}`} aria-hidden={hidden || undefined} className="flex items-center">
        <span className={i % serifEvery === 1 ? "serif text-brand" : ""}>{t}</span>
        <Star />
      </span>
    ));
  return (
    <div className={`overflow-hidden ${className}`}>
      <div ref={track} className="marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`mx-[0.45em] h-[0.42em] w-[0.42em] shrink-0 text-accent ${className}`}>
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" fill="currentColor" />
    </svg>
  );
}

/* ---------- Check icon that draws itself ---------- */
export function Check({ className = "" }: { className?: string }) {
  return (
    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand ${className}`} aria-hidden="true">
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ---------- Spotlight card hover ---------- */
export function useSpotlight() {
  return (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
}

/* ---------- 3D tilt on hover ---------- */
export function Tilt({ children, className = "", max = 6 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.PointerEvent) => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(ref.current, { rotateY: px * max, rotateX: -py * max, duration: 0.8, ease: "power3.out", transformPerspective: 1000 });
  };
  const onLeave = () => gsap.to(ref.current, { rotateY: 0, rotateX: 0, duration: 1.2, ease: "elastic.out(1,0.5)" });
  return (
    <div ref={ref} className={className} onPointerMove={onMove} onPointerLeave={onLeave} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

/* ---------- Closing CTA with cursor-following orb ---------- */
export function ClosingCta({ title, body, cta, href = "/contact" }: { title: React.ReactNode; body: string; cta: string; href?: string }) {
  const zone = useRef<HTMLElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const z = zone.current!;
    const o = orb.current!;
    const qx = gsap.quickTo(o, "x", { duration: 1.1, ease: "power3.out" });
    const qy = gsap.quickTo(o, "y", { duration: 1.1, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = z.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.72;
      qx((e.clientX - cx) * 0.25);
      qy((e.clientY - cy) * 0.25);
    };
    const leave = () => {
      qx(0);
      qy(0);
    };
    z.addEventListener("pointermove", move);
    z.addEventListener("pointerleave", leave);
    return () => {
      z.removeEventListener("pointermove", move);
      z.removeEventListener("pointerleave", leave);
    };
  }, []);
  return (
    <section ref={zone} className="relative overflow-hidden section-y">
      <div className="aurora">
        <i />
        <i />
        <i />
      </div>
      <div className="shell relative text-center">
        <h2 data-split className="t-h1 mx-auto max-w-[15ch]">
          {title}
        </h2>
        <p data-rise data-delay="0.2" className="lead mx-auto mt-8">
          {body}
        </p>
        <div className="mt-14 flex justify-center">
          <div data-rise data-delay="0.3">
           <div ref={orb}>
            <TransitionLink
              href={href}
              data-cursor="none"
              className="group relative flex h-48 w-48 items-center justify-center rounded-full bg-brand text-center text-white shadow-[0_40px_80px_-30px_rgba(42,27,110,.6)] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:scale-110 sm:h-56 sm:w-56"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-accent transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-100" aria-hidden="true" />
              <span className="relative max-w-[9ch] text-[17px] font-medium leading-tight tracking-[-0.01em] text-white group-hover:text-ink">
                {cta}
              </span>
            </TransitionLink>
           </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { MagneticButton };
