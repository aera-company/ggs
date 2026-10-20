# Validação técnica · V1 (19/10/2026)

## Stack e decisões

- **Next.js 16.2.2 + React 19.2.4 + TypeScript + Tailwind v4.** Mesma base da new-3d-landbase, com `turbopack.root` fixado.
- **GSAP 3.15 + ScrollTrigger** para todas as timelines com scrub. **Lenis 1.3** acoplado ao ticker do GSAP.
- **WebGL puro** no hero, sem three.js.
- **SVG** para mapa, raias, anéis técnicos, wireframe e linhas convergentes.
- **Portal:** `useReducer` + Context. Tipos em `src/components/portal/types.ts` (`RFQ`, `ServiceRequest`, `Partner`, `PartnerQuote`, `Proposal`, `ServiceTimeline`, `DemoSession`).
- **Projeto isolado** em `GGS/gavea-global-services`, com `git init` próprio (sem commits) para não cair no repositório acidental da HOME.
- `robots: noindex, nofollow` nos metadados.
- **Sem deploy, sem APIs pagas, sem geração de imagem.**
- `npm install` rodou com `--ignore-scripts`: o pós-instalação do `sharp` (opcional, só para otimização de imagem do Next) travou por mais de 8 minutos. As imagens já são WebP otimizadas e servidas com `<img>`.

## Comandos

```bash
cd ~/Desktop/GGS/gavea-global-services
npm run dev        # http://localhost:3040
npm run build && npm run start
npm run gen:map    # regenera src/data/world-dots.json
```

## Resultados

| Verificação | Resultado |
|---|---|
| `tsc --noEmit` | Sem erros |
| `eslint src` | Sem erros nem avisos |
| `next build` | Sucesso, página estática |
| JS (gzip) | Cerca de 270 KB no total (React, Next e GSAP) |
| Mídia | 1.1 MB em 17 WebP, carregamento lazy exceto no hero |
| Overflow horizontal | Nenhum em 375 px e 1440 px |

## Interações testadas (navegador, 1440×900 e 375×812)

- Validação: envio vazio mostra erros inline e foca o primeiro campo inválido.
- Criação de `DEMO-0101` com anexo local (nome e tamanho exibidos, nada enviado).
- GAVEA Ops: iniciar revisão, completar checklist, convidar 2 parceiros (SG-3 bloqueado por seguro vencido).
- Partner: cotação de SG-1 (100) e SG-2 (94), com troca de identidade.
- Ops: seleção de SG-2, margem de 15%, publicação da proposta.
- **Confidencialidade:** o Client view não contém índice, margem nem nome de parceiro (verificado por busca no texto renderizado).
- Cliente aceita; parceiro reporta mobilização, andamento e conclusão; Ops encerra; cliente vê os documentos de encerramento.
- Repeat request: campos copiados, nova janela exigida, `DEMO-0102` com "repeated from DEMO-0101".
- `Simulate next step`: 11 passos do Received ao Closed.
- `Reset demo` e o `Restart` do cabeçalho voltam ao estado inicial.
- Tabs de perspectiva navegáveis por setas (padrão ARIA tablist).
- Cenas 00 a 07 conferidas por captura em pontos-chave de cada trilha.
- Link do BUILD 2030: HTTP 200, título "GAVEA / BUILD 2030".

## Acessibilidade

- Estrutura semântica (`section` com `aria-label` por cena, `h1` no cold open, `h2` por cena).
- Link "pular para a demonstração".
- Textos divididos em palavras têm a versão completa em `sr-only`.
- Foco visível em todos os controles; formulários com `label`, `aria-invalid` e `aria-describedby`.
- Mapa e diagramas com `role="img"` e descrição.
- **Movimento reduzido:** sem Lenis, sem WebGL (poster estático), pins desfeitos e cenas empilhadas em fluxo legível. A lógica foi revisada, mas **não foi testada no navegador**: o painel de testes não emula `prefers-reduced-motion`. Testar no macOS com Ajustes > Acessibilidade > Tela > Reduzir movimento.

## Limitações conhecidas

- Imagens de baixa resolução (ver `ASSET_AND_GAPS_AUDIT.md`), mais visíveis no hero mobile.
- A interface do portal está só em inglês; o alternador PT/EN ficou para a V2.
- Sem PDF da proposta: o brief só aceita PDF gerado localmente e rotulado, e isso ficou para a V2.
- Safari e iOS reais não foram testados (só emulação de viewport no Chromium).
- O gancho `window.__ggs` (instância do Lenis) existe para QA automatizado; remover antes de publicar.

## Checklist de publicação (quando houver autorização)

- [ ] Regenerar pelo menos o frame 01 (16:9 e 9:16).
- [ ] Confirmar com a GAVEA as pendências do audit (logo SVG, fontes, nome do conceito).
- [ ] Testar Safari macOS, iOS Safari e Android Chrome.
- [ ] Testar com movimento reduzido ativado.
- [ ] Remover `window.__ggs`.
- [ ] Manter `noindex` e considerar proteção por senha na Vercel.
- [ ] Criar a imagem OG 1200×630 (ausente na V1).
- [ ] Deploy só com ordem explícita.

## V2 (20/10/2026)

| Verificação | Resultado |
|---|---|
| `tsc` / `eslint` / `next build` | Limpos |
| WebKit desktop 1440×900 | Sem erros; WebGL ativo; tour de 8 passos concluído; axe sem violações |
| WebKit iPhone 390×844 | Sem erros; hero em modo estendido; tour concluído; axe sem violações; sem overflow |
| WebKit movimento reduzido | Sem Lenis e sem WebGL; cenas empilhadas; títulos presentes |
| Títulos animados | Nenhum nome acessível duplicado (árvore ARIA verificada) |

Script de QA usado (fora do repositório): Playwright WebKit + axe-core, navegando por 13 pontos das cenas e executando o tour. `window.__ggs` agora só existe em desenvolvimento ou com `?qa`.
