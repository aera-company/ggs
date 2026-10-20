"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useScrollScene } from "../motion/useScrollScene";
import { AssetImage } from "../ui/AssetImage";
import { SplitWords } from "../ui/SplitWords";

/**
 * Aquisição internacional como uma jornada em seis telas:
 * Search → Service landing → RFQ → GAVEA Operations → Proposal → Execution.
 * Uma única janela muda de conteúdo conforme o scroll.
 */

const STAGES: { k: string; caption: string; url: string }[] = [
  { k: "Search", caption: "Um gestor de frota busca o serviço no porto em que vai operar.", url: "search.example/?q=tank+cleaning+singapore" },
  { k: "Service landing", caption: "Encontra uma página de serviço com escopo claro e um caminho de contratação.", url: "services.example/tank-cleaning" },
  { k: "RFQ", caption: "Envia uma solicitação estruturada, sem cadeia de e-mails.", url: "services.example/tank-cleaning/request" },
  { k: "GAVEA Operations", caption: "A demanda entra qualificada no comercial da GAVEA.", url: "portal.example/operations" },
  { k: "Proposal", caption: "A GAVEA responde com a sua proposta.", url: "portal.example/requests/DEMO-0101" },
  { k: "Execution", caption: "O parceiro executa, a GAVEA coordena e o cliente volta para o próximo serviço.", url: "portal.example/requests/DEMO-0101" },
];

const CHANNELS = ["SEO internacional", "Busca paga", "LinkedIn", "Prospecção assistida", "Base atual de clientes"];

function Row({ k, v, accent }: { k: string; v: ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-[#e1e6eb] py-2 text-[13px]">
      <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#586775]">{k}</span>
      <span className={accent ? "font-medium text-[#006b90]" : "font-medium text-[#0b1a26]"}>{v}</span>
    </div>
  );
}

function ScreenSearch() {
  return (
    <div className="flex h-full flex-col bg-white p-5 text-[#0b1a26] md:p-8">
      <div className="flex items-center gap-3 rounded-full border border-[#dfe4e9] px-4 py-2.5 shadow-sm">
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="5" fill="none" stroke="#586775" strokeWidth="1.5" />
          <path d="m11 11 3.5 3.5" stroke="#586775" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span data-gtm-query className="inline-block overflow-hidden whitespace-nowrap text-[14px] md:text-[15px]" style={{ clipPath: "inset(0 0 0 0)" }}>
          tank cleaning singapore request quote
        </span>
      </div>
      <div className="mt-6 grid gap-4">
        <div data-gtm-hit className="rounded-[12px] border-2 border-[#006b90] bg-[#e2f0f5]/50 p-4">
          <p className="font-mono text-[11px] text-[#586775]">services.example › tank-cleaning</p>
          <p className="mt-1 text-[16px] font-semibold text-[#00577a] md:text-[17px]">Tank Cleaning · Request a quote | GAVEA Global Services</p>
          <p className="mt-1 text-[13px] text-[#586775]">One commercial counterparty, qualified local partners, scope and proposal in one portal.</p>
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="px-4 opacity-50">
            <span className="block h-2.5 w-40 rounded bg-[#d5dce2]" />
            <span className="mt-2 block h-3.5 w-[70%] rounded bg-[#b9c4ce]" />
            <span className="mt-2 block h-2.5 w-[85%] rounded bg-[#e1e6eb]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenLanding() {
  return (
    <div className="relative grid h-full bg-[#0a1a28] text-paper md:grid-cols-[1.1fr_0.9fr]">
      <div className="relative z-10 flex flex-col justify-between gap-6 p-6 md:p-9">
        <div>
          <p className="t-label mb-4 text-faint">GAVEA Global Services · Tank Cleaning</p>
          <p className="t-l max-w-[13ch]">Tank cleaning, coordinated end to end.</p>
          <p className="mt-4 max-w-[40ch] text-[0.9rem] leading-relaxed text-mist">One commercial counterparty. Qualified local partners. Scope, proposal and close-out in one portal.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex min-h-[40px] items-center rounded-full bg-paper px-5 text-[0.88rem] font-medium text-navy">Request a quote</span>
          <span className="text-[0.75rem] text-faint">Coverage subject to service and region validation.</span>
        </div>
      </div>
      <div className="absolute inset-0 md:relative">
        <AssetImage id="tankCleaning" decorative sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a28] via-[#0a1a28]/70 to-[#0a1a28]/20 md:via-[#0a1a28]/20 md:to-transparent" />
      </div>
    </div>
  );
}

function ScreenRFQ() {
  return (
    <div className="flex h-full flex-col bg-[#f4f6f8] p-5 text-[#0b1a26] md:p-8">
      <p className="text-[17px] font-semibold">New service request</p>
      <p className="mt-1 text-[12.5px] text-[#586775]">Describe the need once.</p>
      <div className="mt-4 grid gap-0 rounded-[12px] border border-[#e1e6eb] bg-white px-4 py-1">
        <Row k="Service" v="Tank Cleaning" />
        <Row k="Location" v="Singapore" />
        <Row k="Vessel" v="MT Example Star" />
        <Row k="Window" v="12 → 15 Nov" />
        <Row k="Tanks" v="4 · Cargo tanks" />
        <Row k="Documents" v="tank-plan-example.pdf" />
      </div>
      <div className="mt-auto flex justify-end pt-4">
        <span data-gtm-submit className="inline-flex min-h-[38px] items-center rounded-[10px] bg-[#006b90] px-4 text-[13px] font-medium text-white">Submit request →</span>
      </div>
    </div>
  );
}

function ScreenOps() {
  const checks = ["Scope and tank data", "Documents reviewed", "HSE requirements", "Contract and insurance", "Feasibility"];
  return (
    <div className="grid h-full gap-4 bg-[#f4f6f8] p-5 text-[#0b1a26] md:grid-cols-[0.8fr_1.2fr] md:p-7">
      <div className="grid content-start gap-2">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-[#586775]">Request inbox</p>
        <div className="rounded-[12px] border-2 border-[#006b90] bg-white p-3">
          <p className="flex items-center justify-between font-mono text-[11.5px]">
            DEMO-0101 <span className="rounded-full bg-[#e2f0f5] px-2 py-[2px] text-[10px] text-[#006b90]">NEW</span>
          </p>
          <p className="mt-1 text-[13px] font-medium">Tank Cleaning · Singapore</p>
        </div>
        <div className="rounded-[12px] border border-[#e1e6eb] bg-white/60 p-3 opacity-60">
          <p className="font-mono text-[11.5px]">DEMO-0098</p>
          <p className="mt-1 text-[13px]">Tank Cleaning · Rotterdam</p>
        </div>
      </div>
      <div className="rounded-[12px] border border-[#e1e6eb] bg-white p-4">
        <p className="mb-2 text-[13px] font-semibold">Qualification</p>
        <ul className="grid gap-2">
          {checks.map((c) => (
            <li key={c} data-gtm-check className="flex items-center gap-2.5 text-[13px]">
              <span className="grid size-4 place-items-center rounded bg-[#006b90] text-white">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2 5.2 4.2 7.3 8 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#0b1a26] px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.06em] text-white">Internal</p>
      </div>
    </div>
  );
}

function ScreenProposal() {
  return (
    <div className="flex h-full flex-col bg-[#f4f6f8] p-5 text-[#0b1a26] md:p-8">
      <div className="rounded-[14px] border border-[#e1e6eb] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[15px] font-semibold">
            Proposal <span className="font-mono text-[11.5px] font-normal text-[#586775]">DEMO-0101-P</span>
          </p>
          <span className="rounded-full bg-[#fbefe3] px-2 py-[2px] font-mono text-[10px] uppercase tracking-[0.06em] text-[#a24f12]">Awaiting decision</span>
        </div>
        {["Tank cleaning of 4 cargo tanks on MT Example Star, Singapore.", "GAVEA as single commercial counterparty and coordinator.", "Execution by a qualified local partner under contract."].map((t) => (
          <p key={t} className="flex gap-2 border-t border-[#e1e6eb] py-2 text-[13px]">
            <span className="text-[#006b90]">✓</span>
            {t}
          </p>
        ))}
        <div className="mt-3 flex justify-end">
          <span className="inline-flex min-h-[36px] items-center rounded-[10px] bg-[#006b90] px-4 text-[13px] font-medium text-white">Accept proposal</span>
        </div>
      </div>
    </div>
  );
}

function ScreenExecution() {
  const stages = ["Received", "Scope review", "Partner sourcing", "Proposal ready", "Execution planning", "Closed"];
  return (
    <div className="grid h-full gap-4 bg-[#f4f6f8] p-5 text-[#0b1a26] md:grid-cols-[0.9fr_1.1fr] md:p-7">
      <div className="rounded-[12px] border border-[#e1e6eb] bg-white p-4">
        <p className="mb-3 text-[13px] font-semibold">Status</p>
        <ol className="grid gap-2.5">
          {stages.map((s) => (
            <li key={s} data-gtm-stage className="flex items-center gap-2.5 text-[13px]">
              <span className="grid size-[17px] place-items-center rounded-full bg-[#006b90] text-white">
                <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2 5.2 4.2 7.3 8 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>
      <div className="grid content-start gap-3">
        <div className="rounded-[12px] border border-[#e1e6eb] bg-white p-4">
          <p className="mb-2 text-[13px] font-semibold">Close-out documents</p>
          {["Completion report", "Waste handling record", "Service acceptance"].map((d) => (
            <p key={d} className="border-t border-[#e1e6eb] py-1.5 text-[12.5px]">{d} (demo)</p>
          ))}
        </div>
        <span data-gtm-repeat className="inline-flex min-h-[38px] items-center justify-center gap-2 self-start rounded-[10px] border border-[#006b90] bg-white px-4 text-[13px] font-medium text-[#006b90]">
          ↻ Repeat request
        </span>
      </div>
    </div>
  );
}

const SCREENS = [ScreenSearch, ScreenLanding, ScreenRFQ, ScreenOps, ScreenProposal, ScreenExecution];

export function GoToMarket() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (el) => {
    const screens = gsap.utils.toArray<HTMLElement>("[data-gtm-screen]", el);
    const rail = gsap.utils.toArray<HTMLElement>("[data-gtm-rail]", el);
    const caps = gsap.utils.toArray<HTMLElement>("[data-gtm-cap]", el);
    const urls = gsap.utils.toArray<HTMLElement>("[data-gtm-url]", el);
    const line = el.querySelector("[data-gtm-line]");
    const query = el.querySelector("[data-gtm-query]");
    const hit = el.querySelector("[data-gtm-hit]");
    const checks = gsap.utils.toArray<HTMLElement>("[data-gtm-check]", el);
    const stages = gsap.utils.toArray<HTMLElement>("[data-gtm-stage]", el);

    gsap.set(screens.slice(1), { autoAlpha: 0, y: 24 });
    gsap.set([...caps.slice(1), ...urls.slice(1)], { autoAlpha: 0 });
    gsap.set(rail.slice(1), { opacity: 0.78 });
    gsap.set(query, { clipPath: "inset(0 100% 0 0)" });
    gsap.set(hit, { autoAlpha: 0, y: 10 });
    gsap.set([...checks, ...stages], { autoAlpha: 0.15 });

    gsap.from(el.querySelectorAll("[data-gtm-title] .split-word > span"), {
      yPercent: 110,
      stagger: 0.03,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: el.querySelector(".pin-track"), start: "top top", end: "bottom bottom", scrub: 0.6 },
    });

    tl.to(query, { clipPath: "inset(0 0% 0 0)", duration: 0.08 }, 0.02);
    tl.to(hit, { autoAlpha: 1, y: 0, duration: 0.04 }, 0.1);
    tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 0.86 }, 0.02);

    const step = 0.145;
    for (let i = 1; i < STAGES.length; i++) {
      const at = 0.06 + i * step;
      tl.to(screens[i - 1], { autoAlpha: 0, y: -24, duration: 0.022 }, at - 0.02);
      tl.to(screens[i], { autoAlpha: 1, y: 0, duration: 0.026 }, at - 0.008);
      tl.to([caps[i - 1], urls[i - 1]], { autoAlpha: 0, duration: 0.018 }, at - 0.02);
      tl.to([caps[i], urls[i]], { autoAlpha: 1, duration: 0.022 }, at - 0.004);
      tl.to(rail[i], { opacity: 1, duration: 0.03 }, at);
    }
    // microanimações dentro das telas
    checks.forEach((c, i) => tl.to(c, { autoAlpha: 1, duration: 0.015 }, 0.5 + i * 0.012));
    stages.forEach((s, i) => tl.to(s, { autoAlpha: 1, duration: 0.012 }, 0.79 + i * 0.012));
    tl.to({}, { duration: 0.06 }, 0.94);
  });

  return (
    <section ref={ref} id="acquisition" data-header-theme="dark" className="scene bg-navy-deep" aria-label="05 · Aquisição internacional">
      <div className="pin-track" style={{ ["--track" as string]: 560 }}>
        <div className="pin-stage rm-flow">
          <div className="wrap grid h-full grid-cols-1 content-center gap-6 pt-[calc(var(--header-h)+4vh)] pb-[5vh] md:grid-cols-[0.75fr_1.25fr] md:items-center md:gap-12 rm-static">
            {/* título + trilho */}
            <div className="flex min-w-0 flex-col gap-6 md:gap-10">
              <div>
                <p className="t-label mb-4 text-signal">05 · Aquisição internacional</p>
                <h2 data-gtm-title className="t-l max-w-[16ch]">
                  <SplitWords text="A presença digital vira oportunidade comercial." />
                </h2>
              </div>

              <ol className="relative hidden gap-0 pl-6 md:grid" aria-label="Jornada do cliente">
                <span className="absolute bottom-3 left-[5px] top-3 w-px bg-paper/12" aria-hidden="true">
                  <span data-gtm-line className="block h-full w-full origin-top bg-signal" />
                </span>
                {STAGES.map((s, i) => (
                  <li key={s.k} data-gtm-rail className="relative py-2 rm-visible">
                    <span className="absolute -left-6 top-[13px] size-[11px] rounded-full border border-signal bg-navy-deep" aria-hidden="true" />
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[0.72rem] text-signal">0{i + 1}</span>
                      <span className="text-[1.05rem] font-medium">{s.k}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <div className="relative min-h-[3.6rem]">
                {STAGES.map((s, i) => (
                  <p key={s.k} data-gtm-cap className={`${i === 0 ? "relative" : "absolute inset-x-0 top-0"} t-m text-mist rm-static rm-visible`}>
                    <span className="mr-2 font-mono text-[0.75rem] text-signal md:hidden">0{i + 1} {s.k}</span>
                    {s.caption}
                  </p>
                ))}
              </div>
            </div>

            {/* janela da jornada */}
            <div className="relative flex min-h-0 min-w-0 items-center">
              <div className="w-full min-w-0 overflow-hidden rounded-[18px] border border-paper/12 bg-[#0a1a28] shadow-[0_50px_120px_-50px_rgba(0,0,0,0.9)]">
                <div className="flex items-center gap-3 border-b border-paper/10 px-4 py-3">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-paper/15" />
                    <span className="size-2.5 rounded-full bg-paper/15" />
                    <span className="size-2.5 rounded-full bg-paper/15" />
                  </span>
                  <span className="relative min-w-0 flex-1">
                    {STAGES.map((s, i) => (
                      <span key={s.k} data-gtm-url className={`${i === 0 ? "relative" : "absolute inset-0"} t-mono block truncate rounded-md bg-paper/6 px-3 py-1 text-faint rm-hide`}>
                        {s.url}
                      </span>
                    ))}
                  </span>
                  <span className="t-label hidden shrink-0 text-[0.58rem] text-signal sm:inline">Exemplo · não publicado</span>
                </div>
                <div className="relative aspect-[4/5] max-h-[52vh] w-full sm:aspect-[16/10] md:max-h-[62vh] rm-auto">
                  {SCREENS.map((Screen, i) => (
                    <div key={i} data-gtm-screen className="absolute inset-0 rm-static rm-tall" aria-hidden="true">
                      <Screen />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="wrap absolute inset-x-0 bottom-4 hidden text-[0.78rem] text-faint md:block rm-hide">
            Canais: {CHANNELS.join(" · ")}. Cada serviço e região validados viram uma nova porta de entrada.
          </p>
        </div>
      </div>
    </section>
  );
}
