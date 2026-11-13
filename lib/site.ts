export const SITE_URL = "https://www.komansu.com";

export const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ??
  (process.env.NODE_ENV === "production" ? "/Komansu-Electronics" : "");

export function assetPath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (BASE_PATH && path.startsWith(BASE_PATH)) return path;
  return `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
}

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
] as const;

export const ROUTE_NAMES: Record<string, string> = {
  "/": "Home",
  "/services": "Services",
  "/about": "About",
  "/portfolio": "Portfolio",
  "/contact": "Contact",
};

export const FOOTER_SERVICES = [
  { href: "/services#cctv", label: "CCTV Surveillance" },
  { href: "/services#iva-demos", label: "Intelligent Video Analytics" },
  { href: "/services#fire-alarm-paga", label: "Fire Alarm & PAGA" },
  { href: "/services#access-control", label: "Access Control" },
  { href: "/services#data-networks", label: "Data Networks" },
] as const;

export const FOOTER_COMPANY = [
  { href: "/about", label: "About Us" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/contact", label: "Contact" },
] as const;

export const INDUSTRIES = [
  "Industrial Facilities",
  "Hospitality & Hotels",
  "Commercial Buildings",
  "Healthcare",
  "Oil & Gas",
  "Education",
  "Retail & Malls",
  "Infrastructure",
] as const;

/** Verbatim meta from the live komansu.com pages */
export const META = {
  home: {
    title: "Komansu Electronics — ELV Systems Design & Deployment",
    description:
      "Komansu Electronics Pvt. Ltd. — Expert ELV systems: CCTV, IVA, Fire Alarm, PAGA, Access Control, Data Networks.",
  },
  services: {
    title: "ELV Services — Komansu Electronics",
    description:
      "CCTV surveillance, Intelligent Video Analytics, Fire Alarm & PAGA, Access Control, Data Networks and ELV design consulting — end-to-end ELV services from Komansu Electronics.",
  },
  about: {
    title: "About Us — Komansu Electronics",
    description:
      "About Komansu Electronics Pvt. Ltd. — ELV systems specialists for industrial, hospitality and infrastructure projects.",
  },
  portfolio: {
    title: "Portfolio — Komansu Electronics",
    description:
      "ELV project portfolio — CCTV, FAS, PAGA and access control project case studies by Komansu Electronics.",
  },
  contact: {
    title: "Contact — Komansu Electronics",
    description:
      "Contact Komansu Electronics Pvt. Ltd. for ELV systems design and deployment enquiries.",
  },
} as const;
