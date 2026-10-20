"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";

const MILESTONES = [
  { k: "Validate", t: "Entrevistas com clientes, análise de demanda e definição de regiões e serviços prioritários." },
  { k: "Qualify", t: "Homologação de parceiros, requisitos legais, HSE e seguros, desenho de responsabilidades." },
  { k: "Prototype", t: "Experiência digital e workflow operacional. GAVEA TRADE como possível integração futura." },
  { k: "Pilot", t: "Poucas solicitações reais, após contratação e validações. Medir conversão, tempo, qualidade e margem." },
];

const RISKS = [
  "Segurança operacional",
  "Seguros",
  "Compliance",
  "Tributação e contratos transfronteiriços",
  "Licenças locais",
  "Responsabilidade técnica",
];

const NEXT = [
  { k: "Workshop de validação", t: "Com a liderança GAVEA: tese, apetite de risco, serviços e regiões candidatas." },
  { k: "Recorte do piloto", t: "Um serviço, uma região e um pequeno grupo de clientes e parceiros." },
  { k: "Estrutura de responsabilidades", t: "Jurídico, seguros e contratos definidos antes de qualquer operação real." },
  { k: "Protótipo operacional", t: "Evolução desta demonstração para um workflow testável pelo time comercial." },
];

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
    const ms = el.querySelector("[data-ms]");
    const tl = gsap.timeline({ scrollTrigger: { trigger: ms, start: "top 80%", end: "bottom 55%", scrub: 0.6 } });
    tl.fromTo("[data-ms-line]", { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
    gsap.utils.toArray<HTMLElement>("[data-ms-item]", el).forEach((m, i) => {
      tl.from(m, { autoAlpha: 0.15, y: 16, duration: 0.25 }, i * 0.25);
    });
    gsap.utils.toArray<HTMLElement>("[data-fade]", el).forEach((b) => {
      gsap.from(b, { autoAlpha: 0, y: 24, duration: 1, ease: "power3.out", scrollTrigger: { trigger: b, start: "top 88%" } });
    });
  });

  return (
    <section ref={ref} id="pilot" data-header-theme="dark" className="scene bg-abyss py-28 md:py-40" aria-label="06 · Piloto">
      <div className="wrap">
        <p className="t-label mb-5 text-signal">06 · Estratégia de lançamento</p>
        <h2 data-pl-title className="t-xl max-w-[16ch]">
          <SplitWords text="Testar o modelo antes de escalar." />
        </h2>
        <p className="t-body mt-6 text-mist">
          Serviços internacionais são uma <span className="text-paper">hipótese de expansão a validar</span>, não uma unidade já operacional. O caminho proposto reduz risco a cada marco.
        </p>

        {/* marcos */}
        <div data-ms className="relative mt-20 md:mt-28">
          <div className="absolute left-0 right-0 top-[7px] hidden h-px bg-paper/12 md:block" aria-hidden="true">
            <div data-ms-line className="h-full origin-left bg-signal" />
          </div>
          <ol className="grid gap-10 md:grid-cols-4 md:gap-8">
            {MILESTONES.map((m, i) => (
              <li key={m.k} data-ms-item className="relative">
                <span className="relative z-10 mb-6 block size-[15px] rounded-full border border-signal bg-abyss" aria-hidden="true">
                  <span className="absolute inset-[4px] rounded-full bg-signal" />
                </span>
                <p className="font-mono text-[0.75rem] text-faint">0{i + 1}</p>
                <p className="t-l mt-1">{m.k}</p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">{m.t}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* riscos + próximos passos */}
        <div className="mt-24 grid gap-12 md:mt-32 md:grid-cols-[0.85fr_1.15fr]">
          <div data-fade className="rounded-[20px] border border-paper/12 bg-paper/[0.03] p-7 md:p-9">
            <p className="t-label mb-4 text-[#e4a66b]">Riscos críticos</p>
            <p className="t-m mb-6">A resolver antes de qualquer operação real.</p>
            <ul className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {RISKS.map((r) => (
                <li key={r} className="flex items-start gap-3 border-t border-paper/10 pt-3 text-[0.95rem] text-paper/90">
                  <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#e4a66b]" aria-hidden="true" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.82rem] text-faint">Esta apresentação não propõe solução jurídica. Cada tema exige validação com especialistas.</p>
          </div>

          <div data-fade>
            <p className="t-label mb-4 text-signal">Proposta de implantação</p>
            <p className="t-l mb-8 max-w-[18ch]">Quatro passos para chegar a um piloto prudente.</p>
            <ol className="border-b border-paper/10">
              {NEXT.map((n, i) => (
                <li key={n.k} className="grid gap-1 border-t border-paper/10 py-5 sm:grid-cols-[48px_1fr]">
                  <span className="font-mono text-[0.8rem] text-signal">{String.fromCharCode(65 + i)}</span>
                  <div>
                    <p className="text-[1.08rem] font-medium">{n.k}</p>
                    <p className="mt-1 text-[0.95rem] leading-relaxed text-mist">{n.t}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* fecho do GLOBAL SERVICES */}
        <div data-fade className="mt-32 border-t border-paper/12 pt-16 text-center md:mt-44 md:pt-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/gavea-group-white.png" alt="GAVEA GROUP" width={1600} height={311} loading="lazy" className="mx-auto h-[22px] w-auto opacity-90 md:h-[28px]" />
          <p className="t-mega mt-10">Global Services</p>
          <p className="t-m mt-6 text-mist">One partner. Global solutions.</p>
          <p className="t-label mt-10 text-faint">Conceito estratégico · protótipo demonstrativo</p>
        </div>
      </div>
    </section>
  );
}
