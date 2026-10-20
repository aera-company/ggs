"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { STAGES, type ServiceRequest, type StageIndex } from "./types";
import { fmtDateTime } from "./data";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

type Tone = "neutral" | "accent" | "ok" | "warn" | "demo" | "danger";
const TONES: Record<Tone, string> = {
  neutral: "bg-[#eef1f4] text-[var(--ui-muted)]",
  accent: "bg-[var(--ui-accent-soft)] text-[var(--ui-accent)]",
  ok: "bg-[var(--ui-ok-soft)] text-[var(--ui-ok)]",
  warn: "bg-[var(--ui-warn-soft)] text-[var(--ui-warn)]",
  danger: "bg-[#fbe9e9] text-[var(--ui-danger)]",
  demo: "bg-[#0b1a26] text-white",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] font-mono text-[10.5px] font-medium uppercase tracking-[0.06em]", TONES[tone], className)}>
      {children}
    </span>
  );
}

export function StageBadge({ stage }: { stage: StageIndex }) {
  const tone: Tone = stage === 5 ? "ok" : stage === 3 ? "warn" : "accent";
  return (
    <Badge tone={tone}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STAGES[stage]}
    </Badge>
  );
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "dark";
  size?: "sm" | "md";
};

export function Btn({ variant = "secondary", size = "md", className, children, ...rest }: BtnProps) {
  return (
    <button
      type="button"
      {...rest}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-[background,box-shadow,transform,color] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-accent)]",
        size === "sm" ? "min-h-[34px] px-3 text-[13px]" : "min-h-[42px] px-4 text-[14px]",
        variant === "primary" && "bg-[var(--ui-accent)] text-white shadow-[0_1px_0_rgba(255,255,255,0.2)_inset,0_6px_16px_-8px_rgba(0,107,144,0.8)] hover:bg-[#005a7a]",
        variant === "dark" && "bg-[#0b1a26] text-white hover:bg-[#13283a]",
        variant === "secondary" && "border border-[var(--ui-line)] bg-white text-[var(--ui-ink)] hover:bg-[#f6f8fa]",
        variant === "ghost" && "text-[var(--ui-accent)] hover:bg-[var(--ui-accent-soft)]",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Panel({ title, aside, children, className }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-[14px] border border-[var(--ui-line)] bg-white", className)}>
      {(title || aside) && (
        <header className="flex items-center justify-between gap-3 border-b border-[var(--ui-line)] px-4 py-3">
          <h4 className="text-[13px] font-semibold text-[var(--ui-ink)]">{title}</h4>
          {aside}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function KV({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[var(--ui-muted)]">{k}</dt>
      <dd className="mt-1 truncate text-[13.5px] text-[var(--ui-ink)]">{v || <span className="text-[var(--ui-muted)]">Not provided</span>}</dd>
    </div>
  );
}

/** Linha do tempo da solicitação. Estados demonstrativos, sem atualização automática. */
export function Timeline({ req, compact = false }: { req: ServiceRequest; compact?: boolean }) {
  return (
    <ol className={cx("relative", compact ? "flex items-center gap-1" : "grid gap-0")} aria-label="Request timeline">
      {STAGES.map((label, i) => {
        const done = i < req.stage || req.stage === 5;
        const current = i === req.stage && req.stage !== 5;
        if (compact) {
          return (
            <li key={label} className="flex-1" title={label}>
              <span className={cx("block h-1 rounded-full", done ? "bg-[var(--ui-accent)]" : current ? "bg-[var(--ui-accent)]/50" : "bg-[var(--ui-line)]")} />
              <span className="sr-only">
                {label}: {done ? "done" : current ? "current" : "pending"}
              </span>
            </li>
          );
        }
        const entry = req.log.find((l) => matchLog(i, l.text));
        return (
          <li key={label} className="relative flex gap-3 pb-4 last:pb-0">
            {i < STAGES.length - 1 && (
              <span className={cx("absolute left-[9px] top-5 h-[calc(100%-12px)] w-px", done ? "bg-[var(--ui-accent)]" : "bg-[var(--ui-line)]")} aria-hidden="true" />
            )}
            <span
              className={cx(
                "relative z-10 mt-0.5 grid size-[19px] shrink-0 place-items-center rounded-full border",
                done && "border-[var(--ui-accent)] bg-[var(--ui-accent)] text-white",
                current && "border-[var(--ui-accent)] bg-white",
                !done && !current && "border-[var(--ui-line)] bg-white",
              )}
              aria-hidden="true"
            >
              {done ? (
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <path d="M2 5.2 4.2 7.3 8 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : current ? (
                <span className="size-[7px] animate-pulse rounded-full bg-[var(--ui-accent)]" />
              ) : null}
            </span>
            <div className="min-w-0">
              <p className={cx("text-[13.5px]", done || current ? "font-medium text-[var(--ui-ink)]" : "text-[var(--ui-muted)]")}>
                {label}
                {current && <span className="sr-only"> (current stage)</span>}
              </p>
              {entry && (done || current) && <p className="font-mono text-[11px] text-[var(--ui-muted)]">{fmtDateTime(entry.at)}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function matchLog(stage: number, text: string) {
  const t = text.toLowerCase();
  return [
    t.startsWith("request submitted"),
    t.includes("scope review") || t.includes("scope reviewed"),
    t.includes("partner sourcing"),
    t.includes("proposal published"),
    t.includes("proposal accepted"),
    t.includes("closed"),
  ][stage];
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-[14px] border border-dashed border-[var(--ui-line)] bg-white/60 px-6 py-14 text-center">
      <p className="text-[14px] font-medium text-[var(--ui-ink)]">{title}</p>
      {children && <div className="mt-2 max-w-[42ch] text-[13px] text-[var(--ui-muted)]">{children}</div>}
    </div>
  );
}

export const Icon = {
  plus: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  list: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2 3.5h10M2 7h10M2 10.5h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  doc: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3.5 1.5h4.5L11 4.5v8H3.5z M8 1.5v3h3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
  clip: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M9.5 4.5 5.2 8.8a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L3.3 7a3.9 3.9 0 0 0 5.5 5.5L12 9.3" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  repeat: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M2.5 6V5a2 2 0 0 1 2-2H11M9 1l2 2-2 2M11.5 8v1a2 2 0 0 1-2 2H3M5 13l-2-2 2-2" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrow: (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M3 7h8M8 4l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  check: (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2.5 6.3 5 8.7l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  lock: (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <rect x="2.5" y="5.5" width="7" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ),
  x: (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 3l6 6M9 3 3 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
};
