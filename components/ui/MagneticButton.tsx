"use client";

import { useRef } from "react";
import { gsap, isFinePointer, prefersReducedMotion } from "@/lib/gsap";
import { TransitionLink } from "@/components/transition/TransitionLink";

type Variant = "primary" | "light" | "ghost" | "accent";

const VARIANTS: Record<Variant, { base: string; fill: string; text: string; chip: string }> = {
  primary: { base: "bg-brand text-white border-brand", fill: "bg-brand-2", text: "", chip: "bg-accent text-white" },
  accent: { base: "bg-accent text-ink border-accent", fill: "bg-ink", text: "group-hover:text-white", chip: "bg-ink text-white" },
  light: { base: "bg-surface text-ink border-line", fill: "bg-brand-soft", text: "", chip: "bg-brand text-white" },
  ghost: { base: "bg-transparent text-ink border-line-strong", fill: "bg-brand", text: "group-hover:text-white", chip: "bg-brand text-white group-hover:bg-white group-hover:text-brand" },
};

/**
 * Magnetic pill button: drifts toward the cursor, fills from the exact
 * entry point, rolls its label and spins its arrow chip.
 */
export function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
  size = "md",
  type,
  onClick,
  arrow = true,
  disabled,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
  onClick?: () => void;
  arrow?: boolean;
  disabled?: boolean;
}) {
  const wrap = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const v = VARIANTS[variant];

  const place = (e: React.PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const d = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2.1;
    gsap.set(fill.current, { left: x, top: y, width: d, height: d, xPercent: -50, yPercent: -50 });
  };
  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    place(e);
    gsap.fromTo(fill.current, { scale: 0 }, { scale: 1, duration: 0.7, ease: "expo.out", overwrite: true });
  };
  const onMove = (e: React.PointerEvent) => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const r = wrap.current!.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    gsap.to(wrap.current, { x: dx * 10, y: dy * 8, duration: 0.6, ease: "power3.out", overwrite: "auto" });
  };
  const onLeave = (e: React.PointerEvent) => {
    if (prefersReducedMotion()) return;
    place(e);
    gsap.to(fill.current, { scale: 0, duration: 0.6, ease: "expo.out", overwrite: true });
    gsap.to(wrap.current, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: "auto" });
  };

  const sizes = {
    sm: { btn: "h-11 pl-5 pr-1.5 text-[14.5px] gap-3", chip: "h-8 w-8" },
    md: { btn: "h-14 pl-7 pr-2 text-[15.5px] gap-4", chip: "h-10 w-10" },
    lg: { btn: "h-[72px] pl-9 pr-2.5 text-[17px] gap-5", chip: "h-[52px] w-[52px]" },
  }[size];
  const noArrowPad = arrow ? "" : size === "lg" ? "!pr-9" : size === "md" ? "!pr-7" : "!pr-5";

  const label = typeof children === "string" ? children : null;
  const inner = (
    <>
      <span ref={fill} aria-hidden="true" className={`pointer-events-none absolute rounded-full ${v.fill}`} style={{ transform: "scale(0)" }} />
      <span className={`relative z-10 font-medium tracking-[-0.01em] transition-colors duration-500 ${v.text}`}>
        {label ? (
          <span className="roll">
            <span>{label}</span>
            <span aria-hidden="true">{label}</span>
          </span>
        ) : (
          children
        )}
      </span>
      {arrow && (
        <span
          aria-hidden="true"
          className={`relative z-10 flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-[transform,background-color,color] duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-[-45deg] ${v.chip} ${sizes.chip}`}
        >
          <Arrow />
        </span>
      )}
    </>
  );

  const cls = `group relative inline-flex select-none items-center justify-between overflow-hidden rounded-full border ${sizes.btn} ${noArrowPad} ${v.base} disabled:opacity-60`;

  return (
    <span ref={wrap} className={`inline-flex will-change-transform ${className}`} onPointerEnter={onEnter} onPointerMove={onMove} onPointerLeave={onLeave}>
      {href ? (
        <TransitionLink href={href} className={cls} data-cursor="none">
          {inner}
        </TransitionLink>
      ) : (
        <button type={type ?? "button"} onClick={onClick} className={cls} data-cursor="none" disabled={disabled}>
          {inner}
        </button>
      )}
    </span>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden="true" className={className}>
      <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
