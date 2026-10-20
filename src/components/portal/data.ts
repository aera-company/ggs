// Dados demonstrativos. Nada aqui representa clientes, parceiros, embarcações,
// preços ou cobertura reais. Nomes são deliberadamente genéricos.
import type { DemoSession, Partner, RFQ, ServiceRequest, ServiceType } from "./types";

export const SERVICES: { id: ServiceType; label: string; desc: string; available: boolean }[] = [
  { id: "tank-cleaning", label: "Tank Cleaning", desc: "Cargo, slop, ballast or fuel tanks", available: true },
  { id: "hull-cleaning", label: "Hull Cleaning", desc: "Concept only", available: false },
  { id: "underwater", label: "Underwater Services", desc: "Concept only", available: false },
  { id: "logistics", label: "Logistics Support", desc: "Concept only", available: false },
];

export const LOCATIONS = ["Singapore", "Rotterdam", "Houston", "Fujairah", "Other (describe in notes)"];

export const VESSEL_TYPES = ["Oil tanker", "Chemical tanker", "Product tanker", "Bulk carrier", "Offshore support vessel", "Other"];

export const TANK_TYPES = ["Cargo tanks", "Slop tanks", "Ballast tanks", "Fuel oil tanks"];

export const CLIENT_NAME = "Example Shipping Co.";

export const PARTNERS: Partner[] = [
  {
    id: "sg-1",
    name: "Partner SG-1",
    region: "Singapore",
    services: ["tank-cleaning"],
    qualification: [
      { doc: "Company registration", status: "verified" },
      { doc: "HSE management system", status: "verified" },
      { doc: "Insurance certificate", status: "verified" },
      { doc: "Confined space work procedure", status: "pending" },
    ],
  },
  {
    id: "sg-2",
    name: "Partner SG-2",
    region: "Singapore",
    services: ["tank-cleaning"],
    qualification: [
      { doc: "Company registration", status: "verified" },
      { doc: "HSE management system", status: "pending" },
      { doc: "Insurance certificate", status: "verified" },
      { doc: "Confined space work procedure", status: "verified" },
    ],
  },
  {
    id: "sg-3",
    name: "Partner SG-3",
    region: "Singapore",
    services: ["tank-cleaning"],
    qualification: [
      { doc: "Company registration", status: "verified" },
      { doc: "HSE management system", status: "verified" },
      { doc: "Insurance certificate", status: "expired" },
      { doc: "Confined space work procedure", status: "verified" },
    ],
  },
  {
    id: "nl-1",
    name: "Partner NL-1",
    region: "Rotterdam",
    services: ["tank-cleaning"],
    qualification: [
      { doc: "Company registration", status: "verified" },
      { doc: "HSE management system", status: "verified" },
      { doc: "Insurance certificate", status: "verified" },
      { doc: "Confined space work procedure", status: "verified" },
    ],
  },
];

export const OPS_CHECKS: { id: string; label: string }[] = [
  { id: "scope", label: "Scope and tank data complete" },
  { id: "docs", label: "Supporting documents reviewed" },
  { id: "hse", label: "HSE and permit requirements identified" },
  { id: "legal", label: "Contract, insurance and jurisdiction flagged to legal" },
  { id: "feasibility", label: "Service and region feasibility confirmed" },
];

export const EMPTY_RFQ: RFQ = {
  service: "tank-cleaning",
  location: "Singapore",
  vessel: "",
  vesselType: "",
  windowStart: "",
  windowEnd: "",
  tankType: "",
  tankCount: "",
  cargoHistory: "",
  notes: "",
};

/** Exemplo usado pelo tour e pelo botão "Fill with example" (dados fictícios). */
export const EXAMPLE_RFQ: RFQ = {
  service: "tank-cleaning",
  location: "Singapore",
  vessel: "MT Example Star",
  vesselType: "Product tanker",
  windowStart: "2026-11-12",
  windowEnd: "2026-11-15",
  tankType: "Cargo tanks",
  tankCount: "4",
  cargoHistory: "Clean petroleum products (example)",
  notes: "Tank plan attached. Pre-loading inspection standard expected.",
};

export const EXAMPLE_ATTACHMENT = { name: "tank-plan-example.pdf", size: 482_000, type: "application/pdf" };

export function buildProposal(r: Pick<RFQ, "tankCount" | "tankType" | "vessel" | "location">, id: string) {
  const n = r.tankCount ? `${r.tankCount} ` : "";
  return {
    ref: `${id}-P`,
    published: false,
    accepted: false,
    scope: [
      `Tank cleaning of ${n}${r.tankType ? r.tankType.toLowerCase() : "tanks"} on ${r.vessel || "the vessel"}, ${r.location}.`,
      "GAVEA as single commercial counterparty and coordinator.",
      "Execution by a qualified local partner under contract.",
      "Progress updates and close-out documentation in the portal.",
    ],
    assumptions: [
      "Final scope subject to technical review with the vessel operator.",
      "Site access, permits and conditions to be confirmed before mobilization.",
      "Commercial terms, schedule and responsibilities defined in the formal proposal and contract.",
      "Values intentionally omitted in this demonstration.",
    ],
  };
}

const D = (iso: string) => Date.parse(iso);

function closedSeed(
  id: string,
  rfq: Partial<RFQ>,
  created: string,
  partnerId: string,
): ServiceRequest {
  const base: RFQ = { ...EMPTY_RFQ, ...rfq };
  const t0 = D(created);
  const proposal = { ...buildProposal(base, id), published: true, accepted: true };
  return {
    ...base,
    id,
    createdAt: t0,
    origin: "seed",
    attachments: [{ name: "tank-plan-example.pdf", size: 482_000, type: "application/pdf" }],
    stage: 5,
    ops: {
      checks: Object.fromEntries(OPS_CHECKS.map((c) => [c.id, true])),
      invited: [partnerId],
      quotes: [{ partnerId, index: 100, note: "Demo quote" }],
      selected: partnerId,
      margin: 12,
    },
    proposal,
    execution: [
      { at: t0 + 6 * 864e5, kind: "mobilized", text: "Mobilization confirmed" },
      { at: t0 + 7 * 864e5, kind: "in-progress", text: "Work in progress" },
      { at: t0 + 8 * 864e5, kind: "completed", text: "Completion report submitted" },
    ],
    closeout: ["Completion report (demo)", "Waste handling record (demo)", "Service acceptance (demo)"],
    log: [
      { at: t0, actor: "Client", text: "Request submitted" },
      { at: t0 + 864e5, actor: "GAVEA", text: "Scope reviewed" },
      { at: t0 + 2 * 864e5, actor: "GAVEA", text: "Proposal published" },
      { at: t0 + 3 * 864e5, actor: "Client", text: "Proposal accepted" },
      { at: t0 + 9 * 864e5, actor: "GAVEA", text: "Request closed" },
    ],
  };
}

export const SEED_REQUESTS: ServiceRequest[] = [
  closedSeed(
    "DEMO-0098",
    {
      location: "Rotterdam",
      vessel: "MT Example Meridian",
      vesselType: "Chemical tanker",
      windowStart: "2026-07-14",
      windowEnd: "2026-07-18",
      tankType: "Cargo tanks",
      tankCount: "6",
      cargoHistory: "Vegetable oils (example)",
      notes: "Pre-loading inspection standard expected.",
    },
    "2026-07-02T09:00:00Z",
    "nl-1",
  ),
  closedSeed(
    "DEMO-0097",
    {
      location: "Singapore",
      vessel: "MT Example Horizon",
      vesselType: "Product tanker",
      windowStart: "2026-05-20",
      windowEnd: "2026-05-23",
      tankType: "Slop tanks",
      tankCount: "2",
      cargoHistory: "Clean petroleum products (example)",
      notes: "",
    },
    "2026-05-08T03:00:00Z",
    "sg-1",
  ),
];

export function initialSession(): DemoSession {
  return {
    view: "client",
    requests: SEED_REQUESTS,
    selectedId: null,
    clientTab: "new",
    draft: { ...EMPTY_RFQ },
    draftAttachments: [],
    partnerId: "sg-1",
    seq: 100,
    toast: null,
    tour: { mode: "intro", step: 0 },
  };
}

export const fmtDate = (t: number) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(t);

export const fmtDateTime = (t: number) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(t) + " UTC";

export const fmtSize = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`);

export const serviceLabel = (s: ServiceType) => SERVICES.find((x) => x.id === s)?.label ?? s;
export const partnerById = (id?: string) => PARTNERS.find((p) => p.id === id);
