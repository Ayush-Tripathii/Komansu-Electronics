import type { Metadata } from "next";
import { META } from "@/lib/site";
import { INDUSTRIES } from "@/lib/site";
import { HomeHero } from "@/components/home/HomeHero";
import { ServicePanels } from "@/components/home/ServicePanels";
import { DisciplineGallery, StatsBand, Values, Why } from "@/components/home/HomeSections";
import { ClosingCta, MagneticButton, SectionHead, VelocityMarquee } from "@/components/ui/kit";

export const metadata: Metadata = {
  title: META.home.title,
  description: META.home.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HomeHero />

      {/* Industries */}
      <section aria-labelledby="industries" className="pt-24 sm:pt-32">
        <div className="shell mb-10 flex items-center justify-between gap-6">
          <h2 id="industries" data-rise className="text-[15px] font-medium text-ink-2">
            Industries We Serve
          </h2>
          <span data-rule className="rule hidden flex-1 sm:block" />
        </div>
        <VelocityMarquee items={INDUSTRIES} className="font-display text-[clamp(2.6rem,7vw,7rem)] font-medium leading-[1.05] tracking-[-0.045em] text-ink" />
        <ul className="sr-only">
          {INDUSTRIES.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>

      {/* Statement */}
      <section className="section-y">
        <div className="shell">
          <div data-rise className="mb-10">
            <span className="eyebrow">What We Do</span>
          </div>
          <p data-scrub className="statement max-w-[24ch]">
            Integrated security, safety, communications and network infrastructure — delivered as one coordinated package.
          </p>
        </div>
      </section>

      {/* Core services */}
      <section aria-labelledby="core-services" className="pb-[var(--section-y)]">
        <div className="shell">
          <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHead id="core-services" title={<>Our Core <span className="serif text-brand">ELV Services</span></>} />
            <div data-rise>
              <MagneticButton href="/services" variant="ghost">
                View All Services
              </MagneticButton>
            </div>
          </div>
          <ServicePanels />
        </div>
      </section>

      {/* Values */}
      <section className="pb-[var(--section-y)]">
        <div className="shell">
          <Values />
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Key figures" className="border-y border-line py-20 sm:py-28">
        <div className="shell">
          <StatsBand
            items={[
              ["5+", "ELV Disciplines"],
              ["100%", "Design-to-Deploy"],
              ["500+", "Sites Completed"],
              ["3", "States"],
            ]}
          />
        </div>
      </section>

      {/* Why */}
      <section className="section-y">
        <div className="shell">
          <Why />
        </div>
      </section>

      <DisciplineGallery />

      <ClosingCta
        title={<>Ready to Start Your <span className="serif text-brand">ELV Project?</span></>}
        body="Tell us about your project and we'll respond within 24 business hours."
        cta="Request a Consultation"
      />
    </>
  );
}
