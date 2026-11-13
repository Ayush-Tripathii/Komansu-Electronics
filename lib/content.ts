/** All client copy — verbatim from the brief (§7). */

import { assetPath } from "./site";

export type Service = {
  id: string;
  short: string;
  title: string;
  body: string;
  points: string[];
  image: string;
  alt: string;
  standard: string;
};

export const SERVICES: Service[] = [
  {
    id: "cctv",
    short: "CCTV",
    title: "CCTV Surveillance",
    body: "IP and analog camera systems, NVR/DVR infrastructure, video management, and storage planning for perimeter, indoor, and critical-area monitoring. We design systems from site survey to as-built documentation, covering industrial facilities, hospitality properties, and commercial campuses.",
    points: [
      "IP megapixel, PTZ, fisheye, and thermal cameras",
      "Analog HD (HDCVI/TVI) for retrofit projects",
      "NVR/DVR with RAID storage design",
      "VMS integration: Milestone, Genetec, Hikvision, Dahua",
      "AutoCAD layout drawings, cable schedules, and BOQ",
      "Compliant with IEC 62676 and project security requirements",
    ],
    image: assetPath("/images/cameras.jpg"),
    alt: "A wall of mounted security cameras",
    standard: "IEC 62676",
  },
  {
    id: "iva",
    short: "Video Analytics",
    title: "Intelligent Video Analytics",
    body: "AI-driven analytics that transform passive CCTV infrastructure into an active security layer — reducing operator fatigue and delivering actionable alerts. Deployed at the edge or on a dedicated server, integrated with your existing cameras or as a standalone system.",
    points: [
      "Perimeter intrusion detection and virtual tripwire",
      "Loitering, crowd density, and abandoned object alerts",
      "Licence plate recognition (LPR/ANPR)",
      "Face recognition and people counting",
      "AI-based fire and smoke detection",
      "Integration with PAGA and access control for automated response",
    ],
    image: assetPath("/images/video-wall.jpg"),
    alt: "A wall of video monitors in a monitoring room",
    standard: "Edge & server AI",
  },
  {
    id: "fire-alarm-paga",
    short: "Fire & PA",
    title: "Fire Alarm & PA Systems",
    body: "Addressable and conventional Fire Alarm System (FAS) design, and Public Address & General Alarm (PAGA) for evacuation and area communication — engineered for industrial plants, petrochemical facilities, hotels, and commercial buildings. All designs comply with NFPA 72, BS 5839, and EN 54.",
    points: [
      "Addressable FAS: Notifier, Hochiki, Siemens, Apollo compatible",
      "Loop-based panel design with point-by-point device mapping",
      "PAGA: amplifier sizing, zone routing, speaker tapping calculations",
      "Voice evacuation system (VES) per EN 54-16 and NFPA 72 Ch. 24",
      "Integration with suppression systems, fire doors, and BMS",
      "Single-line diagrams, zone schedules, and complete BOQ",
    ],
    image: assetPath("/images/auditorium.jpg"),
    alt: "A large auditorium served by a public address system",
    standard: "NFPA 72 · EN 54",
  },
  {
    id: "access-control",
    short: "Access",
    title: "Access Control Systems",
    body: "Card reader, biometric, and intercom-integrated solutions with centralised management — from single-entry offices to multi-gate industrial facilities. We design for security stringency and operational practicality, with full door hardware specification, cable segregation, and integration with HR and visitor management systems.",
    points: [
      "IP-based controllers: HID, Lenel, Honeywell, ZKTeco, Suprema",
      "Card technologies: MIFARE, DESFire, HID iCLASS, proximity",
      "Biometric: fingerprint, face recognition, and iris readers",
      "Turnstiles, boom barriers, and vehicle access integration",
      "Fail-safe vs. fail-secure door hardware specification",
      "AutoCAD drawings, device schedules, and complete BOQ",
    ],
    image: assetPath("/images/smart-lock.jpg"),
    alt: "A smart door lock operated from a phone",
    standard: "Card · Biometric",
  },
  {
    id: "data-networks",
    short: "Networks",
    title: "Data Networks & WiFi Infra",
    body: "Structured cabling (Cat6/6A/Fibre), core and edge switching, wireless access point planning, and telecom room builds for offices, hotels, and industrial plant environments. Designed to TIA-568 and ISO/IEC 11801, coordinated with IT teams and main contractors for seamless integration.",
    points: [
      "Structured cabling: Cat6, Cat6A (copper), OS2/OM3/OM4 fibre",
      "MDF/IDF design: rack layouts, power, patching schedules",
      "Core and access switching: Cisco, HPE Aruba, Ubiquiti",
      "Enterprise WiFi: site survey, AP placement, channel planning",
      "VLAN design and network segmentation for OT/IT convergence",
      "TIA-568-C and ISO/IEC 11801 compliant with test reports",
    ],
    image: assetPath("/images/patch-panel.jpg"),
    alt: "Network patch panel with neatly routed cables",
    standard: "TIA-568 · ISO 11801",
  },
  {
    id: "elv-design",
    short: "Design",
    title: "ELV Design & Consulting",
    body: "BOQ preparation, single-line diagrams, AutoCAD layout deliverables, site surveys, and specification writing — bridging concept to construction documentation for consultants, PMCs, and project owners. We work directly within your project workflow with code-compliant, authority-ready deliverables.",
    points: [
      "Concept design and system selection advisory",
      "AutoCAD floor plans, cable routing, and riser diagrams",
      "Bill of Quantities (BOQ) with accurate material take-off",
      "Technical specifications and vendor-neutral design briefs",
      "Authority submission drawings and compliance documentation",
      "Coordination with MEP consultants, PMCs, and EPC contractors",
    ],
    image: assetPath("/images/blueprints.jpg"),
    alt: "Engineering drawings being reviewed on a desk",
    standard: "AutoCAD · BOQ",
  },
];

export const HOME_SERVICES = [
  {
    title: "CCTV Surveillance",
    body: "IP & analog camera systems with NVR/DVR infrastructure for perimeter and critical area monitoring.",
    href: "/services#cctv",
    image: assetPath("/images/cameras.jpg"),
    alt: "A wall of mounted security cameras",
    tag: "IEC 62676",
  },
  {
    title: "Fire Alarm & PAGA",
    body: "Addressable FAS and Public Address & General Alarm systems per NFPA 72 and EN 54.",
    href: "/services#fire-alarm-paga",
    image: assetPath("/images/auditorium.jpg"),
    alt: "A large auditorium served by a public address system",
    tag: "NFPA 72 · EN 54",
  },
  {
    title: "Data Networks & WiFi",
    body: "Structured cabling, core switching and wireless infrastructure planning for demanding environments.",
    href: "/services#data-networks",
    image: assetPath("/images/server-rack.jpg"),
    alt: "A server rack with structured cabling",
    tag: "TIA-568 · ISO 11801",
  },
];

export const VALUES = [
  { title: "End-to-End Delivery", body: "Design brief to commissioning — one team, no handoffs." },
  { title: "Standards-Led Engineering", body: "NFPA, IEC, TIA and local authority compliance built in." },
  { title: "Multi-Discipline Expertise", body: "CCTV, FAS, PAGA, access & networks — delivered as one." },
];

export const WHY = [
  "Full design-to-deployment capability",
  "Industrial and hospitality sector experience",
  "AutoCAD deliverables with accurate BOQ",
  "Collaborative with PMCs, consultants & contractors",
];

export const IVA_DEMOS = [
  {
    title: "Speed Detection",
    kind: "Video Demo",
    body: "Real-time vehicle speed analytics at entry gates using camera-based IVA — no physical sensors required. Flags over-speed events with automatic on-screen alerts and logging.",
    src: assetPath("/media/IVA_SpeedDetect_blurred2.mp4"),
    type: "video" as const,
  },
  {
    title: "Time Attendance with Cameras",
    kind: "Case Study PDF",
    body: "Contactless attendance tracking powered by face recognition at turnstiles and entry points — eliminating proxy attendance and integrating directly with HR payroll systems.",
    src: assetPath("/media/IVA_TimeAttendance.pdf"),
    type: "pdf" as const,
  },
  {
    title: "Fire Detection",
    kind: "Video Demo",
    body: "AI-based smoke and flame detection using standard CCTV feeds — provides earlier warning than traditional sensors, covering large open areas such as warehouses and substations.",
    src: assetPath("/media/IVA_FireDetect.mp4"),
    type: "video" as const,
  },
  {
    title: "Intruder Detection",
    kind: "Video Demo",
    body: "Perimeter tripwire and zone-crossing analytics that trigger alerts the moment an unauthorised person breaches a defined boundary — with directional filtering to cut false alarms.",
    src: assetPath("/media/IVA_IntruDetect_blurred.mp4"),
    type: "video" as const,
  },
];

export const PROCESS = [
  "Site survey and system design brief",
  "AutoCAD drawings and BOQ submission",
  "Material procurement advisory",
  "Installation oversight and QA",
  "Testing, commissioning and handover",
  "As-built documentation and O&M manuals",
];

export const STANDARDS = [
  { code: "NFPA 72", name: "National Fire Alarm and Signaling Code" },
  { code: "EN 54 / BS 5839", name: "European / British Fire Detection Standards" },
  { code: "TIA-568 / ISO 11801", name: "Structured Cabling Standards" },
  { code: "IEC 62676", name: "Video Surveillance Systems Standard" },
];

export const ABOUT_POINTS = [
  "Full design-to-deployment capability — no handoffs, no gaps",
  "Experienced in industrial plants, refineries and hospitality developments",
  "AutoCAD-based deliverables with accurate BOQ documentation",
  "Collaborative model — alongside project consultants and main contractors",
  "Trusted by project owners, PMCs, and EPC contractors",
];

export const CLIENT_TYPES = [
  "Industrial Facilities",
  "Hospitality & Hotels",
  "Oil & Gas",
  "Healthcare",
  "Commercial Buildings",
  "Education",
  "Project Owners",
  "Consultants & PMCs",
  "EPC Contractors",
  "Main Contractors",
];

export const PRINCIPLES = [
  {
    title: "Code Compliance First",
    body: "Every design is benchmarked against NFPA, IEC, TIA, and relevant local authority requirements — non-negotiable.",
  },
  {
    title: "Accurate Documentation",
    body: "Precise AutoCAD drawings, verified BOQs, and clean handover packages that consultants and clients can rely on.",
  },
  {
    title: "Collaborative Approach",
    body: "We work alongside your project team — consultants, PMCs and contractors — fitting into your workflow, not disrupting it.",
  },
];

export type Project = {
  id: string;
  sector: string;
  title: string;
  image: string;
  clients: string[];
  tags: string[];
  states: string[];
};

export const PROJECTS: Project[] = [
  {
    id: "industrial",
    sector: "Industrial Sites",
    title: "Manufacturing & Warehouse Surveillance",
    image: assetPath("/proj_industrial.jpg"),
    clients: [
      "Ritex Overseas, Kundli",
      "Becton Dickinson India Pvt. Ltd., Bawal, Haryana",
      "Mittal Electronics (Sujata), Jehangirpuri, Delhi",
    ],
    tags: ["IP CCTV", "IVA"],
    states: ["Delhi", "Haryana"],
  },
  {
    id: "retail",
    sector: "Retail",
    title: "Retail Store & F&B Surveillance",
    image: assetPath("/proj_retail.jpg"),
    clients: ["Aurapastry, Bhopal", "Bhopal Baking Company, Bhopal", "Didymous Trade Links — Retail Stores, Bhopal"],
    tags: ["IP CCTV", "POS Integration"],
    states: ["Madhya Pradesh"],
  },
  {
    id: "hospitality",
    sector: "Hospitality",
    title: "Hotel & Resort Security Systems",
    image: assetPath("/proj_hospitality.jpg"),
    clients: ["Hotel City Park, Pitampura, Delhi", "Jehan Numa Retreat, Bhopal"],
    tags: ["IP CCTV", "Access Control"],
    states: ["Delhi", "Madhya Pradesh"],
  },
  {
    id: "institutional",
    sector: "Commercial & Institutional",
    title: "Warehouses & School Campuses",
    image: assetPath("/proj_institutional.jpg"),
    clients: [
      "Vishal Mega Mart Warehouse, Wazirpur, Haryana",
      "Vishal Mega Mart Warehouse, Pataudi, Haryana",
      "Carmel Convent School, Ratanpur, Bhopal",
      "Carmel Convent School, B.H.E.L., Bhopal",
    ],
    tags: ["IP CCTV", "Campus Safety"],
    states: ["Haryana", "Madhya Pradesh"],
  },
  {
    id: "residential",
    sector: "Residential",
    title: "Apartment Complex Security",
    image: assetPath("/proj_residential.jpg"),
    clients: ["Rajasthali Apartments, Madhuban Chowk, Pitampura, Delhi"],
    tags: ["IP CCTV", "Perimeter", "Parking"],
    states: ["Delhi"],
  },
  {
    id: "worship",
    sector: "Place of Worship",
    title: "Religious Site Surveillance",
    image: assetPath("/proj_worship.jpg"),
    clients: ["Shree Balaji Mandir, Prashant Vihar, Delhi"],
    tags: ["IP CCTV", "Crowd Monitoring"],
    states: ["Delhi"],
  },
];

export const SERVICE_OPTIONS = [
  "CCTV Surveillance",
  "Intelligent Video Analytics",
  "Fire Alarm & PA Systems (FAS / PAGA)",
  "Access Control Systems",
  "Data Networks & WiFi Infrastructure",
  "ELV Design & Consulting",
  "Multiple / Full ELV Package",
];

export const PROJECT_TYPES = [
  "New Build / Greenfield",
  "Retrofit / Upgrade",
  "Design Consulting Only",
  "BOQ & Documentation",
  "Maintenance & Support",
];

export const ENGAGEMENT = [
  "Industrial & Oil/Gas facilities",
  "Hospitality developments",
  "Commercial buildings",
  "Infrastructure projects",
  "EPC & PMC contracts",
  "Consultant-led design packages",
];
