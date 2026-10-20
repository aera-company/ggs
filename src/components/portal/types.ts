// Modelo de dados do protótipo. Tudo vive em memória, na aba do navegador.

export type ViewId = "client" | "ops" | "partner";

export type ServiceType = "tank-cleaning" | "hull-cleaning" | "underwater" | "logistics";

export const STAGES = [
  "Received",
  "Scope review",
  "Partner sourcing",
  "Proposal ready",
  "Execution planning",
  "Closed",
] as const;
export type StageIndex = 0 | 1 | 2 | 3 | 4 | 5;

export interface Attachment {
  name: string;
  size: number;
  type: string;
}

/** Campos que o cliente preenche (também usados para "Repeat request"). */
export interface RFQ {
  service: ServiceType;
  location: string;
  vessel: string;
  vesselType: string;
  windowStart: string;
  windowEnd: string;
  tankType: string;
  tankCount: string;
  cargoHistory: string;
  notes: string;
}

export interface LogEntry {
  at: number;
  actor: "Client" | "GAVEA" | "Partner" | "Demo";
  text: string;
}

export interface Partner {
  id: string;
  name: string;
  region: string;
  services: ServiceType[];
  qualification: { doc: string; status: "verified" | "pending" | "expired" }[];
}

export interface PartnerQuote {
  partnerId: string;
  /** valor em índice demonstrativo (base 100), nunca moeda */
  index: number;
  note: string;
}

export interface Proposal {
  ref: string;
  published: boolean;
  accepted: boolean;
  scope: string[];
  assumptions: string[];
}

export interface OpsState {
  checks: Record<string, boolean>;
  invited: string[];
  quotes: PartnerQuote[];
  selected?: string;
  margin: number;
}

export interface ExecUpdate {
  at: number;
  kind: "mobilized" | "in-progress" | "completed";
  text: string;
}

export interface ServiceRequest extends RFQ {
  id: string;
  createdAt: number;
  origin: "seed" | "session";
  repeatedFrom?: string;
  attachments: Attachment[];
  stage: StageIndex;
  ops: OpsState;
  proposal?: Proposal;
  execution: ExecUpdate[];
  closeout: string[];
  log: LogEntry[];
}

export type ServiceTimeline = { stage: StageIndex; label: (typeof STAGES)[number]; done: boolean; current: boolean }[];

export interface DemoSession {
  view: ViewId;
  requests: ServiceRequest[];
  selectedId: string | null;
  clientTab: "new" | "requests" | "detail";
  draft: RFQ;
  draftAttachments: Attachment[];
  draftRepeatedFrom?: string;
  partnerId: string;
  seq: number;
  toast: string | null;
}
