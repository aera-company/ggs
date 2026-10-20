"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ASSETS, HERO_RIG } from "@/lib/assets";
import { HeroCanvas } from "../motion/HeroCanvas";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";
import { useLenis } from "../motion/SmoothScroll";

const LINES = [
  "Um navio em Singapura precisa de limpeza de tanques.",
  "O desafio não é só encontrar um fornecedor.",
  "É ter alguém que responda pelo resultado.",
];

export function ColdOpen() {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const lenis = useLenis();

  useScrollScene(ref, (el, { desktop }) => {
    const lines = gsap.utils.toArray<HTMLElement>("[data-line]", el);
    const reveal = el.querySelector("[data-reveal]");
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: el.querySelector(".pin-track"),
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => (progressRef.current = self.progress),
      },
    });

    // estado inicial: primeira linha entra na carga da página, não no scroll
    lines.forEach((line, i) => {
      gsap.set(line, { autoAlpha: i === 0 ? 1 : 0 });
    });
    gsap.from(lines[0].querySelectorAll(".split-word > span"), {
      yPercent: 110,
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.06,
      delay: 0.5,
    });
    gsap.from("[data-intro]", { autoAlpha: 0, y: 12, duration: 1.2, ease: "power3.out", delay: 1.1, stagger: 0.12 });

    const wordsOut = (line: HTMLElement) => line.querySelectorAll(".split-word > span");

    // linha 1 sai
    tl.to(wordsOut(lines[0]), { yPercent: -110, stagger: 0.006, duration: 0.05 }, 0.12);
    tl.set(lines[0], { autoAlpha: 0 }, 0.2);

    // linha 2: entra, segura, sai
    tl.set(lines[1], { autoAlpha: 1 }, 0.19);
    tl.from(wordsOut(lines[1]), { yPercent: 110, stagger: 0.006, duration: 0.05 }, 0.2);
    tl.to(wordsOut(lines[1]), { yPercent: -110, stagger: 0.005, duration: 0.05 }, 0.38);
    tl.set(lines[1], { autoAlpha: 0 }, 0.45);

    // linha 3
    tl.set(lines[2], { autoAlpha: 1 }, 0.44);
    tl.from(wordsOut(lines[2]), { yPercent: 110, stagger: 0.008, duration: 0.05 }, 0.45);
    tl.to(wordsOut(lines[2]), { yPercent: -110, stagger: 0.006, duration: 0.05 }, 0.6);
    tl.set(lines[2], { autoAlpha: 0 }, 0.67);

    // revelação da marca
    tl.fromTo(reveal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.68);
    tl.from(el.querySelectorAll("[data-reveal] .split-word > span"), { yPercent: 110, stagger: 0.015, duration: 0.08 }, 0.68);
    tl.from("[data-reveal-sub]", { autoAlpha: 0, y: 24, duration: 0.06, stagger: 0.02 }, 0.76);
    tl.to("[data-scroll-hint]", { autoAlpha: 0, duration: 0.03 }, 0.01);
    tl.to("[data-hud]", { yPercent: desktop ? 0 : 0, autoAlpha: 0.5, duration: 0.2 }, 0.7);
    tl.to({}, { duration: 0.06 }, 0.94);
  });

  const explore = () => {
    const target = document.getElementById("opportunity");
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.8 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="request" data-header-theme="dark" className="scene bg-abyss" aria-label="00 · The request">
      <div className="pin-track" style={{ ["--track" as string]: 420 }}>
        <div className="pin-stage rm-flow">
          <HeroCanvas asset={ASSETS.heroVessel} rig={HERO_RIG} progressRef={progressRef} />
          <div className="absolute inset-0 scrim-b opacity-80" aria-hidden="true" />

          {/* HUD técnico: cenário identificado como ilustrativo */}
          <div data-hud className="wrap rm-static absolute inset-x-0 top-[calc(var(--header-h)+24px)] flex items-start justify-between">
            <div data-intro className="t-label space-y-1 text-mist">
              <p className="text-paper">Singapore · Marine operations</p>
              <p className="text-faint">1°16′N 103°50′E</p>
            </div>
            <p data-intro className="t-label whitespace-nowrap rounded-full border border-paper/20 px-3 py-1 text-[0.62rem] text-mist">
              <span className="hidden sm:inline">Cenário </span>ilustrativo
            </p>
          </div>

          {/* sequência de frases */}
          <div className="wrap absolute inset-x-0 bottom-[16vh] md:bottom-[14vh] rm-static">
            <div className="relative min-h-[2.2em] t-xl max-w-[15ch] md:max-w-[19ch]">
              {LINES.map((l, i) => (
                <p key={l} data-line className={`${i === 0 ? "relative" : "absolute inset-x-0 bottom-0"} rm-static`}>
                  <SplitWords text={l} />
                </p>
              ))}
            </div>
          </div>

          {/* revelação */}
          <div data-reveal className="wrap invisible absolute inset-x-0 bottom-[12vh] rm-visible rm-static">
            <p data-reveal-sub className="t-label mb-6 text-signal">Concept · GAVEA GROUP</p>
            <h1 className="t-mega">
              <SplitWords text="GAVEA Global Services" />
            </h1>
            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <p data-reveal-sub className="t-m max-w-[30ch] text-mist">
                From request to execution. <span className="text-paper">Beyond borders.</span>
              </p>
              <button data-reveal-sub type="button" onClick={explore} className="btn-ghost self-start md:self-auto">
                Explorar o conceito
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M7 2v10M3 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>
          </div>

          <div data-scroll-hint className="rm-hide absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
            <div className="animate-[fadein_1s_ease-out_1.6s_both]">
              <span className="t-label text-[0.6rem] text-faint">Scroll</span>
              <span className="mx-auto mt-2 block h-8 w-px overflow-hidden bg-paper/15">
                <span className="block h-1/2 w-full animate-[hint_2.2s_ease-in-out_infinite] bg-paper/70" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
