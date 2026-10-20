"use client";

import { useEffect, useRef, type Dispatch } from "react";
import { useLenis } from "../motion/SmoothScroll";
import { OPS_CHECKS } from "./data";
import { allChecksDone, candidatePartners, tourRequest, useDemo, type Action } from "./store";
import type { DemoSession, ServiceRequest, ViewId } from "./types";
import { cx } from "./ui";

/**
 * Demonstração guiada do cenário Tank Cleaning em Singapura.
 * Cada passo usa as mesmas ações do protótipo (nada é encenado à parte):
 * o apresentador executa o passo e o portal mostra o resultado na
 * perspectiva certa. A qualquer momento dá para explorar livremente.
 */

type Step = {
  view: ViewId;
  /** área do portal destacada (atributo data-tour) */
  target: string;
  who: string;
  title: string;
  text: string;
  cta: string;
  done: (r: ServiceRequest | null) => boolean;
  run: (s: DemoSession, d: Dispatch<Action>, now: number) => void;
};

const VIEW_LABEL: Record<ViewId, string> = { client: "Client view", ops: "GAVEA Operations", partner: "Partner view" };

export const TOUR: Step[] = [
  {
    view: "client",
    target: "form",
    who: "Cliente",
    title: "O cliente descreve a necessidade uma única vez",
    text: "Serviço, porto, embarcação, janela e documentos. A demanda chega estruturada à GAVEA.",
    cta: "Preencher exemplo e enviar",
    done: (r) => !!r,
    run: (_s, d, now) => {
      d({ type: "SET_VIEW", view: "client" });
      d({ type: "FILL_EXAMPLE" });
      d({ type: "SUBMIT", now });
    },
  },
  {
    view: "ops",
    target: "qualification",
    who: "GAVEA",
    title: "A GAVEA recebe e qualifica o escopo",
    text: "Escopo, documentos, HSE, contrato e viabilidade. Nada avança sem qualificação.",
    cta: "Qualificar a solicitação",
    done: (r) => !!r && (r.stage >= 2 || (r.stage >= 1 && allChecksDone(r))),
    run: (s, d, now) => {
      const r = tourRequest(s);
      if (!r) return;
      d({ type: "SELECT", id: r.id });
      if (r.stage === 0) d({ type: "OPS_START_REVIEW", id: r.id, now });
      OPS_CHECKS.forEach((c) => {
        if (!r.ops.checks[c.id]) d({ type: "OPS_TOGGLE_CHECK", id: r.id, check: c.id });
      });
    },
  },
  {
    view: "ops",
    target: "sourcing",
    who: "GAVEA",
    title: "A GAVEA aciona parceiros homologados",
    text: "Só quem é qualificado para o serviço e a região. Um parceiro fica bloqueado: seguro vencido.",
    cta: "Convidar parceiros",
    done: (r) => !!r && r.stage >= 2,
    run: (s, d, now) => {
      const r = tourRequest(s);
      if (!r) return;
      const ids = candidatePartners(r)
        .filter((p) => !p.qualification.some((q) => q.status === "expired"))
        .slice(0, 2)
        .map((p) => p.id);
      d({ type: "OPS_INVITE", id: r.id, partnerIds: ids, now });
    },
  },
  {
    view: "partner",
    target: "invitations",
    who: "Parceiro",
    title: "Os parceiros cotam para a GAVEA",
    text: "O parceiro vê o escopo técnico. Os dados comerciais do cliente final ficam protegidos.",
    cta: "Enviar cotações",
    done: (r) => !!r && (r.stage >= 3 || (r.ops.invited.length > 0 && r.ops.quotes.length >= r.ops.invited.length)),
    run: (s, d, now) => {
      const r = tourRequest(s);
      if (!r) return;
      d({ type: "SET_PARTNER", partnerId: r.ops.invited[0] });
      r.ops.invited.forEach((pid, i) => {
        if (!r.ops.quotes.some((q) => q.partnerId === pid)) {
          d({ type: "PARTNER_QUOTE", id: r.id, partnerId: pid, index: i === 0 ? 100 : 94, note: "Demo quote", now });
        }
      });
    },
  },
  {
    view: "ops",
    target: "composition",
    who: "GAVEA",
    title: "A GAVEA compõe e publica a sua proposta",
    text: "Escolha do parceiro e margem ficam internas. O cliente recebe uma proposta GAVEA.",
    cta: "Publicar a proposta",
    done: (r) => !!r && r.stage >= 3,
    run: (s, d, now) => {
      const r = tourRequest(s);
      if (!r) return;
      d({ type: "SELECT", id: r.id });
      if (!r.ops.selected && r.ops.quotes.length) {
        const best = [...r.ops.quotes].sort((a, b) => a.index - b.index)[0];
        d({ type: "OPS_SELECT_PARTNER", id: r.id, partnerId: best.partnerId });
      }
      d({ type: "OPS_PUBLISH", id: r.id, now });
    },
  },
  {
    view: "client",
    target: "proposal",
    who: "Cliente",
    title: "O cliente aprova, sem ver custos internos",
    text: "Escopo, premissas e contraparte. Nenhum preço de parceiro ou margem aparece aqui.",
    cta: "Aprovar a proposta",
    done: (r) => !!r && r.stage >= 4,
    run: (s, d, now) => {
      const r = tourRequest(s);
      if (!r) return;
      d({ type: "CLIENT_ACCEPT", id: r.id, now });
    },
  },
  {
    view: "partner",
    target: "awarded",
    who: "Parceiro",
    title: "O parceiro executa e reporta",
    text: "Mobilização, andamento e conclusão entram no mesmo histórico que a GAVEA e o cliente acompanham.",
    cta: "Registrar a execução",
    done: (r) => !!r && (r.stage >= 5 || r.execution.some((e) => e.kind === "completed")),
    run: (s, d, now) => {
      const r = tourRequest(s);
      if (!r) return;
      if (r.ops.selected) d({ type: "SET_PARTNER", partnerId: r.ops.selected });
      (["mobilized", "in-progress", "completed"] as const).forEach((kind, i) => {
        d({ type: "PARTNER_UPDATE", id: r.id, kind, now: now + i * 60_000 });
      });
    },
  },
  {
    view: "client",
    target: "closeout",
    who: "GAVEA",
    title: "A GAVEA encerra e entrega a documentação",
    text: "Um responsável do pedido à entrega. Na próxima vez, o cliente repete a solicitação em um clique.",
    cta: "Encerrar e entregar",
    done: (r) => !!r && r.stage >= 5,
    run: (s, d, now) => {
      const r = tourRequest(s);
      if (!r) return;
      d({ type: "OPS_CLOSE", id: r.id, now });
    },
  },
];

/** Leva o portal até a perspectiva do passo, com a solicitação do tour aberta. */
function showStep(i: number, s: DemoSession, d: Dispatch<Action>) {
  const step = TOUR[i];
  if (!step) return;
  const r = tourRequest(s);
  d({ type: "SET_VIEW", view: step.view });
  if (step.view === "client") {
    if (r) d({ type: "SELECT", id: r.id });
    else d({ type: "SET_CLIENT_TAB", tab: "new" });
  } else if (r) {
    d({ type: "SELECT", id: r.id });
  }
  if (step.view === "partner" && r) {
    const pid = i >= 6 ? r.ops.selected : r.ops.invited[0];
    if (pid) d({ type: "SET_PARTNER", partnerId: pid });
  }
}

export function GuidedTour({ placement }: { placement: "top" | "bottom" }) {
  const { state, dispatch } = useDemo();
  const lenis = useLenis();
  const barRef = useRef<HTMLDivElement>(null);
  const { mode, step } = state.tour;
  const r = tourRequest(state);
  const current = TOUR[step];
  const finished = mode === "guided" && step >= TOUR.length;
  const isDone = current ? current.done(r) : false;

  // leva a área destacada para a tela quando o passo muda ou é executado
  useEffect(() => {
    if (placement !== "bottom" || mode !== "guided" || !current) return;
    const id = requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${current.target}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const barH = barRef.current?.offsetHeight ?? 0;
      const top = 64 + 24;
      const fits = rect.height < window.innerHeight - top - barH - 24;
      if (rect.top < top || (fits && rect.bottom > window.innerHeight - barH - 24)) {
        if (lenis) lenis.scrollTo(el, { offset: -top, duration: 0.9 });
        else el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [placement, mode, step, isDone, current, lenis]);

  const start = () => {
    dispatch({ type: "TOUR", tour: { mode: "guided", step: 0 } });
    showStep(0, state, dispatch);
  };
  const next = () => {
    const n = step + 1;
    dispatch({ type: "TOUR", tour: { step: n } });
    showStep(n, state, dispatch);
  };
  const run = () => current?.run(state, dispatch, Date.now());
  const goTo = (i: number) => {
    dispatch({ type: "TOUR", tour: { step: i } });
    showStep(i, state, dispatch);
  };

  // acima da janela: só o atalho para retomar; abaixo: o controle do apresentador
  if (placement === "top") {
    if (mode !== "free") return null;
    return (
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => dispatch({ type: "TOUR", tour: { mode: "guided" } })}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[var(--light-line)] bg-white/80 px-4 text-[0.85rem] font-medium text-ui-ink shadow-sm hover:bg-white"
        >
          <span className="size-2 rounded-full bg-ui-accent" aria-hidden="true" />
          Retomar demonstração guiada
        </button>
      </div>
    );
  }
  if (mode === "free") return null;

  return (
    <div ref={barRef} className="sticky bottom-3 z-30 mt-5" role="region" aria-label="Demonstração guiada">
      <div className="rounded-[18px] border border-[#cfd8df] bg-white/92 p-4 text-ui-ink shadow-[0_-10px_60px_-30px_rgba(8,30,47,0.55)] backdrop-blur-xl md:p-5">
        {mode === "intro" ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="t-label mb-1.5 text-ui-accent">Demonstração guiada · 8 passos</p>
              <p className="text-[1.08rem] font-medium leading-snug md:text-[1.2rem]">Tank Cleaning em Singapura, do pedido à entrega.</p>
              <p className="mt-1 text-[0.9rem] text-ui-muted">Você conduz; o portal mostra cada perspectiva. Dados fictícios.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={start} className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-ui-accent px-5 text-[0.95rem] font-medium text-white hover:bg-[#005a7a]">
                Iniciar demonstração
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" onClick={() => dispatch({ type: "TOUR", tour: { mode: "free" } })} className="inline-flex min-h-[44px] items-center rounded-[12px] border border-[var(--ui-line)] bg-white px-4 text-[0.9rem] font-medium hover:bg-[#f6f8fa]">
                Explorar livremente
              </button>
            </div>
          </div>
        ) : finished ? (
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="t-label mb-1.5 text-ui-ok">Cenário completo</p>
              <p className="text-[1.08rem] font-medium leading-snug md:text-[1.2rem]">Da solicitação à entrega, com um único responsável.</p>
              <p className="mt-1 text-[0.9rem] text-ui-muted">Experimente repetir a solicitação ou explorar cada perspectiva.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  if (r) dispatch({ type: "REPEAT", id: r.id });
                  dispatch({ type: "TOUR", tour: { mode: "free" } });
                }}
                className="inline-flex min-h-[44px] items-center rounded-[12px] bg-ui-accent px-5 text-[0.95rem] font-medium text-white hover:bg-[#005a7a]"
              >
                Repetir solicitação
              </button>
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: "RESET" });
                  dispatch({ type: "TOUR", tour: { mode: "guided", step: 0 } });
                }}
                className="inline-flex min-h-[44px] items-center rounded-[12px] border border-[var(--ui-line)] bg-white px-4 text-[0.9rem] font-medium hover:bg-[#f6f8fa]"
              >
                Recomeçar
              </button>
            </div>
          </div>
        ) : current ? (
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center md:gap-8">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-mono text-[0.72rem] text-ui-muted">
                  Passo {step + 1}/{TOUR.length}
                </span>
                <span className="rounded-full bg-[var(--ui-accent-soft)] px-2 py-[2px] font-mono text-[0.66rem] uppercase tracking-[0.06em] text-ui-accent">
                  {current.who} · {VIEW_LABEL[current.view]}
                </span>
              </div>
              <p className="text-[1.05rem] font-medium leading-snug md:text-[1.2rem]" aria-live="polite">
                {current.title}
              </p>
              <p className="mt-1 text-[0.9rem] leading-relaxed text-ui-muted">{current.text}</p>
              <ol className="mt-3 flex gap-1.5" aria-label="Passos">
                {TOUR.map((t, i) => {
                  const reached = i < step || (i === step && isDone);
                  return (
                    <li key={t.target} className="flex-1">
                      <button
                        type="button"
                        onClick={() => i <= step && goTo(i)}
                        disabled={i > step}
                        aria-label={`Passo ${i + 1}: ${t.title}`}
                        aria-current={i === step ? "step" : undefined}
                        className={cx(
                          "block h-1.5 w-full rounded-full transition-colors",
                          reached ? "bg-ui-accent" : i === step ? "bg-ui-accent/40" : "bg-[var(--ui-line)]",
                          i <= step && "cursor-pointer hover:bg-ui-accent/70",
                        )}
                      />
                    </li>
                  );
                })}
              </ol>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isDone ? (
                <button type="button" onClick={next} className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-[#0b1a26] px-5 text-[0.95rem] font-medium text-white hover:bg-[#13283a]">
                  {step === TOUR.length - 1 ? "Concluir" : "Próximo passo"}
                  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                    <path d="M3 7h8M8 4l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ) : (
                <button type="button" onClick={run} className="inline-flex min-h-[44px] items-center gap-2 rounded-[12px] bg-ui-accent px-5 text-[0.95rem] font-medium text-white hover:bg-[#005a7a]">
                  {current.cta}
                </button>
              )}
              <button type="button" onClick={() => dispatch({ type: "TOUR", tour: { mode: "free" } })} className="inline-flex min-h-[44px] items-center rounded-[12px] px-3 text-[0.88rem] font-medium text-ui-muted hover:bg-[#f0f3f5] hover:text-ui-ink">
                Explorar livremente
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Alvo destacado no portal durante o tour (null fora do modo guiado). */
export function tourTarget(s: DemoSession) {
  if (s.tour.mode !== "guided") return null;
  return TOUR[s.tour.step]?.target ?? null;
}
