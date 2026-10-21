"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";

/** Nós do diagrama (viewBox 640×440). Portos iguais aos do mapa de cenário. */
const CLIENT = { x: 80, y: 220 };
const GAVEA = { x: 320, y: 220 };
const PORTS = [
  { k: "Singapore", x: 548, y: 70, tags: ["contrato", "idioma"] },
  { k: "Rotterdam", x: 584, y: 170, tags: ["seguro", "cotação"] },
  { k: "Houston", x: 576, y: 280, tags: ["fatura", "prazo"] },
  { k: "Fujairah", x: 532, y: 378, tags: ["documentos", "homologação"] },
];

// o diferencial central, em três papéis (repetidos no diagrama)
const ROLES = [
  { k: "Contraparte comercial", t: "O cliente contrata a GAVEA. Uma proposta, uma relação, um responsável." },
  { k: "Coordena a operação", t: "Escopo, prazos, documentos e acompanhamento ficam com a GAVEA." },
  { k: "Contrata parceiros locais", t: "Quando necessário, aciona um parceiro qualificado para executar no porto." },
];

// curvas cruzadas para o "contratar sozinho": parecem emaranhadas de propósito
const soloPath = (p: (typeof PORTS)[number], i: number) => {
  const c1y = i % 2 === 0 ? 420 - p.y : p.y + 120;
  return `M${CLIENT.x} ${CLIENT.y} C ${220} ${c1y}, ${380} ${440 - c1y}, ${p.x} ${p.y}`;
};
const viaPath = (p: (typeof PORTS)[number]) => `M${GAVEA.x} ${GAVEA.y} C ${420} ${GAVEA.y}, ${460} ${p.y}, ${p.x} ${p.y}`;

export function Advantage() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el) => {
    const solo = gsap.utils.toArray<SVGPathElement>("[data-adv-solo]", el);
    const tags = gsap.utils.toArray<SVGGElement>("[data-adv-tag]", el);
    const via = gsap.utils.toArray<SVGPathElement>("[data-adv-via]", el);
    const trunk = el.querySelector("[data-adv-trunk]");
    const hub = el.querySelector("[data-adv-hub]");
    const roleA = gsap.utils.toArray<SVGTextElement>("[data-adv-role-a]", el);
    const roleB = gsap.utils.toArray<SVGTextElement>("[data-adv-role-b]", el);
    const picked = el.querySelector("[data-adv-picked]");
    const phaseA = el.querySelector("[data-adv-a]");
    const phaseB = el.querySelector("[data-adv-b]");
    const items = gsap.utils.toArray<HTMLElement>("[data-adv-item]", el);
    const roles = gsap.utils.toArray<SVGTextElement>("[data-adv-role]", el);

    gsap.set([...solo, ...via], { attr: { "stroke-dashoffset": 1 } });
    gsap.set(trunk, { attr: { "stroke-dashoffset": 1 } });
    gsap.set(tags, { autoAlpha: 0, scale: 0.8, transformOrigin: "50% 50%" });
    gsap.set([hub, picked], { autoAlpha: 0 });
    gsap.set(roleB, { autoAlpha: 0 });
    gsap.set(phaseB, { autoAlpha: 0, y: 20 });
    gsap.set(items, { autoAlpha: 0, x: -12 });
    gsap.set(roles, { autoAlpha: 0 });

    gsap.from(el.querySelectorAll("[data-adv-title] .split-word > span"), {
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

    // A. contratar sozinho: linhas emaranhadas e fricções
    solo.forEach((p, i) => tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.12, ease: "power2.out" }, 0.04 + i * 0.03));
    tags.forEach((t, i) => tl.to(t, { autoAlpha: 1, scale: 1, duration: 0.04 }, 0.14 + i * 0.018));

    // B. contratar pela GAVEA
    tl.to(phaseA, { autoAlpha: 0, y: -20, duration: 0.06 }, 0.42);
    tl.to(tags, { autoAlpha: 0, scale: 0.8, duration: 0.05, stagger: 0.004 }, 0.42);
    tl.to(solo, { attr: { "stroke-dashoffset": -1 }, duration: 0.1, ease: "power2.in" }, 0.44);
    tl.to(hub, { autoAlpha: 1, duration: 0.06 }, 0.5);
    tl.to(trunk, { attr: { "stroke-dashoffset": 0 }, duration: 0.08, ease: "power2.out" }, 0.52);
    via.forEach((p, i) => tl.to(p, { attr: { "stroke-dashoffset": 0 }, duration: 0.08 }, 0.56 + i * 0.02));
    tl.to(roleA, { autoAlpha: 0, duration: 0.04 }, 0.58);
    tl.to(roleB, { autoAlpha: 1, duration: 0.04 }, 0.6);
    tl.to(picked, { autoAlpha: 1, duration: 0.05 }, 0.68);
    tl.to(phaseB, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.5);
    // cada papel acende no texto e no diagrama ao mesmo tempo
    items.forEach((it, i) => {
      tl.to(it, { autoAlpha: 1, x: 0, duration: 0.04 }, 0.6 + i * 0.08);
      tl.to(roles[i], { autoAlpha: 1, duration: 0.04 }, 0.6 + i * 0.08);
    });
    tl.to({}, { duration: 0.06 }, 0.94);
  });

  return (
    <section
      ref={ref}
      id="advantage"
      data-header-theme="dark"
      className="scene"
      style={{ background: "radial-gradient(110% 80% at 75% 50%, #0b2539 0%, #050f1a 60%, #030a12 100%)" }}
      aria-label="02 · Por que contratar pela GAVEA"
    >
      <div className="pin-track" style={{ ["--track" as string]: 190 }}>
        <div className="pin-stage rm-flow">
          <div className="wrap grid h-full grid-rows-[auto_1fr_auto] gap-4 pt-[calc(var(--header-h)+4vh)] pb-[5vh] md:grid-cols-[0.85fr_1.15fr] md:grid-rows-1 md:items-center md:gap-10 rm-static">
            <div className="md:self-center">
              <p className="t-label mb-5 text-signal">02 · Por que pela GAVEA</p>
              <h2 data-adv-title className="t-xl max-w-[12ch]">
                <SplitWords text="Um responsável no lugar de muitos." />
              </h2>

              <div className="relative mt-6 min-h-[9.5rem] md:mt-8 md:min-h-[16rem]">
                <div data-adv-a className="absolute inset-x-0 top-0 rm-static">
                  <p className="t-label mb-3 text-[#e4a66b]">Contratar sozinho</p>
                  <p className="t-m text-mist">
                    Um fornecedor por porto. Para cada um, uma nova cotação, contrato, seguro, idioma e cobrança.
                  </p>
                </div>
                <div data-adv-b className="absolute inset-x-0 top-0 rm-static rm-visible">
                  <p className="t-label mb-4 text-signal">Contratar pela GAVEA</p>
                  <ol className="grid gap-2.5 md:gap-4">
                    {ROLES.map((r, i) => (
                      <li key={r.k} data-adv-item className="grid grid-cols-[28px_1fr] items-baseline rm-visible">
                        <span className="font-mono text-[0.8rem] text-signal">{i + 1}</span>
                        <span>
                          <span className="block text-[1.15rem] font-medium leading-snug text-paper md:text-[1.25rem]">{r.k}</span>
                          <span className="mt-0.5 hidden text-[0.92rem] leading-relaxed text-mist md:block">{r.t}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            <div className="relative row-start-2 flex min-h-0 items-center md:row-start-1 md:col-start-2">
              <svg
                viewBox="0 0 640 440"
                className="adv-svg h-full max-h-[64vh] w-full"
                role="img"
                aria-label="Comparação: sozinho, o cliente coordena quatro fornecedores em portos diferentes, cada um com contrato, seguro, idioma e cobrança próprios. Pela GAVEA, o cliente tem uma única relação, e a GAVEA aciona o parceiro homologado adequado."
              >
                <defs>
                  <linearGradient id="adv-trunk" gradientUnits="userSpaceOnUse" x1={CLIENT.x} y1={CLIENT.y} x2={GAVEA.x} y2={GAVEA.y}>
                    <stop offset="0" stopColor="#f3f1ec" />
                    <stop offset="1" stopColor="#3aa9d2" />
                  </linearGradient>
                </defs>

                {PORTS.map((p, i) => (
                  <path key={`s-${p.k}`} data-adv-solo d={soloPath(p, i)} pathLength={1} strokeDasharray="1" fill="none" stroke="#e4a66b" strokeOpacity="0.55" strokeWidth="1.2" />
                ))}
                {PORTS.map((p) => (
                  <path key={`v-${p.k}`} data-adv-via d={viaPath(p)} pathLength={1} strokeDasharray="1" fill="none" stroke="#3aa9d2" strokeOpacity="0.45" strokeWidth="1.2" />
                ))}
                <path data-adv-trunk d={`M${CLIENT.x} ${CLIENT.y} L${GAVEA.x} ${GAVEA.y}`} pathLength={1} strokeDasharray="1" fill="none" stroke="url(#adv-trunk)" strokeWidth="3" />

                {/* fricções no caminho de quem contrata sozinho */}
                {PORTS.flatMap((p, i) =>
                  p.tags.map((t, j) => {
                    const x = 250 + j * 120 + (i % 2) * 30;
                    const y = 60 + i * 96 + j * 22;
                    return (
                      <g key={`${p.k}-${t}`} data-adv-tag transform={`translate(${x} ${y})`}>
                        <rect x={-t.length * 3.6 - 10} y="-11" width={t.length * 7.2 + 20} height="22" rx="11" fill="#1a1410" stroke="#e4a66b" strokeOpacity="0.6" />
                        <text y="4" textAnchor="middle" fill="#f0c9a4" className="adv-tag" style={{ font: "500 11.5px var(--font-geist-mono)" }}>
                          {t}
                        </text>
                      </g>
                    );
                  }),
                )}

                {/* cliente */}
                <g transform={`translate(${CLIENT.x} ${CLIENT.y})`}>
                  <circle r="26" fill="#030a12" stroke="#f3f1ec" strokeWidth="1.5" />
                  <circle r="5" fill="#f3f1ec" />
                  <text y="50" textAnchor="middle" className="fill-paper" style={{ font: "500 14px var(--font-archivo)" }}>
                    Cliente
                  </text>
                </g>

                {/* hub GAVEA */}
                <g data-adv-hub transform={`translate(${GAVEA.x} ${GAVEA.y})`}>
                  <circle r="44" fill="#3aa9d2" fillOpacity="0.12" />
                  <circle r="30" fill="#030a12" stroke="#3aa9d2" strokeWidth="2" />
                  <text y="5" textAnchor="middle" className="adv-tag fill-paper" style={{ font: "600 12px var(--font-geist-mono)", letterSpacing: "0.08em" }}>
                    GAVEA
                  </text>
                </g>

                {/* os três papéis, ancorados no diagrama */}
                <text data-adv-role x={(CLIENT.x + GAVEA.x) / 2} y={CLIENT.y - 30} textAnchor="middle" fill="#f3f1ec" className="adv-lbl" style={{ fontFamily: "var(--font-geist-mono)", fontWeight: 500, letterSpacing: "0.06em" }}>
                  1 · CONTRAPARTE
                </text>
                <text data-adv-role x={GAVEA.x} y={GAVEA.y + 64} textAnchor="middle" fill="#3aa9d2" className="adv-lbl" style={{ fontFamily: "var(--font-geist-mono)", fontWeight: 500, letterSpacing: "0.06em" }}>
                  2 · COORDENA
                </text>
                <text data-adv-role x={450} y={414} textAnchor="middle" fill="#9cc9dc" className="adv-lbl" style={{ fontFamily: "var(--font-geist-mono)", fontWeight: 500, letterSpacing: "0.06em" }}>
                  <tspan x={450}>3 · PARCEIROS LOCAIS,</tspan>
                  <tspan x={450} dy="1.25em">QUANDO NECESSÁRIO</tspan>
                </text>

                {/* portos */}
                {PORTS.map((p, i) => (
                  <g key={p.k} transform={`translate(${p.x} ${p.y})`}>
                    {i === 0 && (
                      <circle data-adv-picked r="20" fill="none" stroke="#3aa9d2" strokeWidth="1.5" strokeDasharray="3 4" />
                    )}
                    <circle r="9" fill="#030a12" stroke={i === 0 ? "#3aa9d2" : "#9aa8b6"} strokeWidth="1.4" />
                    <text x="-16" y="-14" textAnchor="end" className="fill-paper" style={{ font: "500 12px var(--font-geist-mono)", letterSpacing: "0.05em" }}>
                      {p.k.toUpperCase()}
                    </text>
                    <text data-adv-role-a x="-16" y="4" textAnchor="end" className="adv-sub fill-faint rm-hide" style={{ font: "400 12px var(--font-archivo)" }}>
                      Fornecedor {i + 1}
                    </text>
                    <text data-adv-role-b x="-16" y="4" textAnchor="end" fill="#9cc9dc" className="adv-sub" style={{ font: "400 12px var(--font-archivo)" }}>
                      {i === 0 ? "Parceiro acionado" : "Parceiro homologado"}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
