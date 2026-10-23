"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { SEQ, SEQ_VESSEL_RIG, SEQ_VESSEL_RIG_NARROW, largest, srcSet, type Asset } from "@/lib/assets";
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

// rótulos do canto superior, um por trecho da sequência; o primeiro já
// apresenta a plataforma, antes de qualquer rolagem
const HUD = [
  ["Nova plataforma de serviços internacionais", "GAVEA Global Services · conceito"],
  ["Rio de Janeiro · Guanabara Bay", "22°54′S 43°10′W"],
  ["Marine operations", "Port of Rio de Janeiro"],
];

// rolagem da abertura em vh (o pin soma uma tela a mais)
const SCROLL = 540;

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
    const hubTag = q("[data-hub-tag]");
    const flash = q("[data-flash]");
    const net = q("[data-network]");
    const arcs = gsap.utils.toArray<SVGGElement>("[data-arc]", el);
    const hud = gsap.utils.toArray<HTMLElement>("[data-hud-step]", el);

    // Roteiro em vh de rolagem (o pin tem SCROLL + 100vh). Um movimento por imagem,
    // sempre para a frente: globo → mergulho → Rio → porto → navio.
    const at = (vh: number) => vh / SCROLL;
    const len = (vh: number) => vh / SCROLL;
    const B = {
      dive: 150, // fim das rotas, começa o mergulho
      rio: 186, // o clarão cobre a troca globo → Rio
      port: 290, // corte no movimento
      hero: 372, // corte para o navio (master WebGL)
    };
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
          progressRef.current = gsap.utils.clamp(0, 1, (p - at(B.hero)) / (1 - at(B.hero)));
          heroActive.current = p > at(B.hero - 40);
          // pulsos e anel do hub só rodam enquanto o globo está em cena
          if (p < at(B.rio + 10) !== live) {
            live = p < at(B.rio + 10);
            net.classList.toggle("is-live", live);
          }
        },
      },
    });
    net.classList.add("is-live");

    // ---------- carga da página: plataforma, primeira frase e globo ----------
    lines.forEach((line, i) => gsap.set(line, { autoAlpha: i === 0 ? 1 : 0 }));
    gsap.from(lines[0].querySelectorAll(".split-word > span"), {
      yPercent: 110,
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.06,
      delay: 0.5,
    });
    gsap.from("[data-intro]", { autoAlpha: 0, y: 12, duration: 1.2, ease: "power3.out", delay: 0.7, stagger: 0.12 });
    gsap.set(hud.slice(1), { autoAlpha: 0 });
    gsap.from(globe.querySelector("img"), { opacity: 0, duration: 1.8, ease: "power2.out" });
    gsap.fromTo("[data-hub]", { opacity: 0 }, { opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.9 });

    // ---------- 01 · globo: rotas acendem uma por vez a partir do Rio ----------
    const hubOrigin = `${(HUB.x / 2752) * 100}% ${(HUB.y / 1536) * 100}%`;
    gsap.set(globe, { transformOrigin: hubOrigin });
    tl.to(globe, { scale: 1.1, duration: len(B.dive) }, 0);
    arcs.forEach((arc, i) => {
      const t = at(10 + i * 9);
      const strokes = arc.querySelectorAll(".seq-arc, .seq-arc-halo");
      tl.to(strokes, { strokeDashoffset: 0, duration: len(22), ease: "power1.inOut" }, t);
      tl.to(arc.querySelectorAll("[data-pulse]"), { opacity: 0.9, duration: len(8) }, t + len(18));
      const node = arc.querySelector("[data-node]");
      if (node) tl.from(node, { opacity: 0, duration: len(8) }, t + len(20));
    });
    // com a rede completa e o texto fora de cena, o Rio é nomeado como centro de coordenação
    tl.fromTo(hubTag, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: len(14), ease: "power2.out" }, at(118));
    tl.to(hubTag, { autoAlpha: 0, duration: len(10) }, at(B.dive + 2));

    // ---------- passagem: mergulho no Rio, o único clarão da abertura ----------
    // leva o hub ao centro da tela enquanto amplia
    const toCenter = (axis: "x" | "y") => () => {
      const r = globe.offsetLeft + (HUB.x / 2752) * globe.offsetWidth;
      const b = globe.offsetTop + (HUB.y / 1536) * globe.offsetHeight;
      return axis === "x" ? window.innerWidth / 2 - r : window.innerHeight / 2 - b;
    };
    tl.to(globe, { scale: 3.4, x: toCenter("x"), y: toCenter("y"), duration: len(B.rio + 8 - B.dive), ease: "power2.in" }, at(B.dive));
    tl.to(net, { opacity: 0, duration: len(20) }, at(B.dive + 6));
    tl.to(flash, { opacity: 0.9, duration: len(16), ease: "power1.in" }, at(B.rio - 14));
    tl.to(globe, { opacity: 0, duration: len(10) }, at(B.rio - 2));
    tl.to(flash, { opacity: 0, duration: len(30), ease: "power1.out" }, at(B.rio + 4));

    // ---------- 02 · Rio: um só avanço da baía até o porto ----------
    gsap.set(rio, { transformOrigin: "52% 84%" });
    tl.fromTo(rio, { scale: 1.04 }, { scale: 1.62, duration: len(B.port - B.rio), ease: "power1.in" }, at(B.rio));
    // corte no movimento: o porto entra já avançando
    tl.set(rio, { opacity: 0 }, at(B.port));

    // ---------- 03 · porto: avanço até o navio, corte para o master ----------
    gsap.set(port, { transformOrigin: "66% 56%" });
    tl.fromTo(port, { scale: 1.06 }, { scale: 1.3, duration: len(B.hero - B.port), ease: "power1.in" }, at(B.port));
    tl.set(port, { opacity: 0 }, at(B.hero));

    // rótulos do canto acompanham o lugar
    tl.to(hud[0], { autoAlpha: 0, duration: len(8) }, at(B.rio)).to(hud[1], { autoAlpha: 1, duration: len(8) }, at(B.rio + 10));
    tl.set(hud[1], { autoAlpha: 0 }, at(B.port)).set(hud[2], { autoAlpha: 1 }, at(B.port));

    // ---------- frases ----------
    const words = (line: HTMLElement) => line.querySelectorAll(".split-word > span");
    // a saída de uma frase leva ~24vh: a próxima só entra depois dela
    const SLOTS = [
      [0, 36],
      [60, 98],
      [B.rio + 24, B.port - 30],
      [B.port + 10, B.hero - 34],
    ];
    lines.forEach((line, i) => {
      const [inAt, outAt] = SLOTS[i].map(at);
      if (i > 0) {
        tl.set(line, { autoAlpha: 1 }, inAt - len(3));
        tl.from(words(line), { yPercent: 110, stagger: len(2), duration: len(16) }, inAt);
      }
      tl.to(words(line), { yPercent: -110, stagger: len(1.5), duration: len(12) }, outAt);
      tl.set(line, { autoAlpha: 0 }, outAt + len(24));
    });

    // ---------- navio: título com tempo para ser lido ----------
    const title = B.hero + 18;
    tl.fromTo(reveal, { autoAlpha: 0 }, { autoAlpha: 1, duration: len(8) }, at(title));
    tl.from(el.querySelectorAll("[data-reveal] .split-word > span"), { yPercent: 110, stagger: len(5), duration: len(26), ease: "power2.out" }, at(title));
    tl.from("[data-reveal-sub]", { autoAlpha: 0, y: 24, duration: len(18), stagger: len(6) }, at(title + 26));
    tl.to("[data-scroll-hint]", { autoAlpha: 0, duration: len(12) }, at(4));
    tl.to("[data-hud]", { yPercent: desktop ? 0 : 0, autoAlpha: 0.5, duration: len(40) }, at(title));
    tl.to({}, { duration: 0 }, 1);

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
      <div className="pin-track" style={{ ["--track" as string]: SCROLL + 100 }}>
        <div className="pin-stage rm-flow">
          {/* master final: o hero WebGL atual (água viva e dolly) recebe a sequência */}
          <HeroCanvas asset={SEQ.vessel} rig={SEQ_VESSEL_RIG} rigPortrait={SEQ_VESSEL_RIG_NARROW} progressRef={progressRef} activeRef={heroActive} priority={false} cover />

          {/* sequência mundo → Brasil → porto, por cima do hero. As placas ficam sempre
              pintadas, empilhadas na ordem inversa: cada troca só apaga a de cima
              (ocultar e mostrar faz o Safari decodificar a imagem de novo no corte).
              seq-dock saiu na revisão de 23/10: repetia o navio no mesmo ângulo do master. */}
          <div className="rm-hide absolute inset-0 overflow-hidden" aria-hidden="true">
            <Plate name="port" asset={SEQ.port} />
            <Plate name="rio" asset={SEQ.rio} />
            <Plate name="globe" asset={SEQ.globe} eager>
              <GlobeNetwork />
              {/* o Rio nomeado como centro de coordenação quando a rede se completa */}
              <div
                data-hub-tag
                className="seq-hub-tag t-label"
                style={{ left: `${(HUB.x / 2752) * 100}%`, top: `${(HUB.y / 1536) * 100}%` }}
              >
                <span className="seq-hub-tag-line" />
                <span>
                  <span className="block text-paper">Rio de Janeiro</span>
                  <span className="block text-[#f3c27c]">Coordination hub</span>
                </span>
              </div>
            </Plate>
            <div data-flash className="seq-flash absolute inset-0" />
          </div>
          <span className="sr-only">{SEQ.globe.alt} {SEQ.rio.alt} {SEQ.vessel.alt}</span>

          <div className="absolute inset-0 scrim-b opacity-80" aria-hidden="true" />

          {/* HUD técnico: cenário identificado como ilustrativo */}
          <div data-hud className="wrap rm-static absolute inset-x-0 top-[calc(var(--header-h)+24px)] flex items-start justify-between">
            <div data-intro className="t-label relative text-mist">
              {HUD.map(([a, b], i) => (
                <div key={a} data-hud-step className={`${i ? "absolute left-0 top-0 rm-hide" : ""} w-max max-w-[24ch] space-y-1 sm:max-w-none`}>
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
