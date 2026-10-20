"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";

const LANES = [
  { id: "client", label: "Cliente", y: 26 },
  { id: "gavea", label: "GAVEA", y: 78 },
  { id: "partner", label: "Parceiro local", y: 130 },
] as const;

const BEATS = [
  {
    lane: 0,
    x: 150,
    verb: "Solicita",
    actor: "Cliente",
    text: "Especifica a necessidade e autoriza a contratação.",
    img: "hero-vessel",
    pos: "40% 50%",
  },
  {
    lane: 1,
    x: 345,
    verb: "Qualifica",
    actor: "GAVEA",
    text: "Recebe a demanda, valida especificações e riscos e estrutura o escopo.",
    img: "industrial-macro",
    pos: "50% 50%",
  },
  {
    lane: 1,
    x: 540,
    verb: "Contrata",
    actor: "GAVEA",
    text: "Consulta parceiros habilitados, compõe a proposta, negocia e formaliza.",
    img: "the-people",
    pos: "62% 40%",
  },
  {
    lane: 2,
    x: 735,
    verb: "Executa",
    actor: "Parceiro local",
    text: "Realiza o serviço conforme contrato, qualificação e licenças aplicáveis.",
    img: "tank-cleaning",
    pos: "45% 50%",
  },
  {
    lane: 1,
    x: 930,
    verb: "Acompanha e encerra",
    actor: "GAVEA",
    text: "Acompanha a execução e entrega ao cliente a documentação de encerramento.",
    img: "service-execution",
    pos: "18% 50%",
  },
];

const PATH_D = BEATS.map((b, i) => `${i === 0 ? "M" : "L"}${b.x} ${LANES[b.lane].y}`).join(" ");

// fração acumulada do traço em cada nó (segmentos têm comprimentos diferentes)
const SEG = BEATS.slice(1).map((b, i) => Math.hypot(b.x - BEATS[i].x, LANES[b.lane].y - LANES[BEATS[i].lane].y));
const TOTAL = SEG.reduce((a, b) => a + b, 0);
const AT_NODE = [0, ...SEG.map((_, i) => SEG.slice(0, i + 1).reduce((a, b) => a + b, 0) / TOTAL)];

export function BusinessModel() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el) => {
    const imgs = gsap.utils.toArray<HTMLElement>("[data-bm-img]", el);
    const texts = gsap.utils.toArray<HTMLElement>("[data-bm-text]", el);
    const nodes = gsap.utils.toArray<Element>("[data-bm-node], [data-bm-step]", el);
    const path = el.querySelector<SVGPathElement>("[data-bm-path]")!;
    const back = el.querySelector<SVGPathElement>("[data-bm-back]")!;
    const note = el.querySelector("[data-bm-note]");

    gsap.set(imgs.slice(1), { autoAlpha: 0 });
    gsap.set(texts.slice(1), { autoAlpha: 0, y: 18 });
    gsap.set(path, { attr: { "stroke-dashoffset": 1 } });
    gsap.set(back, { attr: { "stroke-dashoffset": 1 } });
    gsap.set(nodes, { opacity: 0.25 });
    const svgNodes = gsap.utils.toArray<Element>("[data-bm-node]", el);
    const steps = gsap.utils.toArray<Element>("[data-bm-step]", el);
    const nodeAt = (i: number) => [svgNodes[i], steps[i]].filter(Boolean);
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
    tl.to(nodeAt(0), { opacity: 1, duration: 0.02 }, 0.02);
    for (let i = 1; i < n; i++) {
      const at = 0.04 + i * seg;
      tl.to(path, { attr: { "stroke-dashoffset": 1 - AT_NODE[i] }, duration: seg * 0.5, ease: "power1.inOut" }, at - seg * 0.55);
      tl.to(imgs[i - 1], { autoAlpha: 0, duration: seg * 0.35 }, at - seg * 0.2);
      tl.fromTo(imgs[i], { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: seg * 0.5 }, at - seg * 0.25);
      tl.to(texts[i - 1], { autoAlpha: 0, y: -18, duration: seg * 0.2 }, at - seg * 0.2);
      tl.to(texts[i], { autoAlpha: 1, y: 0, duration: seg * 0.25 }, at);
      tl.to(nodeAt(i), { opacity: 1, duration: seg * 0.1 }, at);
    }
    tl.to(back, { attr: { "stroke-dashoffset": 0 }, duration: 0.06 }, 0.86);
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
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/media/${b.img}-1920.webp`}
                  srcSet={`/media/${b.img}-1080.webp 1080w, /media/${b.img}-1920.webp 1920w`}
                  sizes="100vw"
                  alt=""
                  loading="lazy"
                  className="img-cover"
                  style={{ objectPosition: b.pos, filter: "saturate(0.8) contrast(1.05)" }}
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-navy-deep/55" />
            <div className="absolute inset-0 scrim-b" />
            <div className="absolute inset-0 scrim-l opacity-70" />
          </div>

          <div className="wrap relative flex h-full flex-col justify-between gap-6 pt-[calc(var(--header-h)+4vh)] pb-[5vh] rm-static">
            <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-end">
              <div>
                <p className="t-label mb-5 text-signal">02 · O modelo de negócio</p>
                <h2 data-bm-title className="t-xl">
                  <SplitWords text="One partner." className="block" />
                  <SplitWords text="One accountable process." className="block" />
                </h2>
                <p className="t-body mt-5 text-mist">
                  A GAVEA lidera a relação comercial e coordena a entrega. Parceiros locais qualificados executam sob contrato.
                </p>
              </div>

              {/* texto da etapa ativa */}
              <div className="relative min-h-[9rem]">
                {BEATS.map((b, i) => (
                  <div key={b.verb} data-bm-text className={`${i === 0 ? "relative" : "absolute inset-x-0 bottom-0"} rm-static rm-visible`}>
                    <p className="t-label mb-3 text-faint">
                      <span className="text-signal">0{i + 1}</span> · {b.actor}
                    </p>
                    <p className="t-l mb-2">{b.verb}</p>
                    <p className="t-body text-mist">{b.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* raias */}
              <ol className="grid grid-cols-5 gap-1.5 md:hidden" aria-label="Etapas do processo">
                {BEATS.map((b, i) => (
                  <li key={b.verb} data-bm-step className="rounded-[10px] border border-signal/40 bg-abyss/60 px-1.5 py-2 text-center backdrop-blur">
                    <span className="block font-mono text-[0.7rem] text-signal">{i + 1}</span>
                    <span className="mt-0.5 block text-[0.62rem] leading-tight text-paper/90">{b.actor === "Parceiro local" ? "Parceiro" : b.actor}</span>
                  </li>
                ))}
              </ol>
              <div className="relative hidden rounded-[18px] border border-paper/10 bg-abyss/50 px-3 py-4 backdrop-blur-md md:block md:px-6">
                <svg viewBox="0 0 1000 164" className="h-auto w-full" role="img" aria-label="Fluxo: cliente solicita, GAVEA qualifica e contrata, parceiro local executa, GAVEA acompanha e entrega ao cliente.">
                  {LANES.map((l) => (
                    <g key={l.id}>
                      <line x1="0" x2="1000" y1={l.y} y2={l.y} stroke="#f3f1ec" strokeOpacity="0.1" strokeDasharray="2 6" />
                      <text x="0" y={l.y - 10} className="fill-mist" style={{ font: "500 13px var(--font-geist-mono)", letterSpacing: "0.06em" }}>
                        {l.label.toUpperCase()}
                      </text>
                    </g>
                  ))}
                  <path data-bm-path d={PATH_D} pathLength={1} strokeDasharray="1" strokeDashoffset="0" fill="none" stroke="#3aa9d2" strokeWidth="2" />
                  <path
                    data-bm-back
                    d={`M930 ${LANES[1].y} L930 ${LANES[0].y}`}
                    pathLength={1}
                    strokeDasharray="1"
                    strokeDashoffset="0"
                    fill="none"
                    stroke="#f3f1ec"
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                  />
                  {BEATS.map((b, i) => (
                    <g key={b.verb} data-bm-node transform={`translate(${b.x} ${LANES[b.lane].y})`}>
                      <circle r="13" fill="#030a12" stroke="#3aa9d2" strokeWidth="1.5" />
                      <text y="4.5" textAnchor="middle" className="fill-paper" style={{ font: "600 12px var(--font-geist-mono)" }}>
                        {i + 1}
                      </text>
                      <text y="30" textAnchor="middle" className="fill-paper hidden md:block" style={{ font: "500 13px var(--font-archivo)" }}>
                        {b.verb}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              <p data-bm-note className="mt-4 text-[0.88rem] text-mist rm-visible">
                <span className="text-paper">Não é um marketplace.</span> O cliente não entra em um leilão de fornecedores: tem um único responsável comercial. A GAVEA assume as responsabilidades estabelecidas nos contratos.
              </p>
            </div>
          </div>

          <p className="concept-tag absolute bottom-3 right-[var(--gutter)] hidden md:block rm-hide">Imagens conceituais · styleframes 01 · 02 · 03 · 05 · 06</p>
        </div>
      </div>
    </section>
  );
}
