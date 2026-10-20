"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { WorldMap, ROUTES } from "../motion/WorldMap";
import { SplitWords } from "../ui/SplitWords";

const BEATS = [
  {
    k: "Portos, prazos, jurisdições",
    t: "Compradores marítimos enfrentam demandas operacionais em portos, prazos e jurisdições diferentes.",
  },
  {
    k: "Uma solicitação",
    t: "Um navio em Singapura precisa de tank cleaning. Quem coordena, contrata e responde pelo serviço?",
  },
  {
    k: "A tese",
    t: "Um único interlocutor comercial capaz de coordenar o serviço em outra geografia, sob condições validadas.",
  },
];

export function Opportunity() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el) => {
    const svg = el.querySelector("svg")!;
    const stop = svg.querySelector("[data-reveal-stop]")!;
    const edge = svg.querySelector("[data-reveal-edge]")!;
    const arcs = ROUTES.map((k) => svg.querySelector<SVGPathElement>(`[data-arc="${k}"]`)!);
    const ports = gsap.utils.toArray<SVGGElement>("[data-port]", svg);
    const pulse = svg.querySelector<SVGGElement>("[data-pulse]")!;
    const pulseLabel = svg.querySelector<SVGGElement>("[data-pulse-label]")!;
    const sgArc = svg.querySelector<SVGPathElement>('[data-arc="singapore"]')!;
    const beats = gsap.utils.toArray<HTMLElement>("[data-beat]", el);
    const len = sgArc.getTotalLength();

    gsap.set(stop, { attr: { offset: 0 } });
    gsap.set(edge, { attr: { offset: 0.02 } });
    gsap.set(arcs, { attr: { "stroke-dashoffset": 1 } });
    gsap.set(ports, { autoAlpha: 0 });
    gsap.set(beats.slice(1), { autoAlpha: 0, y: 16 });

    // título entra antes do pin
    gsap.from(el.querySelectorAll("[data-title] .split-word > span"), {
      yPercent: 110,
      stagger: 0.04,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el.querySelector(".pin-track"), start: "top top", end: "bottom bottom", scrub: 0.6 },
    });

    tl.to(stop, { attr: { offset: 1 }, duration: 0.28, ease: "power1.in" }, 0.02);
    tl.to(edge, { attr: { offset: 1 }, duration: 0.28, ease: "power1.in" }, 0.02);
    tl.fromTo("[data-home-ring]", { attr: { r: 4 } }, { attr: { r: 14 }, duration: 0.1 }, 0.1);

    arcs.forEach((arc, i) => {
      tl.to(arc, { attr: { "stroke-dashoffset": 0 }, duration: 0.14, ease: "power2.inOut" }, 0.22 + i * 0.05);
      tl.to(ports[i], { autoAlpha: 1, duration: 0.04 }, 0.32 + i * 0.05);
    });

    tl.to(beats[0], { autoAlpha: 0, y: -16, duration: 0.05 }, 0.4);
    tl.to(beats[1], { autoAlpha: 1, y: 0, duration: 0.05 }, 0.45);

    // a solicitação viaja de Singapura até a GAVEA
    const pos = { t: 0 };
    tl.set(pulse, { opacity: 1 }, 0.48);
    tl.set(pulseLabel, { opacity: 1 }, 0.48);
    tl.to(
      pos,
      {
        t: 1,
        duration: 0.26,
        ease: "power1.inOut",
        onUpdate: () => {
          const pt = sgArc.getPointAtLength(len * (1 - pos.t));
          pulse.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
          pulseLabel.setAttribute("transform", `translate(${pt.x + 14} ${pt.y - 10})`);
        },
      },
      0.48,
    );
    tl.to(pulseLabel, { opacity: 0, duration: 0.04 }, 0.74);
    tl.fromTo("[data-home-ring]", { attr: { r: 6 } }, { attr: { r: 22 }, duration: 0.08, ease: "power2.out" }, 0.74);

    tl.to(beats[1], { autoAlpha: 0, y: -16, duration: 0.05 }, 0.78);
    tl.to(beats[2], { autoAlpha: 1, y: 0, duration: 0.05 }, 0.82);
    tl.to({}, { duration: 0.1 }, 0.9);
  });

  return (
    <section
      ref={ref}
      id="opportunity"
      data-header-theme="dark" className="scene"
      style={{ background: "radial-gradient(120% 90% at 70% 40%, #0b2539 0%, #050f1a 55%, #030a12 100%)" }}
      aria-label="01 · A oportunidade"
    >
      <div className="pin-track" style={{ ["--track" as string]: 340 }}>
        <div className="pin-stage rm-flow">
          <div className="wrap relative flex h-full flex-col pt-[calc(var(--header-h)+5vh)] pb-[7vh] rm-static">
            <div className="relative z-10 flex items-start justify-between gap-8">
              <div>
                <p className="t-label mb-5 text-signal">01 · A oportunidade</p>
                <h2 data-title className="t-xl">
                  <SplitWords text="A operação se move." className="block" />
                  <SplitWords text="A necessidade acompanha." className="block text-mist" />
                </h2>
              </div>
            </div>

            <div className="pointer-events-none absolute -left-[46%] -right-[6%] top-[30%] bottom-[30%] md:inset-auto md:bottom-[8%] md:left-[22%] md:right-[1%] md:top-[14%] rm-static">
              <WorldMap className="h-full w-full" />
            </div>
            <div className="flex-1" />

            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="relative min-h-[8.5rem] max-w-[34rem] md:min-h-[7.5rem]">
                {BEATS.map((b, i) => (
                  <div key={b.k} data-beat className={`${i === 0 ? "relative" : "absolute inset-x-0 top-0"} rm-static rm-visible`}>
                    <p className="t-label mb-3 text-faint">{b.k}</p>
                    <p className={`t-m ${i === 2 ? "text-paper" : "text-mist"}`}>{b.t}</p>
                  </div>
                ))}
              </div>
              <div className="t-label space-y-2 text-[0.62rem] text-faint md:text-right">
                <p className="flex items-center gap-2 md:justify-end">
                  <span className="inline-block size-2 rounded-full bg-paper" aria-hidden="true" /> GAVEA · Brasil
                </p>
                <p className="flex items-center gap-2 md:justify-end">
                  <span className="inline-block size-2 rounded-full border border-signal" aria-hidden="true" /> Portos de cenário hipotético
                </p>
                <p className="max-w-[30ch] normal-case tracking-normal md:ml-auto">Não representa cobertura, parceiros ou operações existentes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
