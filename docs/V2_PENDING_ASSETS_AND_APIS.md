# V2 · Ajustes que dependem de novos assets, vídeos ou APIs pagas

Nada abaixo foi feito: tudo exige autorização para gastar créditos ou material novo. A arquitetura já está pronta para receber cada item sem refazer animações (ver `ASSET_SWAP_GUIDE.md`).

## Imagens (Magnific ou equivalente)

| Prioridade | Item | Por quê | Encaixe |
|---|---|---|---|
| 1 | **Hero Vessel nativo**, 16:9 em 3840×2160 e 9:16 em 2160×3840 | Maior limitação visual. O modo estendido no celular reduziu a pixelização, mas o original tem cerca de 440 px. | `ASSETS.heroVessel` + `HERO_RIG` (e `rigPortrait` se a composição retrato mudar) |
| 2 | Service Execution sem marcas nos uniformes | As inscrições foram removidas digitalmente; a imagem segue de baixa resolução. | `ASSETS.serviceExecution` |
| 3 | The People sem marca | Idem. | `ASSETS.thePeople` |
| 4 | Industrial Macro em 4K | Base do Portal Reveal; o zoom chega a 1.55x. | `ASSETS.industrialMacro` (rever o centro dos anéis) |
| 5 | Tank Cleaning refinado | Aparece na cadeia de valor e na jornada de aquisição. | `ASSETS.tankCleaning` |

## Vídeo (opcional, só após aprovar o frame 1)

- **Loop de 6 a 8 s do hero.** O shader já dá movimento à imagem; o vídeo seria um upgrade. Exigiria trocar a textura estática por uma de vídeo no `HeroCanvas` (suportado pelo WebGL), mantendo poster e fallback.
- **Plate de 2 a 3 s do horizonte abrindo** para a entrada do BUILD 2030, se a AERA quiser substituir a linha de luz por imagem real.

## Som (opcional)

- Design sonoro discreto no hero, na varredura do Portal Reveal e no horizonte do BUILD 2030, com ativação explícita pelo usuário. Exigiria trilha licenciada ou gerada (ElevenLabs ou similar, com créditos).

## Integrações e APIs (fora do escopo do conceito)

- Integração real com o GAVEA TRADE (RFQs, cotações, propostas): proposta de arquitetura apenas.
- Autenticação, upload real de documentos, e-mail e assinatura: deliberadamente ausentes no protótipo.
- PDF demonstrativo da proposta, gerado localmente e rotulado (não depende de API; ficou para a próxima etapa por escopo).
- Alternador PT/EN no portal (não depende de API; próxima etapa).

## Validações que não são técnicas

- Fontes oficiais e logo vetorial da GAVEA.
- Autorização para o link público do BUILD 2030 nesta apresentação.
- Revisão jurídica de qualquer frase que vá para uma página pública.
