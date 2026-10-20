"use client";

import { useRef, type KeyboardEvent } from "react";
import { ClientView } from "./ClientView";
import { OpsView } from "./OpsView";
import { PartnerView } from "./PartnerView";
import { DemoProvider, nextStep, useDemo } from "./store";
import type { ViewId } from "./types";
import { Badge, Btn, cx, Icon } from "./ui";

const VIEWS: { id: ViewId; label: string; short: string; who: string }[] = [
  { id: "client", label: "Client view", short: "Client", who: "Example Shipping Co." },
  { id: "ops", label: "GAVEA Operations", short: "GAVEA Ops", who: "GAVEA commercial & operations" },
  { id: "partner", label: "Partner view", short: "Partner", who: "Qualified local partner" },
];

function ViewSwitch() {
  const { state, dispatch } = useDemo();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + VIEWS.length) % VIEWS.length;
    dispatch({ type: "SET_VIEW", view: VIEWS[n].id });
    refs.current[n]?.focus();
  };
  return (
    <div role="tablist" aria-label="Perspective" className="flex rounded-[12px] bg-[#e9edf1] p-1">
      {VIEWS.map((v, i) => {
        const active = state.view === v.id;
        return (
          <button
            key={v.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`tab-${v.id}`}
            aria-selected={active}
            aria-controls="portal-panel"
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => onKey(e, i)}
            onClick={() => dispatch({ type: "SET_VIEW", view: v.id })}
            className={cx(
              "relative min-h-[34px] rounded-[9px] px-3 text-[12.5px] font-medium transition-[background,color,box-shadow] duration-200 sm:px-4",
              active ? "bg-white text-[var(--ui-ink)] shadow-[0_1px_3px_rgba(11,26,38,0.12)]" : "text-[var(--ui-muted)] hover:text-[var(--ui-ink)]",
            )}
          >
            <span className="hidden sm:inline">{v.label}</span>
            <span className="sm:hidden">{v.short}</span>
          </button>
        );
      })}
    </div>
  );
}

function ClientNav() {
  const { state, dispatch } = useDemo();
  const items = [
    { id: "new" as const, label: "New request", icon: Icon.plus },
    { id: "requests" as const, label: "My requests", icon: Icon.list, count: state.requests.length },
  ];
  return (
    <nav aria-label="Client navigation" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((it) => {
        const active = state.clientTab === it.id || (it.id === "requests" && state.clientTab === "detail");
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => dispatch({ type: "SET_CLIENT_TAB", tab: it.id })}
            aria-current={active ? "page" : undefined}
            className={cx(
              "flex min-h-[38px] shrink-0 items-center gap-2.5 rounded-[10px] px-3 text-[13px] font-medium transition-colors",
              active ? "bg-white text-[var(--ui-ink)] shadow-[0_1px_2px_rgba(11,26,38,0.08)]" : "text-[var(--ui-muted)] hover:bg-white/60",
            )}
          >
            <span className={active ? "text-[var(--ui-accent)]" : ""}>{it.icon}</span>
            {it.label}
            {it.count !== undefined && <span className="ml-auto font-mono text-[11px] text-[var(--ui-muted)]">{it.count}</span>}
          </button>
        );
      })}
      <div className="mt-auto hidden rounded-[12px] border border-[var(--ui-line)] bg-white/70 p-3 text-[11.5px] leading-relaxed text-[var(--ui-muted)] lg:block">
        <p className="mb-1 font-medium text-[var(--ui-ink)]">One entry point</p>
        Requests, proposals, updates and documents for every service, in one place.
      </div>
    </nav>
  );
}

function DemoBar() {
  const { state, dispatch } = useDemo();
  const target =
    state.requests.find((r) => r.id === state.selectedId && r.stage < 5) ?? state.requests.find((r) => r.origin === "session" && r.stage < 5);
  const step = target ? nextStep(target) : null;
  return (
    <div className="flex flex-col gap-3 border-t border-[var(--ui-line)] bg-[#f9fafb] px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5">
      <p className="flex items-center gap-2 text-[11.5px] text-[var(--ui-muted)]">
        <span className="size-1.5 rounded-full bg-[var(--ui-accent)]" aria-hidden="true" />
        All data is fictitious and lives only in this browser tab. No login, upload, email or payment.
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Btn
          size="sm"
          variant="dark"
          disabled={!target || !step}
          onClick={() => target && dispatch({ type: "DEMO_ADVANCE", id: target.id, now: Date.now() })}
          title={step ?? undefined}
        >
          {target && step ? (
            <>
              Simulate next step <span className="hidden font-normal text-white/60 lg:inline">· {step}</span>
            </>
          ) : (
            "Submit a request to simulate"
          )}
        </Btn>
        <Btn size="sm" onClick={() => dispatch({ type: "RESET" })}>
          Reset demo
        </Btn>
      </div>
    </div>
  );
}

function Shell() {
  const { state } = useDemo();
  const view = VIEWS.find((v) => v.id === state.view)!;

  return (
    <div className="overflow-hidden rounded-[22px] border border-[#d5dce2] bg-[var(--ui-bg)] text-[var(--ui-ink)] shadow-[0_40px_120px_-40px_rgba(8,30,47,0.45),0_2px_6px_rgba(8,30,47,0.06)]" style={{ fontVariationSettings: '"wdth" 100' }}>
      {/* barra superior */}
      <div className="flex flex-col gap-3 border-b border-[var(--ui-line)] bg-white px-4 py-3 md:flex-row md:items-center md:justify-between md:px-5">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/gavea-group-white.png" alt="GAVEA GROUP" width={1600} height={311} className="h-[13px] w-auto" style={{ filter: "brightness(0) saturate(100%) invert(9%) sepia(30%) saturate(1800%) hue-rotate(175deg)" }} />
          <span className="h-4 w-px bg-[var(--ui-line)]" aria-hidden="true" />
          <span className="text-[13px] font-semibold tracking-[-0.005em]">Global Services</span>
          <Badge tone="demo">Demo</Badge>
        </div>
        <ViewSwitch />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-[var(--ui-line)] bg-white/60 px-4 py-2 md:px-5">
        <p className="text-[12px] text-[var(--ui-muted)]">
          Viewing as <span className="font-medium text-[var(--ui-ink)]">{view.who}</span> <span className="text-[var(--ui-muted)]">(simulated perspective, no authentication)</span>
        </p>
      </div>

      <div id="portal-panel" role="tabpanel" aria-labelledby={`tab-${state.view}`} className="min-h-[640px]">
        {state.view === "client" ? (
          <div className="grid lg:grid-cols-[210px_1fr]">
            <div className="border-b border-[var(--ui-line)] bg-[#eef1f4]/60 p-3 lg:flex lg:flex-col lg:border-b-0 lg:border-r">
              <ClientNav />
            </div>
            <div className="min-w-0 p-4 md:p-6">
              <ClientView />
            </div>
          </div>
        ) : (
          <div className="min-w-0 p-4 md:p-6">{state.view === "ops" ? <OpsView /> : <PartnerView />}</div>
        )}
      </div>

      <DemoBar />

      <div aria-live="polite" className="pointer-events-none relative">
        {state.toast && (
          <div className="absolute bottom-[calc(100%+16px)] left-1/2 w-[min(92%,460px)] -translate-x-1/2 rounded-[12px] bg-[#0b1a26] px-4 py-3 text-center text-[13px] text-white shadow-xl">
            {state.toast}
          </div>
        )}
      </div>
    </div>
  );
}

export function PortalDemo() {
  return (
    <DemoProvider>
      <Shell />
    </DemoProvider>
  );
}
