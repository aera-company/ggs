"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";

/**
 * Hero cinematográfico em WebGL puro (sem three.js: ~0 kB de dependência).
 * Uma única imagem ganha vida no shader:
 *  - dolly de câmera ligado ao scroll (zoom + deriva em direção à proa);
 *  - água com ondulação em perspectiva, mascarando o casco;
 *  - nuvens em deriva lenta e brilho cintilante no mar;
 *  - grade de cor navy, vinheta, aberração sutil nas bordas e grão.
 * Sem WebGL ou com movimento reduzido, cai para <img> estática.
 */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform float uTime;
uniform float uProg;
uniform vec2 uMouse;
uniform float uReveal;
varying vec2 vUv;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

void main() {
  vec2 uv = vUv;
  float rs = uRes.x / uRes.y;
  float ri = uImg.x / uImg.y;
  vec2 scale = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);

  // ponto focal: proa do navio; em telas estreitas o recorte acompanha o casco
  vec2 focus = vec2(0.395, 0.56);
  vec2 center = vec2(0.5 + (focus.x - 0.5) * clamp((1.0 - scale.x) * 1.6, 0.0, 1.0), 0.5);

  float zoom = 1.045 + uProg * 0.24 + (1.0 - uReveal) * 0.06;
  vec2 p = (uv - 0.5) * scale / zoom;
  p += (focus - center) * uProg * 0.42;
  p += uMouse * 0.01;
  vec2 iuv = p + center;

  // máscaras em coordenadas da imagem (y = 0 no topo)
  float horizon = 0.205;
  float t = clamp((iuv.y - 0.17) / 0.78, 0.0, 1.0);
  float left = mix(0.30, 0.12, t);
  float right = mix(0.51, 0.675, t);
  float hull = smoothstep(left - 0.025, left + 0.01, iuv.x) * (1.0 - smoothstep(right - 0.01, right + 0.025, iuv.x)) * step(0.17, iuv.y);
  float superS = step(0.30, iuv.x) * step(iuv.x, 0.51) * step(0.03, iuv.y) * step(iuv.y, 0.21);
  float ship = max(hull, superS);

  // água: ondulação com perspectiva (mais fina perto do horizonte)
  float below = smoothstep(horizon + 0.005, horizon + 0.07, iuv.y);
  float depth = max(iuv.y - horizon, 0.0);
  float n1 = noise(iuv * vec2(22.0, 60.0) + vec2(uTime * 0.12, uTime * 0.05));
  vec2 wave = vec2(
    sin(iuv.y * 150.0 / (depth + 0.12) - uTime * 1.5 + n1 * 3.0),
    cos(iuv.x * 34.0 + uTime * 0.9 + noise(iuv * 9.0 + uTime * 0.15) * 4.0)
  );
  vec2 disp = wave * vec2(0.0015, 0.0021) * (0.35 + depth * 1.7) * below * (1.0 - ship);

  // céu: deriva lenta das nuvens, sem tocar a superestrutura
  float sky = 1.0 - smoothstep(horizon - 0.05, horizon - 0.008, iuv.y);
  disp.x += sky * (1.0 - superS) * (noise(vec2(iuv.y * 7.0, uTime * 0.06)) - 0.5) * 0.007;

  vec2 suv = iuv + disp;
  vec2 ca = (uv - 0.5) * 0.0035 * length(uv - 0.5);
  vec3 col;
  col.r = texture2D(uTex, suv + ca).r;
  col.g = texture2D(uTex, suv).g;
  col.b = texture2D(uTex, suv - ca).b;

  float lum = dot(col, vec3(0.299, 0.587, 0.114));

  // luzes do convés respirando
  float warm = smoothstep(0.58, 0.92, lum) * step(col.b, col.r) * step(horizon, iuv.y);
  col += warm * 0.07 * (0.5 + 0.5 * sin(uTime * 2.1 + iuv.x * 37.0 + iuv.y * 11.0));

  // brilho cintilante no mar
  float spark = pow(noise(iuv * vec2(380.0, 820.0) + vec2(uTime * 0.55, uTime * 0.1)), 16.0);
  col += spark * 0.32 * below * (1.0 - ship) * (0.4 + depth);

  // grade: sombras puxadas para o navy GAVEA, médios levemente frios
  vec3 navy = vec3(0.02, 0.075, 0.125);
  col = mix(navy, col, 0.86 + 0.14 * lum);
  col = mix(col, col * vec3(0.94, 1.0, 1.06), 0.5);

  // vinheta + saída para o abismo
  float edge = length((uv - 0.5) * vec2(1.0, 0.9));
  col *= mix(0.42, 1.0, smoothstep(0.92, 0.18, edge));
  col = mix(col, vec3(0.012, 0.039, 0.07), smoothstep(0.72, 1.0, uProg) * 0.9);

  // grão
  col += (hash(uv * uRes + fract(uTime * 7.0) * 91.0) - 0.5) * 0.05;

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

type Props = {
  src: string;
  fallbackSrc: string;
  alt: string;
  progressRef: MutableRefObject<number>;
};

export function HeroCanvas({ src, fallbackSrc, alt, progressRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"pending" | "gl" | "static">("pending");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl = !reduce
      ? (canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" }) as WebGLRenderingContext | null)
      : null;
    if (!gl) {
       
      setMode("static");
      return;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setMode("static");
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = {
      res: gl.getUniformLocation(prog, "uRes"),
      img: gl.getUniformLocation(prog, "uImg"),
      time: gl.getUniformLocation(prog, "uTime"),
      prog: gl.getUniformLocation(prog, "uProg"),
      mouse: gl.getUniformLocation(prog, "uMouse"),
      reveal: gl.getUniformLocation(prog, "uReveal"),
    };

    let start = performance.now();
    let raf = 0;
    let smoothProg = 0;
    const tex = gl.createTexture();
    let ready = false;
    let imgW = 1920;
    let imgH = 1080;
    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img.onload = () => {
      imgW = img.naturalWidth;
      imgH = img.naturalHeight;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
      ready = true;
      start = performance.now();
      setMode("gl");
    };
    img.onerror = () => setMode("static");

    const dprCap = window.innerWidth < 900 ? 1.25 : 1.6;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(canvas);

    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      if (ready) {
        const t = (now - start) / 1000;
        smoothProg += (progressRef.current - smoothProg) * 0.12;
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        const reveal = Math.min(1, t / 2.2);
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform2f(u.img, imgW, imgH);
        gl.uniform1f(u.time, t);
        gl.uniform1f(u.prog, smoothProg);
        gl.uniform2f(u.mouse, mouse.x, mouse.y);
        gl.uniform1f(u.reveal, 1 - Math.pow(1 - reveal, 3));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src, progressRef]);

  return (
    <div className="absolute inset-0 bg-abyss">
      {/* poster imediato: evita tela vazia enquanto o WebGL inicializa */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fallbackSrc}
        alt={mode === "static" ? alt : ""}
        aria-hidden={mode === "static" ? undefined : true}
        fetchPriority="high"
        className="img-cover"
        style={{ objectPosition: "40% 50%", filter: "brightness(0.78) saturate(0.9)" }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full transition-opacity duration-1000"
        style={{ opacity: mode === "gl" ? 1 : 0 }}
      />
      {mode !== "static" && <span className="sr-only">{alt}</span>}
    </div>
  );
}
