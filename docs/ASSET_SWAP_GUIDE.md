# Guia de troca de assets

Todas as imagens passam por `src/lib/assets.ts`. Para trocar uma, não é preciso mexer em nenhuma cena ou animação.

## Passo a passo

1. Exportar em WebP, sem texto nem logos na imagem:
   - paisagem: 1080 e 1920 px de largura (ou 1920 e 3840 para 4K), nomes `nome-1080.webp` / `nome-1920.webp`;
   - retrato opcional (9:16): `nome-portrait.webp`.
2. Colocar em `public/media/`.
3. Atualizar a entrada em `ASSETS`:
   - `sources`: caminhos e dimensões (use o helper `pair("nome")` para o par 1080/1920);
   - `portrait`: descomentar ou adicionar quando houver versão 9:16;
   - `focal` e `focalNarrow`: ponto de interesse (0 a 1) para o recorte no desktop e no celular;
   - `concept`: `true` para imagem gerada, `false` para material real.
4. Rodar `npm run dev` e conferir as cenas.

## Hero (navio)

O shader do hero usa o `HERO_RIG`, em coordenadas da imagem (0 a 1, y a partir do topo):

| Campo | O que é |
|---|---|
| `horizon` | linha do horizonte (abaixo dela a água ondula) |
| `focus` | ponto para onde o dolly avança (proa) |
| `hull` | trapézio do casco: `top`/`bottom` em y, `l0`/`r0` no topo e `l1`/`r1` na base (a água não ondula aqui) |
| `superstructure` | retângulo da superestrutura acima do horizonte (as nuvens não derivam aqui) |

Com um hero novo, abra `http://localhost:3040/?rig`: a sobreposição mostra casco (vermelho), superestrutura (laranja), horizonte (ciano) e foco (cruz branca). Ajuste o rig até encaixar. Especificação completa em `HERO_MASTER_SPEC.md`. Para a versão retrato, passe `rigPortrait` ao `HeroCanvas` se a composição for diferente.

Sem versão retrato, telas estreitas usam o modo estendido (imagem no alto, céu e mar gerados pelo shader). Com versão retrato, ela é usada em cover.

## Onde cada asset aparece

| Id | Cenas |
|---|---|
| `heroVessel` | 00 (WebGL), 02 etapa 1 |
| `industrialMacro` | 02 etapa 2, 03 Portal Reveal (anéis técnicos centrados em 42% × 58%) |
| `tankCleaning` | 02 etapa 3, 05 landing da jornada |
| `thePeople` | 02 etapa 4 |
| `serviceExecution` | 02 etapa 5 |
| `build2030` | 07 |

O Portal Reveal posiciona os anéis técnicos sobre o flange do `industrialMacro`. Se esse asset mudar, ajuste `origin-[42%_58%]` e as coordenadas `672,522` em `Platform.tsx`.
