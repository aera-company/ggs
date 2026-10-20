// Gera a malha de pontos do mapa (Global Network) em tempo de build.
// Fonte: world-atlas (Natural Earth, domínio público). Saída: src/data/world-dots.json
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { geoContains, geoEqualEarth } from "d3-geo";
import { feature } from "topojson-client";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/land-110m.json"), "utf8"));
const land = feature(topo, topo.objects.land);

const W = 1000;
const H = 486;
const projection = geoEqualEarth().fitExtent(
  [
    [6, 6],
    [W - 6, H - 6],
  ],
  { type: "Sphere" },
);

const STEP = 1.9; // graus
const dots = [];
for (let lat = 78; lat >= -56; lat -= STEP) {
  // compensa a convergência dos meridianos para manter densidade visual uniforme
  const lonStep = STEP / Math.max(0.35, Math.cos((lat * Math.PI) / 180));
  for (let lon = -180; lon < 180; lon += lonStep) {
    if (geoContains(land, [lon, lat])) {
      const [x, y] = projection([lon, lat]);
      dots.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
    }
  }
}

// Pontos do cenário. Apenas GAVEA · Brasil é fato (empresa brasileira).
// Os demais são portos de cenário hipotético, sem cobertura implantada.
const places = {
  brasil: { label: "GAVEA · Brasil", coord: [-43.2, -22.9], kind: "home" },
  singapore: { label: "Singapore", coord: [103.8, 1.29], kind: "scenario" },
  rotterdam: { label: "Rotterdam", coord: [4.48, 51.92], kind: "scenario" },
  houston: { label: "Houston", coord: [-95.0, 29.6], kind: "scenario" },
  fujairah: { label: "Fujairah", coord: [56.33, 25.12], kind: "scenario" },
};
const projected = Object.fromEntries(
  Object.entries(places).map(([k, p]) => {
    const [x, y] = projection(p.coord);
    return [k, { ...p, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }];
  }),
);

mkdirSync("src/data", { recursive: true });
writeFileSync("src/data/world-dots.json", JSON.stringify({ width: W, height: H, dots, places: projected }));
console.log(`world-dots.json: ${dots.length} pontos`);
