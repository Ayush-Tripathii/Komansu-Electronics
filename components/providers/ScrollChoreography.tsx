"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger, SplitText } from "@/lib/gsap";

const EASE = "expo.out";

/** Resolve once the first-visit preloader has lifted. */
function whenReady(cb: () => void) {
  const html = document.documentElement;
  if (html.classList.contains("is-ready")) return cb();
  const mo = new MutationObserver(() => {
    if (html.classList.contains("is-ready")) {
      mo.disconnect();
      cb();
    }
  });
  mo.observe(html, { attributes: true, attributeFilter: ["class"] });
}

/**
 * Declarative scroll choreography, opted into via data attributes:
 *  data-split[="load"]  line-mask headline reveal
 *  data-scrub           statement whose words fill with ink as you scroll
 *  data-rise / data-stagger   rise + fade (groups stagger)
 *  data-reveal          clip-path image reveal; inner <img> settles from 1.25 scale
 *  data-grow            media grows from inset card to full bleed on scroll
 *  data-count           odometer digit roll
 *  data-parallax="0.1"  translate differential
 *  data-rule            hairline draws left → right
 */
export function ScrollChoreography() {
  const pathname = usePathname();

  useEffect(() => {
    registerGsap();
    const reduced = prefersReducedMotion();
    const splits: SplitText[] = [];
    let ctx: gsap.Context | null = null;
    let alive = true;

    const run = () => {
      if (!alive) return;
      ctx = gsap.context(() => {
        if (reduced) {
          gsap.set("[data-split], [data-rise], [data-reveal]", { clearProps: "all", visibility: "visible", opacity: 1 });
          return;
        }
        const isLoad = (el: HTMLElement, key: string) => el.dataset[key] === "load";

        // ---- line headlines
        document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
          const delay = parseFloat(el.dataset.delay ?? "0");
          const split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            linesClass: "split-line",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { visibility: "visible" });
              return gsap.from(self.lines, {
                yPercent: 115,
                rotate: 2.5,
                transformOrigin: "0% 100%",
                duration: 1.35,
                ease: EASE,
                stagger: 0.09,
                delay,
                scrollTrigger: isLoad(el, "split") ? undefined : { trigger: el, start: "top 88%", once: true },
              });
            },
          });
          splits.push(split);
        });

        // ---- scrubbed statements: words ink in with scroll
        document.querySelectorAll<HTMLElement>("[data-scrub]").forEach((el) => {
          const split = SplitText.create(el, { type: "words", wordsClass: "scrub-w" });
          splits.push(split);
          gsap.fromTo(
            split.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
            }
          );
        });

        // ---- hairlines
        gsap.utils.toArray<HTMLElement>("[data-rule]").forEach((el) => {
          gsap.to(el, {
            scaleX: 1,
            duration: 1.6,
            ease: "expo.inOut",
            delay: parseFloat(el.dataset.delay ?? "0"),
            scrollTrigger: isLoad(el, "rule") ? undefined : { trigger: el, start: "top 92%", once: true },
          });
        });

        // ---- rise groups
        const grouped = new Set<HTMLElement>();
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((group) => {
          const items = Array.from(group.querySelectorAll<HTMLElement>("[data-rise]"));
          items.forEach((i) => grouped.add(i));
          if (!items.length) return;
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: EASE,
            stagger: 0.09,
            delay: parseFloat(group.dataset.delay ?? "0"),
            scrollTrigger: isLoad(group, "stagger") ? undefined : { trigger: group, start: "top 86%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          if (grouped.has(el)) return;
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: EASE,
            delay: parseFloat(el.dataset.delay ?? "0"),
            scrollTrigger: isLoad(el, "rise") ? undefined : { trigger: el, start: "top 90%", once: true },
          });
        });

        // ---- clip-path image reveals
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          const r = getComputedStyle(el).getPropertyValue("--r") || "0px";
          const img = el.querySelector("img, video");
          const st = isLoad(el, "reveal") ? undefined : { trigger: el, start: "top 85%", once: true };
          const delay = parseFloat(el.dataset.delay ?? "0");
          gsap.fromTo(
            el,
            { clipPath: `inset(100% 0% 0% 0% round ${r})` },
            { clipPath: `inset(0% 0% 0% 0% round ${r})`, duration: 1.5, ease: "expo.inOut", delay, scrollTrigger: st }
          );
          if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2, ease: EASE, delay, scrollTrigger: st });
        });

        // ---- full-bleed media growth
        gsap.utils.toArray<HTMLElement>("[data-grow]").forEach((el) => {
          gsap.fromTo(
            el,
            { clipPath: "inset(6% 7% 6% 7% round 36px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 0px)",
              ease: "none",
              scrollTrigger: { trigger: el, start: "top 85%", end: "top 10%", scrub: 0.8 },
            }
          );
          const img = el.querySelector("img");
          if (img)
            gsap.fromTo(img, { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });

        // ---- odometers
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const value = el.dataset.count ?? el.textContent ?? "";
          el.setAttribute("aria-label", value);
          el.textContent = "";
          el.classList.add("odo");
          const cols: { col: HTMLElement; digit: number; i: number }[] = [];
          [...value].forEach((ch, i) => {
            if (/\d/.test(ch)) {
              const wrap = document.createElement("span");
              wrap.className = "odo-digit";
              wrap.setAttribute("aria-hidden", "true");
              const col = document.createElement("span");
              col.className = "odo-col";
              for (let n = 0; n < 20 + Number(ch) + 1; n++) {
                const s = document.createElement("span");
                s.textContent = String(n % 10);
                col.appendChild(s);
              }
              wrap.appendChild(col);
              el.appendChild(wrap);
              cols.push({ col, digit: Number(ch), i });
            } else {
              const s = document.createElement("span");
              s.setAttribute("aria-hidden", "true");
              s.textContent = ch;
              el.appendChild(s);
            }
          });
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 92%", once: true } });
          cols.forEach(({ col, digit, i }) => {
            tl.fromTo(col, { yPercent: 0 }, { yPercent: (-(20 + digit) / (21 + digit)) * 100, duration: 2 + i * 0.2, ease: "power4.out" }, i * 0.08);
          });
        });

        // ---- parallax
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
          const amt = Math.min(0.3, parseFloat(el.dataset.parallax || "0.1"));
          gsap.fromTo(
            el,
            { yPercent: amt * 50 },
            { yPercent: -amt * 50, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } }
          );
        });
      });
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    };

    whenReady(run);

    return () => {
      alive = false;
      splits.forEach((s) => s.revert());
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
