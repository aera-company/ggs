"use client";

import { useState } from "react";
import { PARTNERS, partnerById, serviceLabel } from "./data";
import { useDemo } from "./store";
import type { ExecUpdate, ServiceRequest } from "./types";
import { Badge, Btn, cx, Empty, Icon, KV, Panel } from "./ui";

const EXEC_ORDER: { kind: ExecUpdate["kind"]; label: string }[] = [
  { kind: "mobilized", label: "Confirm mobilization" },
  { kind: "in-progress", label: "Report work in progress" },
  { kind: "completed", label: "Submit completion report" },
];

function Invitation({ r, partnerId }: { r: ServiceRequest; partnerId: string }) {
  const { dispatch } = useDemo();
  const [index, setIndex] = useState("100");
  const [note, setNote] = useState("");
  const n = Number(index);
  const valid = Number.isFinite(n) && n >= 50 && n <= 200;
  const quoted = r.ops.quotes.find((q) => q.partnerId === partnerId);

  return (
    <li className="grid gap-3 rounded-[12px] border border-[var(--ui-line)] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] font-semibold text-[var(--ui-ink)]">
          {serviceLabel(r.service)} · {r.location}
        </p>
        <span className="font-mono text-[11.5px] text-[var(--ui-muted)]">{r.id}-RFQ</span>
      </div>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KV k="Tanks" v={`${r.tankCount} · ${r.tankType}`} />
        <KV k="Window" v={`${r.windowStart} → ${r.windowEnd}`} />
        <KV k="Vessel type" v={r.vesselType} />
        <KV k="Cargo history" v={r.cargoHistory} />
      </dl>
      <p className="rounded-[10px] bg-[#f6f8fa] px-3 py-2 text-[12px] text-[var(--ui-muted)]">
        Requested by <strong className="font-semibold text-[var(--ui-ink)]">GAVEA Global Services</strong>. End-client commercial details are shared only after contract.
      </p>
      {quoted ? (
        <div className="flex items-center gap-2 text-[13px] text-[var(--ui-ok)]">
          {Icon.check} Quote submitted · {quoted.index} idx
        </div>
      ) : (
        <form
          className="grid gap-3 sm:grid-cols-[140px_1fr_auto] sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (valid) dispatch({ type: "PARTNER_QUOTE", id: r.id, partnerId, index: Math.round(n), note, now: Date.now() });
          }}
        >
          <div>
            <label htmlFor={`q-${r.id}`} className="mb-1.5 block text-[12.5px] font-medium">
              Quote (index)
            </label>
            <input
              id={`q-${r.id}`}
              inputMode="numeric"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
              aria-invalid={!valid}
              aria-describedby={`qh-${r.id}`}
              className={cx("w-full rounded-[10px] border px-3 py-2.5 text-[14px] outline-none focus:border-[var(--ui-accent)]", valid ? "border-[var(--ui-line)]" : "border-[var(--ui-danger)]")}
            />
          </div>
          <div>
            <label htmlFor={`qn-${r.id}`} className="mb-1.5 block text-[12.5px] font-medium">
              Note
            </label>
            <input id={`qn-${r.id}`} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Assumptions, availability" className="w-full rounded-[10px] border border-[var(--ui-line)] px-3 py-2.5 text-[14px] outline-none focus:border-[var(--ui-accent)]" />
          </div>
          <Btn type="submit" variant="primary" disabled={!valid}>
            Submit quote (demo)
          </Btn>
          <p id={`qh-${r.id}`} className="text-[11.5px] text-[var(--ui-muted)] sm:col-span-3">
            Demonstration index between 50 and 200 (base 100). Not a price.
          </p>
        </form>
      )}
    </li>
  );
}

function Job({ r, partnerId }: { r: ServiceRequest; partnerId: string }) {
  const { dispatch } = useDemo();
  const done = new Set(r.execution.map((e) => e.kind));
  const next = EXEC_ORDER.find((e) => !done.has(e.kind));
  return (
    <li className="grid gap-3 rounded-[12px] border border-[var(--ui-line)] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[14px] font-semibold text-[var(--ui-ink)]">
          {serviceLabel(r.service)} · {r.location} · {r.vessel}
        </p>
        <Badge tone={r.stage === 5 ? "ok" : r.stage === 4 ? "accent" : "warn"}>{r.stage === 5 ? "Closed" : r.stage === 4 ? "Contracted" : "Awaiting client decision"}</Badge>
      </div>
      <ol className="grid gap-2 sm:grid-cols-3">
        {EXEC_ORDER.map((e) => (
          <li key={e.kind} className={cx("flex items-center gap-2 rounded-[10px] border px-3 py-2 text-[12.5px]", done.has(e.kind) ? "border-[var(--ui-ok)]/30 bg-[var(--ui-ok-soft)] text-[var(--ui-ok)]" : "border-[var(--ui-line)] text-[var(--ui-muted)]")}>
            {done.has(e.kind) ? Icon.check : <span className="size-3 rounded-full border border-current" aria-hidden="true" />}
            {e.label.replace("Confirm ", "").replace("Report ", "").replace("Submit ", "")}
          </li>
        ))}
      </ol>
      {r.stage === 4 && next && (
        <div className="flex justify-end">
          <Btn variant="primary" size="sm" onClick={() => dispatch({ type: "PARTNER_UPDATE", id: r.id, kind: next.kind, now: Date.now() })}>
            {next.label}
          </Btn>
        </div>
      )}
      {r.stage === 3 && <p className="text-[12px] text-[var(--ui-muted)]">GAVEA selected your quote. Execution starts after the client accepts the proposal.</p>}
      {partnerId && r.stage === 4 && !next && <p className="text-[12px] text-[var(--ui-muted)]">Completion submitted. GAVEA will close the request.</p>}
    </li>
  );
}

export function PartnerView() {
  const { state, dispatch } = useDemo();
  const partner = partnerById(state.partnerId)!;
  const invites = state.requests.filter((r) => r.stage === 2 && r.ops.invited.includes(partner.id));
  const jobs = state.requests.filter((r) => r.ops.selected === partner.id && r.stage >= 3 && r.origin === "session");

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--ui-ink)]">Partner workspace</h3>
          <p className="mt-1 text-[13.5px] text-[var(--ui-muted)]">Invitations from GAVEA, qualification documents and execution updates.</p>
        </div>
        <label className="flex items-center gap-2 text-[12.5px]">
          <span className="text-[var(--ui-muted)]">Acting as</span>
          <select
            value={state.partnerId}
            onChange={(e) => dispatch({ type: "SET_PARTNER", partnerId: e.target.value })}
            className="rounded-[10px] border border-[var(--ui-line)] bg-white px-3 py-2 text-[13px] font-medium outline-none focus:border-[var(--ui-accent)]"
          >
            {PARTNERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.region} (illustrative)
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="grid content-start gap-4">
          <section data-tour="invitations" className="rounded-[14px]">
            <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--ui-muted)]">Invitations to quote</h4>
            {invites.length === 0 ? (
              <Empty title="No open invitations">Invitations appear when GAVEA starts partner sourcing for a request in your region.</Empty>
            ) : (
              <ul className="grid gap-3">
                {invites.map((r) => (
                  <Invitation key={r.id} r={r} partnerId={partner.id} />
                ))}
              </ul>
            )}
          </section>
          <section data-tour="awarded" className="rounded-[14px]">
            <h4 className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--ui-muted)]">Awarded work</h4>
            {jobs.length === 0 ? (
              <Empty title="No awarded work in this session" />
            ) : (
              <ul className="grid gap-3">
                {jobs.map((r) => (
                  <Job key={r.id} r={r} partnerId={partner.id} />
                ))}
              </ul>
            )}
          </section>
        </div>

        <Panel title="Qualification" aside={<Badge>Illustrative</Badge>}>
          <ul className="grid gap-2">
            {partner.qualification.map((q) => (
              <li key={q.doc} className="flex items-center justify-between gap-3 text-[13px]">
                <span className="flex items-center gap-2">
                  <span className="text-[var(--ui-muted)]">{Icon.doc}</span>
                  {q.doc}
                </span>
                <Badge tone={q.status === "verified" ? "ok" : q.status === "pending" ? "warn" : "danger"}>{q.status}</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-[var(--ui-line)] pt-3 text-[11.5px] text-[var(--ui-muted)]">
            Real qualification criteria (legal, HSE, insurance) would be defined by GAVEA before any pilot.
          </p>
        </Panel>
      </div>
    </div>
  );
}
