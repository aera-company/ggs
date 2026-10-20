# new-3d-landbase · Auditoria e aproveitamento

Pasta auditada: `GGS/new-3d-landbase` (Next 16.2.2, React 19.2.4, Tailwind v4, Lenis, Framer Motion). Nenhum arquivo foi alterado; nada foi copiado da `.next/`.

## O que a base tem de fato

- **Não há 3D real.** Não usa three.js, r3f, shaders, câmeras nem materiais. O efeito "3D" vem de uma sequência de frames pré-renderizados desenhada num canvas 2D conforme o scroll.
- `public/frames` está vazia: só tem um README. O hero aponta para 169 `.jpg` que não existem.
- **Scroll:** seção de 400vh com palco sticky. O progresso é calculado por `getBoundingClientRect`, com rAF limitado por `tickingRef` e escrita direta em refs, sem state.
- **Lenis** com `lerp 0.1` e `syncTouch:false`, desligado sob movimento reduzido. Não é integrado ao GSAP.
- **Efeitos:** grão SVG fixo, vinheta radial, cartões de vidro, cantoneiras HUD e microrrótulos mono.
- **Performance:** DPR limitado a 2, listeners passivos, `will-change`. Faltam IntersectionObserver, set de frames para mobile e carregamento progressivo.
- **intelligence/:** pipeline (briefing, direção, estrutura, hero, copy, build, QA), regras de copy (sentence case, sem travessão), escala tipográfica de 1.25 a 1.333, uma ideia de movimento por seção, checklist de QA.

## Aproveitado (adaptado, não copiado às cegas)

| Recurso | Como entrou no GLOBAL SERVICES |
|---|---|
| `turbopack.root` fixado | `next.config.ts` copiado como está. Evita CSS defasado e fork storm por causa do `~/package-lock.json`. |
| Palco sticky com trilha em vh | Generalizado em `.pin-track` / `.pin-stage` com `--track`. O ScrollTrigger só faz o scrub, não o pin, o que dispensa spacers e é mais estável com Lenis. |
| Lenis com config segura para Safari | Mantida (`syncTouch:false`) e agora acoplada ao `gsap.ticker`, com `ScrollTrigger.update`, num único relógio. |
| Escrita em refs, sem React state no loop | Aplicada no hero WebGL, no cabeçalho (progresso) e no pulso do mapa. |
| DPR limitado | Hero com DPR máximo de 1.6 no desktop e 1.25 no mobile (mais conservador que o 2 da base). |
| Grão SVG fixo | Reaproveitado com opacidade menor (0.045). |
| Kill switch de movimento reduzido | Expandido: além de cortar transições, desfaz os pins e empilha as cenas em fluxo normal. |
| Regras do `intelligence/` | Sentence case, sem travessões, no máximo duas famílias tipográficas, uma ideia de movimento por cena, contraste AA, checklist de QA. |

## Descartado (e por quê)

| Recurso | Motivo |
|---|---|
| Frame-sequence em canvas | Não há frames, e gerar exigiria vídeo ou render pago. Foi substituído por um **shader WebGL sobre uma única imagem**: cerca de 120 KB contra 8 a 12 MB de frames, carregamento imediato e "vida" contínua (água, luz, nuvens) em vez de um scrub congelado. |
| Framer Motion | Duplicaria o GSAP. A experiência é coreografada por timeline com scrub; o GSAP cobre tudo com uma só dependência. |
| HUD sci-fi, glow dourado, leitura falsa "87.3%" | Estética de outro projeto, que soaria genérica e "futurista gratuita", contra o brief. Ficou só a ideia de microtipografia técnica, aplicada com dados reais (coordenadas de Singapura) ou rótulos honestos ("Cenário ilustrativo"). |
| Cartões de vidro e layout de anotações | O brief pede para evitar cards repetidos. As cenas usam escala, raias, listas editoriais e uma UI real. |
| Componentes `AnimatedSection` e `ScrollRevealText` | Não houve necessidade: as revelações usam máscara por palavra (`SplitWords`) dentro das timelines das cenas. |
| Geist Sans | Substituída por Archivo de largura variável, que dialoga com o logo condensado da GAVEA. |

## Os três focos pedidos

1. **Hero:** profundidade e movimento de câmera em WebGL puro (`HeroCanvas.tsx`): dolly por scroll, paralaxe de mouse, água mascarada, nuvens, luzes e grade. Poster imediato, IntersectionObserver para pausar fora da tela e fallback estático.
2. **Global Network:** malha de pontos gerada em build a partir do Natural Earth, com cinco pontos rotulados (um real, quatro hipotéticos), arcos desenhados por scroll e uma solicitação animada percorrendo o arco. Evita o globo 3D clichê e o mapa cheio de luzes.
3. **Portal Reveal:** aço em macro, anéis técnicos, varredura que converte o industrial em superfície clara, e wireframe com a geometria exata da UI que acende antes do demo real.
