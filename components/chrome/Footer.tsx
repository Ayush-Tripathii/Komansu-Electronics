"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { FOOTER_COMPANY, FOOTER_SERVICES, assetPath } from "@/lib/site";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { gsap, prefersReducedMotion, registerGsap } from "@/lib/gsap";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: -22 },
        { yPercent: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } }
      );
      const letters = word.current!.querySelectorAll("[data-l]");
      gsap.fromTo(
        letters,
        { yPercent: 105 },
        {
          yPercent: 0,
          ease: "expo.out",
          duration: 1.4,
          stagger: 0.06,
          scrollTrigger: { trigger: word.current, start: "top 95%", once: true },
        }
      );
      gsap.fromTo(
        word.current!.querySelector("[data-fill]"),
        { backgroundPosition: "100% 0" },
        {
          backgroundPosition: "0% 0",
          ease: "none",
          scrollTrigger: { trigger: word.current, start: "top bottom", end: "bottom bottom", scrub: 0.6 },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [pathname]);

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo(t: number, o?: object): void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { duration: 2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={root} className="relative z-0 overflow-hidden bg-bg-soft" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="aurora opacity-60">
        <i />
        <i />
        <i />
      </div>
      <div ref={inner} className="relative will-change-transform">
        <div className="shell pt-24 sm:pt-32">
          <div className="flex flex-col justify-between gap-10 border-b border-line pb-16 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <Image src={assetPath("/logo.jpg")} alt="Komansu Electronics Pvt. Ltd." width={454} height={188} className="logo-ko h-11 w-auto" />
              <p className="mt-7 text-[clamp(1.25rem,1.7vw,1.6rem)] leading-snug tracking-[-0.02em] text-ink">
                Expert ELV systems design and deployment — CCTV, Fire Alarm, PAGA, Access Control &amp; Data Networks.
              </p>
            </div>
            <a
              href="mailto:info@komansu.com"
              className="group relative inline-flex items-center gap-5 self-start font-display text-[clamp(1.9rem,4.4vw,4.4rem)] font-medium leading-none tracking-[-0.04em] text-brand lg:self-auto"
            >
              <span className="relative">
                info@komansu.com
                <span className="absolute -bottom-2 left-0 h-[2px] w-full origin-right scale-x-0 bg-accent transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:origin-left group-hover:scale-x-100" />
              </span>
              <span className="flex h-[0.95em] w-[0.95em] items-center justify-center rounded-full bg-brand text-white transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:rotate-[-45deg]">
                <svg width="40%" height="40%" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
            <nav aria-label="Services" className="col-span-2">
              <p className="mb-5 text-[13px] font-medium text-ink-3">Services</p>
              <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                {FOOTER_SERVICES.map((l) => (
                  <li key={l.href}>
                    <TransitionLink href={l.href} className="u-link py-1 text-[16px] text-ink">
                      {l.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Company">
              <p className="mb-5 text-[13px] font-medium text-ink-3">Company</p>
              <ul className="space-y-2.5">
                {FOOTER_COMPANY.map((l) => (
                  <li key={l.href}>
                    <TransitionLink href={l.href} className="u-link py-1 text-[16px] text-ink">
                      {l.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col items-start justify-between gap-6">
              <p className="text-[13px] font-medium text-ink-3">Back to top</p>
              <button
                type="button"
                onClick={toTop}
                aria-label="Back to top"
                className="group flex h-16 w-16 items-center justify-center rounded-full border border-line-strong bg-white/60 transition-colors duration-500 hover:border-brand hover:bg-brand hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-500 group-hover:-translate-y-1">
                  <path d="M7 13V2M2.5 6.5 7 2l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div ref={word} className="shell select-none overflow-hidden" aria-hidden="true">
          <div
            data-fill
            data-l
            className="text-center font-display font-semibold leading-[0.8] tracking-[-0.06em]"
            style={{
              fontSize: "clamp(4.4rem, 19.2vw, 23rem)",
              backgroundImage: "linear-gradient(90deg, var(--brand) 0%, var(--brand-2) 30%, var(--accent) 48%, rgba(42,27,110,0.08) 52%, rgba(42,27,110,0.08) 100%)",
              backgroundSize: "210% 100%",
              backgroundPosition: "100% 0",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              paddingBottom: "0.04em",
            }}
          >
            KOMANSU
          </div>
        </div>

        <div className="shell">
          <div className="flex flex-col gap-3 border-t border-line py-7 text-[14px] text-ink-3 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Komansu Electronics Pvt. Ltd. All rights reserved.</p>
            <a href="https://www.komansu.com" className="u-link">
              www.komansu.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
