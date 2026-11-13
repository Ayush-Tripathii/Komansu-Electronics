"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/site";

const FEEDS = [
  { src: assetPath("/images/warehouse-aisle.jpg"), label: "Warehouse aisle", alt: "Warehouse racking aisle" },
  { src: assetPath("/images/hotel-night.jpg"), label: "Hotel pool deck", alt: "Hotel pool deck at dusk" },
  { src: assetPath("/images/office.jpg"), label: "Office floor", alt: "Open-plan office floor" },
  { src: assetPath("/images/apartments.jpg"), label: "Residential block", alt: "Apartment building exterior" },
];

/** Four camera feeds — hover one to promote it; the others compress like a VMS layout switch. */
export function CctvMultiview() {
  const [active, setActive] = useState(0);
  const [time, setTime] = useState("");
  useEffect(() => {
    const t = () => setTime(new Date().toLocaleTimeString("en-IN", { hour12: false }));
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);
  const col = active % 2 === 0 ? "2.2fr 1fr" : "1fr 2.2fr";
  const row = active < 2 ? "2.2fr 1fr" : "1fr 2.2fr";
  return (
    <div
      className="grid aspect-[5/4] w-full gap-2.5 transition-[grid-template-columns,grid-template-rows] duration-700 ease-[cubic-bezier(.16,1,.3,1)]"
      style={{ gridTemplateColumns: col, gridTemplateRows: row }}
    >
      {FEEDS.map((f, i) => {
        const on = i === active;
        return (
          <button
            key={f.label}
            type="button"
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-label={`Show ${f.label} feed`}
            aria-pressed={on}
            data-cursor-label="Focus"
            className="group relative overflow-hidden rounded-[18px] bg-ink-2 text-left"
          >
            <Image
              src={f.src}
              alt={f.alt}
              fill
              sizes="(min-width:1024px) 30vw, 60vw"
              className={`object-cover transition-[filter,transform] duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] ${on ? "scale-100 grayscale-0" : "scale-110 grayscale"}`}
              style={{ filter: on ? undefined : "grayscale(1) contrast(1.05) brightness(.9)" }}
            />
            {/* focus brackets */}
            <span aria-hidden="true" className={`pointer-events-none absolute inset-3 transition-all duration-500 ${on ? "opacity-100" : "scale-110 opacity-0"}`}>
              {["left-0 top-0 border-l-2 border-t-2", "right-0 top-0 border-r-2 border-t-2", "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((c) => (
                <i key={c} className={`absolute h-5 w-5 rounded-[3px] border-white ${c}`} />
              ))}
            </span>
            <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-[12.5px] font-medium text-ink backdrop-blur">
              <span className={`h-1.5 w-1.5 rounded-full ${on ? "animate-pulse bg-accent" : "bg-ink-3"}`} />
              {f.label}
            </span>
            {on && (
              <span className="absolute right-3 top-3 rounded-full bg-white/85 px-3 py-1.5 text-[12.5px] font-medium tabular-nums text-ink backdrop-blur" suppressHydrationWarning>
                {time}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
