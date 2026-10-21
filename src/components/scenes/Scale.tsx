"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";

/**
 * Escalabilidade: a mesma cadeia de valor aplicada a outras categorias.
 * Tank Cleaning é o cenário desta apresentação; as demais são possibilidades a validar.
 */

const CHAIN = ["Recebe", "Qualifica", "Contrata", "Propõe", "Coordena"];

const ROLL: { name: string; domain: string; demo?: boolean }[] = [
  { name: "Tank cleaning", domain: "Marítimo", demo: true },
  { name: "Limpeza de casco", domain: "Marítimo" },
  { name: "Inspeção subaquática", domain: "Marítimo" },
  { name: "Manutenção offshore", domain: "Offshore" },
  { name: "Equipes técnicas embarcadas", domain: "Offshore" },
  { name: "Limpeza industrial", domain: "Industrial" },
];

const CATALOG: { domain: string; items: string[] }[] = [
  { domain: "Marítimo", items: ["Tank cleaning", "Limpeza de casco", "Inspeção subaquática", "Reparos a bordo"] },
  { domain: "Offshore", items: ["Inspeção e manutenção", "Equipes técnicas embarcadas", "Apoio logístico"] },
  { domain: "Industrial", items: ["Limpeza industrial", "Inspeção de equipamentos", "Manutenção de tubulações"] },
];

export function Scale() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el) => {
    const names = gsap.utils.toArray<HTMLElement>("[data-sc-name]", el);
    const tags = gsap.utils.toArray<HTMLElement>("[data-sc-tag]", el);
    const nodes = gsap.utils.toArray<HTMLElement>("[data-sc-node]", el);
    const chips = gsap.utils.toArray<HTMLElement>("[data-sc-chip]", el);

    gsap.set(names.slice(1), { yPercent: 105, autoAlpha: 0 });
    gsap.set(tags.slice(1), { autoAlpha: 0 });
    gsap.set(chips, { opacity: 0.35 });

    gsap.from(el.querySelectorAll("[data-sc-title] .split-word > span"), {
      yPercent: 110,
      stagger: 0.04,
      duration: 1.1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el.querySelector(".pin-track"), start: "top top", end: "bottom bottom", scrub: 0.5 },
    });

    const step = 0.8 / (ROLL.length - 1);
    for (let i = 1; i < ROLL.length; i++) {
      const at = 0.08 + (i - 1) * step + step * 0.5;
      tl.to(names[i - 1], { yPercent: -105, autoAlpha: 0, duration: 0.05, ease: "power2.in" }, at);
      tl.fromTo(names[i], { yPercent: 105, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.05, ease: "power2.out" }, at + 0.02);
      tl.to(tags[i - 1], { autoAlpha: 0, duration: 0.03 }, at);
      tl.to(tags[i], { autoAlpha: 1, duration: 0.03 }, at + 0.03);
      // a cadeia "processa" cada nova categoria
      tl.fromTo(nodes, { backgroundColor: "rgba(58,169,210,0.35)" }, { backgroundColor: "rgba(58,169,210,0.08)", duration: 0.06, stagger: 0.008 }, at + 0.02);
    }
    tl.to(chips, { opacity: 1, duration: 0.12, stagger: 0.006 }, 0.55);
    tl.to({}, { duration: 0.06 }, 0.94);
  });

  return (
    <section ref={ref} id="scale" data-header-theme="dark" className="scene bg-navy-deep" aria-label="02 · Um modelo, muitos serviços">
      <div className="pin-track" style={{ ["--track" as string]: 170 }}>
        <div className="pin-stage rm-flow">
          <div className="wrap flex h-full flex-col justify-center gap-10 pt-[calc(var(--header-h)+3vh)] pb-[5vh] md:gap-14 rm-static">
            <div className="grid gap-6 md:grid-cols-[1fr_0.9fr] md:items-end">
              <div>
                <p className="t-label mb-5 text-signal">02 · Escala</p>
                <h2 data-sc-title className="t-xl">
                  <SplitWords text="Um modelo." className="block" />
                  <SplitWords text="Muitos serviços." className="block text-mist" />
                </h2>
              </div>
              <p className="t-body text-mist md:justify-self-end">
                O que funciona para tank cleaning pode se repetir em outras categorias, uma a uma, depois de validar demanda, parceiros e responsabilidades.
              </p>
            </div>

            {/* categoria passando pela mesma cadeia */}
            <div className="rounded-[20px] border border-paper/10 bg-abyss/70 p-5 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="relative mb-3 h-[1.4rem] rm-h-auto">
                    {ROLL.map((r) => (
                      <p key={r.name} data-sc-tag className="t-label absolute inset-x-0 top-0 whitespace-nowrap text-faint rm-static rm-visible">
                        {r.domain} · <span className={r.demo ? "text-signal" : "text-[#e4a66b]"}>{r.demo ? "cenário desta apresentação" : "a validar"}</span>
                      </p>
                    ))}
                  </div>
                  <div className="t-l relative h-[1.12em] overflow-hidden rm-h-auto" style={{ fontSize: "clamp(1.9rem, 4.6vw, 4.6rem)", lineHeight: 1.05 }}>
                    {ROLL.map((r) => (
                      <p key={r.name} data-sc-name className="absolute inset-x-0 top-0 whitespace-nowrap rm-static rm-visible">
                        {r.name}
                      </p>
                    ))}
                  </div>
                </div>
                <ol className="grid grid-cols-5 gap-1.5 md:w-[46%] md:gap-2" aria-label="Mesma cadeia de valor para cada categoria">
                  {CHAIN.map((c, i) => (
                    <li key={c} data-sc-node className="rounded-[12px] border border-signal/40 px-1 py-3 text-center" style={{ backgroundColor: "rgba(58,169,210,0.08)" }}>
                      <span className="block font-mono text-[0.7rem] text-signal">{i + 1}</span>
                      <span className="mt-0.5 block text-[0.72rem] text-paper md:text-[0.88rem]">{c}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* catálogo de possibilidades */}
            <div className="grid gap-6 md:grid-cols-3">
              {CATALOG.map((g) => (
                <div key={g.domain}>
                  <p className="t-label mb-3 text-faint">{g.domain}</p>
                  <ul className="flex flex-wrap gap-2">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        data-sc-chip
                        className={`rounded-full border px-3 py-1.5 text-[0.86rem] rm-visible ${it === "Tank cleaning" ? "border-signal/70 text-paper" : "border-paper/15 text-paper/85"}`}
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="-mt-4 text-[0.82rem] text-faint md:-mt-6">Possibilidades a validar. Nenhuma categoria além do cenário de demonstração é oferta atual.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
