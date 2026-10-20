"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";

const CHANNELS = [
  "Páginas por serviço e localização com cobertura comprovada",
  "SEO internacional de intenção de contratação",
  "Busca paga e LinkedIn para armadores e gestores de frota",
  "Prospecção assistida pelo comercial",
  "Convites à base atual de clientes",
  "Novos mercados a partir de serviços e parceiros validados",
];

export function GoToMarket() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el) => {
    const lines = gsap.utils.toArray<SVGPathElement>("[data-ch-line]", el);
    const items = gsap.utils.toArray<HTMLElement>("[data-ch]", el);
    gsap.set(lines, { attr: { "stroke-dashoffset": 1 } });

    gsap.from(el.querySelectorAll("[data-gtm-title] .split-word > span"), {
      yPercent: 110,
      stagger: 0.03,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });
    gsap.from("[data-browser]", {
      y: 60,
      autoAlpha: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: "[data-browser]", start: "top 85%" },
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el.querySelector("[data-flow]"), start: "top 80%", end: "bottom 45%", scrub: 0.6 },
    });
    items.forEach((it, i) => tl.from(it, { autoAlpha: 0, x: -16, duration: 0.1 }, i * 0.06));
    lines.forEach((l, i) => tl.to(l, { attr: { "stroke-dashoffset": 0 }, duration: 0.3 }, 0.1 + i * 0.06));
    tl.from("[data-hub]", { autoAlpha: 0, scale: 0.9, duration: 0.15 }, 0.55);
    tl.from("[data-hub-out]", { autoAlpha: 0, x: -10, duration: 0.15 }, 0.7);
  });

  // linhas convergentes: de cada canal (esquerda) até o hub (direita)
  const H = 360;
  const step = H / CHANNELS.length;

  return (
    <section ref={ref} id="acquisition" data-header-theme="dark" className="scene bg-navy-deep py-28 md:py-40" aria-label="05 · Novos clientes">
      <div className="wrap">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-end">
          <div>
            <p className="t-label mb-5 text-signal">05 · Aquisição internacional</p>
            <h2 data-gtm-title className="t-xl max-w-[14ch]">
              <SplitWords text="Não é só software." /> <span className="text-mist"><SplitWords text="É um novo canal de negócios." /></span>
            </h2>
          </div>
          <p className="t-body text-mist md:justify-self-end">
            O portal transforma intenção de contratação em solicitações qualificadas. Cada nova região ou serviço validado vira uma porta de entrada comercial.
          </p>
        </div>

        {/* exemplo editorial de landing */}
        <figure data-browser className="mt-16 md:mt-24">
          <div className="overflow-hidden rounded-[18px] border border-paper/12 bg-[#0a1a28] shadow-[0_50px_120px_-50px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-3 border-b border-paper/10 px-4 py-3">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full bg-paper/15" />
                <span className="size-2.5 rounded-full bg-paper/15" />
                <span className="size-2.5 rounded-full bg-paper/15" />
              </span>
              <span className="t-mono truncate rounded-md bg-paper/6 px-3 py-1 text-faint">services.example / tank-cleaning</span>
              <span className="t-label ml-auto hidden rounded-full border border-signal/40 px-2.5 py-1 text-[0.6rem] text-signal sm:inline">Exemplo editorial · não publicado</span>
            </div>
            <div className="relative grid min-h-[440px] md:grid-cols-[1.1fr_0.9fr]">
              <div className="relative z-10 flex flex-col justify-between gap-10 p-7 md:p-12">
                <div>
                  <p className="t-label mb-6 text-faint">GAVEA Global Services · Tank Cleaning</p>
                  <p className="t-l max-w-[14ch]">Tank cleaning, coordinated end to end.</p>
                  <p className="mt-5 max-w-[42ch] text-[0.95rem] leading-relaxed text-mist">
                    One commercial counterparty. Qualified local partners. Scope, proposal, execution updates and close-out documents in one portal.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex min-h-[44px] items-center rounded-full bg-paper px-5 text-[0.9rem] font-medium text-navy" aria-hidden="true">
                    Request a quote
                  </span>
                  <span className="text-[0.78rem] text-faint">Coverage subject to service and region validation.</span>
                </div>
              </div>
              <div className="relative min-h-[260px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/media/tank-cleaning-1080.webp" alt="Profissional em limpeza de tanque. Imagem conceitual." loading="lazy" className="img-cover" style={{ objectPosition: "40% 50%" }} />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a28] via-[#0a1a28]/30 to-transparent md:from-[#0a1a28]" />
              </div>
            </div>
          </div>
          <figcaption className="concept-tag mt-4">Ilustração de página comercial por serviço. Não afirma atendimento atual em nenhuma localidade.</figcaption>
        </figure>

        {/* canais convergindo */}
        <div data-flow className="mt-24 grid gap-10 md:mt-32 md:grid-cols-[1.1fr_0.5fr_0.6fr] md:gap-0">
          <ul className="grid gap-4">
            {CHANNELS.map((c, i) => (
              <li key={c} data-ch className="flex items-baseline gap-4 border-t border-paper/10 pt-4">
                <span className="font-mono text-[0.75rem] text-signal">0{i + 1}</span>
                <span className="text-[1.02rem] text-paper/90">{c}</span>
              </li>
            ))}
          </ul>
          <svg viewBox={`0 0 200 ${H}`} preserveAspectRatio="none" className="hidden h-full w-full md:block" aria-hidden="true">
            {CHANNELS.map((_, i) => (
              <path
                key={i}
                data-ch-line
                d={`M0 ${(i + 0.6) * step} C 110 ${(i + 0.6) * step}, 90 ${H / 2}, 200 ${H / 2}`}
                pathLength={1}
                strokeDasharray="1"
                fill="none"
                stroke="#3aa9d2"
                strokeOpacity={0.35 + i * 0.08}
              />
            ))}
          </svg>
          <div className="grid gap-4 self-center">
            <div data-hub className="rounded-[18px] border border-signal/50 bg-signal/10 p-6">
              <p className="t-label mb-2 text-signal">Portal</p>
              <p className="t-m">GAVEA Global Services</p>
              <p className="mt-2 text-[0.85rem] text-mist">Solicitações estruturadas e qualificadas</p>
            </div>
            <div data-hub-out className="flex items-center gap-3 pl-6 text-mist">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M4 2v8a4 4 0 0 0 4 4h7M12 11l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <span className="text-[0.95rem]">Comercial GAVEA conduz a proposta</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
