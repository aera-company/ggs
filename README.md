# GAVEA Global Services · Concept experience

Experiência cinematográfica e protótipo navegável do conceito GAVEA GLOBAL SERVICES, concebidos pela AERA para a liderança da GAVEA GROUP. Conceito estratégico: cenários, parceiros e dados são ilustrativos.

## Rodar localmente

```bash
npm install --ignore-scripts
npm run dev   # http://localhost:3040
```

## Estrutura

```
src/app/                  layout, tokens (globals.css), fontes OFL
src/components/scenes/    as cenas (ColdOpen … Epilogue), incluindo Advantage (V2)
src/components/motion/    HeroCanvas (WebGL), WorldMap, Lenis+GSAP, hook de cena
src/components/portal/    protótipo do portal: tipos, dados demo, reducer, 3 visões
src/data/world-dots.json  malha do mapa (gerada por scripts/gen-map.mjs)
src/lib/assets.ts          registro de imagens e rig do hero
public/media/             styleframes em WebP + frame do BUILD 2030
public/brand/             logos oficiais (GAVEA GROUP branco, AERA)
docs/                     conceito, roteiro, auditorias, validação, revisão crítica
```

## Documentos

- `docs/CONCEPT_OVERVIEW.md`: tese, modelo, MVP, riscos, métricas.
- `docs/EXPERIENCE_SCRIPT.md`: roteiro e copy de todas as cenas.
- `docs/ASSET_AND_GAPS_AUDIT.md`: ativos usados e ausentes, lista de regeneração no Magnific, pendências com a GAVEA.
- `docs/NEW_3D_LANDBASE_AUDIT.md`: o que foi aproveitado ou descartado da base e por quê.
- `docs/TECH_VALIDATION.md`: build, testes, acessibilidade, checklist de publicação.
- `docs/CRITICAL_REVIEW.md`: leitura crítica e próximos refinamentos (V1).
- `docs/V2_REFINEMENT.md`: o que mudou na V2.
- `docs/V2_PENDING_ASSETS_AND_APIS.md`: o que depende de novos assets, vídeos ou APIs pagas.
- `docs/ASSET_SWAP_GUIDE.md`: como trocar imagens pelo registro `src/lib/assets.ts`.

Sem deploy. Publicação somente com autorização.
