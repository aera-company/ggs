# V3 · Refinamento editorial e comercial (21/10/2026)

Evolução sobre a versão publicada (`f259629`). Arquitetura, scroll otimizado, abertura em quatro frases, demonstração guiada e transição para o BUILD 2030 preservados. Nenhum crédito usado, nada publicado.

## O que mudou

**1. Hero pronto para o master nativo**
- Sobreposição de calibração `?rig`: mostra casco, superestrutura, horizonte e foco sobre a imagem, com o dolly congelado.
- Suporte a master 4K (`variants("hero-vessel", [1080, 1920, 3840])`); o WebGL escolhe a menor textura que cobre a tela, então o celular não baixa o 4K.
- Especificação completa do master (composição, tolerâncias, formatos, troca em 5 passos) em `HERO_MASTER_SPEC.md`.

**2. Escalabilidade (cena nova "Um modelo. Muitos serviços.")**
- Logo depois de "Por que pela GAVEA" e antes do portal.
- A mesma cadeia (Recebe · Qualifica · Contrata · Propõe · Coordena) processa categorias que se alternam no scroll: tank cleaning, limpeza de casco, inspeção subaquática, manutenção offshore, equipes técnicas embarcadas, limpeza industrial.
- Catálogo curto por domínio (marítimo, offshore, industrial). Tank cleaning aparece como "cenário desta apresentação"; todo o resto como "a validar". Uma linha deixa claro que nenhuma outra categoria é oferta atual.
- Pin curto (170vh).

**3. Diferencial central reforçado**
- "Por que pela GAVEA" agora termina nos três papéis, que acendem juntos no texto e no diagrama: 1 · Contraparte comercial, 2 · Coordena a operação, 3 · Contrata parceiros locais, quando necessário.
- Cadeia de valor, etapa 3: "Contrata o parceiro local, quando necessário".
- O fecho do Global Services repete a frase-síntese: "A GAVEA é a contraparte, coordena a operação e contrata parceiros locais qualificados quando necessário."

**4. Conclusão com proposta de piloto**
- Cartão "Recorte proposto · a validar com a GAVEA": **serviço** (tank cleaning), **região** (um porto internacional prioritário; Singapura como cenário de estudo), **parceiros** (2 a 3 parceiros locais homologados), **clientes iniciais** (3 a 5 clientes atuais, por convite).
- Fases (Validar → Homologar → Prototipar → Pilotar) e o que medir, na mesma peça.
- Três decisões para começar, riscos críticos num painel expansível e o próximo passo (workshop de validação).
- Os números do recorte são parâmetros de escopo a validar, não dados comerciais. Nenhum preço, volume, prazo ou cliente real.

**5. BUILD 2030**
- Não foi tocado: continua só depois do fecho do Global Services.

**6. Cadência e legibilidade (Safari desktop e mobile)**
- Rolagem medida no WebKit: **0% de quadros longos nas 10 cenas**; página com ~25 telas no total (as cenas presas somam ~20).
- No celular, "Por que pela GAVEA" ficou compacta (descrições só no desktop, rótulos do diagrama maiores, legendas secundárias ocultas).
- Fundo do cabeçalho mais sólido sobre seções escuras, para títulos não passarem por baixo do texto do cabeçalho.
- Regressão WebKit (desktop, iPhone, movimento reduzido): tour de 8 passos concluído, axe sem violações, títulos sem duplicação, sem erros e sem overflow.

## Para avaliar

```bash
cd ~/Desktop/GGS/gavea-global-services
npm run dev   # http://localhost:3040
```

Calibração do hero: `http://localhost:3040/?rig`.

## 7. Filme do BUILD 2030 no epílogo (21/10)

- O frame 3D saiu. O horizonte agora se abre num **poster da abertura do próprio filme** (a Terra à noite), com o texto "AERA apresenta" removido só no poster.
- **Preparação antes do vídeo:** frases de ponte → horizonte e 2026 → 2030 → "The next GAVEA · GAVEA BUILD 2030", a frase de contexto e "Antes de encerrar, um filme curto sobre essa segunda conversa". O botão "Assistir ao filme · 1 min 12 s · com som" é o único jeito de iniciar.
- **Modo cinema:** o clique escurece a tela e o filme entra em fade. Como ele abre no escuro, não há corte. Controles: pausar, som, tela cheia (inclusive iPhone), barra de progresso clicável, fechar (Esc), e controles que somem com o mouse parado. O scroll da página fica travado enquanto o filme roda e volta para o mesmo ponto ao fechar.
- **Fim:** cartão "Uma segunda conversa: como a GAVEA chega a 2030", com "Conhecer BUILD 2030", "Assistir de novo" e "Voltar à apresentação".
- **Arquivos:** `public/media/build2030-film-1080.mp4` (25 MB) e `build2030-film-720.mp4` (8 MB), H.264 + AAC, com início rápido (faststart), gerados a partir do master de 122 MB. Notebooks e projetores recebem 1080p; celulares, 720p. O download começa em segundo plano quando o horizonte aparece, para o play ser imediato na reunião.
- **Testado no motor do Safari** (desktop e iPhone): o áudio toca após o clique, o cartão final aparece, o Esc fecha, a rolagem e o foco voltam ao botão. Nenhum quadro longo a mais na rolagem.
- **Pendente:** legendas (arquivo VTT) se o filme tiver locução e for exibido sem som.
