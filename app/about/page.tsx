import type { Metadata } from "next";
import { META } from "@/lib/site";
import { ABOUT_POINTS } from "@/lib/content";
import { Check, ClosingCta, PageHero, RevealImage, SectionHead } from "@/components/ui/kit";
import { StatsBand } from "@/components/home/HomeSections";
import { Blueprint } from "@/components/services/Blueprint";
import { ClientCloud, PrinciplesStack } from "@/components/about/AboutParts";

export const metadata: Metadata = {
  title: META.about.title,
  description: META.about.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            Who We <span className="serif text-gradient pr-[0.05em]">Are</span>
          </>
        }
        sub="A specialist ELV engineering company — built on technical depth, code compliance, and reliable delivery."
        image="/images/white-arch.jpg"
        alt="A white modern building with sharp geometric lines"
      />

      {/* Our company */}
      <section aria-labelledby="company-t" className="section-y">
        <div className="shell grid gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <SectionHead id="company-t" eyebrow="Our Company" title={<>Komansu Electronics <span className="serif text-brand">Pvt. Ltd.</span></>} />
            <div data-stagger className="mt-8 space-y-5">
              <p data-rise className="lead">
                Komansu Electronics is a specialist ELV systems company providing integrated security, safety, communications, and network infrastructure for demanding projects across industrial, hospitality, and infrastructure sectors.
              </p>
              <p data-rise className="body text-[17px]">
                We operate from design concept through to system commissioning and handover — with full AutoCAD drawing deliverables, accurate Bills of Quantity, and compliance documentation aligned to international standards.
              </p>
            </div>
            <ul data-stagger className="mt-10">
              {ABOUT_POINTS.map((p) => (
                <li key={p} data-rise className="group flex items-center gap-4 border-b border-line py-4 text-[16.5px] transition-[padding] duration-500 hover:pl-2">
                  <Check className="transition-colors duration-500 group-hover:bg-brand group-hover:text-white" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-5 lg:col-start-8">
            <RevealImage src="/images/glass-tower.jpg" alt="Glass office towers" className="col-span-2 aspect-[4/3]" parallax />
            <RevealImage src="/images/corridor.jpg" alt="A bright office corridor" className="aspect-square" radius={22} />
            <RevealImage src="/images/patch-panel.jpg" alt="A network patch panel" className="aspect-square" radius={22} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Key figures" className="border-y border-line py-20 sm:py-28">
        <div className="shell">
          <StatsBand
            items={[
              ["5+", "ELV Disciplines"],
              ["100%", "Design-to-Deploy Capability"],
              ["NFPA · IEC · TIA", "Standards We Work To"],
            ]}
          />
        </div>
      </section>

      {/* Documentation showpiece */}
      <section aria-labelledby="docs-t" className="section-y">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-4">
            <SectionHead id="docs-t" eyebrow="How We Work" title={<>Accurate <span className="serif text-brand">Documentation</span></>} lead="Precise AutoCAD drawings, verified BOQs, and clean handover packages that consultants and clients can rely on." />
          </div>
          <div className="lg:col-span-8">
            <div data-rise className="overflow-hidden rounded-[28px] border border-line shadow-[var(--shadow-soft)]">
              <Blueprint tall />
            </div>
          </div>
        </div>
      </section>

      {/* Industries & clients */}
      <section aria-labelledby="clients-t" className="bg-bg-soft section-y">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead id="clients-t" title={<>Industries &amp; Clients <span className="serif text-brand">We Serve</span></>} />
          </div>
          <div className="lg:col-span-8 lg:pt-4">
            <ClientCloud />
          </div>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles-t" className="section-y">
        <div className="shell">
          <SectionHead
            id="principles-t"
            eyebrow="How We Work"
            title={
              <>
                Our Core <span className="serif text-brand">Principles</span>
              </>
            }
            lead="The standards that guide every design and every project delivery."
            className="mb-16"
          />
          <PrinciplesStack />
        </div>
      </section>

      <ClosingCta
        title={
          <>
            Let&apos;s Build Something <span className="serif text-brand">Together</span>
          </>
        }
        body="Bring us into your project early — we can contribute from design brief stage through to commissioning."
        cta="Get in Touch"
      />
    </>
  );
}
