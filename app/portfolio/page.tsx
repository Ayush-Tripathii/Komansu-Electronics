import type { Metadata } from "next";
import { META } from "@/lib/site";
import { MagneticButton, PageHero } from "@/components/ui/kit";
import { StatsBand } from "@/components/home/HomeSections";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

export const metadata: Metadata = {
  title: META.portfolio.title,
  description: META.portfolio.description,
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title={
          <>
            Projects &amp; <span className="serif text-gradient pr-[0.05em]">Portfolio</span>
          </>
        }
        sub="Across industrial facilities, hotels, schools, retail stores, residences and places of worship — real deployments, real results."
      />

      <section aria-label="Key figures" className="pt-20">
        <div className="shell border-y border-line py-16">
          <StatsBand
            items={[
              ["500+", "Sites Completed"],
              ["6", "Sectors PAN India"],
              ["3", "States"],
            ]}
          />
        </div>
      </section>

      <section aria-label="Projects" className="section-y">
        <div className="shell">
          <PortfolioGrid />
        </div>
      </section>

      {/* Portal — coming soon */}
      <section aria-labelledby="portal-t" className="pb-[var(--section-y)]">
        <div className="shell">
          <div data-rise className="hatch relative overflow-hidden rounded-[32px] border border-line bg-surface p-9 sm:p-16">
            <div className="aurora opacity-60">
              <i />
              <i />
              <i />
            </div>
            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2.5 rounded-full bg-accent-soft px-4 py-2 text-[13.5px] font-medium text-accent-deep">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
                  Coming soon
                </span>
                <h2 id="portal-t" data-split className="t-h2 mt-7 max-w-[16ch]">
                  New Enquiries &amp; <span className="serif text-brand">After-Sales Portal</span>
                </h2>
                <p data-rise className="lead mt-6">
                  A dedicated client portal for new project enquiries, progress tracking, and after-sales support is being set up. Coming soon.
                </p>
              </div>
              <div className="lg:col-span-4 lg:col-start-9 lg:justify-self-end">
                <MagneticButton href="/contact" variant="primary">
                  Contact Us in the Meantime
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
