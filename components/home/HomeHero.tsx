"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap, isFinePointer, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { assetPath } from "@/lib/site";

export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // media frame grows to full-bleed and the photo drifts as you scroll
      gsap.fromTo(
        media.current,
        { clipPath: "inset(0% 4% 0% 4% round 36px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)",
          ease: "none",
          scrollTrigger: { trigger: media.current, start: "top 75%", end: "top top", scrub: 0.8 },
        }
      );
      gsap.fromTo(img.current, { yPercent: -6, scale: 1.15 }, { yPercent: 6, scale: 1.02, ease: "none", scrollTrigger: { trigger: media.current, start: "top bottom", end: "bottom top", scrub: true } });

      // floating cards bob gently, each on its own rhythm
      gsap.utils.toArray<HTMLElement>("[data-float]").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 14 : -14, duration: 3.6 + i * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
        const d = parseFloat(el.dataset.depth || "0.2");
        gsap.fromTo(el, { yPercent: 0 }, { yPercent: -60 * d, ease: "none", scrollTrigger: { trigger: media.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }, root);

    // cursor-depth parallax on the media cards
    let off = () => {};
    if (isFinePointer()) {
      const layers = gsap.utils.toArray<HTMLElement>("[data-mouse]");
      const setters = layers.map((el) => ({ x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3.out" }), d: parseFloat(el.dataset.mouse || "20") }));
      const move = (e: PointerEvent) => {
        const px = e.clientX / window.innerWidth - 0.5;
        const py = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s) => {
          s.x(px * s.d);
          s.y(py * s.d);
        });
      };
      window.addEventListener("pointermove", move, { passive: true });
      off = () => window.removeEventListener("pointermove", move);
    }
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden pt-36 sm:pt-44" aria-labelledby="hero-title">
      <div className="aurora">
        <i />
        <i />
        <i />
      </div>

      <div className="shell relative">
        <div data-rise="load" data-delay="0.05">
          <span className="eyebrow">Trusted ELV Specialists</span>
        </div>
        <h1 id="hero-title" data-split="load" data-delay="0.1" className="t-display mt-8 max-w-[13ch]">
          Intelligent ELV Systems Designed for the <span className="serif text-gradient pr-[0.06em]">Future</span>
        </h1>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
          <p data-rise="load" data-delay="0.5" className="lead lg:col-span-6">
            Komansu Electronics delivers end-to-end Extra Low Voltage solutions — from CCTV and fire alarm to access control and intelligent networks — for industrial and hospitality projects.
          </p>
          <div data-rise="load" data-delay="0.6" className="flex flex-wrap gap-3 lg:col-span-6 lg:justify-end">
            <MagneticButton href="/services" variant="primary">
              Explore Services
            </MagneticButton>
            <MagneticButton href="/contact" variant="light">
              Request Consultation
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* cinematic media */}
      <div className="relative mt-16 sm:mt-24">
        <div ref={media} data-rise="load" data-delay="0.7" className="relative h-[72vh] min-h-[440px] overflow-hidden sm:h-[92vh]" style={{ clipPath: "inset(0% 4% 0% 4% round 36px)" }}>
          <div ref={img} className="absolute inset-0">
            <Image src={assetPath("/images/towers.jpg")} alt="Glass towers rising into a pale sky" fill priority sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,243,238,.0)_40%,rgba(18,19,42,.35)_100%)]" />
          {/* soft scanning light */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen" aria-hidden="true">
            <div className="hero-scan absolute inset-y-0 w-[30%] bg-[linear-gradient(100deg,transparent,rgba(170,190,255,.35),transparent)]" />
          </div>

          {/* floating glass stat cards */}
          <div className="absolute inset-0 hidden md:block" aria-hidden="true">
            <div data-depth="0.5" className="absolute left-[8%] top-[14%]">
              <div data-mouse="-26">
                <div data-float className="rounded-[22px] border border-white/60 bg-white/70 p-5 pr-8 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                  <p className="font-display text-5xl font-medium tracking-[-0.05em] text-brand">5+</p>
                  <p className="mt-1 text-[14px] text-ink-2">ELV Disciplines</p>
                </div>
              </div>
            </div>
            <div data-depth="0.9" className="absolute right-[9%] top-[30%]">
              <div data-mouse="34">
                <div data-float className="rounded-[22px] border border-white/60 bg-white/70 p-5 pr-8 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                  <p className="font-display text-5xl font-medium tracking-[-0.05em] text-brand">100%</p>
                  <p className="mt-1 text-[14px] text-ink-2">Design-to-Deploy</p>
                </div>
              </div>
            </div>
            <div data-depth="0.3" className="absolute bottom-[12%] left-[30%]">
              <div data-mouse="-14">
                <div data-float className="flex items-center gap-4 rounded-full border border-white/60 bg-white/75 py-3 pl-3 pr-6 shadow-[var(--shadow-soft)] backdrop-blur-xl">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white">
                    <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7.5 5.5 10.5 11.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span>
                    <span className="block font-display text-lg font-medium tracking-[-0.02em] text-ink">NFPA &amp; IEC</span>
                    <span className="block text-[13px] text-ink-2">Standards Compliant</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* stat strip (accessible + mobile) */}
      <div className="shell relative">
        <dl className="grid grid-cols-1 divide-y divide-line border-b border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["5+", "ELV Disciplines"],
            ["100%", "Design-to-Deploy"],
            ["NFPA & IEC", "Standards Compliant"],
          ].map(([v, l]) => (
            <div key={l} className="flex flex-row-reverse items-baseline justify-between gap-4 py-8 sm:flex-col-reverse sm:items-start sm:justify-start sm:gap-3 sm:px-8 sm:first:pl-0">
              <dt className="text-[15px] text-ink-2">{l}</dt>
              <dd className="font-display text-[clamp(2.2rem,3.6vw,3.4rem)] font-medium leading-none tracking-[-0.045em] text-ink">
                {/\d/.test(v) ? <span data-count={v}>{v}</span> : v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
