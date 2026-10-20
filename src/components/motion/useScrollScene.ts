"use client";

import { useEffect, useLayoutEffect, type RefObject } from "react";
import { gsap, IS_DESKTOP, MOTION_OK } from "@/lib/gsap";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type SceneConditions = { desktop: boolean };

/**
 * Monta as animações de uma cena apenas quando o usuário aceita movimento.
 * Tudo é revertido no unmount ou quando a media query muda.
 */
export function useScrollScene(
  ref: RefObject<HTMLElement | null>,
  build: (el: HTMLElement, c: SceneConditions) => void | (() => void),
) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia(el);
    mm.add({ motion: MOTION_OK, desktop: IS_DESKTOP }, (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) return;
      return build(el, { desktop });
    });
    return () => mm.revert();
    // a função de build é estável por cena
     
  }, []);
}
