"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { SEQ, SEQ_VESSEL_RIG, largest, srcSet, type Asset } from "@/lib/assets";
import { HeroCanvas } from "../motion/HeroCanvas";
import { GlobeNetwork, HUB } from "../motion/GlobeNetwork";
import { useScrollScene } from "../motion/useScrollScene";
import { SplitWords } from "../ui/SplitWords";
import { useLenis } from "../motion/SmoothScroll";

const LINES = [
  "Um navio pode estar em qualquer porto do mundo.",
  "E precisar de um serviço antes da próxima carga.",
  "O desafio não é encontrar um fornecedor.",
  "É ter alguém que responda pelo resultado.",
];

// rótulos do canto superior, um por trecho da sequência
const HUD = [
  ["Global network", "Brazil · Atlantic"],
  ["Rio de Janeiro · Guanabara Bay", "22°54′S 43°10′W"],
  ["Marine operations", "Port of Rio de Janeiro"],
];

// tamanho da placa: a maior dimensão que cobre a tela (ver .seq-plate)
const PLATE_SIZES = "(max-aspect-ratio: 2752/1536) 179vh, 100vw";

function Plate({ name, asset, eager, children }: { name: string; asset: Asset; eager?: boolean; children?: ReactNode }) {
  return (
    <div
      data-plate={name}
      className="seq-plate"
      style={{ ["--fx" as string]: asset.focal.x, ["--fy" as string]: asset.focal.y }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={largest(asset).src}
        srcSet={srcSet(asset)}
        sizes={PLATE_SIZES}
        alt=""
        fetchPriority={eager ? "high" : "low"}
        decoding="async"
      />
      {children}
    </div>
  );
}

export function ColdOpen() {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const heroActive = useRef(false);
  const lenis = useLenis();

  useScrollScene(ref, (el, { desktop }) => {
    const q = (s: string) => el.querySelector<HTMLElement>(s)!;
    const lines = gsap.utils.toArray<HTMLElement>("[data-line]", el);
    const reveal = q("[data-reveal]");
    const globe = q('[data-plate="globe"]');
    const rio = q('[data-plate="rio"]');
    const port = q('[data-plate="port"]');
    const dock = q('[data-plate="dock"]');
    const flash = q("[data-flash]");
    const net = q("[data-network]");
    const arcs = gsap.utils.toArray<SVGGElement>("[data-arc]", el);
    const hud = gsap.utils.toArray<HTMLElement>("[data-hud-step]", el);

    // trechos da sequência, em progresso do pin (0 a 1)
    const HERO_AT = 0.72;
    let live = true;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: el.querySelector(".pin-track"),
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = gsap.utils.clamp(0, 1, (p - HERO_AT) / (1 - HERO_AT));
          heroActive.current = p > 0.6;
          // pulsos e anel do hub só rodam enquanto o globo está em cena
          if (p < 0.3 !== live) {
            live = p < 0.3;
            net.classList.toggle("is-live", live);
          }
        },
      },
    });
    net.classList.add("is-live");

    // ---------- carga da página: primeira frase e rótulos ----------
    lines.forEach((line, i) => gsap.set(line, { autoAlpha: i === 0 ? 1 : 0 }));
    gsap.from(lines[0].querySelectorAll(".split-word > span"), {
      yPercent: 110,
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.06,
      delay: 0.5,
    });
    gsap.from("[data-intro]", { autoAlpha: 0, y: 12, duration: 1.2, ease: "power3.out", delay: 1.1, stagger: 0.12 });
    gsap.set(hud.slice(1), { autoAlpha: 0 });
    // o globo surge do escuro e o hub acende sozinho
    gsap.from(globe.querySelector("img"), { opacity: 0, duration: 1.8, ease: "power2.out" });
    gsap.fromTo("[data-hub]", { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.9 });

    // ---------- 01 · globo: rotas acendem uma por vez, push-in lento ----------
    const hubOrigin = `${(HUB.x / 2752) * 100}% ${(HUB.y / 1536) * 100}%`;
    gsap.set(globe, { transformOrigin: hubOrigin });
    tl.to(globe, { scale: 1.1, duration: 0.22 }, 0);
    arcs.forEach((arc, i) => {
      const at = 0.03 + i * 0.016;
      const strokes = arc.querySelectorAll(".seq-arc, .seq-arc-halo");
      tl.to(strokes, { strokeDashoffset: 0, duration: 0.036, ease: "power1.inOut" }, at);
      tl.to(arc.querySelectorAll("[data-pulse]"), { opacity: 0.9, duration: 0.012 }, at + 0.03);
      const node = arc.querySelector("[data-node]");
      if (node) tl.from(node, { opacity: 0, duration: 0.012 }, at + 0.032);
    });

    // ---------- passagem: mergulho no Rio, encoberto por um clarão quente ----------
    // leva o hub ao centro da tela enquanto amplia
    const toCenter = (axis: "x" | "y") => () => {
      const r = globe.offsetLeft + (HUB.x / 2752) * globe.offsetWidth;
      const b = globe.offsetTop + (HUB.y / 1536) * globe.offsetHeight;
      return axis === "x" ? window.innerWidth / 2 - r : window.innerHeight / 2 - b;
    };
    tl.to(globe, { scale: 3.4, x: toCenter("x"), y: toCenter("y"), duration: 0.09, ease: "power2.in" }, 0.22);
    tl.to(net, { opacity: 0, duration: 0.04 }, 0.235);
    tl.to(flash, { opacity: 0.9, duration: 0.03, ease: "power1.in" }, 0.255);
    tl.to(globe, { opacity: 0, duration: 0.02 }, 0.27);
    tl.to(flash, { opacity: 0, duration: 0.05, ease: "power1.out" }, 0.285);

    // ---------- 02 · Rio: chega do alto e desce até o porto ----------
    gsap.set(rio, { transformOrigin: "52% 82%" });
    tl.fromTo(rio, { scale: 1.32 }, { scale: 1, duration: 0.15, ease: "power2.out" }, 0.27);
    tl.to(rio, { scale: 1.9, duration: 0.085, ease: "power1.in" }, 0.415);
    tl.to(rio, { opacity: 0, duration: 0.022 }, 0.48);
    // descida: um véu de luz curto esconde a troca de ponto de vista
    tl.to(flash, { opacity: 0.55, duration: 0.014, ease: "power1.in" }, 0.474);
    tl.to(flash, { opacity: 0, duration: 0.03, ease: "power1.out" }, 0.488);

    gsap.set(port, { transformOrigin: "66% 55%" });
    tl.fromTo(port, { scale: 1.2 }, { scale: 1, duration: 0.08, ease: "power2.out" }, 0.48);
    tl.to(port, { scale: 1.24, duration: 0.07, ease: "power1.in" }, 0.555);

    // ---------- 03 · porto: corte casado com um clarão curto, depois o master ----------
    tl.to(flash, { opacity: 0.7, duration: 0.018, ease: "power1.in" }, 0.612);
    tl.to(port, { opacity: 0, duration: 0.004 }, 0.627);
    tl.to(flash, { opacity: 0, duration: 0.04, ease: "power1.out" }, 0.632);

    // termina perto do enquadramento do master (proa maior, superestrutura no mesmo lugar)
    gsap.set(dock, { transformOrigin: "66% 30%" });
    tl.fromTo(dock, { scale: 1 }, { scale: 1.52, duration: 0.1, ease: "power1.inOut" }, 0.628);
    tl.to(dock, { opacity: 0, duration: 0.022 }, 0.702);

    // rótulos do canto acompanham o lugar
    tl.to(hud[0], { autoAlpha: 0, duration: 0.02 }, 0.27).to(hud[1], { autoAlpha: 1, duration: 0.02 }, 0.29);
    tl.to(hud[1], { autoAlpha: 0, duration: 0.02 }, 0.49).to(hud[2], { autoAlpha: 1, duration: 0.02 }, 0.51);

    // ---------- frases ----------
    const words = (line: HTMLElement) => line.querySelectorAll(".split-word > span");
    const SLOTS = [
      [0, 0.09],
      [0.11, 0.2],
      [0.36, 0.46],
      [0.53, 0.64],
    ];
    lines.forEach((line, i) => {
      const [inAt, outAt] = SLOTS[i];
      if (i > 0) {
        tl.set(line, { autoAlpha: 1 }, inAt - 0.005);
        tl.from(words(line), { yPercent: 110, stagger: 0.004, duration: 0.03 }, inAt);
      }
      tl.to(words(line), { yPercent: -110, stagger: 0.003, duration: 0.025 }, outAt);
      tl.set(line, { autoAlpha: 0 }, outAt + 0.045);
    });

    // ---------- revelação da marca sobre o navio ----------
    tl.fromTo(reveal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.02 }, 0.76);
    tl.from(el.querySelectorAll("[data-reveal] .split-word > span"), { yPercent: 110, stagger: 0.012, duration: 0.05 }, 0.76);
    tl.from("[data-reveal-sub]", { autoAlpha: 0, y: 24, duration: 0.04, stagger: 0.015 }, 0.81);
    tl.to("[data-scroll-hint]", { autoAlpha: 0, duration: 0.03 }, 0.01);
    tl.to("[data-hud]", { yPercent: desktop ? 0 : 0, autoAlpha: 0.5, duration: 0.12 }, 0.78);
    tl.to({}, { duration: 0.06 }, 0.94);

    return () => net.classList.remove("is-live");
  });

  const explore = () => {
    const target = document.getElementById("opportunity");
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 1.8 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={ref} id="request" data-header-theme="dark" className="scene bg-abyss" aria-label="00 · The request">
      <div className="pin-track" style={{ ["--track" as string]: 760 }}>
        <div className="pin-stage rm-flow">
          {/* master final: o hero WebGL atual (água viva e dolly) recebe a sequência */}
          <HeroCanvas asset={SEQ.vessel} rig={SEQ_VESSEL_RIG} progressRef={progressRef} activeRef={heroActive} cover />

          {/* sequência mundo → Brasil → porto, por cima do hero. As placas ficam sempre
              pintadas, empilhadas na ordem inversa: cada troca só apaga a de cima
              (ocultar e mostrar faz o Safari decodificar a imagem de novo no corte). */}
          <div className="rm-hide absolute inset-0 overflow-hidden" aria-hidden="true">
            <Plate name="dock" asset={SEQ.dock} />
            <Plate name="port" asset={SEQ.port} />
            <Plate name="rio" asset={SEQ.rio} />
            <Plate name="globe" asset={SEQ.globe} eager>
              <GlobeNetwork />
            </Plate>
            <div data-flash className="seq-flash absolute inset-0" />
          </div>
          <span className="sr-only">{SEQ.globe.alt} {SEQ.rio.alt} {SEQ.vessel.alt}</span>

          <div className="absolute inset-0 scrim-b opacity-80" aria-hidden="true" />

          {/* HUD técnico: cenário identificado como ilustrativo */}
          <div data-hud className="wrap rm-static absolute inset-x-0 top-[calc(var(--header-h)+24px)] flex items-start justify-between">
            <div data-intro className="t-label relative text-mist">
              {HUD.map(([a, b], i) => (
                <div key={a} data-hud-step className={`${i ? "absolute left-0 top-0 rm-hide" : ""} space-y-1 whitespace-nowrap`}>
                  <p className="text-paper">{a}</p>
                  <p className="text-faint">{b}</p>
                </div>
              ))}
            </div>
            <p data-intro className="t-label whitespace-nowrap rounded-full border border-paper/20 px-3 py-1 text-[0.62rem] text-mist">
              <span className="hidden sm:inline">Cenário </span>ilustrativo
            </p>
          </div>

          {/* sequência de frases */}
          <div className="wrap absolute inset-x-0 bottom-[16vh] md:bottom-[14vh] rm-static">
            <div className="relative min-h-[2.2em] t-xl max-w-[15ch] md:max-w-[20ch]">
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
