"use client";

import { useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CLIENT_NAME, fmtDate, fmtDateTime, fmtSize, LOCATIONS, SERVICES, serviceLabel, TANK_TYPES, VESSEL_TYPES } from "./data";
import { selectedRequest, useDemo } from "./store";
import type { RFQ, ServiceRequest } from "./types";
import { Badge, Btn, cx, Empty, Icon, KV, Panel, StageBadge, Timeline } from "./ui";

type Errors = Partial<Record<keyof RFQ, string>>;

function validate(d: RFQ): Errors {
  const e: Errors = {};
  if (!SERVICES.find((s) => s.id === d.service)?.available) e.service = "This service is not available in the demo.";
  if (!d.location) e.location = "Select a location.";
  if (!d.vessel.trim()) e.vessel = "Enter the vessel or asset name.";
  if (!d.vesselType) e.vesselType = "Select a vessel type.";
  if (!d.windowStart) e.windowStart = "Select a start date.";
  if (!d.windowEnd) e.windowEnd = "Select an end date.";
  else if (d.windowStart && d.windowEnd < d.windowStart) e.windowEnd = "End date must be after the start date.";
  if (!d.tankType) e.tankType = "Select a tank type.";
  const n = Number(d.tankCount);
  if (!d.tankCount || !Number.isInteger(n) || n < 1 || n > 99) e.tankCount = "Enter a number between 1 and 99.";
  return e;
}

const inputCls = (err?: string) =>
  cx(
    "w-full rounded-[10px] border bg-white px-3 py-2.5 text-[14px] text-[var(--ui-ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[#9aa5b1]",
    "focus:border-[var(--ui-accent)] focus:shadow-[0_0_0_3px_rgba(0,107,144,0.14)]",
    err ? "border-[var(--ui-danger)]" : "border-[var(--ui-line)]",
  );

function Field({
  label,
  name,
  error,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: (p: { id: string; "aria-invalid"?: boolean; "aria-describedby"?: string }) => React.ReactNode;
  className?: string;
}) {
  const uid = useId();
  const id = `${name}-${uid}`;
  const descId = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1 text-[12.5px] font-medium text-[var(--ui-ink)]">
        {label}
        {required && (
          <span className="text-[var(--ui-muted)]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": descId })}
      {error ? (
        <p id={descId} className="mt-1.5 text-[12px] text-[var(--ui-danger)]">
          {error}
        </p>
      ) : hint ? (
        <p id={descId} className="mt-1.5 text-[12px] text-[var(--ui-muted)]">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function NewRequest() {
  const { state, dispatch } = useDemo();
  const d = state.draft;
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<RFQ>) => {
    dispatch({ type: "UPDATE_DRAFT", patch });
    const k = Object.keys(patch)[0] as keyof RFQ;
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const on = (k: keyof RFQ) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => set({ [k]: e.target.value } as Partial<RFQ>);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate(d);
    setErrors(errs);
    if (Object.keys(errs).length) {
      requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setBusy(true);
    window.setTimeout(() => {
      dispatch({ type: "SUBMIT", now: Date.now() });
      setBusy(false);
    }, 650);
  };

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).map((f) => ({ name: f.name, size: f.size, type: f.type }));
    if (files.length) dispatch({ type: "ADD_ATTACHMENTS", files });
    e.target.value = "";
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--ui-ink)]">New service request</h3>
          <p className="mt-1 text-[13.5px] text-[var(--ui-muted)]">Describe the need once. GAVEA structures scope, sources partners and returns a proposal.</p>
        </div>
        {state.draftRepeatedFrom && (
          <Badge tone="accent">
            {Icon.repeat} Repeated from {state.draftRepeatedFrom}
          </Badge>
        )}
      </div>

      {/* serviço */}
      <fieldset>
        <legend className="mb-2 text-[12.5px] font-medium text-[var(--ui-ink)]">Service</legend>
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {SERVICES.map((s) => {
            const active = d.service === s.id;
            return (
              <label
                key={s.id}
                className={cx(
                  "relative flex cursor-pointer flex-col gap-1 rounded-[12px] border p-3 transition-[border-color,box-shadow,background]",
                  active ? "border-[var(--ui-accent)] bg-[var(--ui-accent-soft)]/50 shadow-[0_0_0_3px_rgba(0,107,144,0.1)]" : "border-[var(--ui-line)] bg-white hover:border-[#c8d1d9]",
                  !s.available && "cursor-not-allowed opacity-55",
                )}
              >
                <input
                  type="radio"
                  name="service"
                  value={s.id}
                  checked={active}
                  disabled={!s.available}
                  onChange={() => set({ service: s.id })}
                  className="sr-only"
                />
                <span className="text-[13.5px] font-semibold text-[var(--ui-ink)]">{s.label}</span>
                <span className="text-[11.5px] text-[var(--ui-muted)]">{s.desc}</span>
                {active && <span className="absolute right-3 top-3 text-[var(--ui-accent)]">{Icon.check}</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Location" name="location" required error={errors.location} hint="Availability subject to service and region validation.">
          {(p) => (
            <select {...p} value={d.location} onChange={on("location")} className={inputCls(errors.location)}>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Vessel / asset" name="vessel" required error={errors.vessel}>
          {(p) => <input {...p} value={d.vessel} onChange={on("vessel")} placeholder="e.g. MT Example Star" autoComplete="off" className={inputCls(errors.vessel)} />}
        </Field>
        <Field label="Vessel type" name="vesselType" required error={errors.vesselType}>
          {(p) => (
            <select {...p} value={d.vesselType} onChange={on("vesselType")} className={inputCls(errors.vesselType)}>
              <option value="">Select…</option>
              {VESSEL_TYPES.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          )}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Window start" name="windowStart" required error={errors.windowStart}>
            {(p) => <input {...p} type="date" value={d.windowStart} onChange={on("windowStart")} className={inputCls(errors.windowStart)} />}
          </Field>
          <Field label="Window end" name="windowEnd" required error={errors.windowEnd}>
            {(p) => <input {...p} type="date" value={d.windowEnd} min={d.windowStart || undefined} onChange={on("windowEnd")} className={inputCls(errors.windowEnd)} />}
          </Field>
        </div>
        <div className="grid grid-cols-[1fr_110px] gap-3">
          <Field label="Tank type" name="tankType" required error={errors.tankType}>
            {(p) => (
              <select {...p} value={d.tankType} onChange={on("tankType")} className={inputCls(errors.tankType)}>
                <option value="">Select…</option>
                {TANK_TYPES.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            )}
          </Field>
          <Field label="Tanks" name="tankCount" required error={errors.tankCount}>
            {(p) => <input {...p} inputMode="numeric" value={d.tankCount} onChange={on("tankCount")} placeholder="0" className={inputCls(errors.tankCount)} />}
          </Field>
        </div>
        <Field label="Cargo history" name="cargoHistory" hint="Last cargoes, as informed by the operator.">
          {(p) => <input {...p} value={d.cargoHistory} onChange={on("cargoHistory")} placeholder="e.g. last three cargoes" className={inputCls()} />}
        </Field>
        <Field label="Scope notes" name="notes" className="md:col-span-2">
          {(p) => (
            <textarea {...p} rows={3} value={d.notes} onChange={on("notes")} placeholder="Anything the team should know: access, constraints, expected standard." className={cx(inputCls(), "resize-y")} />
          )}
        </Field>
      </div>

      {/* anexo local */}
      <div>
        <p className="mb-2 text-[12.5px] font-medium text-[var(--ui-ink)]">Documents</p>
        <div className="flex flex-wrap items-center gap-3 rounded-[12px] border border-dashed border-[#c9d2da] bg-[#fafbfc] p-3">
          <input ref={fileRef} id="rfq-files" type="file" multiple onChange={onFiles} className="sr-only" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx" />
          <Btn size="sm" onClick={() => fileRef.current?.click()}>
            {Icon.clip} Attach document
          </Btn>
          <p className="text-[12px] text-[var(--ui-muted)]">Demo: files stay on this device. Nothing is uploaded.</p>
          {state.draftAttachments.length > 0 && (
            <ul className="flex w-full flex-wrap gap-2">
              {state.draftAttachments.map((f, i) => (
                <li key={`${f.name}-${i}`} className="flex items-center gap-2 rounded-[8px] border border-[var(--ui-line)] bg-white py-1 pl-2.5 pr-1 text-[12.5px]">
                  <span className="text-[var(--ui-muted)]">{Icon.doc}</span>
                  <span className="max-w-[220px] truncate">{f.name}</span>
                  <span className="font-mono text-[11px] text-[var(--ui-muted)]">{fmtSize(f.size)}</span>
                  <button type="button" onClick={() => dispatch({ type: "REMOVE_ATTACHMENT", index: i })} className="grid size-6 place-items-center rounded-md text-[var(--ui-muted)] hover:bg-[#f0f3f5]" aria-label={`Remove ${f.name}`}>
                    {Icon.x}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ui-line)] pt-4">
        <p className="text-[12px] text-[var(--ui-muted)]">
          {Object.keys(errors).some((k) => errors[k as keyof RFQ]) ? (
            <span className="text-[var(--ui-danger)]" role="alert">
              Please review the highlighted fields.
            </span>
          ) : (
            "Required fields are marked with *."
          )}
        </p>
        <Btn type="submit" variant="primary" disabled={busy} aria-busy={busy}>
          {busy ? (
            <>
              <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" /> Creating demo request…
            </>
          ) : (
            <>
              Submit demo request {Icon.arrow}
            </>
          )}
        </Btn>
      </div>
    </form>
  );
}

function RequestList() {
  const { state, dispatch } = useDemo();
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--ui-ink)]">My requests</h3>
          <p className="mt-1 text-[13.5px] text-[var(--ui-muted)]">History, status and documents. Repeat a previous request in one step.</p>
        </div>
        <Btn size="sm" variant="primary" onClick={() => dispatch({ type: "SET_CLIENT_TAB", tab: "new" })}>
          {Icon.plus} New request
        </Btn>
      </div>
      <ul className="grid gap-2">
        {state.requests.map((r) => (
          <li key={r.id} className="grid gap-3 rounded-[12px] border border-[var(--ui-line)] bg-white p-3.5 sm:grid-cols-[1fr_auto] sm:items-center">
            <button type="button" onClick={() => dispatch({ type: "SELECT", id: r.id })} className="grid gap-2 text-left">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-medium text-[var(--ui-ink)]">{r.id}</span>
                <StageBadge stage={r.stage} />
                {r.origin === "session" && <Badge tone="neutral">New</Badge>}
              </div>
              <p className="text-[14px] font-medium text-[var(--ui-ink)]">
                {serviceLabel(r.service)} · {r.location}
              </p>
              <p className="text-[12.5px] text-[var(--ui-muted)]">
                {r.vessel} · {r.tankCount} {r.tankType.toLowerCase()} · created {fmtDate(r.createdAt)}
              </p>
              <div className="w-full max-w-[280px]">
                <Timeline req={r} compact />
              </div>
            </button>
            <div className="flex gap-2">
              <Btn size="sm" onClick={() => dispatch({ type: "SELECT", id: r.id })}>
                Open
              </Btn>
              <Btn size="sm" variant="ghost" onClick={() => dispatch({ type: "REPEAT", id: r.id })}>
                {Icon.repeat} Repeat
              </Btn>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProposalCard({ req }: { req: ServiceRequest }) {
  const { dispatch } = useDemo();
  const p = req.proposal;
  if (!p || !p.published) {
    return (
      <Panel title="Proposal">
        <p className="text-[13px] text-[var(--ui-muted)]">
          The proposal appears here when GAVEA publishes it. Internal sourcing and partner terms are never shown in this view.
        </p>
      </Panel>
    );
  }
  return (
    <Panel
      title={
        <span className="flex items-center gap-2">
          Proposal <span className="font-mono text-[11.5px] font-normal text-[var(--ui-muted)]">{p.ref}</span>
        </span>
      }
      aside={<Badge tone={p.accepted ? "ok" : "warn"}>{p.accepted ? "Accepted" : "Awaiting decision"}</Badge>}
    >
      <div className="grid gap-4">
        <div className="rounded-[10px] bg-[#f6f8fa] px-3 py-2 text-[12px] text-[var(--ui-muted)]">
          <strong className="font-semibold text-[var(--ui-ink)]">Fictitious example.</strong> No real values, schedules or supplier names. A real proposal would follow GAVEA&apos;s formal process.
        </div>
        <div>
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--ui-muted)]">Scope</p>
          <ul className="grid gap-1.5 text-[13.5px] text-[var(--ui-ink)]">
            {p.scope.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="mt-[3px] text-[var(--ui-accent)]">{Icon.check}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--ui-muted)]">Assumptions</p>
          <ul className="grid gap-1 text-[13px] text-[var(--ui-muted)]">
            {p.assumptions.map((s) => (
              <li key={s}>· {s}</li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-[10px] border border-[var(--ui-line)] p-3">
          <KV k="Commercial terms" v="Shown in the formal proposal" />
          <KV k="Counterparty" v="GAVEA (concept)" />
        </div>
        {!p.accepted && req.stage === 3 && (
          <div className="flex flex-wrap gap-2">
            <Btn variant="primary" onClick={() => dispatch({ type: "CLIENT_ACCEPT", id: req.id, now: Date.now() })}>
              Accept proposal (demo)
            </Btn>
          </div>
        )}
      </div>
    </Panel>
  );
}

function RequestDetail() {
  const { state, dispatch } = useDemo();
  const r = selectedRequest(state);
  if (!r) return <Empty title="No request selected">Create a new request or open one from your history.</Empty>;

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button type="button" onClick={() => dispatch({ type: "SET_CLIENT_TAB", tab: "requests" })} className="mb-2 text-[12.5px] text-[var(--ui-accent)] hover:underline">
            ← My requests
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--ui-ink)]">
              {serviceLabel(r.service)} · {r.location}
            </h3>
            <StageBadge stage={r.stage} />
          </div>
          <p className="mt-1 font-mono text-[12px] text-[var(--ui-muted)]">
            {r.id} · {CLIENT_NAME} · created {fmtDateTime(r.createdAt)}
            {r.repeatedFrom && ` · repeated from ${r.repeatedFrom}`}
          </p>
        </div>
        <Btn size="sm" onClick={() => dispatch({ type: "REPEAT", id: r.id })}>
          {Icon.repeat} Repeat request
        </Btn>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <Panel title="Status">
          <Timeline req={r} />
          <p className="mt-4 border-t border-[var(--ui-line)] pt-3 text-[11.5px] text-[var(--ui-muted)]">Demonstration stages. In the demo they advance through GAVEA and partner actions, not automatically.</p>
        </Panel>

        <div className="grid gap-4">
          <Panel title="Request details">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-3">
              <KV k="Vessel" v={r.vessel} />
              <KV k="Vessel type" v={r.vesselType} />
              <KV k="Window" v={r.windowStart && `${r.windowStart} → ${r.windowEnd}`} />
              <KV k="Tank type" v={r.tankType} />
              <KV k="Tanks" v={r.tankCount} />
              <KV k="Cargo history" v={r.cargoHistory} />
            </dl>
            {r.notes && <p className="mt-3 rounded-[10px] bg-[#f6f8fa] px-3 py-2 text-[13px] text-[var(--ui-ink)]">{r.notes}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {r.attachments.length === 0 ? (
                <span className="text-[12.5px] text-[var(--ui-muted)]">No documents attached.</span>
              ) : (
                r.attachments.map((f) => (
                  <span key={f.name} className="flex items-center gap-2 rounded-[8px] border border-[var(--ui-line)] px-2.5 py-1 text-[12.5px]">
                    {Icon.doc} {f.name} <span className="font-mono text-[11px] text-[var(--ui-muted)]">{fmtSize(f.size)}</span>
                  </span>
                ))
              )}
            </div>
          </Panel>

          <ProposalCard req={r} />

          {(r.execution.length > 0 || r.stage >= 4) && (
            <Panel title="Execution updates">
              {r.execution.length === 0 ? (
                <p className="text-[13px] text-[var(--ui-muted)]">Waiting for the executing partner to confirm mobilization.</p>
              ) : (
                <ul className="grid gap-2">
                  {r.execution.map((e) => (
                    <li key={e.kind} className="flex items-center justify-between gap-3 text-[13.5px]">
                      <span className="flex items-center gap-2">
                        <span className="text-[var(--ui-ok)]">{Icon.check}</span>
                        {e.text}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--ui-muted)]">{fmtDateTime(e.at)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-3 text-[11.5px] text-[var(--ui-muted)]">Executed by a qualified local partner under contract, coordinated by GAVEA.</p>
            </Panel>
          )}

          {r.closeout.length > 0 && (
            <Panel title="Close-out documents" aside={<Badge tone="ok">Closed</Badge>}>
              <ul className="flex flex-wrap gap-2">
                {r.closeout.map((d) => (
                  <li key={d} className="flex items-center gap-2 rounded-[8px] border border-[var(--ui-line)] px-2.5 py-1.5 text-[12.5px]">
                    {Icon.doc} {d}
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}

export function ClientView() {
  const { state } = useDemo();
  if (state.clientTab === "new") return <NewRequest />;
  if (state.clientTab === "requests") return <RequestList />;
  return <RequestDetail />;
}
