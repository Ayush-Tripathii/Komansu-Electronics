"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from "@/lib/gsap";

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

/**
 * Lenis smooth scroll synced to the GSAP ticker, plus the site-wide
 * scroll-velocity skew (max 2px-equivalent, settles on stop).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const skewRef = useRef(0);

  useEffect(() => {
    registerGsap();
    const reduced = prefersReducedMotion();
    document.documentElement.classList.toggle("reduced", reduced);
    if (reduced) return;

    const l = new Lenis({ lerp: 0.08, autoRaf: false, anchors: false });
    setLenis(l);
    (window as unknown as { __lenis?: Lenis }).__lenis = l;

    const root = document.documentElement;
    const setSkew = gsap.quickTo(skewRef, "current", {
      duration: 0.6,
      ease: "power3.out",
      onUpdate: () => root.style.setProperty("--skew", `${skewRef.current.toFixed(3)}deg`),
    });

    l.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      // ~0.18deg on a 600px block ≈ 2px. Clamp hard.
      const v = gsap.utils.clamp(-0.18, 0.18, e.velocity * -0.006);
      setSkew(v);
    });

    const raf = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      l.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
}
