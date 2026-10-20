# GAVEA GLOBAL SERVICES · Experience script V1

Roteiro final da experiência implementada. Single page navegada por scroll, oito cenas. Mix: cerca de 75% GLOBAL SERVICES e demonstração, 15% implantação e riscos, 10% ponte para o BUILD 2030.

## Direção de arte

- **Paleta:** navy `#081E2F` e teal `#006B90`, amostrados do logo oficial (`gavea-group-vertical.png`). Abismo `#030A12`, branco editorial `#F3F1EC`, aço `#9AA8B6`, sinal `#3AA9D2` (teal clareado para contraste AA sobre o navy). Superfície clara `#E9EDF0` para o portal.
- **Tipografia:** Archivo variável (OFL). Títulos em largura 72 a 80, que ecoa o desenho condensado do logo GAVEA. Corpo em largura 100. Geist Mono para microrrótulos. Sentence case em títulos; caps só em marcas e rótulos mono pequenos (tracking 0.08em).
- **Luz e cor por cena:** abertura navy industrial, oportunidade naval, modelo em metal, portal claro e legível, encerramento em navy de marca.
- **Assinaturas:** GAVEA GROUP como marca-mãe (logo oficial branco no cabeçalho e no fecho). AERA só no rodapé final.

## Cena 00 · The request (cold open)

- **Visual:** styleframe 01 (navio-tanque) vivo em WebGL. Água ondulando em perspectiva com o casco mascarado, nuvens à deriva, luzes do convés respirando, brilho no mar, grade navy, vinheta e grão. O scroll faz um dolly em direção à proa; o mouse dá um paralaxe sutil.
- **HUD:** `Singapore · Marine operations` · `1°16′N 103°50′E` · pílula `Cenário ilustrativo`.
- **Copy (uma frase por vez, presa ao scroll):**
  1. A vessel needs tank cleaning.
  2. The challenge is not just finding a supplier.
  3. It's getting the job done.
- **Revelação:** `Concept · GAVEA GROUP` / **GAVEA Global Services** / From request to execution. Beyond borders. / botão `Explore the concept`.

## Cena 01 · A oportunidade

- **Título:** A operação se move. A necessidade acompanha.
- **Visual:** mapa em malha de pontos (Natural Earth, projeção Equal Earth) gerado em build. Revelação radial a partir de `GAVEA · Brasil`, depois arcos para quatro portos de cenário hipotético. Por fim, um pulso `Request · Tank cleaning · Demo` viaja de Singapura até a GAVEA.
- **Legendas em sequência:**
  - Compradores marítimos enfrentam demandas operacionais em portos, prazos e jurisdições diferentes.
  - Um navio em Singapura precisa de tank cleaning. Quem coordena, contrata e responde pelo serviço?
  - Um único interlocutor comercial capaz de coordenar o serviço em outra geografia, sob condições validadas.
- **Legenda do mapa:** Não representa cobertura, parceiros ou operações existentes.

## Cena 02 · O modelo de negócio

- **Título:** One partner. One accountable process.
- **Subtítulo:** A GAVEA lidera a relação comercial e coordena a entrega. Parceiros locais qualificados executam sob contrato.
- **Visual:** cinco etapas presas ao scroll. Fundos em crossfade (styleframes 01, 02, 05, 03, 06) e um diagrama de raias Cliente / GAVEA / Parceiro local, com o traço percorrendo os nós. No mobile, as raias viram um stepper.
  1. Cliente · Solicita
  2. GAVEA · Qualifica
  3. GAVEA · Contrata
  4. Parceiro local · Executa
  5. GAVEA · Acompanha e encerra (retorno ao cliente)
- **Nota final:** Não é um marketplace. O cliente não entra em um leilão de fornecedores: tem um único responsável comercial.

## Cena 03 · The platform

**Portal reveal (transição de maior impacto):**
1. Aproximação no aço do flange (styleframe 02) com anéis técnicos desenhados e rótulos Request · Scope · Partner · Execution.
2. Uma linha de varredura desce pela tela; acima dela, o industrial vira superfície clara com grid.
3. A janela do portal se desenha em traço com a mesma geometria da UI real, depois acende.
4. **The platform.** / Da solicitação à execução, em um só lugar.

**Live demo:** protótipo navegável em React, com estado local e dados identificados como demonstrativos.
- **Client view:** nova solicitação (serviço, localização, embarcação, tipo, janela, tanques, histórico de carga, notas, anexo local), validação, criação de `DEMO-0101`, linha do tempo, proposta fictícia, aceite, atualizações de execução, documentos de encerramento, histórico e Repeat request.
- **GAVEA Operations:** caixa de entrada, checklist de qualificação, seleção e convite de parceiros (um bloqueado por seguro vencido), cotações, margem e composição em índice, publicação da proposta, monitoramento e encerramento. Tudo marcado como interno.
- **Partner view:** escolha da identidade de parceiro, convite para cotar sem dados comerciais do cliente final, envio de cotação em índice, homologação ilustrativa e atualizações de execução.
- **Controles de demo:** `Simulate next step` (atalho para o apresentador), `Reset demo` e aviso fixo de que tudo é fictício e local.

## Cena 04 · Por que usar

- **Título:** Por que usar o portal em vez de mandar um e-mail?
- **Resposta:** a demanda deixa de ser uma conversa espalhada e passa a ser uma operação gerenciável, com dono, etapas e histórico.
- **Visual:** e-mails soltos convergem em uma RFQ estruturada.
- **Benefícios:** uma porta de entrada · menos repetição · visibilidade do andamento · propostas e documentos juntos · relação contínua · alcance internacional sujeito à homologação.

## Cena 05 · Aquisição internacional

- **Título:** Não é só software. É um novo canal de negócios.
- **Visual 1:** exemplo editorial de landing `Tank cleaning, coordinated end to end.`, com selo "não publicado" e "Coverage subject to service and region validation".
- **Visual 2:** seis canais convergindo no portal e daí para o comercial GAVEA.

## Cena 06 · Estratégia de lançamento

- **Título:** Testar o modelo antes de escalar.
- **Marcos:** Validate · Qualify · Prototype · Pilot.
- **Riscos críticos:** segurança operacional, seguros, compliance, tributação e contratos transfronteiriços, licenças locais, responsabilidade técnica.
- **Proposta de implantação:** A workshop de validação · B recorte do piloto · C estrutura de responsabilidades · D protótipo operacional.
- **Fecho:** GAVEA GROUP / Global Services / One partner. Global solutions.

## Cena 07 · The next GAVEA

- Uma nova plataforma pode abrir novos mercados.
- Uma visão de futuro pode preparar a GAVEA para todos eles.
- Um frame real do hero BUILD 2030 abre por uma fresta horizontal.
- **The next GAVEA** / **GAVEA BUILD 2030** / One GAVEA. One Direction.
- Uma visão independente da AERA para posicionamento, comunicação, marketing e tecnologia da próxima fase da GAVEA.
- CTA real: `Conhecer BUILD 2030`, que abre https://build-2030.vercel.app (HTTP 200 e título "GAVEA / BUILD 2030" verificados em 19/10/2026).
- **Rodapé:** Concept experience by AERA · aviso de conceito · Restart experience.

## Storyboard de motion (resumo)

| Cena | Trilha | Ideia de movimento |
|---|---|---|
| 00 | 420vh | Dolly WebGL e frases em máscara |
| 01 | 340vh | Revelação radial, arcos e pulso da solicitação |
| 02 | 480vh | Crossfade de fundos e traço nas raias |
| 03 | 300vh + demo | Zoom no aço, varredura e wireframe que acende |
| 04 | 240vh | E-mails convergindo na RFQ |
| 05 | livre | Entrada do browser e linhas convergindo |
| 06 | livre | Linha de marcos e fade editorial |
| 07 | 320vh | Frases, depois a fresta que abre no BUILD 2030 |
