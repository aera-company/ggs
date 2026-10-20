"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { PortalDemo } from "../portal/PortalDemo";
import { SplitWords } from "../ui/SplitWords";

/** Esqueleto do portal: mesmo desenho da janela real, em traço. */
function PortalWireframe() {
  return (
    <svg viewBox="0 0 1200 700" className="h-auto w-full" aria-hidden="true">
      <g fill="none" stroke="#0b1a26" strokeOpacity="0.5" strokeWidth="1.4">
        <rect data-wf x="1" y="1" width="1198" height="698" rx="22" pathLength={1} strokeDasharray="1" />
        <path data-wf d="M1 62H1199" pathLength={1} strokeDasharray="1" />
        <path data-wf d="M1 98H1199" pathLength={1} strokeDasharray="1" />
        <path data-wf d="M212 98V640" pathLength={1} strokeDasharray="1" />
        <path data-wf d="M1 640H1199" pathLength={1} strokeDasharray="1" />
      </g>
      <g data-wf-fill opacity="0">
        <rect x="1" y="1" width="1198" height="698" rx="22" fill="#f4f6f8" />
        <rect x="1" y="1" width="1198" height="61" rx="22" fill="#fff" />
        <rect x="1" y="40" width="1198" height="22" fill="#fff" />
        <rect x="1" y="98" width="211" height="542" fill="#eef1f4" />
        <rect x="1" y="640" width="1198" height="59" fill="#f9fafb" />
        <rect x="24" y="24" width="96" height="12" rx="3" fill="#081e2f" />
        <rect x="136" y="22" width="110" height="16" rx="3" fill="#081e2f" opacity="0.8" />
        <rect x="860" y="16" width="316" height="30" rx="10" fill="#e9edf1" />
        <rect x="866" y="20" width="100" height="22" rx="7" fill="#fff" />
        <rect x="16" y="118" width="180" height="34" rx="9" fill="#fff" />
        <rect x="16" y="160" width="180" height="34" rx="9" fill="#e4e9ee" />
        <rect x="244" y="126" width="300" height="20" rx="4" fill="#0b1a26" />
        <rect x="244" y="156" width="460" height="10" rx="3" fill="#b7c2cc" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={244 + i * 232} y="196" width="220" height="74" rx="12" fill="#fff" stroke={i === 0 ? "#006b90" : "#e1e6eb"} />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={244 + (i % 2) * 470} y={300 + Math.floor(i / 2) * 74} width="452" height="44" rx="10" fill="#fff" stroke="#e1e6eb" />
        ))}
        <rect x="1004" y="584" width="172" height="40" rx="10" fill="#006b90" />
        <rect x="24" y="664" width="420" height="10" rx="3" fill="#b7c2cc" />
        <rect x="992" y="656" width="184" height="28" rx="8" fill="#0b1a26" />
      </g>
    </svg>
  );
}

export function Platform() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el, { desktop }) => {
    const img = el.querySelector("[data-pr-img]");
    const light = el.querySelector<HTMLElement>("[data-pr-light]");
    const scan = el.querySelector("[data-pr-scan]");
    const rings = gsap.utils.toArray<SVGElement>("[data-pr-ring]", el);
    const ticks = el.querySelector("[data-pr-ticks]");
    const labels = gsap.utils.toArray<HTMLElement>("[data-pr-label]", el);
    const wf = gsap.utils.toArray<SVGElement>("[data-wf]", el);
    const wfFill = el.querySelector("[data-wf-fill]");
    const head = el.querySelectorAll("[data-pr-head] .split-word > span");
    const sub = el.querySelector("[data-pr-sub]");
    const wfBox = el.querySelector("[data-pr-wfbox]");
    const track = el.querySelector<HTMLElement>(".pin-track")!;

    gsap.set(rings, { attr: { "stroke-dashoffset": 1 } });
    gsap.set(ticks, { autoAlpha: 0 });
    gsap.set(labels, { autoAlpha: 0, y: 8 });
    gsap.set(light, { clipPath: "inset(0% 0% 100% 0%)" });
    gsap.set(scan, { top: "0%", autoAlpha: 0 });
    gsap.set(wf, { attr: { "stroke-dashoffset": 1 } });
    gsap.set(head, { yPercent: 110 });
    gsap.set(sub, { autoAlpha: 0, y: 14 });
    gsap.set(wfBox, { y: desktop ? 40 : 20, scale: 0.96 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el.querySelector(".pin-track"), start: "top top", end: "bottom bottom", scrub: 0.6 },
    });

    // 1. aproximação no aço
    tl.fromTo(img, { scale: 1.06 }, { scale: 1.55, duration: 0.5, ease: "power1.inOut" }, 0);
    tl.to(rings, { attr: { "stroke-dashoffset": 0 }, duration: 0.18, stagger: 0.04, ease: "power2.out" }, 0.06);
    tl.to(ticks, { autoAlpha: 1, duration: 0.06 }, 0.14);
    tl.to(labels, { autoAlpha: 1, y: 0, stagger: 0.025, duration: 0.05 }, 0.18);

    // 2. varredura: o industrial vira interface
    tl.set(scan, { autoAlpha: 1 }, 0.34);
    tl.to(scan, { top: "100%", duration: 0.24, ease: "power2.inOut" }, 0.34);
    tl.to(light, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.24, ease: "power2.inOut" }, 0.34);
    tl.set(scan, { autoAlpha: 0 }, 0.58);
    tl.set(track, { attr: { "data-header-theme": "dark" } }, 0);
    tl.set(track, { attr: { "data-header-theme": "light" } }, 0.38);

    // 3. a janela do portal se desenha e acende
    tl.to(wf, { attr: { "stroke-dashoffset": 0 }, duration: 0.16, stagger: 0.02, ease: "power2.inOut" }, 0.5);
    tl.to(wfBox, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" }, 0.5);
    tl.to(wfFill, { opacity: 1, duration: 0.1 }, 0.7);
    tl.to(head, { yPercent: 0, stagger: 0.02, duration: 0.1 }, 0.62);
    tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.72);
    tl.to({}, { duration: 0.1 }, 0.9);
  });

  return (
    <section ref={ref} id="platform" className="scene" aria-label="03 · The platform" data-header-theme="light">
      {/* PORTAL REVEAL */}
      <div className="pin-track bg-navy-deep" style={{ ["--track" as string]: 300 }} data-header-theme="light">
        <div className="pin-stage rm-flow">
          <div className="absolute inset-0 overflow-hidden rm-hide" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-pr-img
              src="/media/industrial-macro-1920.webp"
              srcSet="/media/industrial-macro-1080.webp 1080w, /media/industrial-macro-1920.webp 1920w"
              sizes="100vw"
              alt=""
              loading="lazy"
              className="img-cover origin-[42%_58%]"
              style={{ filter: "saturate(0.75) contrast(1.08) brightness(0.8)" }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_58%,transparent_0%,rgba(3,10,18,0.35)_40%,rgba(3,10,18,0.85)_100%)]" />

            {/* camada técnica */}
            <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
              <g fill="none" stroke="#f3f1ec" strokeOpacity="0.55">
                <circle data-pr-ring cx="672" cy="522" r="150" pathLength={1} strokeDasharray="1" strokeWidth="1" />
                <circle data-pr-ring cx="672" cy="522" r="232" pathLength={1} strokeDasharray="1" strokeWidth="0.8" strokeOpacity="0.35" />
                <circle data-pr-ring cx="672" cy="522" r="330" pathLength={1} strokeDasharray="1" strokeWidth="0.6" strokeOpacity="0.2" />
              </g>
              <g data-pr-ticks stroke="#3aa9d2" strokeWidth="1.2">
                <path d="M672 347v40M672 657v40M497 522h40M807 522h40" />
                {Array.from({ length: 48 }).map((_, i) => {
                  const a = (i / 48) * Math.PI * 2;
                  const r1 = 232;
                  const r2 = i % 4 === 0 ? 246 : 239;
                  return (
                    <line
                      key={i}
                      x1={(672 + Math.cos(a) * r1).toFixed(1)}
                      y1={(522 + Math.sin(a) * r1).toFixed(1)}
                      x2={(672 + Math.cos(a) * r2).toFixed(1)}
                      y2={(522 + Math.sin(a) * r2).toFixed(1)}
                      strokeOpacity="0.6"
                    />
                  );
                })}
              </g>
            </svg>
            <div className="absolute left-[42%] top-[58%] h-0 w-0">
              {[
                { t: "Request", x: "-330px", y: "-210px" },
                { t: "Scope", x: "190px", y: "-230px" },
                { t: "Partner", x: "240px", y: "160px" },
                { t: "Execution", x: "-360px", y: "190px" },
              ].map((l) => (
                <span key={l.t} data-pr-label className="t-label absolute whitespace-nowrap text-paper/80" style={{ left: l.x, top: l.y }}>
                  <span className="mr-2 inline-block size-1.5 rounded-full bg-signal align-middle" />
                  {l.t}
                </span>
              ))}
            </div>
          </div>

          {/* camada clara: a interface */}
          <div data-pr-light className="absolute inset-0 bg-[var(--light-bg)] text-ui-ink rm-static" style={{ clipPath: "inset(0 0 0 0)" }}>
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage: "linear-gradient(rgba(11,26,38,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(11,26,38,0.05) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
                maskImage: "radial-gradient(ellipse at 50% 60%, #000 30%, transparent 80%)",
              }}
              aria-hidden="true"
            />
            <div className="wrap relative flex h-full flex-col pt-[calc(var(--header-h)+4vh)] pb-[5vh]">
              <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="t-label mb-4 text-ui-accent">03 · The platform</p>
                  <h2 data-pr-head className="t-xl">
                    <SplitWords text="The platform." />
                  </h2>
                </div>
                <p data-pr-sub className="t-m max-w-[26ch] text-ui-muted md:text-right">
                  Da solicitação à execução, <span className="text-ui-ink">em um só lugar.</span>
                </p>
              </div>
              <div className="relative flex min-h-0 flex-1 items-center justify-center rm-hide md:items-start">
                <div data-pr-wfbox className="w-full" style={{ maxWidth: "min(1200px, calc((100svh - var(--header-h) - 250px) * 1.714))" }}>
                  <PortalWireframe />
                </div>
              </div>
            </div>
          </div>

          <div data-pr-scan className="pointer-events-none absolute inset-x-0 h-px bg-signal shadow-[0_0_24px_4px_rgba(58,169,210,0.6)] rm-hide" aria-hidden="true" />
        </div>
      </div>

      {/* LIVE DEMO */}
      <div className="bg-[var(--light-bg)] pb-24 text-ui-ink md:pb-32">
        <div className="wrap">
          <div className="mb-6 flex flex-col gap-3 border-t border-[var(--light-line)] pt-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="t-label mb-3 text-ui-muted">Live demo</p>
              <p className="t-m max-w-[34ch]">Três perspectivas, um só processo. Cada uma vê apenas o que lhe cabe.</p>
            </div>
          </div>

          <PortalDemo />

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { k: "Client view", t: "Solicita, acompanha, decide e repete. Nunca vê custos, margens ou negociação com parceiros." },
              { k: "GAVEA Operations", t: "Qualifica, seleciona parceiros habilitados, compõe a proposta e responde pela coordenação." },
              { k: "Partner view", t: "Recebe convites da GAVEA, cota, mantém a homologação e reporta a execução." },
            ].map((c) => (
              <div key={c.k} className="border-t border-[var(--light-line)] pt-4">
                <p className="t-label mb-2 text-ui-accent">{c.k}</p>
                <p className="text-[0.98rem] leading-relaxed text-ui-muted">{c.t}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 max-w-[70ch] text-[0.82rem] text-ui-muted">
            Protótipo conceitual. Integração com o GAVEA TRADE e com processos internos é uma proposta de arquitetura, ainda não implementada.
          </p>
        </div>
      </div>
    </section>
  );
}
