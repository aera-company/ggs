"use client";

import { createContext, useContext, useEffect, useReducer, type Dispatch } from "react";
import { RESET_EVENT } from "@/lib/scenes";
import { buildProposal, EMPTY_RFQ, initialSession, OPS_CHECKS, PARTNERS } from "./data";
import type { Attachment, DemoSession, ExecUpdate, LogEntry, RFQ, ServiceRequest, StageIndex, ViewId } from "./types";

export type Action =
  | { type: "SET_VIEW"; view: ViewId }
  | { type: "SET_CLIENT_TAB"; tab: DemoSession["clientTab"] }
  | { type: "SELECT"; id: string | null }
  | { type: "UPDATE_DRAFT"; patch: Partial<RFQ> }
  | { type: "ADD_ATTACHMENTS"; files: Attachment[] }
  | { type: "REMOVE_ATTACHMENT"; index: number }
  | { type: "SUBMIT"; now: number }
  | { type: "OPS_START_REVIEW"; id: string; now: number }
  | { type: "OPS_TOGGLE_CHECK"; id: string; check: string }
  | { type: "OPS_INVITE"; id: string; partnerIds: string[]; now: number }
  | { type: "PARTNER_QUOTE"; id: string; partnerId: string; index: number; note: string; now: number }
  | { type: "OPS_SELECT_PARTNER"; id: string; partnerId: string }
  | { type: "OPS_SET_MARGIN"; id: string; margin: number }
  | { type: "OPS_PUBLISH"; id: string; now: number }
  | { type: "CLIENT_ACCEPT"; id: string; now: number }
  | { type: "PARTNER_UPDATE"; id: string; kind: ExecUpdate["kind"]; now: number }
  | { type: "OPS_CLOSE"; id: string; now: number }
  | { type: "DEMO_ADVANCE"; id: string; now: number }
  | { type: "REPEAT"; id: string }
  | { type: "SET_PARTNER"; partnerId: string }
  | { type: "TOAST"; message: string | null }
  | { type: "RESET" };

const EXEC_TEXT: Record<ExecUpdate["kind"], string> = {
  mobilized: "Mobilization confirmed",
  "in-progress": "Work in progress",
  completed: "Completion report submitted",
};

function patchReq(s: DemoSession, id: string, fn: (r: ServiceRequest) => ServiceRequest): DemoSession {
  return { ...s, requests: s.requests.map((r) => (r.id === id ? fn(r) : r)) };
}

const log = (r: ServiceRequest, actor: LogEntry["actor"], text: string, at: number): LogEntry[] => [...r.log, { at, actor, text }];

export const allChecksDone = (r: ServiceRequest) => OPS_CHECKS.every((c) => r.ops.checks[c.id]);

export const candidatePartners = (r: ServiceRequest) => {
  const local = PARTNERS.filter((p) => p.region === r.location && p.services.includes(r.service));
  return local.length ? local : PARTNERS.filter((p) => p.region === "Singapore");
};

/** Descreve o próximo passo que o atalho de demonstração executará. */
export function nextStep(r: ServiceRequest): string | null {
  switch (r.stage) {
    case 0:
      return "GAVEA starts scope review";
    case 1:
      return allChecksDone(r) ? "GAVEA invites qualified partners" : "GAVEA completes qualification checklist";
    case 2:
      if (r.ops.quotes.length === 0) return "Partners submit quotes";
      if (!r.ops.selected) return "GAVEA selects a partner";
      return "GAVEA publishes proposal to client";
    case 3:
      return "Client accepts proposal";
    case 4: {
      const last = r.execution[r.execution.length - 1]?.kind;
      if (!last) return "Partner confirms mobilization";
      if (last === "mobilized") return "Partner reports work in progress";
      if (last === "in-progress") return "Partner submits completion report";
      return "GAVEA closes the request";
    }
    default:
      return null;
  }
}

function reducer(s: DemoSession, a: Action): DemoSession {
  switch (a.type) {
    case "SET_VIEW":
      return { ...s, view: a.view };
    case "SET_CLIENT_TAB":
      return { ...s, clientTab: a.tab };
    case "SELECT":
      return { ...s, selectedId: a.id, clientTab: a.id && s.view === "client" ? "detail" : s.clientTab };
    case "UPDATE_DRAFT":
      return { ...s, draft: { ...s.draft, ...a.patch } };
    case "ADD_ATTACHMENTS":
      return { ...s, draftAttachments: [...s.draftAttachments, ...a.files].slice(0, 5) };
    case "REMOVE_ATTACHMENT":
      return { ...s, draftAttachments: s.draftAttachments.filter((_, i) => i !== a.index) };

    case "SUBMIT": {
      const seq = s.seq + 1;
      const id = `DEMO-${String(seq).padStart(4, "0")}`;
      const req: ServiceRequest = {
        ...s.draft,
        id,
        createdAt: a.now,
        origin: "session",
        repeatedFrom: s.draftRepeatedFrom,
        attachments: s.draftAttachments,
        stage: 0,
        ops: { checks: {}, invited: [], quotes: [], margin: 12 },
        execution: [],
        closeout: [],
        log: [
          {
            at: a.now,
            actor: "Client",
            text: s.draftRepeatedFrom ? `Request submitted (repeated from ${s.draftRepeatedFrom})` : "Request submitted",
          },
        ],
      };
      return {
        ...s,
        seq,
        requests: [req, ...s.requests],
        selectedId: id,
        clientTab: "detail",
        draft: { ...EMPTY_RFQ },
        draftAttachments: [],
        draftRepeatedFrom: undefined,
        toast: `${id} created. Stored only in this browser tab.`,
      };
    }

    case "OPS_START_REVIEW":
      return patchReq(s, a.id, (r) =>
        r.stage === 0 ? { ...r, stage: 1, log: log(r, "GAVEA", "Scope review started", a.now) } : r,
      );
    case "OPS_TOGGLE_CHECK":
      return patchReq(s, a.id, (r) => ({ ...r, ops: { ...r.ops, checks: { ...r.ops.checks, [a.check]: !r.ops.checks[a.check] } } }));
    case "OPS_INVITE":
      return patchReq(s, a.id, (r) =>
        r.stage === 1 && allChecksDone(r)
          ? {
              ...r,
              stage: 2,
              ops: { ...r.ops, invited: a.partnerIds },
              log: log(r, "GAVEA", `Partner sourcing started (${a.partnerIds.length} invited)`, a.now),
            }
          : r,
      );
    case "PARTNER_QUOTE":
      return patchReq(s, a.id, (r) => {
        if (r.stage !== 2 || !r.ops.invited.includes(a.partnerId)) return r;
        const quotes = [...r.ops.quotes.filter((q) => q.partnerId !== a.partnerId), { partnerId: a.partnerId, index: a.index, note: a.note }];
        return { ...r, ops: { ...r.ops, quotes }, log: log(r, "Partner", "Quote received", a.now) };
      });
    case "OPS_SELECT_PARTNER":
      return patchReq(s, a.id, (r) => ({ ...r, ops: { ...r.ops, selected: a.partnerId } }));
    case "OPS_SET_MARGIN":
      return patchReq(s, a.id, (r) => ({ ...r, ops: { ...r.ops, margin: a.margin } }));
    case "OPS_PUBLISH":
      return patchReq(s, a.id, (r) =>
        r.stage === 2 && r.ops.selected
          ? {
              ...r,
              stage: 3,
              proposal: { ...buildProposal(r, r.id), published: true },
              log: log(r, "GAVEA", "Proposal published to client", a.now),
            }
          : r,
      );
    case "CLIENT_ACCEPT":
      return patchReq(s, a.id, (r) =>
        r.stage === 3 && r.proposal
          ? { ...r, stage: 4, proposal: { ...r.proposal, accepted: true }, log: log(r, "Client", "Proposal accepted (demo)", a.now) }
          : r,
      );
    case "PARTNER_UPDATE":
      return patchReq(s, a.id, (r) =>
        r.stage === 4 && !r.execution.some((e) => e.kind === a.kind)
          ? {
              ...r,
              execution: [...r.execution, { at: a.now, kind: a.kind, text: EXEC_TEXT[a.kind] }],
              log: log(r, "Partner", EXEC_TEXT[a.kind], a.now),
            }
          : r,
      );
    case "OPS_CLOSE":
      return patchReq(s, a.id, (r) =>
        r.stage === 4 && r.execution.some((e) => e.kind === "completed")
          ? {
              ...r,
              stage: 5 as StageIndex,
              closeout: ["Completion report (demo)", "Waste handling record (demo)", "Service acceptance (demo)"],
              log: log(r, "GAVEA", "Request closed, close-out documents shared", a.now),
            }
          : r,
      );

    case "DEMO_ADVANCE": {
      const r = s.requests.find((x) => x.id === a.id);
      if (!r) return s;
      const now = a.now;
      switch (r.stage) {
        case 0:
          return reducer(s, { type: "OPS_START_REVIEW", id: r.id, now });
        case 1: {
          if (!allChecksDone(r)) {
            return patchReq(s, r.id, (x) => ({
              ...x,
              ops: { ...x.ops, checks: Object.fromEntries(OPS_CHECKS.map((c) => [c.id, true])) },
              log: log(x, "GAVEA", "Qualification checklist completed", now),
            }));
          }
          const ids = candidatePartners(r)
            .slice(0, 2)
            .map((p) => p.id);
          return reducer(s, { type: "OPS_INVITE", id: r.id, partnerIds: ids, now });
        }
        case 2: {
          if (r.ops.quotes.length === 0) {
            let next = s;
            r.ops.invited.forEach((pid, i) => {
              next = reducer(next, { type: "PARTNER_QUOTE", id: r.id, partnerId: pid, index: 100 + i * 9, note: "Demo quote", now });
            });
            return next;
          }
          if (!r.ops.selected) {
            const best = [...r.ops.quotes].sort((x, y) => x.index - y.index)[0];
            return reducer(s, { type: "OPS_SELECT_PARTNER", id: r.id, partnerId: best.partnerId });
          }
          return reducer(s, { type: "OPS_PUBLISH", id: r.id, now });
        }
        case 3:
          return reducer(s, { type: "CLIENT_ACCEPT", id: r.id, now });
        case 4: {
          const last = r.execution[r.execution.length - 1]?.kind;
          if (!last) return reducer(s, { type: "PARTNER_UPDATE", id: r.id, kind: "mobilized", now });
          if (last === "mobilized") return reducer(s, { type: "PARTNER_UPDATE", id: r.id, kind: "in-progress", now });
          if (last === "in-progress") return reducer(s, { type: "PARTNER_UPDATE", id: r.id, kind: "completed", now });
          return reducer(s, { type: "OPS_CLOSE", id: r.id, now });
        }
        default:
          return s;
      }
    }

    case "REPEAT": {
      const r = s.requests.find((x) => x.id === a.id);
      if (!r) return s;
      const { service, location, vessel, vesselType, tankType, tankCount, cargoHistory, notes } = r;
      return {
        ...s,
        view: "client",
        clientTab: "new",
        draft: { service, location, vessel, vesselType, tankType, tankCount, cargoHistory, notes, windowStart: "", windowEnd: "" },
        draftAttachments: [],
        draftRepeatedFrom: r.id,
        toast: `Fields copied from ${r.id}. Set a new operational window.`,
      };
    }
    case "SET_PARTNER":
      return { ...s, partnerId: a.partnerId };
    case "TOAST":
      return { ...s, toast: a.message };
    case "RESET":
      return initialSession();
  }
}

const Ctx = createContext<{ state: DemoSession; dispatch: Dispatch<Action> } | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialSession);

  useEffect(() => {
    const onReset = () => dispatch({ type: "RESET" });
    window.addEventListener(RESET_EVENT, onReset);
    return () => window.removeEventListener(RESET_EVENT, onReset);
  }, []);

  useEffect(() => {
    if (!state.toast) return;
    const t = window.setTimeout(() => dispatch({ type: "TOAST", message: null }), 4200);
    return () => window.clearTimeout(t);
  }, [state.toast]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo fora do DemoProvider");
  return v;
}

export const selectedRequest = (s: DemoSession) => s.requests.find((r) => r.id === s.selectedId) ?? null;
