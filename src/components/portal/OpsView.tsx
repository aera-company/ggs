"use client";

import { useState } from "react";
import { CLIENT_NAME, fmtDateTime, OPS_CHECKS, partnerById, serviceLabel } from "./data";
import { allChecksDone, candidatePartners, useDemo } from "./store";
import type { ServiceRequest } from "./types";
import { Badge, Btn, cx, Empty, Icon, KV, Panel, StageBadge, Timeline } from "./ui";

function Internal() {
  return (
    <Badge tone="demo">
      {Icon.lock} Internal · never shown to client
    </Badge>
  );
}

function Sourcing({ r }: { r: ServiceRequest }) {
  const { dispatch } = useDemo();
  const candidates = candidatePartners(r);
  const [picked, setPicked] = useState<string[]>(() =>
    candidates.filter((p) => !p.qualification.some((q) => q.status === "expired")).slice(0, 2).map((p) => p.id),
  );
  const canInvite = r.stage === 1 && allChecksDone(r) && picked.length > 0;

  return (
    <Panel title="Partner sourcing" tour="sourcing" aside={<Internal />}>
      <ul className="grid gap-2">
        {candidates.map((p) => {
          const expired = p.qualification.some((q) => q.status === "expired");
          const pending = p.qualification.filter((q) => q.status === "pending").length;
          const invited = r.ops.invited.includes(p.id);
          const quote = r.ops.quotes.find((q) => q.partnerId === p.id);
          return (
            <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[var(--ui-line)] p-3">
              <label className={cx("flex items-center gap-3", (r.stage !== 1 || expired) && "cursor-default")}>
                {r.stage === 1 && (
                  <input
                    type="checkbox"
                    disabled={expired}
                    checked={picked.includes(p.id)}
                    onChange={(e) => setPicked((s) => (e.target.checked ? [...s, p.id] : s.filter((x) => x !== p.id)))}
                    className="size-4 accent-[var(--ui-accent)]"
                  />
                )}
                <span>
                  <span className="block text-[13.5px] font-medium text-[var(--ui-ink)]">
                    {p.name} <span className="font-normal text-[var(--ui-muted)]">· illustrative · {p.region}</span>
                  </span>
                  <span className="mt-0.5 block text-[12px] text-[var(--ui-muted)]">
                    {expired ? "Insurance certificate expired: not eligible" : pending ? `${pending} qualification item pending` : "Qualification verified (demo)"}
                  </span>
                </span>
              </label>
              <div className="flex items-center gap-2">
                {expired && <Badge tone="danger">Blocked</Badge>}
                {!expired && pending > 0 && <Badge tone="warn">Pending</Badge>}
                {invited && !quote && <Badge tone="accent">Invited</Badge>}
                {quote && <Badge tone="ok">Quote · {quote.index} idx</Badge>}
              </div>
            </li>
          );
        })}
      </ul>
      {r.stage === 1 && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[12px] text-[var(--ui-muted)]">{allChecksDone(r) ? "Ready to invite qualified partners." : "Complete the qualification checklist first."}</p>
          <Btn variant="primary" size="sm" disabled={!canInvite} onClick={() => dispatch({ type: "OPS_INVITE", id: r.id, partnerIds: picked, now: Date.now() })}>
            Invite {picked.length} partner{picked.length === 1 ? "" : "s"} to quote
          </Btn>
        </div>
      )}
    </Panel>
  );
}

function Composition({ r }: { r: ServiceRequest }) {
  const { dispatch } = useDemo();
  const sel = r.ops.quotes.find((q) => q.partnerId === r.ops.selected);
  const clientIdx = sel ? Math.round(sel.index * (1 + r.ops.margin / 100)) : null;
  return (
    <Panel title="Commercial composition" tour="composition" aside={<Internal />}>
      {r.ops.quotes.length === 0 ? (
        <p className="text-[13px] text-[var(--ui-muted)]">Waiting for quotes from invited partners. Switch to Partner view to answer as a partner.</p>
      ) : (
        <div className="grid gap-4">
          <fieldset className="grid gap-2">
            <legend className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--ui-muted)]">Select executing partner</legend>
            {r.ops.quotes.map((q) => (
              <label key={q.partnerId} className={cx("flex cursor-pointer items-center justify-between gap-3 rounded-[10px] border p-3", r.ops.selected === q.partnerId ? "border-[var(--ui-accent)] bg-[var(--ui-accent-soft)]/40" : "border-[var(--ui-line)]")}>
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`sel-${r.id}`}
                    disabled={r.stage !== 2}
                    checked={r.ops.selected === q.partnerId}
                    onChange={() => dispatch({ type: "OPS_SELECT_PARTNER", id: r.id, partnerId: q.partnerId })}
                    className="size-4 accent-[var(--ui-accent)]"
                  />
                  <span className="text-[13.5px] font-medium">{partnerById(q.partnerId)?.name}</span>
                </span>
                <span className="font-mono text-[12.5px]">{q.index} idx</span>
              </label>
            ))}
          </fieldset>
          <div className="grid gap-2">
            <label htmlFor={`m-${r.id}`} className="flex items-center justify-between text-[12.5px] font-medium">
              GAVEA margin <span className="font-mono">{r.ops.margin}%</span>
            </label>
            <input
              id={`m-${r.id}`}
              type="range"
              min={5}
              max={25}
              value={r.ops.margin}
              disabled={r.stage !== 2}
              onChange={(e) => dispatch({ type: "OPS_SET_MARGIN", id: r.id, margin: Number(e.target.value) })}
              className="w-full accent-[var(--ui-accent)]"
            />
          </div>
          <dl className="grid grid-cols-3 gap-3 rounded-[10px] bg-[#f6f8fa] p-3">
            <KV k="Partner quote" v={sel ? `${sel.index} idx` : "Select partner"} />
            <KV k="Margin" v={`${r.ops.margin}%`} />
            <KV k="Client proposal" v={clientIdx ? `${clientIdx} idx` : "-"} />
          </dl>
          <p className="text-[11.5px] text-[var(--ui-muted)]">Values in demonstration index units (base 100). Not prices.</p>
          {r.stage === 2 && (
            <div className="flex justify-end">
              <Btn variant="primary" size="sm" disabled={!r.ops.selected} onClick={() => dispatch({ type: "OPS_PUBLISH", id: r.id, now: Date.now() })}>
                Publish proposal to client {Icon.arrow}
              </Btn>
            </div>
          )}
        </div>
      )}
    </Panel>
  );
}

function OpsDetail({ r }: { r: ServiceRequest }) {
  const { dispatch } = useDemo();
  const completed = r.execution.some((e) => e.kind === "completed");
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[20px] font-semibold tracking-[-0.01em] text-[var(--ui-ink)]">
              {serviceLabel(r.service)} · {r.location}
            </h3>
            <StageBadge stage={r.stage} />
          </div>
          <p className="mt-1 font-mono text-[12px] text-[var(--ui-muted)]">
            {r.id} · {CLIENT_NAME} · {r.vessel}
          </p>
        </div>
        {r.stage === 0 && (
          <Btn variant="primary" size="sm" onClick={() => dispatch({ type: "OPS_START_REVIEW", id: r.id, now: Date.now() })}>
            Start scope review
          </Btn>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
        <div className="grid gap-4">
          <Panel title="Qualification" tour="qualification" aside={<span className="font-mono text-[11px] text-[var(--ui-muted)]">{OPS_CHECKS.filter((c) => r.ops.checks[c.id]).length}/{OPS_CHECKS.length}</span>}>
            <ul className="grid gap-1.5">
              {OPS_CHECKS.map((c) => (
                <li key={c.id}>
                  <label className={cx("flex items-center gap-3 rounded-[8px] px-2 py-1.5 text-[13.5px]", r.stage === 1 ? "cursor-pointer hover:bg-[#f6f8fa]" : "text-[var(--ui-muted)]")}>
                    <input
                      type="checkbox"
                      disabled={r.stage !== 1}
                      checked={!!r.ops.checks[c.id]}
                      onChange={() => dispatch({ type: "OPS_TOGGLE_CHECK", id: r.id, check: c.id })}
                      className="size-4 accent-[var(--ui-accent)]"
                    />
                    {c.label}
                  </label>
                </li>
              ))}
            </ul>
            {r.stage === 0 && <p className="mt-2 text-[12px] text-[var(--ui-muted)]">Start the scope review to qualify this request.</p>}
          </Panel>

          {r.stage >= 1 && <Sourcing r={r} />}
          {r.stage >= 2 && <Composition r={r} />}

          {r.stage >= 4 && (
            <Panel title="Execution monitoring">
              {r.execution.length === 0 ? (
                <p className="text-[13px] text-[var(--ui-muted)]">Partner {partnerById(r.ops.selected)?.name} has not confirmed mobilization yet.</p>
              ) : (
                <ul className="grid gap-2">
                  {r.execution.map((e) => (
                    <li key={e.kind} className="flex items-center justify-between text-[13.5px]">
                      <span className="flex items-center gap-2">
                        <span className="text-[var(--ui-ok)]">{Icon.check}</span>
                        {e.text}
                      </span>
                      <span className="font-mono text-[11px] text-[var(--ui-muted)]">{fmtDateTime(e.at)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {r.stage === 4 && (
                <div className="mt-3 flex justify-end">
                  <Btn variant="primary" size="sm" disabled={!completed} onClick={() => dispatch({ type: "OPS_CLOSE", id: r.id, now: Date.now() })}>
                    Close request and share documents
                  </Btn>
                </div>
              )}
            </Panel>
          )}
        </div>

        <div className="grid content-start gap-4">
          <Panel title="Timeline">
            <Timeline req={r} />
          </Panel>
          <Panel title="Activity">
            <ul className="grid gap-2">
              {[...r.log].reverse().map((l, i) => (
                <li key={i} className="text-[12.5px]">
                  <span className="font-medium text-[var(--ui-ink)]">{l.actor}</span> <span className="text-[var(--ui-muted)]">{l.text}</span>
                  <span className="block font-mono text-[10.5px] text-[var(--ui-muted)]">{fmtDateTime(l.at)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

export function OpsView() {
  const { state, dispatch } = useDemo();
  const sel = state.requests.find((r) => r.id === state.selectedId) ?? state.requests.find((r) => r.stage < 5) ?? state.requests[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <div className="grid content-start gap-2">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--ui-muted)]">Request inbox</p>
        {state.requests.map((r) => (
          <button
            type="button"
            key={r.id}
            onClick={() => dispatch({ type: "SELECT", id: r.id })}
            aria-current={sel?.id === r.id}
            className={cx(
              "grid gap-1.5 rounded-[12px] border p-3 text-left transition-colors",
              sel?.id === r.id ? "border-[var(--ui-accent)] bg-white shadow-[0_0_0_3px_rgba(0,107,144,0.1)]" : "border-[var(--ui-line)] bg-white/70 hover:bg-white",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11.5px] font-medium">{r.id}</span>
              <StageBadge stage={r.stage} />
            </span>
            <span className="text-[13px] font-medium text-[var(--ui-ink)]">
              {serviceLabel(r.service)} · {r.location}
            </span>
            <Timeline req={r} compact />
          </button>
        ))}
      </div>
      {sel ? <OpsDetail key={sel.id} r={sel} /> : <Empty title="No requests yet" />}
    </div>
  );
}
