"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";

// Proposta de recorte do piloto. São parâmetros de escopo a validar com a GAVEA,
// não dados comerciais: nenhum preço, volume, prazo ou cliente real.
const PILOT = [
  {
    k: "Serviço",
    v: "Tank cleaning",
    d: "O serviço desta demonstração: escopo técnico claro e fácil de padronizar na RFQ.",
  },
  {
    k: "Região",
    v: "Um porto internacional prioritário",
    d: "Escolhido com a GAVEA a partir de onde os clientes atuais já operam. Singapura é o cenário de estudo.",
  },
  {
    k: "Parceiros",
    v: "2 a 3 parceiros locais homologados",
    d: "Selecionados por critérios legais, HSE, seguros e capacidade técnica, com contrato alinhado ao do cliente.",
  },
  {
    k: "Clientes iniciais",
    v: "3 a 5 clientes atuais, por convite",
    d: "Clientes da GAVEA com demanda internacional, convidados a usar o portal desde a primeira solicitação.",
  },
];

const METRICS = ["Conversão de solicitação em proposta", "Tempo até a proposta", "Qualidade da execução", "Margem por serviço", "Repetição de solicitações"];

const DECISIONS = [
  { q: "Aprovar o recorte do piloto", h: "Serviço, região, parceiros e clientes iniciais." },
  { q: "Definir o papel contratual da GAVEA", h: "Contraparte perante o cliente, responsabilidades, seguros e contratos com parceiros." },
  { q: "Indicar quem conduz", h: "Um dono do piloto, com comercial, operações e jurídico envolvidos." },
];

const PHASES = ["Validar", "Homologar", "Prototipar", "Pilotar"];

const RISKS = ["Segurança operacional", "Seguros", "Compliance", "Tributação e contratos transfronteiriços", "Licenças locais", "Responsabilidade técnica"];

export function Pilot() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el) => {
    gsap.from(el.querySelectorAll("[data-pl-title] .split-word > span"), {
      yPercent: 110,
      stagger: 0.04,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });
    gsap.from(el.querySelectorAll("[data-pl-cell]"), {
      autoAlpha: 0,
      y: 28,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.08,
      scrollTrigger: { trigger: el.querySelector("[data-pl-card]"), start: "top 80%" },
    });
    gsap.utils.toArray<HTMLElement>("[data-fade]", el).forEach((b) => {
      gsap.from(b, { autoAlpha: 0, y: 24, duration: 1, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 88%" } });
    });
  });

  return (
    <section ref={ref} id="pilot" data-header-theme="dark" className="scene bg-abyss py-28 md:py-36" aria-label="06 · Proposta de piloto">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <p className="t-label mb-5 text-signal">06 · Proposta de piloto</p>
            <h2 data-pl-title className="t-xl max-w-[14ch]">
              <SplitWords text="Começar pequeno para testar o modelo." />
            </h2>
          </div>
          <p className="t-body text-mist">
            Serviços internacionais são uma hipótese de expansão. A proposta é testá-la com um recorte fechado e responsabilidades definidas antes de qualquer escala.
          </p>
        </div>

        {/* o recorte do piloto: o centro da conclusão */}
        <div data-pl-card className="mt-14 overflow-hidden rounded-[22px] border border-signal/30 bg-[#06121e] md:mt-20">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper/10 px-6 py-4 md:px-8">
            <p className="t-label text-signal">Recorte proposto</p>
            <p className="t-label text-faint">A validar com a GAVEA</p>
          </div>
          <div className="grid md:grid-cols-4">
            {PILOT.map((c, i) => (
              <div key={c.k} data-pl-cell className={`p-6 md:p-8 ${i > 0 ? "border-t border-paper/10 md:border-l md:border-t-0" : ""}`}>
                <p className="t-label mb-4 text-faint">{c.k}</p>
                <p className="t-m font-medium leading-snug text-paper">{c.v}</p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-mist">{c.d}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-4 border-t border-paper/10 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
            <ol className="flex flex-wrap items-center gap-2 text-[0.9rem] text-paper/90" aria-label="Fases">
              {PHASES.map((p, i) => (
                <li key={p} className="flex items-center gap-2">
                  <span className="font-mono text-[0.72rem] text-signal">0{i + 1}</span>
                  {p}
                  {i < PHASES.length - 1 && (
                    <svg width="14" height="10" viewBox="0 0 14 10" className="text-faint" aria-hidden="true">
                      <path d="M1 5h11M9 2l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  )}
                </li>
              ))}
            </ol>
            <p className="text-[0.85rem] text-faint">Medir: {METRICS.join(" · ")}.</p>
          </div>
        </div>

        {/* decisões */}
        <div data-fade className="mt-16 grid gap-8 md:mt-20 md:grid-cols-[0.6fr_1.4fr]">
          <p className="t-l max-w-[12ch]" style={{ fontVariationSettings: '"wdth" 80' }}>
            Três decisões para começar.
          </p>
          <ol className="border-b border-paper/10">
            {DECISIONS.map((d, i) => (
              <li key={d.q} className="grid gap-1 border-t border-paper/10 py-5 sm:grid-cols-[48px_1fr_1.1fr] sm:items-baseline sm:gap-6">
                <span className="font-mono text-[0.8rem] text-signal">0{i + 1}</span>
                <p className="text-[1.1rem] font-medium">{d.q}</p>
                <p className="text-[0.95rem] leading-relaxed text-mist">{d.h}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* riscos: acessíveis, sem dominar a seção */}
        <details data-fade className="group mt-12 rounded-[16px] border border-paper/12 bg-paper/[0.03] open:bg-paper/[0.05]">
          <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-3">
              <span className="size-2 rounded-full bg-[#e4a66b]" aria-hidden="true" />
              <span className="text-[1.02rem] font-medium">Riscos críticos a resolver antes de qualquer operação real</span>
              <span className="font-mono text-[0.75rem] text-faint">6</span>
            </span>
            <svg width="14" height="14" viewBox="0 0 14 14" className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true">
              <path d="M3 5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </summary>
          <div className="px-6 pb-6">
            <ul className="flex flex-wrap gap-2">
              {RISKS.map((r) => (
                <li key={r} className="rounded-full border border-[#e4a66b]/40 px-3 py-1.5 text-[0.9rem] text-paper/90">
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.85rem] text-faint">Cada tema exige validação com especialistas. Esta apresentação não propõe solução jurídica.</p>
          </div>
        </details>

        <p data-fade className="mt-12 max-w-[56ch] text-[1.08rem] text-paper">
          <span className="text-signal">Próximo passo proposto:</span> um workshop com a liderança da GAVEA para validar o recorte e as três decisões.
        </p>

        {/* fecho do GLOBAL SERVICES */}
        <div data-close className="mt-28 border-t border-paper/12 pt-16 text-center md:mt-36 md:pt-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/gavea-group-white.png" alt="GAVEA GROUP" width={1600} height={311} loading="lazy" className="mx-auto h-[22px] w-auto opacity-90 md:h-[28px]" />
          <p className="t-mega mt-10">Global Services</p>
          <p className="t-m mt-6 text-mist">One partner. Global solutions.</p>
          <p className="mx-auto mt-8 max-w-[44ch] text-[0.98rem] text-paper/80">
            A GAVEA é a contraparte, coordena a operação e contrata parceiros locais qualificados quando necessário.
          </p>
        </div>
      </div>
    </section>
  );
}
