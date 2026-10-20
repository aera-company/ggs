"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const IS_DESKTOP = "(min-width: 900px)";

export { gsap, ScrollTrigger };
