"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { ROUTE_NAMES } from "@/lib/site";
import type Lenis from "lenis";

type Ctx = { navigate: (href: string) => void };
const TransitionCtx = createContext<Ctx>({ navigate: () => {} });
export const useAperture = () => useContext(TransitionCtx);

function getLenis() {
  return (window as unknown as { __lenis?: Lenis }).__lenis;
}

function scrollToTarget(hash: string | null) {
  const lenis = getLenis();
  const el = hash ? document.getElementById(hash.replace("#", "")) : null;
  if (lenis) lenis.scrollTo(el ?? 0, { immediate: true, force: true, offset: el ? -90 : 0 });
  else if (el) el.scrollIntoView();
  else window.scrollTo(0, 0);
}

/**
 * Page transition: two layered curtains sweep up over the page, the
 * destination name rises in serif italic, then the curtains lift away.
 * Also runs a short first-visit preloader.
 */
export function ApertureProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const back = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const pre = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const pending = useRef<{ path: string; hash: string | null } | null>(null);
  const [label, setLabel] = useState("");
  const [showPre, setShowPre] = useState(true);

  // ---------- first-visit preloader
  useEffect(() => {
    const el = pre.current;
    if (!el) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem("ko-pre") === "1";
      sessionStorage.setItem("ko-pre", "1");
    } catch {}
    if (seen || prefersReducedMotion()) {
      setShowPre(false);
      document.documentElement.classList.add("is-ready");
      return;
    }
    getLenis()?.stop();
    const n = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setShowPre(false);
        getLenis()?.start();
      },
    });
    tl.from(el.querySelectorAll("[data-pre-in]"), { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.08 })
      .to(
        n,
        {
          v: 100,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(n.v)).padStart(2, "0");
            if (bar.current) bar.current.style.transform = `scaleX(${n.v / 100})`;
          },
        },
        0.1
      )
      .to(el.querySelectorAll("[data-pre-in]"), { yPercent: -110, duration: 0.6, ease: "power3.in", stagger: 0.04 }, "+=0.1")
      .add(() => document.documentElement.classList.add("is-ready"))
      .to(el, { yPercent: -100, duration: 1, ease: "expo.inOut" }, "-=0.2");
    return () => {
      tl.kill();
    };
  }, []);

  // ---------- route committed → lift curtains
  const lift = useCallback(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set([front.current, back.current], { y: 0, yPercent: 100, visibility: "hidden" });
        busy.current = false;
        getLenis()?.start();
      },
    });
    tl.to(word.current, { yPercent: -120, opacity: 0, duration: 0.45, ease: "power3.in" })
      .to(front.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.15")
      .to(back.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.72");
  }, []);

  useEffect(() => {
    const p = pending.current;
    if (!p || p.path !== pathname) return;
    pending.current = null;
    requestAnimationFrame(() => {
      scrollToTarget(p.hash);
      ScrollTrigger.refresh();
      if (prefersReducedMotion()) {
        gsap.to(front.current, {
          opacity: 0,
          duration: 0.15,
          onComplete: () => {
            gsap.set(front.current, { visibility: "hidden", opacity: 1 });
            busy.current = false;
          },
        });
      } else lift();
    });
  }, [pathname, lift]);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.href);
      const path = url.pathname.replace(/\/$/, "") || "/";
      const hash = url.hash || null;
      if (path === pathname) {
        const el = hash ? document.getElementById(hash.slice(1)) : null;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(el ?? 0, { offset: el ? -90 : 0, duration: 1.6 });
        else (el ?? document.body).scrollIntoView({ behavior: "smooth" });
        if (hash) history.replaceState(null, "", hash);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      setLabel(ROUTE_NAMES[path] ?? path.replace("/", ""));
      getLenis()?.stop();

      const go = () => {
        pending.current = { path, hash };
        router.push(path + (hash ?? ""), { scroll: false });
        window.setTimeout(() => {
          if (pending.current?.path === path) {
            pending.current = null;
            lift();
          }
        }, 4000);
      };

      if (prefersReducedMotion()) {
        gsap.set(front.current, { y: 0, yPercent: 0, visibility: "visible", opacity: 0 });
        gsap.to(front.current, { opacity: 1, duration: 0.15, onComplete: go });
        return;
      }

      const tl = gsap.timeline({ onComplete: go });
      tl.set([back.current, front.current], { y: 0, yPercent: 100, visibility: "visible" })
        .set(word.current, { yPercent: 120, opacity: 1 })
        .to(back.current, { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
        .to(front.current, { yPercent: 0, duration: 0.7, ease: "expo.inOut" }, "-=0.6")
        .to(word.current, { yPercent: 0, duration: 0.6, ease: "expo.out" }, "-=0.25");
    },
    [pathname, router, lift]
  );

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}

      {/* route curtains */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[250]">
        <div
          ref={back}
          className="absolute inset-0 bg-brand-soft"
          style={{ transform: "translateY(100%)", visibility: "hidden", borderRadius: "40px 40px 0 0" }}
        />
        <div
          ref={front}
          className="absolute inset-0 flex items-center justify-center overflow-hidden bg-bg"
          style={{ transform: "translateY(100%)", visibility: "hidden" }}
        >
          <div className="aurora opacity-70">
            <i />
            <i />
            <i />
          </div>
          <div className="relative overflow-hidden px-6 py-4">
            <div ref={word} className="t-h1 text-brand">
              <span className="serif">{label}</span>
            </div>
          </div>
        </div>
      </div>

      {/* first-visit preloader */}
      {showPre && (
        <div ref={pre} aria-hidden="true" className="fixed inset-0 z-[260] flex flex-col justify-between bg-bg">
          <div className="aurora">
            <i />
            <i />
            <i />
          </div>
          <div className="shell relative flex flex-1 flex-col items-center justify-center gap-8">
            <div className="overflow-hidden">
              <div data-pre-in>
                <Image src="/logo.jpg" alt="" width={454} height={188} priority className="logo-ko h-14 w-auto sm:h-20" />
              </div>
            </div>
            <div className="overflow-hidden">
              <p data-pre-in className="text-center text-[15px] text-ink-2">
                Intelligent ELV Systems <span className="serif text-[18px] text-brand">Designed for the Future</span>
              </p>
            </div>
          </div>
          <div className="shell relative pb-10">
            <div className="flex items-end justify-between">
              <span className="text-[13px] text-ink-3">Loading experience</span>
              <span className="font-display text-[clamp(3rem,8vw,6rem)] font-medium leading-none tracking-[-0.05em] text-brand tabular-nums">
                <span ref={count}>00</span>
              </span>
            </div>
            <div className="mt-5 h-px w-full bg-line">
              <span ref={bar} className="block h-px origin-left bg-brand" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
        </div>
      )}
    </TransitionCtx.Provider>
  );
}
