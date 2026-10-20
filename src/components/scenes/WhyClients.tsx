"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";

const THREAD = [
  { t: "Re: Fwd: tank cleaning em Singapura?", x: 4, y: 6, r: -4 },
  { t: "Anexo: plano_tanques_v3_FINAL(2).pdf", x: 46, y: 0, r: 3 },
  { t: "Qual era a janela operacional mesmo?", x: 12, y: 30, r: 2 },
  { t: "Re: Re: cotação atualizada", x: 54, y: 26, r: -3 },
  { t: "Reenviando o escopo, versão anterior estava errada", x: 2, y: 56, r: -2 },
  { t: "Alguém confirmou os documentos do fornecedor?", x: 40, y: 50, r: 4 },
  { t: "Status? O navio chega quinta.", x: 22, y: 78, r: -1 },
];

const FIELDS = [
  ["Service", "Tank Cleaning"],
  ["Location", "Singapore"],
  ["Window", "Defined by the client"],
  ["Documents", "tank-plan.pdf"],
  ["Status", "Partner sourcing"],
  ["Proposal", "In the portal"],
];

const BENEFITS = [
  { t: "Uma porta de entrada", d: "Todas as demandas de serviço chegam pelo mesmo lugar, com o mesmo padrão." },
  { t: "Menos repetição", d: "RFQ estruturada: a informação é dada uma vez e reaproveitada nas próximas solicitações." },
  { t: "Visibilidade do andamento", d: "O cliente acompanha cada etapa. Dados internos e de parceiros continuam confidenciais." },
  { t: "Propostas e documentos juntos", d: "Proposta, anexos, atualizações e documentos de encerramento no mesmo histórico." },
  { t: "Relação contínua", d: "Cada serviço concluído alimenta o próximo. O portal sustenta a relação comercial." },
  { t: "Alcance internacional", d: "Atendimento em outras geografias, sujeito à viabilidade e à homologação por região e serviço." },
];

export function WhyClients() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el, { desktop }) => {
    const chips = gsap.utils.toArray<HTMLElement>("[data-chip]", el);
    const card = el.querySelector<HTMLElement>("[data-card]")!;
    const rows = gsap.utils.toArray<HTMLElement>("[data-row]", el);
    gsap.set(card, { autoAlpha: 0, scale: 0.94, y: 20 });
    gsap.set(rows, { autoAlpha: 0, x: -10 });

    gsap.from(el.querySelectorAll("[data-why-title] .split-word > span"), {
      yPercent: 110,
      stagger: 0.03,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });

    // deriva leve dos e-mails antes da ordem
    chips.forEach((c, i) => {
      gsap.to(c, { y: "+=8", duration: 2.4 + (i % 3) * 0.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.2 });
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el.querySelector(".pin-track"), start: "top top", end: "bottom bottom", scrub: 0.6 },
    });
    const box = el.querySelector<HTMLElement>("[data-visual]")!;
    chips.forEach((c, i) => {
      tl.to(
        c,
        {
          left: "50%",
          top: "50%",
          xPercent: -50,
          yPercent: -50,
          rotate: 0,
          scale: 0.6,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        0.12 + i * 0.035,
      );
    });
    tl.to(card, { autoAlpha: 1, scale: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0.42);
    rows.forEach((r, i) => tl.to(r, { autoAlpha: 1, x: 0, duration: 0.06 }, 0.5 + i * 0.05));
    tl.to(box, { y: desktop ? -10 : 0, duration: 0.2 }, 0.8);

    gsap.utils.toArray<HTMLElement>("[data-benefit]", el).forEach((b) => {
      gsap.from(b, { autoAlpha: 0, y: 24, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 88%" } });
    });
  });

  return (
    <section ref={ref} id="why" data-header-theme="light" className="scene bg-[var(--light-bg)] text-ui-ink" aria-label="04 · Por que o portal">
      <div className="pin-track" style={{ ["--track" as string]: 240 }}>
        <div className="pin-stage rm-flow">
          <div className="wrap grid h-full items-center gap-8 pt-[calc(var(--header-h)+3vh)] pb-[5vh] md:grid-cols-[0.9fr_1.1fr] rm-static">
            <div>
              <p className="t-label mb-5 text-ui-accent">04 · Por que usar</p>
              <h2 data-why-title className="t-l max-w-[18ch]">
                <SplitWords text="Por que usar o portal em vez de mandar um e-mail?" />
              </h2>
              <p className="t-body mt-6 text-ui-muted">
                Porque a demanda deixa de ser uma conversa espalhada e passa a ser <span className="text-ui-ink">uma operação gerenciável</span>, com dono, etapas e histórico.
              </p>
            </div>

            <div data-visual className="relative h-[46vh] min-h-[320px] md:h-[62vh]">
              {THREAD.map((m) => (
                <div
                  key={m.t}
                  data-chip
                  className="absolute max-w-[78%] rounded-[12px] border border-[var(--light-line)] bg-white/90 px-3.5 py-2.5 text-[0.8rem] text-ui-muted shadow-[0_10px_30px_-18px_rgba(8,30,47,0.5)] md:text-[0.86rem] rm-hide"
                  style={{ left: `${m.x}%`, top: `${m.y}%`, transform: `rotate(${m.r}deg)` }}
                  aria-hidden="true"
                >
                  <span className="mr-2 font-mono text-[0.68rem] text-ui-accent">MAIL</span>
                  {m.t}
                </div>
              ))}

              <div data-card className="absolute left-1/2 top-1/2 w-[min(100%,420px)] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border border-[#d5dce2] bg-white p-5 shadow-[0_30px_80px_-40px_rgba(8,30,47,0.55)] rm-static rm-visible">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[0.95rem] font-semibold">DEMO-0101</p>
                  <span className="rounded-full bg-[var(--ui-accent-soft)] px-2 py-0.5 font-mono text-[0.66rem] uppercase tracking-[0.06em] text-ui-accent">Structured RFQ</span>
                </div>
                <dl className="grid gap-0">
                  {FIELDS.map(([k, v]) => (
                    <div key={k} data-row className="flex items-center justify-between border-t border-[var(--ui-line)] py-2.5 text-[0.86rem]">
                      <dt className="font-mono text-[0.68rem] uppercase tracking-[0.06em] text-ui-muted">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap pb-28 md:pb-36">
        <ol className="border-b border-[var(--light-line)]">
          {BENEFITS.map((b, i) => (
            <li key={b.t} data-benefit className="grid gap-2 border-t border-[var(--light-line)] py-6 md:grid-cols-[80px_1fr_1fr] md:items-baseline md:gap-8 md:py-8">
              <span className="font-mono text-[0.8rem] text-ui-accent">0{i + 1}</span>
              <p className="t-m font-medium text-ui-ink" style={{ fontVariationSettings: '"wdth" 82' }}>
                {b.t}
              </p>
              <p className="text-[0.98rem] leading-relaxed text-ui-muted">{b.d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-[0.8rem] text-ui-muted">Sem promessas de economia, prazo ou cobertura: o ganho apresentado é de experiência e controle.</p>
      </div>
    </section>
  );
}
