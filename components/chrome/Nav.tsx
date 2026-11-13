"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV } from "@/lib/site";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLLIElement>(null);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 400);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [pathname]);

  // sliding hover highlight
  const moveTo = (el: HTMLElement | null) => {
    const p = pill.current;
    const l = list.current;
    if (!p || !l) return;
    if (!el) {
      const active = l.querySelector<HTMLElement>("[aria-current='page']");
      if (!active) return gsap.to(p, { opacity: 0, duration: 0.3 });
      el = active;
    }
    const lr = l.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    gsap.to(p, { x: r.left - lr.left, width: r.width, opacity: 1, duration: 0.55, ease: "expo.out" });
  };
  useEffect(() => {
    const id = requestAnimationFrame(() => moveTo(null));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (open) {
      lenis?.stop();
      if (!prefersReducedMotion()) {
        gsap.fromTo(el, { clipPath: "circle(0% at 100% 0%)" }, { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" });
        gsap.fromTo(el.querySelectorAll("[data-menu-item]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.35 });
      }
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    } else lenis?.start();
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-[100] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
      style={{ transform: hidden && !open ? "translateY(-120%)" : "translateY(0)" }}
    >
      <div className="shell pt-4">
        <nav
          aria-label="Primary"
          className={`relative flex h-[68px] items-center justify-between rounded-full pl-5 pr-2 transition-[background-color,box-shadow,border-color] duration-700 ${
            scrolled && !open ? "border border-white/70 bg-white/65 shadow-[0_20px_50px_-30px_rgba(42,27,110,.35)] backdrop-blur-xl" : "border border-transparent"
          }`}
        >
          <TransitionLink href="/" aria-label="Komansu Electronics — Home" className="relative z-10 flex items-center">
            <Image src="/logo.jpg" alt="Komansu Electronics Pvt. Ltd." width={454} height={188} priority className="logo-ko h-[34px] w-auto" />
          </TransitionLink>

          <ul ref={list} className="absolute left-1/2 hidden -translate-x-1/2 items-center lg:flex" onMouseLeave={() => moveTo(null)}>
            <li ref={pill} aria-hidden="true" className="absolute left-0 top-0 h-full rounded-full bg-white opacity-0 shadow-[0_6px_20px_-10px_rgba(42,27,110,.4)]" />
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href} className="relative">
                  <TransitionLink
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={(e) => moveTo(e.currentTarget)}
                    className={`group relative flex h-11 items-center px-5 text-[15px] font-medium transition-colors ${active ? "text-brand" : "text-ink-2 hover:text-ink"}`}
                  >
                    <span className="roll">
                      <span>{item.label}</span>
                      <span aria-hidden="true">{item.label}</span>
                    </span>
                  </TransitionLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <MagneticButton href="/contact" variant="primary" size="sm">
                Get a Quote
              </MagneticButton>
            </span>
            <button
              type="button"
              className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_-10px_rgba(42,27,110,.4)] lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-500 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-[1.5px] w-5 bg-ink transition-transform duration-500 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <div id="mobile-menu" ref={menuRef} hidden={!open} className="fixed inset-0 -z-10 overflow-hidden bg-bg lg:hidden">
        <div className="aurora">
          <i />
          <i />
          <i />
        </div>
        <div className="shell relative flex h-full flex-col justify-between pb-10 pt-32">
          <ul className="flex flex-col gap-1">
            {NAV.map((item) => (
              <li key={item.href} className="overflow-hidden">
                <TransitionLink href={item.href} className="block py-1">
                  <span data-menu-item className={`block font-display text-[clamp(2.8rem,12vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.04em] ${pathname === item.href ? "text-brand" : "text-ink"}`}>
                    {pathname === item.href ? <span className="serif">{item.label}</span> : item.label}
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-6">
            <a href="mailto:info@komansu.com" className="text-lg text-ink-2">
              info@komansu.com
            </a>
            <MagneticButton href="/contact" variant="primary">
              Get a Quote
            </MagneticButton>
          </div>
        </div>
      </div>
    </header>
  );
}
