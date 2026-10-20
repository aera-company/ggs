import type { CSSProperties } from "react";
import { ASSETS, largest, pct, srcSet, type Asset, type AssetId } from "@/lib/assets";

type Props = {
  id: AssetId;
  className?: string;
  style?: CSSProperties;
  /** vazio quando a imagem é decorativa (o texto vizinho já descreve) */
  decorative?: boolean;
  priority?: boolean;
  sizes?: string;
  [data: `data-${string}`]: unknown;
};

/**
 * Imagem a partir do registro de assets: srcset, versão retrato opcional
 * e ponto focal por breakpoint (variáveis CSS --fp / --fp-narrow).
 */
export function AssetImage({ id, className = "img-cover", style, decorative, priority, sizes = "100vw", ...rest }: Props) {
  const a: Asset = ASSETS[id];
  const big = largest(a);
  const vars = {
    "--fp": pct(a.focal),
    "--fp-narrow": pct(a.focalNarrow ?? a.focal),
  } as CSSProperties;
  return (
    <picture>
      {a.portrait && <source media="(max-aspect-ratio: 3/4)" srcSet={a.portrait.src} />}
      <img
        {...rest}
        src={big.src}
        srcSet={srcSet(a)}
        sizes={sizes}
        width={big.w}
        height={big.h}
        alt={decorative ? "" : a.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={`asset-focal ${className}`}
        style={{ ...vars, ...style }}
      />
    </picture>
  );
}
