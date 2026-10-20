"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Imagens desenhadas fora de <img> (dentro de SVG), que também precisam ser aquecidas. */
const EXTRA = ["/media/world-dots.svg"];

/**
 * Recalcula os pins depois que fontes e imagens assentam o layout e, com a página
 * ociosa, pré-decodifica as imagens das cenas seguintes. Sem isso, a primeira
 * exibição de cada imagem decodifica na hora e o scroll dá um tranco.
 */
export function RefreshOnLoad() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    let cancelled = false;

    const warm = async () => {
      const imgs = [...document.querySelectorAll<HTMLImageElement>("img[loading='lazy']")];
      const extra = EXTRA.map((src) => {
        const i = new Image();
        i.src = src;
        return i;
      });
      for (const img of [...extra, ...imgs]) {
        if (cancelled) return;
        img.loading = "eager";
        try {
          await img.decode();
        } catch {
          /* imagem indisponível: segue sem travar */
        }
        // uma por vez, sem competir com a rolagem
        await new Promise((r) => setTimeout(r, 120));
      }
    };
    const idle = (fn: () => void) => {
      // Safari não tem requestIdleCallback
      const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(fn, { timeout: 2500 });
      else setTimeout(fn, 1200);
    };

    const onLoad = () => {
      refresh();
      idle(() => void warm());
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    document.fonts?.ready.then(refresh);
    // ao recarregar no meio da página, voltar ao topo evita pins fora de fase
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
    };
  }, []);
  return null;
}
