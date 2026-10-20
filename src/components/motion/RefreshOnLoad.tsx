"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

/** Recalcula os pins depois que fontes e imagens assentam o layout. */
export function RefreshOnLoad() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") refresh();
    else window.addEventListener("load", refresh, { once: true });
    document.fonts?.ready.then(refresh);
    // ao recarregar no meio da página, voltar ao topo evita pins fora de fase
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    return () => window.removeEventListener("load", refresh);
  }, []);
  return null;
}
