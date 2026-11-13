"use client";

import Image from "next/image";
import { useState } from "react";
import { HOME_SERVICES } from "@/lib/content";
import { TransitionLink } from "@/components/transition/TransitionLink";
import { assetPath } from "@/lib/site";

/** Three expanding image panels — the hovered one opens, the others compress. */
export function ServicePanels() {
  const [active, setActive] = useState(0);
  return (
    <div data-stagger className="flex flex-col gap-4 lg:h-[660px] lg:flex-row">
      {HOME_SERVICES.map((s, i) => {
        const on = active === i;
        return (
          <TransitionLink
            key={s.title}
            href={s.href}
            data-rise
            data-cursor-label="Explore"
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className="group relative block h-[460px] overflow-hidden rounded-[28px] bg-ink-2 transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] lg:h-auto"
            style={{ flexGrow: on ? 2.4 : 1, flexBasis: 0 }}
          >
            <Image
              src={assetPath(s.image)}
              alt={s.alt}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className={`object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] ${on ? "scale-100" : "scale-110"}`}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,19,42,.05)_20%,rgba(18,19,42,.78)_100%)]" />
            <div className="absolute left-6 top-6 flex items-center gap-2">
              <span className="rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-md">{s.tag}</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <h3 className="t-h3 text-white">{s.title}</h3>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(.16,1,.3,1)] lg:grid-rows-[0fr] ${on ? "lg:!grid-rows-[1fr] opacity-100" : "lg:opacity-0"}`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="max-w-[44ch] pt-3 text-[15.5px] leading-relaxed text-white/85">{s.body}</p>
                    </div>
                  </div>
                </div>
                <span
                  aria-hidden="true"
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-brand transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${on ? "rotate-[-45deg] scale-100" : "lg:scale-75"}`}
                >
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h11M7.5 2.5 12 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </TransitionLink>
        );
      })}
    </div>
  );
}
