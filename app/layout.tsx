import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { ScrollChoreography } from "@/components/providers/ScrollChoreography";
import { ApertureProvider } from "@/components/transition/Aperture";
import { Nav } from "@/components/chrome/Nav";
import { Footer } from "@/components/chrome/Footer";
import { Cursor } from "@/components/cursor/Cursor";
import { META, SITE_URL } from "@/lib/site";
import { SERVICES } from "@/lib/content";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], display: "swap", weight: ["400", "500", "600"] });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], display: "swap", weight: "400", style: "italic" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: META.home.title, template: "%s" },
  description: META.home.description,
  openGraph: { type: "website", siteName: "Komansu Electronics", locale: "en_IN", images: ["/images/towers.jpg"] },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#F5F3EE",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Komansu Electronics Pvt. Ltd.",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.jpg`,
      email: "info@komansu.com",
      description: META.home.description,
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Komansu Electronics Pvt. Ltd.",
      url: SITE_URL,
      image: `${SITE_URL}/logo.jpg`,
      email: "info@komansu.com",
      address: { "@type": "PostalAddress", addressCountry: "IN" },
      areaServed: ["Delhi", "Haryana", "Madhya Pradesh"],
      parentOrganization: { "@id": `${SITE_URL}/#org` },
    },
    ...SERVICES.map((s) => ({
      "@type": "Service",
      "@id": `${SITE_URL}/services#${s.id}`,
      name: s.title,
      description: s.body,
      provider: { "@id": `${SITE_URL}/#org` },
      areaServed: { "@type": "Country", name: "India" },
    })),
  ],
};

const boot = `(function(d){d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('reduced')}catch(e){}})(document.documentElement)`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${interTight.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>
          <ApertureProvider>
            <Nav />
            <main id="main" className="relative z-[1] bg-bg">
              {children}
            </main>
            <Footer />
            <ScrollChoreography />
            <Cursor />
          </ApertureProvider>
        </SmoothScroll>
        <div className="grain" aria-hidden="true" />
        <svg width="0" height="0" aria-hidden="true" className="absolute">
          <filter id="ko-white" colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -2.2 -2.2 -2.2 6.6 0" />
          </filter>
        </svg>
      </body>
    </html>
  );
}
