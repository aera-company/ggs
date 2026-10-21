"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { useLenis } from "./SmoothScroll";

/**
 * Modo cinema do filme BUILD 2030.
 * O vídeo nunca começa sozinho: só toca depois do clique do apresentador, com som.
 * O play() é chamado dentro do próprio clique (exigência do Safari para áudio) e,
 * como o filme abre no escuro, o fade da tela e o começo do filme se fundem.
 */

const SOURCES = { hd: "/media/build2030-film-1080.mp4", sd: "/media/build2030-film-720.mp4" };
const POSTER = "/media/build2030-film-poster-1920.webp";

export type FilmHandle = { open: (returnTo?: HTMLElement | null) => void };

type Props = {
  /** começar a baixar o filme antes do clique (quando a cena aparece) */
  warm: boolean;
  url: string;
  onReady: (h: FilmHandle) => void;
};

export function FilmTheater({ warm, url, onReady }: Props) {
  const lenis = useLenis();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [idle, setIdle] = useState(false);
  const [src, setSrc] = useState(SOURCES.hd);
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const idleTimer = useRef<number>(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // 1080p em qualquer tela de notebook ou projetor; 720p só em celular ou modo economia
    const save = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    setSrc(Math.max(window.innerWidth, window.innerHeight) < 1024 || save ? SOURCES.sd : SOURCES.hd);
  }, []);

  useEffect(() => {
    if (warm && videoRef.current && videoRef.current.preload !== "auto") videoRef.current.preload = "auto";
  }, [warm]);

  const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = useCallback((returnTo?: HTMLElement | null) => {
    const v = videoRef.current;
    const root = rootRef.current;
    if (!v || !root) return;
    // o Safari não foca botões no clique: quem abriu informa para onde o foco volta
    returnFocus.current = returnTo ?? (document.activeElement as HTMLElement);
    setEnded(false);
    setBlocked(false);
    setOpen(true);
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    // dentro do gesto do usuário: o Safari libera o áudio
    v.play()
      .then(() => setPaused(false))
      .catch(() => {
        setBlocked(true);
        setPaused(true);
      });
    const d = reduce() ? 0 : 1;
    gsap.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.7 * d, ease: "power2.out" });
    gsap.fromTo(v, { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.4 * d, delay: 0.25 * d, ease: "power2.out" });
    requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
  }, [lenis]);

  const hide = useCallback(() => {
    const v = videoRef.current;
    const root = rootRef.current;
    if (!root) return;
    gsap.to(root, {
      autoAlpha: 0,
      duration: reduce() ? 0 : 0.45,
      ease: "power2.in",
      onComplete: () => {
        v?.pause();
        setOpen(false);
        setEnded(false);
        document.documentElement.style.overflow = "";
        lenis?.start();
        returnFocus.current?.focus({ preventScroll: true });
      },
    });
  }, [lenis]);

  useEffect(() => {
    onReady({ open: show });
  }, [onReady, show]);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => {
        setPaused(false);
        setBlocked(false);
      });
    } else {
      v.pause();
      setPaused(true);
    }
  }, []);

  // teclado: Esc fecha, espaço pausa
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        hide();
      } else if (e.key === " " && (e.target as HTMLElement)?.tagName !== "BUTTON" && !ended) {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // progresso sem re-render por quadro
  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v && barRef.current && v.duration) barRef.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const poke = () => {
    setIdle(false);
    window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => setIdle(true), 2600);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    v.currentTime = ((e.clientX - r.left) / r.width) * v.duration;
  };

  const fullscreen = () => {
    const v = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (rootRef.current?.requestFullscreen) rootRef.current.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.();
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    v.play().then(() => setPaused(false));
  };

  if (!mounted) return null;

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Filme GAVEA BUILD 2030"
      aria-hidden={!open}
      onMouseMove={poke}
      onClick={poke}
      className={`fixed inset-0 z-[100] bg-[#030a12] ${idle && !paused && !ended ? "cursor-none" : ""}`}
      style={{ visibility: "hidden", opacity: 0 }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={POSTER}
        preload="metadata"
        playsInline
        onEnded={() => {
          setEnded(true);
          setPaused(true);
          setIdle(false);
        }}
        onPause={() => setPaused(true)}
        onPlay={() => setPaused(false)}
        className="absolute inset-0 h-full w-full object-contain"
      />

      {/* fim do filme: a segunda conversa */}
      {ended && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#030a12] via-[#030a12]/70 to-transparent">
          <div className="wrap pb-[12vh]">
            <p className="t-label mb-4 text-signal">The next GAVEA</p>
            <p className="t-l max-w-[22ch]">Uma segunda conversa: como a GAVEA chega a 2030.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={url} target="_blank" rel="noopener noreferrer" className="btn-solid">
                Conhecer BUILD 2030
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M3.5 2.5h6v6M9.5 2.5l-7 7" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
                <span className="sr-only">(abre em nova aba)</span>
              </a>
              <button type="button" onClick={replay} className="btn-ghost">
                Assistir de novo
              </button>
              <button type="button" onClick={hide} className="btn-ghost">
                Voltar à apresentação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* autoplay recusado: um toque inicia */}
      {blocked && !ended && (
        <button type="button" onClick={toggle} className="absolute inset-0 grid place-items-center" aria-label="Reproduzir o filme">
          <span className="grid size-20 place-items-center rounded-full border border-paper/40 bg-[#030a12]/60">
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <path d="M7 4.5v13l11-6.5z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}

      {/* controles: somem com o mouse parado */}
      <div className={`absolute inset-x-0 top-0 flex justify-end p-4 transition-opacity duration-500 md:p-6 ${idle && !paused && !ended ? "opacity-0" : "opacity-100"}`}>
        <button ref={closeRef} type="button" onClick={hide} className="btn-ghost bg-[#030a12]/60" aria-label="Fechar o filme e voltar à apresentação">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M3 3l6 6M9 3 3 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Fechar</span>
        </button>
      </div>
      {!ended && (
        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#030a12]/80 to-transparent px-4 pb-4 pt-10 transition-opacity duration-500 md:px-6 md:pb-6 ${idle && !paused ? "opacity-0" : "opacity-100"}`}>
          <div className="mb-3 h-6 cursor-pointer py-2.5" onClick={seek} role="presentation">
            <div className="h-1 w-full overflow-hidden rounded-full bg-paper/20">
              <div ref={barRef} className="h-full w-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggle} className="btn-ghost min-w-[44px] justify-center px-3" aria-label={paused ? "Reproduzir" : "Pausar"}>
              {paused ? (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M4 2.5v9l7.5-4.5z" fill="currentColor" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                  <path d="M3.5 2.5h2.5v9H3.5zM8 2.5h2.5v9H8z" fill="currentColor" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                v.muted = !v.muted;
                setMuted(v.muted);
              }}
              className="btn-ghost min-w-[44px] justify-center px-3"
              aria-label={muted ? "Ativar som" : "Silenciar"}
            >
              <svg width="16" height="14" viewBox="0 0 16 14" aria-hidden="true">
                <path d="M1.5 5h2.5l3.5-3v10L4 9H1.5z" fill="currentColor" />
                {muted ? (
                  <path d="M10.5 4.5l4 5M14.5 4.5l-4 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                ) : (
                  <path d="M10.5 4.5a3.5 3.5 0 0 1 0 5M12.5 2.5a6.2 6.2 0 0 1 0 9" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                )}
              </svg>
            </button>
            <p className="t-label ml-2 hidden text-faint sm:block">GAVEA BUILD 2030 · AERA</p>
            <button type="button" onClick={fullscreen} className="btn-ghost ml-auto min-w-[44px] justify-center px-3" aria-label="Tela cheia">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path d="M1.5 5V1.5H5M9 1.5h3.5V5M12.5 9v3.5H9M5 12.5H1.5V9" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
