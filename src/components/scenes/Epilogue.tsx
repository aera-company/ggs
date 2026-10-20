"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { RESET_EVENT } from "@/lib/scenes";
import { useScrollScene } from "../motion/useScrollScene";
import { useLenis } from "../motion/SmoothScroll";
import { AssetImage } from "../ui/AssetImage";
import { SplitWords } from "../ui/SplitWords";

// Link validado em 19/10/2026 (HTTP 200). Projeto independente da AERA.
const BUILD2030_URL = "https://build-2030.vercel.app";

export function Epilogue() {
  const ref = useRef<HTMLElement>(null);
  const lenis = useLenis();

  useScrollScene(ref, (el) => {
    const l1 = el.querySelectorAll("[data-ep-1] .split-word > span");
    const l2 = el.querySelectorAll("[data-ep-2] .split-word > span");
    const lines = el.querySelector("[data-ep-lines]");
    const horizon = el.querySelector("[data-ep-horizon]");
    const year = el.querySelector<HTMLElement>("[data-ep-year]")!;
    const frame = el.querySelector("[data-ep-frame]");
    const img = el.querySelector("[data-ep-img]");
    const reveal = gsap.utils.toArray<HTMLElement>("[data-ep-reveal]", el);

    gsap.set([l1, l2], { yPercent: 110 });
    gsap.set(horizon, { scaleX: 0, autoAlpha: 1 });
    gsap.set(year, { autoAlpha: 0, y: 10 });
    gsap.set(frame, { clipPath: "inset(49.8% 0% 49.8% 0%)", opacity: 0 });
    // texto some só visualmente (continua para leitores de tela); o link some de fato até aparecer
    const isLink = (r: HTMLElement) => r.tagName === "A";
    reveal.forEach((r) => gsap.set(r, isLink(r) ? { autoAlpha: 0, y: 18 } : { opacity: 0, y: 18 }));

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el.querySelector(".pin-track"), start: "top top", end: "bottom bottom", scrub: 0.6 },
    });

    // 1. a ponte em duas frases
    tl.to(l1, { yPercent: 0, stagger: 0.01, duration: 0.08 }, 0.02);
    tl.to(l2, { yPercent: 0, stagger: 0.01, duration: 0.08 }, 0.12);
    tl.to(lines, { autoAlpha: 0, y: -30, duration: 0.06 }, 0.3);

    // 2. um horizonte e o tempo avançando até 2030
    tl.to(horizon, { scaleX: 1, duration: 0.1, ease: "power2.inOut" }, 0.28);
    tl.to(year, { autoAlpha: 1, y: 0, duration: 0.04 }, 0.33);
    const counter = { v: 2026 };
    tl.to(
      counter,
      {
        v: 2030,
        duration: 0.16,
        ease: "power1.inOut",
        onUpdate: () => {
          year.textContent = String(Math.round(counter.v));
        },
      },
      0.34,
    );
    tl.to(year, { autoAlpha: 0, y: -16, duration: 0.04 }, 0.52);

    // 3. o horizonte se abre na visão BUILD 2030
    tl.set(frame, { opacity: 1 }, 0.53);
    tl.to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.16, ease: "power3.inOut" }, 0.53);
    tl.to(horizon, { autoAlpha: 0, duration: 0.05 }, 0.58);
    tl.fromTo(img, { scale: 1.22 }, { scale: 1, duration: 0.4, ease: "power1.out" }, 0.53);
    reveal.forEach((r, i) => tl.to(r, isLink(r) ? { autoAlpha: 1, y: 0, duration: 0.05 } : { opacity: 1, y: 0, duration: 0.05 }, 0.72 + i * 0.035));
    tl.to({}, { duration: 0.06 }, 0.94);
  });

  const restart = () => {
    window.dispatchEvent(new Event(RESET_EVENT));
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
  };

  return (
    <section ref={ref} id="next" data-header-theme="dark" className="scene bg-abyss" aria-label="07 · The next GAVEA">
      <div className="pin-track" style={{ ["--track" as string]: 300 }}>
        <div className="pin-stage rm-flow">
          <div data-ep-lines className="wrap absolute inset-0 flex flex-col justify-center gap-6 rm-static">
            <p data-ep-1 className="t-l max-w-[26ch] text-mist">
              <SplitWords text="Uma nova plataforma pode abrir novos mercados." />
            </p>
            <p data-ep-2 className="t-l max-w-[26ch]">
              <SplitWords text="Uma visão de futuro pode preparar a GAVEA para todos eles." />
            </p>
          </div>

          {/* horizonte + ano: transição curta para a segunda conversa */}
          <div className="pointer-events-none absolute inset-0 rm-hide" aria-hidden="true">
            <div data-ep-horizon className="absolute inset-x-0 top-1/2 h-px origin-center bg-signal shadow-[0_0_30px_6px_rgba(58,169,210,0.45)]" style={{ transform: "scaleX(0)" }} />
            <p
              data-ep-year
              className="absolute inset-x-0 bottom-[calc(50%+2.5vh)] text-center font-mono text-[clamp(3.5rem,11vw,10rem)] font-light leading-none tracking-[-0.04em] text-paper/90 tabular-nums"
              style={{ opacity: 0 }}
            >
              2026
            </p>
          </div>

          <div data-ep-frame className="absolute inset-0 overflow-hidden rm-static" style={{ minHeight: "100%" }}>
            <AssetImage id="build2030" data-ep-img />
            <div className="absolute inset-0 bg-abyss/45" />
            <div className="absolute inset-0 scrim-b" />

            <div className="wrap absolute inset-x-0 bottom-[10vh] rm-static">
              <p data-ep-reveal className="t-label mb-6 text-paper/80">
                The next GAVEA
              </p>
              <h2 data-ep-reveal className="t-mega">
                GAVEA BUILD 2030
              </h2>
              <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div data-ep-reveal>
                  <p className="t-m text-paper">One GAVEA. One Direction.</p>
                  <p className="t-body mt-3 text-mist">
                    Uma visão independente da AERA para posicionamento, comunicação, marketing e tecnologia da próxima fase da GAVEA.
                  </p>
                  <p className="mt-4 text-[0.95rem] text-paper/90">Uma segunda conversa: como a GAVEA chega a 2030.</p>
                </div>
                <a data-ep-reveal href={BUILD2030_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost self-start bg-abyss/40 backdrop-blur md:self-auto">
                  Conhecer BUILD 2030
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M3.5 2.5h6v6M9.5 2.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                  <span className="sr-only">(abre em nova aba)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative border-t border-paper/10 bg-abyss">
        <div className="wrap flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between md:py-16">
          <div className="space-y-5">
            <p className="t-label text-faint">Concept experience by</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/aera.svg" alt="AERA" width={464} height={132} loading="lazy" className="h-[34px] w-auto opacity-90" />
            <p className="max-w-[56ch] text-[0.8rem] leading-relaxed text-faint">
              Conceito estratégico e protótipo demonstrativo para a liderança da GAVEA GROUP. Cenários, localidades, parceiros, embarcações e dados são ilustrativos. Imagens marcadas como conceituais foram geradas para direção de arte. Outubro de 2026.
            </p>
          </div>
          <button type="button" onClick={restart} className="btn-ghost self-start md:self-auto">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 6a4 4 0 1 0 1.2-2.85M2 1.5V4h2.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            Restart experience
          </button>
        </div>
      </footer>
    </section>
  );
}
