# Hero Vessel · especificação do master cinematográfico

Briefing para gerar (ou fotografar) o master nativo que substitui o styleframe 01, sem refazer o WebGL nem a composição atual. **Nada foi gerado nesta etapa.**

## 1. Composição a preservar

Medidas em fração da imagem (0 a 1, origem no canto superior esquerdo). Elas vêm do rig atual (`HERO_RIG` em `src/lib/assets.ts`). Se o master respeitar esses valores, o shader funciona sem ajuste.

| Elemento | Posição atual | Tolerância sem recalibrar |
|---|---|---|
| Horizonte | y = 0.205 | ±0.02 |
| Proa (foco do dolly) | x = 0.395, y = 0.56 | ±0.03 |
| Casco: topo | y = 0.17, x de 0.30 a 0.51 | ±0.02 |
| Casco: base | y = 0.95, x de 0.12 a 0.675 | ±0.03 |
| Superestrutura | x de 0.30 a 0.51, y de 0.03 a 0.21 | ±0.02 |

Leitura de cena: navio-tanque vindo em direção à câmera, levemente à esquerda do centro, câmera alta (drone) em leve picado, entardecer com céu quente no topo e mar azul-escuro em ondulação. Luzes do convés acesas. Espaço escuro de mar no terço inferior para o texto.

## 2. Regras de conteúdo

- Sem texto, logotipo, nome de navio, bandeira ou marca de qualquer empresa (inclusive GAVEA).
- Sem pessoas reconhecíveis.
- Navio genérico, sem identificar armador real.
- Imagem identificada como conceitual na apresentação ("Cenário ilustrativo").

## 3. Formatos de entrega

| Arquivo | Dimensão | Uso |
|---|---|---|
| `hero-vessel-3840.webp` | 3840×2160 | desktops de alta densidade |
| `hero-vessel-1920.webp` | 1920×1080 | desktop padrão (substitui o atual) |
| `hero-vessel-1080.webp` | 1080×608 | fallback leve |
| `hero-vessel-portrait.webp` (opcional) | 2160×3840 | celular em retrato |

WebP qualidade ~80. O componente escolhe sozinho a menor variante que cobre a tela; um celular não baixa o 4K.

**Versão retrato:** a mesma cena recomposta em 9:16, com o navio inteiro no terço superior e médio, e mar escuro embaixo para o texto. Sem ela, o celular continua no modo estendido atual (imagem no alto, céu e mar gerados pelo shader), que já funciona.

## 4. Como trocar

1. Copiar os arquivos para `public/media/`.
2. Em `src/lib/assets.ts`, na entrada `heroVessel`, trocar `sources: pair("hero-vessel")` por `sources: variants("hero-vessel", [1080, 1920, 3840])` e, se houver, descomentar `portrait`.
3. Abrir `http://localhost:3040/?rig`. A sobreposição mostra o casco em vermelho, a superestrutura em laranja, o horizonte em ciano e o foco como uma cruz branca, com o dolly congelado.
4. Se algo não encaixar, ajustar os números do `HERO_RIG` até o vermelho cobrir o casco, o laranja cobrir a superestrutura e a linha ciano coincidir com o horizonte.
5. Se a versão retrato tiver outra composição, passar um `rigPortrait` ao `HeroCanvas` em `ColdOpen.tsx`.

Tempo estimado de calibração: menos de 15 minutos.

## 5. Opcional, depois do frame aprovado

- Loop de vídeo de 6 a 8 s (mar e luzes). O shader aceita textura de vídeo, mas a imagem estática viva já atende a apresentação.
- Plate de céu separado, para paralaxe real entre céu e navio.
