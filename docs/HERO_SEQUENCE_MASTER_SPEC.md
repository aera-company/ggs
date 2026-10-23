# GAVEA GLOBAL SERVICES · HERO SEQUENCE MASTER SPEC

Brief criativo recebido do Tiago em 22/10/2026. Moodboard de referência: `docs/refs/hero-sequence-moodboard.webp`. Complementa o `HERO_MASTER_SPEC.md` (que segue valendo para a cena 03 / end).

## Objetivo

HERO como progressão cinematográfica em 3 cenas, cada uma com par start/end para animação no Magnific:

1. começar com sensação global e estratégica;
2. concentrar a energia visual e narrativa no Brasil;
3. fazer zoom para o contexto operacional;
4. desembocar numa cena final heroica, física e premium;
5. preparar a transição para o portal.

Narrativa: **world → connection → Brazil → operation → port → hero**.

## Estrutura (6 imagens mestres)

| Cena | Start | End |
|---|---|---|
| 01 · Global map | Terra noturna orbital sobre o Atlântico, Brasil legível, quase sem conexões | mesma composição, linhas e nós acendendo, Brasil como hub |
| 02 · Brazil / operational context | aérea ampla do Rio, baía e porto em golden hour | enquadramento mais fechado sobre a área portuária |
| 03 · Port hero | cena portuária ao nível do chão ou levemente elevada, grande embarcação atracada | master hero final: navio dominante, sunset, leitura limpa para sobreposição |

Nomes: `hero-scene-01-global-start`, `hero-scene-01-global-end`, `hero-scene-02-brazil-start`, `hero-scene-02-brazil-end`, `hero-scene-03-port-start`, `hero-scene-03-port-end`. Pack: `GGS_HERO_SEQUENCE_MASTER_PACK`.

## Direção de arte

- Tom: cinematográfico, premium, sóbrio, global, industrial, tecnológico, elegante, realista.
- Paleta: azuis escuros profundos, noturno e crepuscular, dourados quentes contidos, pretos densos, sem neon.
- Progressão: cena 01 fria e global; cena 02 terrestre e quente; cena 03 física, densa, heroica.

## Restrições

Sem texto, logos, nomes de navio, bandeiras, marcas ou pessoas reconhecíveis. Evitar: glow excessivo, HDR exagerado, céu e água artificiais, linhas de conexão com cara de HUD sci-fi, detalhes perfeitos demais, embarcações sem lógica construtiva, clutter. Leitura: fotografia ou plate cinematográfica de altíssimo nível, tratada como cenário conceitual.

## Entrega

16:9, 3840×2160 (master WebP ou PNG), derivados 1920×1080 para web, sem texto ou marcas.

## Resultado esperado

O espectador sente: existe uma oportunidade global; ela converge para o Brasil; ganha forma na operação; a GAVEA pode coordenar essa complexidade; agora quero ver o portal.

---

# Anexo técnico · como a sequência entra no site (AERA, 22/10)

## Continuidade entre cenas (para gerar no Magnific)

Os pares start → end viram movimento dentro de cada cena. As passagens **entre** cenas precisam ser pensadas na geração, senão viram cortes secos:

| Passagem | Regra para a geração | Como o site costura |
|---|---|---|
| 01 end → 02 start | 02 start bem alto, quase saindo das nuvens, Brasil/baía na mesma região de tela onde o hub brilhava no 01 end | dissolução por névoa e leve zoom (código) |
| 02 end → 03 start | 02 end mostra de cima o mesmo navio que abre o 03, na mesma posição de tela | corte casado com flash de luz curto (código) |
| 03 end → resto da página | 03 end é o master hero (ver `HERO_MASTER_SPEC.md`) | o último quadro passa para o WebGL atual: água viva, luzes e dolly |

## Clipes

- Um clipe por cena (start → end), **4 a 6 s**, 24 ou 30 fps, 1920×1080 no mínimo (master 4K se possível).
- Movimento de câmera contínuo e sem cortes dentro do clipe; sem acelerações bruscas no começo e no fim (facilita o scroll ir e voltar).
- Sem texto, logos, marcas, bandeiras ou nomes de navio, como no brief.
- Versão retrato (9:16) é opcional; sem ela, o celular usa recorte central com o foco do rig.

## Integração prevista

- Cada clipe vira uma sequência de quadros WebP (cerca de 48 a 72 por cena, 1280–1600 px de largura) desenhada num canvas e controlada pelo scroll. É a técnica da new-3d-landbase e a que roda fluida no Safari; vídeo controlado por scroll engasga no Safari.
- Abertura total com cerca de 2 a 3 telas de rolagem (regra do scroll curto).
- Peso estimado: 8 a 14 MB para as três cenas no desktop, carregadas em ordem (cena 01 primeiro, as demais em segundo plano).
- Os quadros finais de cada clipe entram como poster imediato, sem tela vazia no carregamento.

## Decisão pendente

As 4 frases atuais da abertura falam de Singapura, e a nova sequência termina num porto no Brasil. Antes de integrar, definir se o texto acompanha o arco mundo → Brasil → porto ou se continua como está.

---

# Protótipo · imagens paradas + rede em código (22/10, sem commit)

Os testes de vídeo no Kling (clipe 01 e clipe B) mostraram o limite da IA nas passagens grandes: o globo e as linhas ficam sobrepostos ao Rio, e as conexões acendem todas juntas. A abertura passou a usar as imagens aprovadas com o movimento feito no código.

- **Imagens:** `public/media/seq-{globe,rio,port,dock,vessel}-{1376,1920,2752}.webp` (cerca de 1,2 MB no desktop), registradas em `SEQ` (`src/lib/assets.ts`). A 01-end não é usada: a rede é desenhada por cima da 01-start.
- **Rede:** `src/components/motion/GlobeNetwork.tsx`. São 10 rotas em grande círculo, calculadas sobre uma esfera ajustada ao contorno da Terra na foto (centro 1378, 2299 e raio 2231, em px da imagem). Elas saem do Rio e somem atrás do horizonte, acendem uma por vez no scroll e têm um pulso de luz contínuo. Sem filtros SVG.
- **Sequência** (`ColdOpen.tsx`, pin de 760vh):

  | Progresso | Trecho |
  |---|---|
  | 0 a 0,22 | Globo: rotas acendem, push-in lento |
  | 0,22 a 0,3 | Mergulho no Rio, encoberto por um clarão quente |
  | 0,27 a 0,48 | Baía: chegada do alto e descida até o porto |
  | 0,48 a 0,62 | Porto: aproximação do navio |
  | 0,62 | Corte casado com um clarão curto |
  | 0,63 a 0,72 | Navio na água |
  | 0,72 em diante | Master `seq-vessel` no hero WebGL (`SEQ_VESSEL_RIG`), com revelação da marca em 0,76 |

- **Copy da abertura (proposta):** "Um navio pode estar em qualquer porto do mundo." · "E precisar de um serviço antes da próxima carga." · "O desafio não é encontrar um fornecedor." · "É ter alguém que responda pelo resultado." Os rótulos do canto acompanham o lugar: Global network, depois Rio de Janeiro · Guanabara Bay, depois Marine operations.
- **Safari:** as placas ficam sempre pintadas e empilhadas, e cada troca apaga a de cima. Ocultar e mostrar fazia o WebKit decodificar a imagem de novo no corte, com quadros de 50 a 96 ms. Medição numa passada completa de ida e volta: WebKit com 1 a 2 quadros longos em cerca de 760, Chrome com 0.
- **Movimento reduzido:** o navio fica estático e as frases aparecem empilhadas.

---

# Polish final da abertura (23/10, sem commit)

Objetivo: mais impacto e menos sensação de duração, sem perder a escala. Nenhuma imagem ou vídeo novo. Globo, rede SVG, placas e WebGL preservados.

**Cadência: um movimento por imagem, sempre para a frente.** O roteiro agora é escrito em vh de rolagem (`SCROLL = 540`, pin de 640vh, antes 760vh).

| vh | Trecho |
|---|---|
| 0 a 150 | Globo: 10 rotas acendem a partir do Rio, uma a cada 9vh. Em 118 o Rio é nomeado "Coordination hub", com a rede completa e sem texto disputando |
| 150 a 186 | Mergulho no hub, coberto pelo único clarão da abertura |
| 186 a 290 | Rio: um só avanço da baía até o porto. O vai e volta de antes (afasta, depois aproxima) saiu |
| 290 | Corte no movimento para o porto |
| 290 a 372 | Porto: avanço até o navio |
| 372 | Corte para o master |
| 372 a 540 | Navio no hero WebGL. Título em 390, completo em ~430 e em tela até o fim (~110vh de leitura) |

**Transições.** Ficou um clarão, só na entrada da atmosfera, onde ele tem motivo físico. Rio → porto e porto → navio viraram cortes secos no movimento: o avanço continua do outro lado do corte, então não há dupla exposição.

**Imagem retirada.** A `seq-dock` saiu: era o mesmo navio, no mesmo ângulo, logo antes do master, e fazia um zoom redundante com dissolve. O arquivo continua em `public/media` e no registro `SEQ`.

**Plataforma antecipada.** O rótulo do canto já abre com "Nova plataforma de serviços internacionais · GAVEA Global Services · conceito", antes de qualquer rolagem. O título chega cerca de 100vh antes do que na versão anterior.

**Navio com protagonismo.**
- Corte direto para o master, com dolly contínuo.
- No celular, recorte próprio (`SEQ_VESSEL_RIG_NARROW`, foco 0,7) na superestrutura iluminada contra o pôr do sol. Antes a proa virava só casco escuro.
- O `HeroCanvas` passou a aceitar `rigPortrait` em telas estreitas mesmo sem arquivo retrato.
- O poster do hero carrega com prioridade baixa (`priority={false}`) para não disputar banda com o globo.

**Validação** (Playwright, WebKit 2370 e Chrome do sistema):
- Rolagem de ida e volta, 7 s e 5 s: WebKit desktop com 1 a 3 quadros longos em ~760, iPhone 390×844 com 1, Chrome com 0.
- Rolagem reversa: cada ponto volta ao mesmo estado (cortes como `set` no timeline).
- 4G simulado no iPhone (9 Mbps, 170 ms): globo em 0,7 s, sequência inteira em 2,6 s.
- Movimento reduzido (desktop e iPhone): navio estático, frases empilhadas, rótulo da plataforma visível, sem erros.
- Demais seções, portal e BUILD 2030: nenhum arquivo deles foi alterado.

Folha de quadros: `docs/refs/hero-polish-sheet.jpg` (local).
