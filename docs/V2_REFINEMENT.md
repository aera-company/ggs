# V2 Refinement · o que mudou (20/10/2026)

Etapa de refinamento sobre a V1 publicada (ggs-portal.vercel.app). A arquitetura, o storytelling, o portal e os recursos técnicos foram preservados. Nenhum crédito gasto, nenhum deploy, nada commitado.

## 1. Hero e assets

- **Registro único de imagens** em `src/lib/assets.ts`: caminhos, dimensões, ponto focal (desktop e telas estreitas), versão retrato opcional e o "rig" do hero (horizonte, máscaras do casco e da superestrutura, foco do dolly). Trocar um asset não exige mexer em animação. Ver `ASSET_SWAP_GUIDE.md`.
- **Componente `AssetImage`**: srcset, `<picture>` com versão 9:16 automática quando existir, ponto focal por breakpoint via variáveis CSS. Todas as cenas passaram a usá-lo.
- **Hero no celular:** antes, o recorte vertical ampliava a imagem cerca de 4 vezes. Agora, em telas retrato, a imagem ocupa a parte alta da tela com o navio inteiro, e o shader estende céu e mar acima e abaixo (sem listras, com ondulação). Os efeitos WebGL foram preservados. Quando houver um hero 9:16 nativo, ele entra no lugar automaticamente (com rig próprio, se necessário).
- O poster imediato do hero segue o mesmo enquadramento do WebGL, para não haver salto na troca.

## 2. Narrativa comercial

- **Cena 02 reescrita como cadeia de valor:** a GAVEA recebe a demanda internacional, qualifica o escopo, contrata o parceiro especializado, apresenta sua proposta e coordena a entrega. Cada etapa mostra "Para o cliente" (um só ponto de contato, escopo claro antes do preço, rede qualificada sem leilão, uma proposta e uma contraparte, quem vende responde).
- **Cena nova, "Por que pela GAVEA":** contratar sozinho (quatro fornecedores em portos diferentes, linhas emaranhadas e fricções: contrato, seguro, idioma, cotação, fatura, prazo, documentos, homologação) se reorganiza em contratar pela GAVEA (um responsável, que aciona o parceiro homologado). Cinco benefícios, sem números inventados.

## 3. Portal

- **Demonstração guiada em 8 passos** para reunião executiva, ancorada embaixo da tela como controle de apresentador. Cada passo diz quem age e em qual perspectiva, executa a ação real do protótipo, troca de perspectiva sozinho, destaca a área envolvida e rola até ela.
  1. Cliente descreve a necessidade
  2. GAVEA qualifica
  3. GAVEA aciona parceiros homologados
  4. Parceiros cotam
  5. GAVEA compõe e publica a proposta
  6. Cliente aprova sem ver custos
  7. Parceiro executa e reporta
  8. GAVEA encerra e entrega documentação
- Ao fim: "Repetir solicitação" ou "Recomeçar". A qualquer momento, "Explorar livremente"; a demonstração pode ser retomada.
- **Botão "Fill with example"** no formulário, para o modo livre.
- O fluxo das três perspectivas segue intacto: todas as ações manuais continuam funcionando, e o tour reconhece passos feitos à mão.

## 4. Aquisição internacional

- A seção virou uma **jornada visual em uma única janela**: Search → Service landing → RFQ → GAVEA Operations → Proposal → Execution, com trilho de etapas, URL mudando e uma legenda curta por tela. Os canais ficaram numa linha discreta.

## 5. Direção editorial

- **Cold open em português**, em quatro frases ("Um navio chega a Singapura." / "Os tanques precisam estar limpos antes da próxima carga." / "O desafio não é encontrar um fornecedor." / "É ter alguém que responda pelo resultado."), ajustado em 20/10 após avaliação do Tiago. Marca, conceitos e a demonstração internacional continuam em inglês.
- **Avisos enxugados:** saíram as etiquetas por imagem, a lista de instruções do demo (o tour substitui), a nota interna da cena 04 e frases redundantes da UI. Ficaram a pílula "Cenário ilustrativo" no hero, a legenda do mapa, o selo "Demo" e uma linha no portal, o selo "não publicado" na jornada de aquisição e o aviso completo no rodapé.
- **Piloto enxuto:** o centro da seção agora são as cinco decisões da liderança (serviço e região, papel contratual, critérios de homologação, quem conduz, relação com o GAVEA TRADE). Os marcos ficaram compactos, os riscos críticos num painel expansível, e há um próximo passo proposto (workshop de validação).

## 6. BUILD 2030

- Transição mais curta e cinematográfica: depois das duas frases, uma linha de horizonte se acende, o ano avança de 2026 a 2030 e o horizonte se abre no frame do BUILD 2030. Termina com "Uma segunda conversa: como a GAVEA chega a 2030." e o link real. O projeto BUILD 2030 não foi tocado.

## 7. Polimento técnico

- **Safari testado no motor WebKit** (Playwright 1.64, build 2370) em desktop 1440×900, iPhone 390×844 e movimento reduzido: sem erros de console, WebGL ativo, sem overflow horizontal, tour de 8 passos concluído nos dois tamanhos.
- **Acessibilidade:** axe-core sem violações (corrigidos contraste do texto `--faint`, trilho da jornada, rótulos do cabeçalho e uma lista de definição). Títulos animados verificados na árvore de acessibilidade: nenhum duplicado. O título do BUILD 2030 passou a existir para leitores de tela mesmo antes da revelação visual. Saiu um `aria-live` ruidoso do cabeçalho.
- **Movimento reduzido:** sem Lenis e sem WebGL, cenas empilhadas e legíveis (verificado em WebKit).
- O gancho de QA `window.__ggs` só existe em desenvolvimento ou com `?qa` na URL.
- Lint e build de produção limpos.

## 8. Ajuste de scroll e abertura (20/10, após avaliação)

- **Abertura reescrita** em quatro frases curtas, escolhidas pelo Tiago.
- **Cenas presas cerca de 36% mais curtas** (de ~29 para ~19 telas de rolagem somadas).
- **Engasgos eliminados** (medido com rolagem contínua, quadros acima de 34 ms):
  - Mapa: a malha de 3.000 pontos com máscara SVG era redesenhada na CPU a cada quadro no Safari (100% de quadros longos). Agora é uma imagem estática (`public/media/world-dots.svg`), revelada por opacidade.
  - Grão de filme sem `mix-blend-mode` e sem camada maior que a tela; sem `backdrop-filter` no cabeçalho, nas raias e no tour; sem filtros CSS em imagens que se movem.
  - Varredura do Portal Reveal com transforms (wipe por duas camadas opostas) em vez de `clip-path`, e a linha por `transform` em vez de `top`.
  - Cabeçalho mede posições só quando o layout muda (antes lia `getBoundingClientRect` a cada quadro).
  - Imagens pré-decodificadas em segundo plano depois da carga, para a primeira exibição não dar tranco.
  - Hero WebGL com resolução interna menor no desktop (DPR máximo 1.3).
- **Resultado no WebKit:** de 21% (abertura), 100% (mapa) e 18% (cadeia de valor) de quadros longos para 0% em todas as cenas. No Chrome, só o primeiro gesto de rolagem tem um quadro longo.
