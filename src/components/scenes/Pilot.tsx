"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";

const DECISIONS = [
  { q: "Qual serviço e qual região testar primeiro?", h: "Um serviço, uma região, poucos clientes." },
  { q: "Qual o papel contratual da GAVEA?", h: "Contraparte única perante o cliente, com responsabilidades definidas." },
  { q: "O que torna um parceiro homologado?", h: "Critérios legais, HSE, seguros e capacidade técnica." },
  { q: "Quem conduz o piloto dentro da GAVEA?", h: "Comercial, operações e jurídico, com um dono claro." },
  { q: "Começa independente ou ligado ao GAVEA TRADE?", h: "A integração pode vir depois do modelo validado." },
];

const MILESTONES = [
  { k: "Validate", t: "Demanda e prioridades" },
  { k: "Qualify", t: "Parceiros e responsabilidades" },
  { k: "Prototype", t: "Workflow testável" },
  { k: "Pilot", t: "Poucas solicitações reais" },
];

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
    gsap.utils.toArray<HTMLElement>("[data-decision]", el).forEach((d) => {
      gsap.from(d, { autoAlpha: 0, y: 28, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: d, start: "top 88%" } });
    });
    const ms = el.querySelector("[data-ms]");
    gsap.fromTo("[data-ms-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ms, start: "top 85%", end: "bottom 60%", scrub: 0.6 } });
    gsap.utils.toArray<HTMLElement>("[data-fade]", el).forEach((b) => {
      gsap.from(b, { autoAlpha: 0, y: 24, duration: 1, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 88%" } });
    });
  });

  return (
    <section ref={ref} id="pilot" data-header-theme="dark" className="scene bg-abyss py-28 md:py-40" aria-label="06 · Piloto">
      <div className="wrap">
        <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
          <div>
            <p className="t-label mb-5 text-signal">06 · Piloto</p>
            <h2 data-pl-title className="t-xl max-w-[14ch]">
              <SplitWords text="Testar o modelo antes de escalar." />
            </h2>
          </div>
          <p className="t-body text-mist">
            Serviços internacionais são uma hipótese de expansão. Para testá-la com prudência, cinco decisões precisam ser tomadas pela liderança.
          </p>
        </div>

        {/* decisões: o centro da seção */}
        <ol className="mt-16 border-b border-paper/10 md:mt-24">
          {DECISIONS.map((d, i) => (
            <li key={d.q} data-decision className="grid gap-2 border-t border-paper/10 py-7 md:grid-cols-[72px_1.2fr_1fr] md:items-baseline md:gap-8 md:py-9">
              <span className="font-mono text-[0.8rem] text-signal">0{i + 1}</span>
              <p className="t-l" style={{ fontVariationSettings: '"wdth" 78' }}>
                {d.q}
              </p>
              <p className="text-[0.98rem] leading-relaxed text-mist">{d.h}</p>
            </li>
          ))}
        </ol>

        {/* marcos compactos */}
        <div data-ms className="relative mt-20 md:mt-24">
          <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-paper/12 md:block" aria-hidden="true">
            <div data-ms-line className="h-full origin-left bg-signal" />
          </div>
          <ol className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {MILESTONES.map((m, i) => (
              <li key={m.k} className="relative">
                <span className="relative z-10 mb-5 block size-[15px] rounded-full border border-signal bg-abyss" aria-hidden="true">
                  <span className="absolute inset-[4px] rounded-full bg-signal" />
                </span>
                <p className="font-mono text-[0.72rem] text-faint">0{i + 1}</p>
                <p className="t-m mt-1 font-medium">{m.k}</p>
                <p className="mt-1 text-[0.92rem] text-mist">{m.t}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* riscos: acessíveis, sem dominar a seção */}
        <details data-fade className="group mt-14 rounded-[16px] border border-paper/12 bg-paper/[0.03] open:bg-paper/[0.05]">
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

        <p data-fade className="mt-14 max-w-[52ch] text-[1.05rem] text-paper">
          <span className="text-signal">Próximo passo proposto:</span> um workshop de validação com a liderança da GAVEA para responder a essas cinco perguntas.
        </p>

        {/* fecho do GLOBAL SERVICES */}
        <div data-close className="mt-32 border-t border-paper/12 pt-16 text-center md:mt-44 md:pt-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/gavea-group-white.png" alt="GAVEA GROUP" width={1600} height={311} loading="lazy" className="mx-auto h-[22px] w-auto opacity-90 md:h-[28px]" />
          <p className="t-mega mt-10">Global Services</p>
          <p className="t-m mt-6 text-mist">One partner. Global solutions.</p>
        </div>
      </div>
    </section>
  );
}
