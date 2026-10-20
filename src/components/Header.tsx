"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { RESET_EVENT, SCENES } from "@/lib/scenes";
import { useLenis } from "./motion/SmoothScroll";

/**
 * Cabeçalho mínimo: marca, nome do conceito, cena atual e progresso.
 * O tema (claro/escuro) acompanha a cena sob o cabeçalho.
 */
export function Header() {
  const lenis = useLenis();
  const [current, setCurrent] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // posições medidas só quando o layout muda; no scroll, apenas comparações com scrollY
    // (ler getBoundingClientRect a cada quadro força layout e contribui para engasgos)
    let sceneTops: number[] = [];
    let themeRanges: { el: HTMLElement; top: number; bottom: number }[] = [];
    let maxScroll = 1;
    const measure = () => {
      const y = window.scrollY;
      sceneTops = SCENES.map((s) => {
        const el = document.getElementById(s.id);
        return el ? el.getBoundingClientRect().top + y : Infinity;
      });
      themeRanges = [...document.querySelectorAll<HTMLElement>("[data-header-theme]")].map((el) => {
        const r = el.getBoundingClientRect();
        return { el, top: r.top + y, bottom: r.bottom + y };
      });
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const mid = y + window.innerHeight * 0.5;
      let idx = 0;
      sceneTops.forEach((t, i) => {
        if (t <= mid) idx = i;
      });
      // o elemento mais interno sob o cabeçalho decide o tema (o atributo pode mudar via GSAP)
      const probe = y + 32;
      let th: "dark" | "light" = "dark";
      themeRanges.forEach((r) => {
        if (r.top <= probe && r.bottom > probe) th = r.el.dataset.headerTheme as "dark" | "light";
      });
      setCurrent(idx);
      setTheme(th);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, y / maxScroll)})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        // dois quadros: deixa o ScrollTrigger aplicar atributos de tema antes da leitura
        requestAnimationFrame(() => requestAnimationFrame(update));
      }
    };
    const onRefresh = () => {
      measure();
      update();
    };
    onRefresh();
    ScrollTrigger.addEventListener("refresh", onRefresh);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onRefresh);
    window.addEventListener("load", onRefresh);
    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onRefresh);
      window.removeEventListener("load", onRefresh);
    };
  }, []);

  const restart = () => {
    window.dispatchEvent(new Event(RESET_EVENT));
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
  };

  const scene = SCENES[current];
  const light = theme === "light";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${light ? "text-ui-ink" : "text-paper"}`}
      style={{ height: "var(--header-h)" }}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${light ? "opacity-100" : "opacity-0"}`}
        style={{ background: "rgba(233,237,240,0.95)" }}
        aria-hidden="true"
      />
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${light ? "opacity-0" : "opacity-100"}`}
        style={{ background: "linear-gradient(to bottom, rgba(3,10,18,0.72), rgba(3,10,18,0))" }}
        aria-hidden="true"
      />
      <div className="wrap relative flex h-full items-center justify-between gap-4">
        <a href="#request" className="flex items-center gap-3 rounded-sm" onClick={(e) => { e.preventDefault(); restart(); }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/gavea-group-white.png"
            alt="GAVEA GROUP"
            width={1600}
            height={311}
            className="h-[15px] w-auto transition-[filter] duration-500 md:h-[17px]"
            style={{ filter: light ? "brightness(0) saturate(100%) invert(9%) sepia(30%) saturate(1800%) hue-rotate(175deg)" : "none" }}
          />
          <span className={`hidden h-4 w-px sm:block ${light ? "bg-ui-ink/20" : "bg-paper/25"}`} aria-hidden="true" />
          <span className="hidden text-[0.82rem] font-medium tracking-[0.01em] sm:block">Global Services</span>
          <span className={`t-label hidden rounded-full border px-2 py-[3px] text-[0.6rem] sm:block ${light ? "border-ui-ink/20 text-ui-muted" : "border-paper/20 text-faint"}`}>
            Concept
          </span>
          <span className="sr-only">, voltar ao início</span>
        </a>

        <div className="flex items-center gap-4">
          <p className="t-label flex items-center gap-2">
            <span className={light ? "text-ui-accent" : "text-signal"}>{scene.n}</span>
            <span className={`hidden md:inline ${light ? "text-ui-muted" : "text-mist"}`}>{scene.label}</span>
          </p>
          <button
            type="button"
            onClick={restart}
            className={`t-label flex min-h-[36px] items-center gap-2 rounded-full border px-3 text-[0.62rem] transition-colors ${light ? "border-ui-ink/15 hover:bg-ui-ink/5" : "border-paper/15 hover:bg-paper/10"}`}
            aria-label="Restart experience"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 6a4 4 0 1 0 1.2-2.85M2 1.5V4h2.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-px ${light ? "bg-ui-ink/10" : "bg-paper/10"}`}>
        <div ref={barRef} className={`h-full origin-left ${light ? "bg-ui-accent" : "bg-signal"}`} style={{ transform: "scaleX(0)" }} />
      </div>
    </header>
  );
}
