/**
 * Rede de conexões desenhada sobre a imagem do globo (seq-globe), em coordenadas
 * da própria imagem (2752 × 1536). As rotas são grandes círculos calculados numa
 * esfera ajustada ao contorno da Terra na foto: saem do Rio, acompanham a
 * curvatura e somem atrás do horizonte. O ColdOpen acende uma por vez no scroll.
 */

const W = 2752;
const H = 1536;
// contorno da Terra na imagem (ajuste por mínimos quadrados sobre o limbo)
const CX = 1378;
const CY = 2299;
const R = 2231;
// Rio de Janeiro na imagem
export const HUB = { x: 872, y: 1073 };

type V3 = [number, number, number];

/** ponto visível na foto */
const front = (x: number, y: number): V3 => {
  const dx = (x - CX) / R;
  const dy = (y - CY) / R;
  return [dx, dy, Math.sqrt(Math.max(1 - dx * dx - dy * dy, 0))];
};
/** ponto atrás do horizonte: direção na tela (graus, 0 = para cima) e quanto passa do limbo */
const behind = (ang: number, beyond: number): V3 => {
  const a = (ang * Math.PI) / 180;
  const b = (beyond * Math.PI) / 180;
  return [Math.sin(a) * Math.cos(b), -Math.cos(a) * Math.cos(b), -Math.sin(b)];
};

// ordem = ordem em que acendem
const ROUTES: { to: V3; node?: [number, number] }[] = [
  { to: front(2257, 630), node: [2257, 630] }, // Golfo da Guiné
  { to: behind(7, 18) }, // norte da Europa
  { to: behind(-27, 22) }, // Golfo do México
  { to: behind(38, 40) }, // Ásia
  { to: front(2573, 1014), node: [2573, 1014] }, // África do Sul
  { to: behind(-14, 16) }, // costa leste dos EUA
  { to: front(1899, 330), node: [1899, 330] }, // África Ocidental
  { to: behind(-38, 14) }, // Caribe e Panamá
  { to: behind(22, 26) }, // Mediterrâneo
  { to: front(413, 1436), node: [413, 1436] }, // Rio da Prata
];

function routePath(to: V3) {
  const a = front(HUB.x, HUB.y);
  const dot = a[0] * to[0] + a[1] * to[1] + a[2] * to[2];
  const w = Math.acos(Math.min(1, Math.max(-1, dot)));
  const s = Math.sin(w);
  const lift = 0.008 + (0.062 * w) / Math.PI;
  let d = "";
  for (let k = 0; k <= 72; k++) {
    const t = k / 72;
    const ka = Math.sin((1 - t) * w) / s;
    const kb = Math.sin(t * w) / s;
    const p = [0, 1, 2].map((i) => a[i] * ka + to[i] * kb);
    const l = 1 + lift * Math.sin(Math.PI * t);
    const x = CX + p[0] * R * l;
    const y = CY + p[1] * R * l;
    // atrás do globo e dentro da silhueta: a rota terminou para a câmera
    if (p[2] < 0 && Math.hypot(x - CX, y - CY) < R * 1.004) break;
    d += `${k ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

const PATHS = ROUTES.map((r) => ({ d: routePath(r.to), node: r.node }));

export function GlobeNetwork() {
  return (
    <svg
      data-network
      viewBox={`0 0 ${W} ${H}`}
      className="seq-network absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="seq-hub-glow">
          <stop offset="0" stopColor="#ffe2b0" stopOpacity="0.9" />
          <stop offset="0.25" stopColor="#f2b765" stopOpacity="0.35" />
          <stop offset="1" stopColor="#f2b765" stopOpacity="0" />
        </radialGradient>
      </defs>

      {PATHS.map((p, i) => (
        <g key={i} data-arc>
          <path d={p.d} pathLength={1} className="seq-arc-halo" />
          <path d={p.d} pathLength={1} className="seq-arc" />
          <path d={p.d} pathLength={1} data-pulse className="seq-pulse" style={{ animationDelay: `${-i * 0.37}s` }} />
          {p.node && (
            <g data-node>
              <circle cx={p.node[0]} cy={p.node[1]} r={26} fill="url(#seq-hub-glow)" />
              <circle cx={p.node[0]} cy={p.node[1]} r={5} fill="#ffe7c2" />
            </g>
          )}
        </g>
      ))}

      <g data-hub>
        <circle cx={HUB.x} cy={HUB.y} r={120} fill="url(#seq-hub-glow)" />
        <circle cx={HUB.x} cy={HUB.y} r={34} className="seq-hub-ring" />
        <circle cx={HUB.x} cy={HUB.y} r={8} fill="#fff1dc" />
      </g>
    </svg>
  );
}
