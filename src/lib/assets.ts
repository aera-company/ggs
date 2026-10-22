/**
 * Registro único de imagens da experiência.
 *
 * Para trocar um asset (ex.: hero nativo em 4K), basta colocar os arquivos em
 * public/media e atualizar a entrada aqui: caminhos, dimensões, ponto focal e,
 * no hero, o "rig" do shader. Nenhuma animação precisa ser refeita.
 * Guia completo: docs/ASSET_SWAP_GUIDE.md
 */

export type Focal = { x: number; y: number }; // 0..1, origem no canto superior esquerdo

export type ImageSource = { src: string; w: number; h: number };

export type Asset = {
  alt: string;
  /** imagem gerada para direção de arte (não é fotografia de operação real) */
  concept: boolean;
  /** variantes paisagem, da menor para a maior */
  sources: ImageSource[];
  /** versão retrato opcional (9:16), usada em telas estreitas */
  portrait?: ImageSource;
  focal: Focal;
  /** ponto focal para telas estreitas, quando difere do desktop */
  focalNarrow?: Focal;
};

/**
 * Rig do hero: máscaras e foco em coordenadas da imagem.
 * O shader ondula a água fora do casco e da superestrutura, e o dolly
 * avança em direção ao foco. Ajustar se a imagem do hero mudar.
 */
export type HeroRig = {
  horizon: number;
  focus: Focal;
  /** casco como trapézio: topo/base em y, limites esquerdo/direito no topo e na base */
  hull: { top: number; bottom: number; l0: number; r0: number; l1: number; r1: number };
  superstructure: { x0: number; x1: number; y0: number; y1: number };
  /** deriva das nuvens acima do horizonte (1 = padrão, 0 = céu parado) */
  skyDrift?: number;
};

/** Variantes paisagem por largura. Para um master 4K: variants("hero-vessel", [1080, 1920, 3840]). */
const variants = (name: string, widths: number[], ratio = 1080 / 1920): ImageSource[] =>
  widths.map((w) => ({ src: `/media/${name}-${w}.webp`, w, h: Math.round(w * ratio) }));
const pair = (name: string) => variants(name, [1080, 1920]);

export const ASSETS = {
  heroVessel: {
    alt: "Navio-tanque em mar aberto ao entardecer. Imagem conceitual.",
    concept: true,
    sources: pair("hero-vessel"),
    // Master nativo (ver docs/HERO_MASTER_SPEC.md):
    // sources: variants("hero-vessel", [1080, 1920, 3840]),
    // portrait: { src: "/media/hero-vessel-portrait.webp", w: 2160, h: 3840 },
    focal: { x: 0.395, y: 0.56 },
  },
  industrialMacro: {
    alt: "Flange de tubulação industrial em macro. Imagem conceitual.",
    concept: true,
    sources: pair("industrial-macro"),
    focal: { x: 0.42, y: 0.58 },
  },
  tankCleaning: {
    alt: "Profissional em limpeza de tanque. Imagem conceitual.",
    concept: true,
    sources: pair("tank-cleaning"),
    focal: { x: 0.45, y: 0.5 },
    focalNarrow: { x: 0.4, y: 0.5 },
  },
  thePeople: {
    alt: "Coordenador técnico consultando um tablet no porto. Imagem conceitual.",
    concept: true,
    sources: pair("the-people"),
    focal: { x: 0.62, y: 0.4 },
    focalNarrow: { x: 0.3, y: 0.4 },
  },
  serviceExecution: {
    alt: "Equipe executando serviço no convés. Imagem conceitual.",
    concept: true,
    sources: pair("service-execution"),
    focal: { x: 0.18, y: 0.5 },
    focalNarrow: { x: 0.35, y: 0.5 },
  },
  build2030: {
    alt: "Abertura do filme GAVEA BUILD 2030: a Terra à noite, com uma linha de luz traçando o horizonte.",
    concept: false,
    sources: [
      { src: "/media/build2030-film-poster-1080.webp", w: 1080, h: 608 },
      { src: "/media/build2030-film-poster-1920.webp", w: 1920, h: 1080 },
    ],
    focal: { x: 0.55, y: 0.5 },
    focalNarrow: { x: 0.62, y: 0.5 },
  },

} satisfies Record<string, Asset>;

/**
 * Abertura em sequência (protótipo, 22/10): imagens paradas com movimento e rede
 * em código. Masters 2752 × 1536 gerados no Higgsfield (pack em
 * human-output/image/ggs-hero-sequence). Spec: docs/HERO_SEQUENCE_MASTER_SPEC.md
 */
const seq = (name: string) => variants(name, [1376, 1920, 2752], 1536 / 2752);
export const SEQ = {
  globe: { alt: "A Terra à noite vista da órbita, com o Brasil iluminado. Imagem conceitual.", concept: true, sources: seq("seq-globe"), focal: { x: 0.32, y: 0.6 } },
  rio: { alt: "Baía de Guanabara ao pôr do sol, com o Pão de Açúcar e o porto. Imagem conceitual.", concept: true, sources: seq("seq-rio"), focal: { x: 0.55, y: 0.6 } },
  port: { alt: "Navio-tanque atracado no porto do Rio, visto do alto. Imagem conceitual.", concept: true, sources: seq("seq-port"), focal: { x: 0.64, y: 0.5 } },
  dock: { alt: "Navio-tanque atracado ao entardecer, visto da água. Imagem conceitual.", concept: true, sources: seq("seq-dock"), focal: { x: 0.45, y: 0.45 } },
  vessel: { alt: "Proa de um navio-tanque atracado ao entardecer. Imagem conceitual.", concept: true, sources: seq("seq-vessel"), focal: { x: 0.3, y: 0.45 } },
} satisfies Record<string, Asset>;

/** Rig do master final da sequência (seq-vessel): navio inteiro acima da linha d'água. */
export const SEQ_VESSEL_RIG: HeroRig = {
  horizon: 0.665,
  focus: { x: 0.36, y: 0.45 },
  hull: { top: 0.0, bottom: 0.75, l0: 0.06, r0: 0.81, l1: 0.17, r1: 0.8 },
  superstructure: { x0: 0.06, x1: 0.81, y0: 0.0, y1: 0.67 },
  skyDrift: 0,
};

export type AssetId = keyof typeof ASSETS;

export const HERO_RIG: HeroRig = {
  horizon: 0.205,
  focus: { x: 0.395, y: 0.56 },
  hull: { top: 0.17, bottom: 0.95, l0: 0.3, r0: 0.51, l1: 0.12, r1: 0.675 },
  superstructure: { x0: 0.3, x1: 0.51, y0: 0.03, y1: 0.21 },
};

export const srcSet = (a: Asset) => a.sources.map((s) => `${s.src} ${s.w}w`).join(", ");
export const largest = (a: Asset) => a.sources[a.sources.length - 1];
/** Menor variante que cobre a largura pedida (evita subir textura 4K num celular). */
export const pickSource = (a: Asset, minWidth: number) => a.sources.find((s) => s.w >= minWidth) ?? largest(a);
export const pct = (f: Focal) => `${f.x * 100}% ${f.y * 100}%`;
