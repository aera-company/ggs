"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { AssetId } from "@/lib/assets";
import { useScrollScene } from "../motion/useScrollScene";
import { AssetImage } from "../ui/AssetImage";
import { SplitWords } from "../ui/SplitWords";

const LANES = [
  { id: "client", label: "Cliente", y: 26 },
  { id: "gavea", label: "GAVEA", y: 78 },
  { id: "partner", label: "Parceiro especializado", y: 130 },
] as const;

// a demanda nasce no cliente; a cadeia de valor é conduzida pela GAVEA
const START = { x: 70, lane: 0 };

const BEATS: { lane: 0 | 1 | 2; x: number; verb: string; head: string; text: string; gain: string; img: AssetId }[] = [
  {
    lane: 1,
    x: 235,
    verb: "Recebe",
    head: "Recebe a demanda internacional",
    text: "O pedido chega por um único canal. A GAVEA passa a ser o interlocutor do cliente, em qualquer porto do cenário.",
    gain: "Um só ponto de contato",
    img: "heroVessel",
  },
  {
    lane: 1,
    x: 415,
    verb: "Qualifica",
    head: "Qualifica o escopo",
    text: "Valida especificações, riscos e viabilidade, e transforma a necessidade em um escopo contratável.",
    gain: "Escopo claro antes do preço",
    img: "industrialMacro",
  },
  {
    lane: 2,
    x: 595,
    verb: "Contrata",
    head: "Contrata o parceiro especializado",
    text: "Seleciona um parceiro homologado para o serviço e a região, e negocia as condições de execução.",
    gain: "Rede qualificada, sem leilão",
    img: "tankCleaning",
  },
  {
    lane: 0,
    x: 775,
    verb: "Propõe",
    head: "Apresenta a proposta GAVEA",
    text: "O cliente recebe uma proposta da GAVEA, com escopo, condições e responsabilidades definidos.",
    gain: "Uma proposta, uma contraparte",
    img: "thePeople",
  },
  {
    lane: 1,
    x: 945,
    verb: "Coordena",
    head: "Coordena a entrega",
    text: "Acompanha a execução do parceiro e entrega ao cliente a documentação de encerramento.",
    gain: "Quem vende, responde",
    img: "serviceExecution",
  },
];

const PTS = [START, ...BEATS].map((b) => ({ x: b.x, y: LANES[b.lane].y }));
const PATH_D = PTS.map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`).join(" ");

// fração acumulada do traço em cada nó (segmentos têm comprimentos diferentes)
const SEG = PTS.slice(1).map((p, i) => Math.hypot(p.x - PTS[i].x, p.y - PTS[i].y));
const TOTAL = SEG.reduce((a, b) => a + b, 0);
const AT_NODE = SEG.map((_, i) => SEG.slice(0, i + 1).reduce((a, b) => a + b, 0) / TOTAL);

export function BusinessModel() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el) => {
    const imgs = gsap.utils.toArray<HTMLElement>("[data-bm-img]", el);
    const texts = gsap.utils.toArray<HTMLElement>("[data-bm-text]", el);
    const svgNodes = gsap.utils.toArray<Element>("[data-bm-node]", el);
    const steps = gsap.utils.toArray<Element>("[data-bm-step]", el);
    const path = el.querySelector<SVGPathElement>("[data-bm-path]")!;
    const coord = el.querySelector<SVGPathElement>("[data-bm-coord]")!;
    const note = el.querySelector("[data-bm-note]");
    const nodeAt = (i: number) => [svgNodes[i], steps[i]].filter(Boolean);

    gsap.set(imgs.slice(1), { autoAlpha: 0 });
    gsap.set(texts.slice(1), { autoAlpha: 0, y: 18 });
    gsap.set(path, { attr: { "stroke-dashoffset": 1 } });
    gsap.set(coord, { attr: { "stroke-dashoffset": 1 } });
    gsap.set([...svgNodes, ...steps], { opacity: 0.25 });
    gsap.set(note, { autoAlpha: 0, y: 12 });

    gsap.from(el.querySelectorAll("[data-bm-title] .split-word > span"), {
      yPercent: 110,
      stagger: 0.04,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 65%" },
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el.querySelector(".pin-track"), start: "top top", end: "bottom bottom", scrub: 0.6 },
    });

    const n = BEATS.length;
    const seg = 0.8 / n;
    tl.to(path, { attr: { "stroke-dashoffset": 1 - AT_NODE[0] }, duration: 0.05, ease: "power1.out" }, 0);
    tl.to(nodeAt(0), { opacity: 1, duration: 0.02 }, 0.04);
    for (let i = 1; i < n; i++) {
      const at = 0.04 + i * seg;
      tl.to(path, { attr: { "stroke-dashoffset": 1 - AT_NODE[i] }, duration: seg * 0.5, ease: "power1.inOut" }, at - seg * 0.55);
      tl.to(imgs[i - 1], { autoAlpha: 0, duration: seg * 0.35 }, at - seg * 0.2);
      tl.fromTo(imgs[i], { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: seg * 0.5 }, at - seg * 0.25);
      // crossfade com leve sobreposição: nunca fica um quadro sem texto
      tl.to(texts[i - 1], { autoAlpha: 0, y: -18, duration: seg * 0.18 }, at - seg * 0.24);
      tl.to(texts[i], { autoAlpha: 1, y: 0, duration: seg * 0.2 }, at - seg * 0.12);
      tl.to(nodeAt(i), { opacity: 1, duration: seg * 0.1 }, at);
    }
    tl.to(coord, { attr: { "stroke-dashoffset": 0 }, duration: 0.06 }, 0.86);
    tl.to(note, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.9);
    tl.to({}, { duration: 0.04 }, 0.96);
  });

  return (
    <section ref={ref} id="model" data-header-theme="dark" className="scene bg-navy-deep" aria-label="02 · O modelo">
      <div className="pin-track" style={{ ["--track" as string]: 480 }}>
        <div className="pin-stage rm-flow">
          {/* imagens de fundo por etapa */}
          <div className="absolute inset-0 rm-hide" aria-hidden="true">
            {BEATS.map((b) => (
              <div key={b.img} data-bm-img className="absolute inset-0">
                <AssetImage id={b.img} decorative style={{ filter: "saturate(0.8) contrast(1.05)" }} />
              </div>
            ))}
            <div className="absolute inset-0 bg-navy-deep/55" />
            <div className="absolute inset-0 scrim-b" />
            <div className="absolute inset-0 scrim-l opacity-70" />
          </div>

          <div className="wrap relative flex h-full flex-col justify-between gap-6 pt-[calc(var(--header-h)+4vh)] pb-[5vh] rm-static">
            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
              <div>
                <p className="t-label mb-5 text-signal">02 · A cadeia de valor</p>
                <h2 data-bm-title className="t-xl">
                  <SplitWords text="One partner." className="block" />
                  <SplitWords text="One accountable process." className="block" />
                </h2>
                <p className="t-body mt-5 text-mist">
                  A GAVEA conduz a contratação de ponta a ponta. O parceiro especializado executa; a GAVEA responde perante o cliente.
                </p>
              </div>

              {/* etapa ativa */}
              <div className="relative min-h-[11rem]">
                {BEATS.map((b, i) => (
                  <div key={b.verb} data-bm-text className={`${i === 0 ? "relative" : "absolute inset-x-0 bottom-0"} rm-static rm-visible`}>
                    <p className="t-label mb-3 text-faint">
                      <span className="text-signal">0{i + 1}</span> · GAVEA {b.verb.toLowerCase()}
                    </p>
                    <p className="t-l mb-2">{b.head}</p>
                    <p className="t-body text-mist">{b.text}</p>
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-signal/40 bg-signal/10 px-3 py-1 text-[0.82rem] text-paper">
                      <span className="t-label text-[0.6rem] text-signal">Para o cliente</span>
                      {b.gain}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* mobile: stepper */}
              <ol className="grid grid-cols-5 gap-1.5 md:hidden" aria-label="Etapas da cadeia de valor">
                {BEATS.map((b, i) => (
                  <li key={b.verb} data-bm-step className="rounded-[10px] border border-signal/40 bg-abyss/60 px-1 py-2 text-center backdrop-blur">
                    <span className="block font-mono text-[0.7rem] text-signal">{i + 1}</span>
                    <span className="mt-0.5 block text-[0.64rem] leading-tight text-paper/90">{b.verb}</span>
                  </li>
                ))}
              </ol>

              {/* desktop: raias */}
              <div className="relative hidden rounded-[18px] border border-paper/10 bg-abyss/50 px-3 py-4 backdrop-blur-md md:block md:px-6">
                <svg
                  viewBox="0 0 1000 164"
                  className="h-auto w-full"
                  role="img"
                  aria-label="Cadeia de valor: o cliente envia a demanda; a GAVEA recebe, qualifica o escopo, contrata o parceiro especializado, apresenta a proposta ao cliente e coordena a entrega."
                >
                  {LANES.map((l) => (
                    <g key={l.id}>
                      <line x1="0" x2="1000" y1={l.y} y2={l.y} stroke="#f3f1ec" strokeOpacity="0.1" strokeDasharray="2 6" />
                      <text x="0" y={l.y - 10} className="fill-mist" style={{ font: "500 13px var(--font-geist-mono)", letterSpacing: "0.06em" }}>
                        {l.label.toUpperCase()}
                      </text>
                    </g>
                  ))}
                  <path data-bm-path d={PATH_D} pathLength={1} strokeDasharray="1" strokeDashoffset="0" fill="none" stroke="#3aa9d2" strokeWidth="2" />
                  {/* coordenação: a GAVEA conecta parceiro e cliente na entrega */}
                  <path
                    data-bm-coord
                    d={`M945 ${LANES[2].y} L945 ${LANES[0].y}`}
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset="0"
                    fill="none"
                    stroke="#f3f1ec"
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                  />
                  <g transform={`translate(${START.x} ${LANES[0].y})`}>
                    <circle r="5" fill="#f3f1ec" />
                    <text y="22" textAnchor="middle" className="fill-mist" style={{ font: "500 12px var(--font-archivo)" }}>
                      Demanda
                    </text>
                  </g>
                  {BEATS.map((b, i) => (
                    <g key={b.verb} data-bm-node transform={`translate(${b.x} ${LANES[b.lane].y})`}>
                      <circle r="13" fill="#030a12" stroke="#3aa9d2" strokeWidth="1.5" />
                      <text y="4.5" textAnchor="middle" className="fill-paper" style={{ font: "600 12px var(--font-geist-mono)" }}>
                        {i + 1}
                      </text>
                      <text y={b.lane === 2 ? -20 : 30} textAnchor="middle" className="fill-paper" style={{ font: "500 13px var(--font-archivo)" }}>
                        {b.verb}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <p data-bm-note className="mt-4 text-[0.92rem] text-mist rm-visible">
                <span className="text-paper">Não é um marketplace.</span> O cliente não coordena fornecedores nem entra em leilão: contrata a GAVEA, que assume as responsabilidades definidas em contrato.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
