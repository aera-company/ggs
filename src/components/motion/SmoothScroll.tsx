"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

/**
 * Lenis acoplado ao ticker do GSAP (um único relógio para scroll e animação).
 * Com movimento reduzido, o Lenis não é criado e o scroll é o nativo.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const tickRef = useRef<((t: number) => void) | null>(null);

  useEffect(() => {
    document.documentElement.classList.add("js-motion");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const instance = new Lenis({ lerp: 0.11, smoothWheel: true, syncTouch: false });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    tickRef.current = tick;
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);
    // gancho de QA: permite navegar por cena em capturas automatizadas
    (window as unknown as { __ggs?: { lenis: Lenis } }).__ggs = { lenis: instance };

    return () => {
      if (tickRef.current) gsap.ticker.remove(tickRef.current);
      instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
