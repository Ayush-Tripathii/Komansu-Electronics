"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { SERVICES, VALUES, WHY } from "@/lib/content";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { Check, MagneticButton, RevealImage, useSpotlight } from "@/components/ui/kit";
import { assetPath } from "@/lib/site";

/* ---------------- Values (three-up) ---------------- */
const VALUE_ICONS = [
  // end-to-end: a route between two nodes
  <path key="a" d="M6 34c0-8 6-10 14-10s14-2 14-10M6 34a3 3 0 1 0 0 .1M34 14a3 3 0 1 0 0 .1" />,
  // standards: stacked ruled sheets
  <path key="b" d="M10 8h16l6 6v20H10zM26 8v6h6M15 20h12M15 25h12M15 30h8" />,
  // multi-discipline: overlapping rings
  <path key="c" d="M15 17a8 8 0 1 0 .1 0M25 17a8 8 0 1 0 .1 0M20 27a8 8 0 1 0 .1 0" />,
];

export function Values() {
  const spot = useSpotlight();
  return (
    <div data-stagger className="grid gap-5 md:grid-cols-3">
      {VALUES.map((v, i) => (
        <article
          key={v.title}
          data-rise
          onPointerMove={spot}
          className="spot card group relative overflow-hidden p-9 transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-2 hover:shadow-[var(--shadow-lift)] sm:p-10"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-soft text-brand transition-colors duration-500 group-hover:bg-brand group-hover:text-white">
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="value-ico">
              {VALUE_ICONS[i]}
            </svg>
          </span>
          <h3 className="t-h3 mt-14">{v.title}</h3>
          <p className="mt-3 text-[16px] leading-relaxed text-ink-2">{v.body}</p>
          <span aria-hidden="true" className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-brand via-brand-2 to-accent transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-100" />
        </article>
      ))}
    </div>
  );
}

/* ---------------- Stats band ---------------- */
export function StatsBand({ items }: { items: [string, string][] }) {
  return (
    <dl data-stagger className={`grid gap-y-12 ${items.length === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2 lg:grid-cols-4"}`}>
      {items.map(([v, l]) => (
        <div key={l} data-rise className="flex flex-col-reverse justify-end gap-3 border-l border-line pl-6 sm:pl-8">
          <dt className="text-[15px] text-ink-2">{l}</dt>
          <dd className="font-display text-[clamp(3rem,6vw,6rem)] font-medium leading-[0.9] tracking-[-0.055em] text-brand">
            {/\d/.test(v) ? <span data-count={v}>{v}</span> : <span className="serif block text-[clamp(2.4rem,4.2vw,4.4rem)] tracking-[-0.02em]">{v}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ---------------- Why Komansu ---------------- */
export function Why() {
  return (
    <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-32">
          <div data-rise>
            <span className="eyebrow">Why Komansu</span>
          </div>
          <h2 data-split className="t-h2 mt-6 max-w-[12ch]">
            ELV Engineering with <span className="serif text-brand">Precision</span>
          </h2>
          <p data-rise data-delay="0.15" className="lead mt-7">
            We work directly with project owners, consultants, and EPC/PMC contractors — providing technically sound, code-compliant ELV systems backed by proper AutoCAD documentation and BOQs.
          </p>
          <ul data-stagger className="mt-10 space-y-1">
            {WHY.map((w) => (
              <li key={w} data-rise className="group flex items-center gap-4 border-b border-line py-4 text-[17px] text-ink transition-[padding] duration-500 hover:pl-2">
                <Check className="transition-colors duration-500 group-hover:bg-brand group-hover:text-white" />
                {w}
              </li>
            ))}
          </ul>
          <div data-rise className="mt-10">
            <MagneticButton href="/about" variant="ghost">
              Learn More About Us
            </MagneticButton>
          </div>
        </div>
      </div>
      <div className="relative lg:col-span-6 lg:col-start-7">
        <RevealImage src="/images/drafting.jpg" alt="An engineer marking up AutoCAD drawings" className="aspect-[4/5] w-full" parallax />
        <div className="relative -mt-28 ml-auto w-[62%] sm:-mt-40">
          <RevealImage src="/images/server-rack.jpg" alt="Structured cabling in a server rack" className="aspect-square w-full border-[6px] border-bg shadow-[var(--shadow-lift)]" radius={24} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Horizontal disciplines gallery ---------------- */
export function DisciplineGallery() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => bar.current && (bar.current.style.transform = `scaleX(${self.progress})`),
        },
      });
      // cards lean slightly while moving
      gsap.utils.toArray<HTMLElement>("[data-hcard]").forEach((c) => {
        gsap.fromTo(c.querySelector("img"), { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: c, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
    });
    mm.add("(max-width: 1023px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth + 20;
      const tween = gsap.to(t, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${dist() * 1.15}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => bar.current && (bar.current.style.transform = `scaleX(${self.progress})`),
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-hcard]").forEach((c) => {
        gsap.fromTo(c.querySelector("img"), { xPercent: -6 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: c, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <div>
    <section ref={root} className="relative overflow-hidden bg-bg-soft flex flex-col justify-center h-screen min-h-[600px] py-6 sm:py-8 lg:h-screen lg:py-0">
      <div className="shell flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span data-rise className="eyebrow">
            What We Do
          </span>
          <h2 data-split className="t-h2 mt-3 sm:mt-5 max-w-[16ch]">
            Our ELV <span className="serif text-brand">Services</span>
          </h2>
        </div>
        <p data-rise className="lead text-[15px] sm:text-[18px] md:max-w-[40ch]">
          Full-spectrum Extra Low Voltage design and deployment — across five core disciplines, delivered end-to-end.
        </p>
      </div>

      <div className="no-scrollbar mt-6 sm:mt-10 lg:mt-12 overflow-hidden lg:overflow-visible">
        <div ref={track} className="flex w-max gap-4 sm:gap-5 px-[var(--gutter)]">
          {SERVICES.map((s, i) => (
            <TransitionLink
              key={s.id}
              href={`/services#${s.id}`}
              data-hcard
              data-cursor="view"
              className="group relative flex w-[80vw] shrink-0 flex-col overflow-hidden rounded-[24px] sm:rounded-[28px] bg-surface sm:w-[56vw] lg:w-[34vw] xl:w-[30vw]"
            >
              <div className="relative h-[24vh] min-h-[160px] sm:h-[30vh] lg:h-[34vh] lg:min-h-[220px] overflow-hidden">
                <Image src={assetPath(s.image)} alt={s.alt} fill sizes="(min-width:1024px) 34vw, 80vw" className="scale-[1.2] object-cover transition-[filter] duration-700 group-hover:brightness-105" />
                <span className="absolute left-4 top-4 sm:left-5 sm:top-5 rounded-full bg-white/85 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[12px] sm:text-[13px] font-medium text-ink backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-7">
                <h3 className="t-h3 text-[20px] sm:text-[24px]">{s.title}</h3>
                <ul className="mt-3 sm:mt-4 space-y-1 sm:space-y-1.5 text-[14px] sm:text-[15px] text-ink-2">
                  {s.points.slice(0, 2).map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="mt-[8px] sm:mt-[10px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span className="line-clamp-2">{p}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-auto flex items-center gap-2 pt-4 sm:pt-6 text-[14px] sm:text-[15px] font-medium text-brand">
                  <span className="roll">
                    <span>Explore service</span>
                    <span aria-hidden="true">Explore service</span>
                  </span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
                    <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </TransitionLink>
          ))}
        </div>
      </div>
      <div className="shell mt-6 sm:mt-8 lg:mt-10 block">
        <div className="h-[2px] w-full overflow-hidden rounded bg-line">
          <span ref={bar} className="block h-full origin-left bg-gradient-to-r from-brand to-accent" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
    </div>
  );
}
