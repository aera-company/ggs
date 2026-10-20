# Asset and gaps audit · V1

Auditoria feita em 19/10/2026 sobre `GAVEA_GLOBAL_SERVICES_ASSETS_V01.zip`, o Desktop e o repositório do BUILD 2030. Nenhum arquivo original foi alterado. Nenhum crédito de Magnific ou de outro gerador foi usado.

## 1. Ambiente auditado

| Item | Local | Uso |
|---|---|---|
| Brief mestre | `GGS/GAVEA_GLOBAL_SERVICES_CLAUDE_MASTER_BRIEF_V1.md` | Referência integral |
| Asset pack | `GGS/GAVEA_GLOBAL_SERVICES_ASSETS_V01.zip` | 8 styleframes, 8 recortes 4:5, 2 moodboards, manifesto |
| Colagem solta | `GGS/Colagem Cinemática de Serviços Marítimos-2.png` | Idêntica ao moodboard 1 (mesmo tamanho em bytes). Não usada. |
| new-3d-landbase | `GGS/new-3d-landbase` | Auditada, ver `NEW_3D_LANDBASE_AUDIT.md`. Preservada. |
| GAVEA TRADE | `~/Desktop/GAVEA-TRADE-APP`, `~/Desktop/GV_TRD` | Não tocados. Tokens lidos só como referência. |
| BUILD 2030 | repo `aera-company/build-2030`; deploy `build-2030.vercel.app` | A pasta local não está mais no Desktop. Lido via `gh api` (somente leitura). |

## 2. Ativos reutilizados

| Ativo | Origem | Onde entra | Tratamento |
|---|---|---|---|
| Logo GAVEA GROUP horizontal branco | `~/Desktop/06.b logo gavea hor simples branco cor2.png` | Cabeçalho, portal, fecho | Removido o rótulo "06.b" que vinha no canto do PNG; recortado e reduzido para 1600 px (`public/brand/gavea-group-white.png`) |
| Logo AERA | `~/Desktop/aera logos finais/logo aera principal final.svg` | Rodapé | Vetor original, cor trocada para `#F3F1EC` e viewBox recortado (`public/brand/aera.svg`) |
| Cores oficiais | `~/Desktop/gavea-group-vertical.png` | Tokens | Amostragem de pixels: `#081E2F` e `#006B90` |
| Archivo e Geist Mono (OFL) | `~/Desktop/AERA_BRAND_FILM_01/public/fonts` | Tipografia | Copiadas com as licenças para `src/app/fonts` |
| Styleframes 01 a 06 | Asset pack | Cenas 00, 02, 03, 05 | WebP 1920 e 1080, unsharp leve |
| Frame do hero BUILD 2030 | `aera-company/build-2030/docs/review-frames-hero-v3/frame-000.png` | Cena 07 | WebP 1440, sem upscale |
| Malha do mapa | `world-atlas` (Natural Earth, domínio público) | Cena 01 | Gerada em build (`scripts/gen-map.mjs`), 3 024 pontos |

### Intervenção em imagens geradas

Os styleframes **05 (THE PEOPLE)** e **06 (SERVICE EXECUTION)** tinham "GAVEA" escrito nos uniformes, gerado por IA. Isso sugeriria equipe GAVEA executando serviços no exterior, o que o brief proíbe e o modelo contradiz (quem executa é o parceiro). As inscrições foram removidas por difusão local nos derivados web; os PNGs originais seguem intactos. Mesmo assim, os dois frames precisam ser regenerados sem marca.

## 3. Ativos não usados (e por quê)

| Ativo | Motivo |
|---|---|
| 04 GLOBAL CONNECTIONS | Mapa cheio de luzes aleatórias, contra o brief. Refeito em SVG com poucos pontos rotulados. |
| 07 PORTAL EXPERIENCE | UI gerada por IA. Serviu só de referência; o portal é código real. |
| 08 BUILD 2030 (styleframe) | Guindaste com "GAVEA" gerado por IA. Substituído por um frame real do hero BUILD 2030. |
| Moodboards e recortes 4:5 | Referência de direção. Resolução ainda menor que a dos 16:9. |
| Logo `Logo_Slog_hor_simbolocor.png` | Símbolo diferente do GAVEA GROUP; não foi possível confirmar a marca. |
| Episódio YouTube Gávea Group (Desktop) | Footage real, mas os direitos de uso nesta peça não foram confirmados. Ver pendências. |

## 4. Placeholders e limitações visuais

- **Todos os styleframes são ampliações de cerca de 440×247 px.** No desktop, a grade, o grão e o escurecimento seguram bem. No mobile, o recorte vertical do hero amplia de 4 a 5 vezes e mostra pixelização. É o primeiro item a regenerar.
- O hero WebGL usa uma máscara trapezoidal ajustada à mão para o casco do styleframe 01. Se a imagem for trocada, os números da máscara em `HeroCanvas.tsx` precisam ser revistos.
- A transição do Portal Reveal centraliza os anéis técnicos no flange do styleframe 02 (ponto em 42% e 58%). Mesma observação.

## 5. Lista de regeneração e refino (Magnific ou equivalente)

Prioridade de cima para baixo. Gerar **sem texto, sem logos e sem uniformes com marca**. Logos e tipografia entram por HTML.

| # | Frame | Ação | Formato | Notas de prompt |
|---|---|---|---|---|
| 1 | 01 HERO VESSEL | Regenerar nativo | 16:9 3840×2160 **e** 9:16 2160×3840 | Mesma composição: proa centrada, horizonte a cerca de 20% do topo, entardecer, luzes do convés. O 9:16 elimina a pixelização no mobile. Opcional: plate do céu separado para paralaxe real. |
| 2 | 06 SERVICE EXECUTION | Regenerar | 16:9 4K | Uniformes neutros, sem inscrições. Equipe de parceiro local, não "GAVEA". |
| 3 | 05 THE PEOPLE | Regenerar | 16:9 4K | Coordenador com tablet, sem marca no uniforme. A tela do tablet pode ficar fora de foco (a UI real é a do portal). |
| 4 | 02 INDUSTRIAL MACRO | Regenerar ou upscale criativo | 16:9 4K | Flange em plano macro, perto do centro-esquerda. Base da transição para a interface. |
| 5 | 03 TANK CLEANING | Upscale criativo | 16:9 4K e 4:5 | Pode ser só refino. Usado no modelo e na landing de aquisição. |
| 6 | Hero em movimento (opcional) | Vídeo curto em loop | 16:9, 6 a 8 s | Só depois de aprovar o frame 1. O shader atual já dá vida à imagem estática; vídeo seria um upgrade, não uma dependência. |

Não regenerar: 04 (mapa é código), 07 (portal é código), 08 (substituído por material real do BUILD 2030).

## 6. Pendências de confirmação com a GAVEA

1. Validar o uso do nome "GAVEA Global Services" como conceito.
2. Confirmar se o logo `06.b` é a versão negativa vigente do GAVEA GROUP. Obter o SVG oficial (os arquivos atuais são PNG; o SVG da pasta do GAVEA TRADE só embute um PNG).
3. Confirmar fontes oficiais da marca. A experiência usa Archivo como escolha provisória documentada.
4. Confirmar se a GAVEA autoriza aparecer como "GAVEA · Brasil" no mapa (base genérica, sem cidade).
5. Direito de uso do episódio "Conhecendo Quem Faz Acontecer EP-03" caso se queira footage real da GAVEA em versão futura.
6. Confirmar que o link público do BUILD 2030 pode aparecer nesta apresentação.
7. Nenhum serviço, porto, parceiro, SLA ou certificação foi afirmado como real. Qualquer evolução para página pública exige validação jurídica.
