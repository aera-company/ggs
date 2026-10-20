import data from "@/data/world-dots.json";

type Place = { label: string; x: number; y: number; kind: "home" | "scenario" };
const places = data.places as Record<string, Place>;


/** Arco quadrático entre dois pontos, curvado para "cima" do mapa. */
export function arcPath(a: Place, b: Place, lift = 0.32) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  // normal apontando para cima
  let nx = -dy / dist;
  let ny = dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const cx = mx + nx * dist * lift;
  const cy = my + ny * dist * lift;
  return `M${a.x} ${a.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
}

const ROUTES = ["singapore", "rotterdam", "houston", "fujairah"] as const;

export function WorldMap({ className }: { className?: string }) {
  const home = places.brasil;
  return (
    <svg
      viewBox={`0 0 ${data.width} ${data.height}`}
      className={className}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Mapa conceitual: GAVEA no Brasil conectada a quatro portos de cenário hipotético (Singapore, Rotterdam, Houston e Fujairah). Não representa cobertura implantada."
    >
      <defs>
        <linearGradient id="wm-arc" x1="0" x2="1">
          <stop offset="0" stopColor="#3aa9d2" stopOpacity="0.15" />
          <stop offset="1" stopColor="#3aa9d2" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* malha estática (scripts/gen-map.mjs): rasterizada uma vez, sem custo por quadro */}
      <image data-dots href="/media/world-dots.svg" x="0" y="0" width={data.width} height={data.height} />

      {ROUTES.map((k) => (
        <path
          key={k}
          data-arc={k}
          id={`arc-${k}`}
          d={arcPath(home, places[k])}
          pathLength={1}
          fill="none"
          stroke="url(#wm-arc)"
          strokeWidth="1.2"
          strokeDasharray="1"
          strokeDashoffset="0"
        />
      ))}

      {ROUTES.map((k) => {
        const p = places[k];
        const anchorEnd = p.x > 760;
        return (
          <g key={k} data-port={k} transform={`translate(${p.x} ${p.y})`}>
            <circle r="7" fill="none" stroke="#3aa9d2" strokeOpacity="0.35" />
            <circle r="2.6" fill="#030a12" stroke="#3aa9d2" strokeWidth="1.2" />
            <text
              x={anchorEnd ? -12 : 12}
              y={4}
              textAnchor={anchorEnd ? "end" : "start"}
              className="fill-paper"
              style={{ font: "500 13px var(--font-geist-mono)", letterSpacing: "0.06em" }}
            >
              {p.label.toUpperCase()}
            </text>
          </g>
        );
      })}

      <g data-home transform={`translate(${home.x} ${home.y})`}>
        <circle data-home-ring r="10" fill="none" stroke="#f3f1ec" strokeOpacity="0.5" />
        <circle r="4" fill="#f3f1ec" />
        <text x={12} y={18} className="fill-paper" style={{ font: "500 13px var(--font-geist-mono)", letterSpacing: "0.06em" }}>
          GAVEA · BRASIL
        </text>
      </g>

      {/* pulso da solicitação: percorre o arco Singapore → Brasil */}
      <g data-pulse opacity="0">
        <circle r="9" fill="#3aa9d2" fillOpacity="0.18" />
        <circle r="3.4" fill="#3aa9d2" />
      </g>
      <g data-pulse-label opacity="0">
        <rect x="-4" y="-17" width="214" height="25" rx="3" fill="#030a12" fillOpacity="0.85" stroke="#3aa9d2" strokeOpacity="0.5" />
        <text x="6" y="0" className="fill-paper" style={{ font: "500 12px var(--font-geist-mono)", letterSpacing: "0.05em" }}>
          REQUEST · TANK CLEANING · DEMO
        </text>
      </g>
    </svg>
  );
}

export { places, ROUTES };
