"use client";

import { useRef, useState } from "react";
import { PROJECT_TYPES, SERVICE_OPTIONS } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { MagneticButton } from "@/components/ui/MagneticButton";

// Same endpoint + reCAPTCHA v3 key as the live komansu.com form.
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "/contact.php";
const RECAPTCHA_SITE_KEY = "6LdykwEuAAAAAH1fIM4rh9C4kEiAAzcdm0YZ4HuJ";

type G = { ready(cb: () => void): void; execute(k: string, o: { action: string }): Promise<string> };
let captcha: Promise<G | null> | null = null;
function loadCaptcha() {
  if (captcha) return captcha;
  captcha = new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    s.async = true;
    s.onload = () => {
      const g = (window as unknown as { grecaptcha?: G }).grecaptcha;
      if (g) g.ready(() => resolve(g));
      else resolve(null);
    };
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return captcha;
}

function Field({ name, label, type = "text", required, area, error, autoComplete }: { name: string; label: string; type?: string; required?: boolean; area?: boolean; error?: string; autoComplete?: string }) {
  const id = `f-${name}`;
  return (
    <div className="field" data-invalid={error ? "true" : undefined}>
      {area ? (
        <textarea id={id} name={name} placeholder=" " required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} rows={5} />
      ) : (
        <input id={id} name={name} type={type} placeholder=" " required={required} autoComplete={autoComplete} aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined} />
      )}
      <label htmlFor={id}>
        {label}
        {required && <span className="text-accent-deep"> *</span>}
      </label>
      <span className="bar" aria-hidden="true" />
      {error && (
        <p id={`${id}-e`} className="mt-2 text-[13.5px] text-accent-deep">
          {error}
        </p>
      )}
    </div>
  );
}

function DropdownField({
  name,
  label,
  options,
  placeholder,
}: {
  name: string;
  label: string;
  options: readonly string[];
  placeholder: string;
}) {
  const id = `f-${name}`;
  return (
    <div className="group relative">
      <label htmlFor={id} className="block text-[14px] font-medium text-ink-2 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          defaultValue=""
          className="w-full appearance-none rounded-[18px] border border-line-strong bg-white/70 px-4 py-3.5 pr-11 text-[15px] font-medium text-ink transition-all duration-300 hover:border-brand hover:bg-white focus:border-brand focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20 cursor-pointer shadow-sm"
        >
          <option value="" disabled className="text-ink-3">
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o} className="text-ink bg-white py-1.5">
              {o}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-ink-3 transition-colors duration-200 group-hover:text-brand">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function ContactForm() {
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [ref, setRef] = useState("");

  const validate = (data: FormData) => {
    const e: Record<string, string> = {};
    if (!String(data.get("fname") || "").trim()) e.fname = "Please add your first name.";
    const email = String(data.get("email") || "").trim();
    if (!email) e.email = "We'll need an email to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "That email doesn't look quite right.";
    if (!String(data.get("message") || "").trim()) e.message = "A few lines about the project help us respond properly.";
    return e;
  };

  const submit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const f = form.current!;
    const data = new FormData(f);
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) {
      f.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const g = await loadCaptcha();
      data.set("recaptcha_token", g ? await g.execute(RECAPTCHA_SITE_KEY, { action: "contact" }) : "");
    } catch {
      data.set("recaptcha_token", "");
    }
    let ok = false;
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: data });
      ok = res.ok;
    } catch {}
    if (!ok) {
      // same fallback as the live site: open the visitor's mail client
      const name = `${data.get("fname")} ${data.get("lname") || ""}`.trim();
      const co = data.get("company") ? ` (${data.get("company")})` : "";
      const svc = String(data.get("service") || "General");
      window.location.href =
        "mailto:info@komansu.com?subject=" +
        encodeURIComponent("Website Enquiry – " + svc) +
        "&body=" +
        encodeURIComponent(`Name: ${name}${co}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone") || "—"}\nProject type: ${data.get("project_type") || "—"}\n\n${data.get("message")}`);
    }
    setRef(`KE-2026-${String(Math.floor(1000 + Math.random() * 9000))}`);
    setStatus("sent");
    f.reset();
    requestAnimationFrame(() => {
      if (!done.current || prefersReducedMotion()) return;
      const tl = gsap.timeline();
      tl.fromTo(done.current, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(120% at 50% 50%)", duration: 1, ease: "expo.inOut" })
        .fromTo(done.current.querySelector("[data-tick]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "expo.out" }, "-=0.3")
        .from(done.current.querySelectorAll("[data-line]"), { yPercent: 100, opacity: 0, duration: 0.8, stagger: 0.12, ease: "expo.out" }, "-=0.5");
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-line bg-surface p-7 shadow-[var(--shadow-soft)] sm:p-12">
      <form ref={form} onSubmit={submit} onFocus={() => loadCaptcha()} noValidate className="space-y-9" aria-hidden={status === "sent"}>
        <div className="grid gap-9 sm:grid-cols-2">
          <Field name="fname" label="First Name" required error={errors.fname} autoComplete="given-name" />
          <Field name="lname" label="Last Name" autoComplete="family-name" />
        </div>
        <Field name="company" label="Company / Organisation" autoComplete="organization" />
        <div className="grid gap-9 sm:grid-cols-2">
          <Field name="email" type="email" label="Email Address" required error={errors.email} autoComplete="email" />
          <Field name="phone" type="tel" label="Phone Number" autoComplete="tel" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <DropdownField
            name="service"
            label="Service Required"
            placeholder="Select a service…"
            options={SERVICE_OPTIONS}
          />
          <DropdownField
            name="project_type"
            label="Project Type"
            placeholder="Select project type…"
            options={PROJECT_TYPES}
          />
        </div>
        <Field name="message" label="Project Details" area required error={errors.message} />

        {/* honeypot — keep the field named "website" */}
        <div className="absolute -left-[9999px] -top-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="recaptcha_token" />

        <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13.5px] text-ink-3">
            Fields marked <span className="text-accent-deep">*</span> are required.
          </p>
          <MagneticButton type="submit" variant="primary" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send Enquiry"}
          </MagneticButton>
        </div>
      </form>

      {status === "sent" && (
        <div ref={done} role="status" className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(160deg,#ffffff,#efedfb)] p-8 text-center">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-ok/10">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path data-tick d="M4 12.5 9.5 18 20 6.5" pathLength={1} strokeDasharray="1" stroke="#0e9f6e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="mt-8 overflow-hidden">
            <p data-line className="t-h3 max-w-[24ch]">
              ✓ Thank you — we&apos;ll be in touch within 24 hours.
            </p>
          </div>
          <div className="mt-4 overflow-hidden">
            <p data-line className="text-[15px] text-ink-2">
              Your reference: <span className="font-medium text-brand">{ref}</span>
            </p>
          </div>
          <div className="mt-8 overflow-hidden">
            <button data-line type="button" onClick={() => setStatus("idle")} className="u-link text-[15px] font-medium text-brand">
              Send another enquiry
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
