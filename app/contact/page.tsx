import type { Metadata } from "next";
import { META } from "@/lib/site";
import { ENGAGEMENT } from "@/lib/content";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: META.contact.title,
  description: META.contact.description,
  alternates: { canonical: "/contact" },
};

const ASIDE = [
  { label: "Email", value: "info@komansu.com", href: "mailto:info@komansu.com" },
  { label: "Registered Office", value: "Komansu Electronics Pvt. Ltd., India" },
  { label: "Response Time", value: "Within 24 business hours" },
];

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden pb-[var(--section-y)] pt-40 sm:pt-48">
      <div className="aurora">
        <i />
        <i />
        <i />
      </div>
      <div className="shell relative grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <div data-rise="load" data-delay="0.1">
              <span className="eyebrow">Get In Touch</span>
            </div>
            <h1 data-split="load" data-delay="0.15" className="t-h1 mt-8 max-w-[11ch]">
              Request a <span className="serif text-gradient pr-[0.05em]">Consultation</span>
            </h1>
            <p data-rise="load" data-delay="0.45" className="lead mt-8">
              Tell us about your project — we&apos;ll respond within 24 business hours.
            </p>

            <dl data-stagger="load" data-delay="0.6" className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {ASIDE.map((a) => (
                <div key={a.label} data-rise className={`rounded-[22px] border border-line bg-white/70 p-5 backdrop-blur ${a.label === "Email" ? "sm:col-span-2 lg:col-span-1 xl:col-span-2" : ""}`}>
                  <dt className="text-[13px] font-medium text-ink-3">{a.label}</dt>
                  <dd className="mt-1.5 text-[17px] font-medium tracking-[-0.01em] text-ink">
                    {a.href ? (
                      <a href={a.href} className="u-link text-[clamp(1.2rem,1.8vw,1.6rem)] text-brand">
                        {a.value}
                      </a>
                    ) : (
                      a.value
                    )}
                  </dd>
                </div>
              ))}
              <div data-rise className="rounded-[22px] border border-line bg-white/70 p-5 backdrop-blur sm:col-span-2 lg:col-span-1 xl:col-span-2">
                <dt className="text-[13px] font-medium text-ink-3">Areas of Engagement</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {ENGAGEMENT.map((e) => (
                    <span key={e} className="rounded-full bg-brand-soft px-3 py-1.5 text-[13.5px] text-brand">
                      {e}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div data-rise="load" data-delay="0.35" className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
