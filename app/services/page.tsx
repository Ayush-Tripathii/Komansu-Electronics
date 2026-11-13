import type { Metadata } from "next";
import { META } from "@/lib/site";
import { STANDARDS } from "@/lib/content";
import { ClosingCta, PageHero, SectionHead, VelocityMarquee } from "@/components/ui/kit";
import { ServiceModules, ServiceTabs } from "@/components/services/ServiceModules";
import { IvaDemos, ProcessTimeline, Standards } from "@/components/services/ServicesExtras";

export const metadata: Metadata = {
  title: META.services.title,
  description: META.services.description,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title={
          <>
            Our ELV <span className="serif text-gradient pr-[0.05em]">Services</span>
          </>
        }
        sub="Full-spectrum Extra Low Voltage design and deployment — across five core disciplines, delivered end-to-end."
        image="/images/datacenter.jpg"
        alt="An engineer walking through a data centre"
      />

      <div>
        <ServiceTabs />
        <ServiceModules />
      </div>

      {/* IVA in action */}
      <section id="iva-demos" aria-labelledby="iva-demos-t" className="scroll-mt-32 section-y">
        <div className="shell">
          <SectionHead
            id="iva-demos-t"
            eyebrow="Intelligent Video Analytics"
            title={
              <>
                IVA <span className="serif text-brand">In Action</span>
              </>
            }
            lead="Real deployments from our portfolio — each demo below shows a live IVA use-case engineered and commissioned by Komansu Electronics."
            className="mb-14"
          />
          <IvaDemos />
        </div>
      </section>

      <ProcessTimeline />

      {/* Standards */}
      <section aria-labelledby="standards-t" className="section-y overflow-hidden">
        <div className="shell">
          <SectionHead
            id="standards-t"
            eyebrow="Compliance"
            title={
              <>
                Standards &amp; <span className="serif text-brand">Codes</span>
              </>
            }
            className="mb-14"
          />
          <Standards />
        </div>
        <VelocityMarquee
          items={STANDARDS.map((s) => s.code)}
          className="mt-24 font-display text-[clamp(2.4rem,6vw,6rem)] font-medium leading-[1.05] tracking-[-0.045em] text-ink/90"
        />
      </section>

      <ClosingCta
        title={
          <>
            Need a Specific <span className="serif text-brand">ELV System?</span>
          </>
        }
        body="Send us your project brief and we'll get back to you within 24 hours."
        cta="Request Consultation"
      />
    </>
  );
}
