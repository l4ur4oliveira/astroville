# DESIGN.md

# AstroVille — Design System & UI Specification

> Especificação visual para criação do design do AstroVille no Penpot.
>
> Este documento é a fonte de verdade para identidade visual, design system, componentes, layouts, telas e estados da interface.

---

## 1. Visão do produto

### 1.1 Conceito

**AstroVille** é um jogo web casual e rápido no qual o jogador assume o papel de uma espécie de **arquiteto cósmico**.

Em cada estágio da evolução da Terra, o jogador deve escolher dois signos do zodíaco.

A combinação escolhida influencia o destino daquele estágio:

- combinação adequada → a humanidade prospera;
- combinação parcialmente adequada → a humanidade evolui, mas com instabilidade;
- combinação inadequada → o mundo entra em colapso.

O jogo deve parecer menos um teste de astrologia e mais uma **experiência interativa de evolução planetária guiada pelos astros**.

---

## 2. Princípios de design

O design deve seguir cinco princípios:

### 2.1 Cosmic

A interface deve transmitir:

- espaço;
- estrelas;
- mistério;
- escala planetária;
- astrologia;
- descoberta.

### 2.2 Minimal

Apesar do tema visual rico, a interface deve permanecer simples.

O jogador precisa entender imediatamente:

1. em qual estágio está;
2. qual é a pergunta;
3. quais signos pode escolher;
4. como confirmar a escolha.

Evitar excesso de elementos decorativos.

### 2.3 Playful

O jogo deve parecer divertido e acessível, não esotérico ou excessivamente sério.

Usar:

- microanimações;
- feedback visual;
- pequenos detalhes humorísticos;
- linguagem simples.

### 2.4 Mysterious

O jogador não deve conhecer explicitamente todas as regras.

A descoberta faz parte da experiência.

O design pode sugerir que existe uma lógica cósmica por trás das escolhas.

### 2.5 Fast

Uma partida deve poder ser concluída em poucos minutos.

A interface deve permitir:

- escolher;
- confirmar;
- receber resultado;
- continuar.

Sem menus complexos.

---

# 3. Direção visual

## 3.1 Estilo

**Minimalismo cósmico + fantasia científica + interface de jogo casual.**

Referências conceituais:

- mapas estelares;
- observatórios;
- interfaces de exploração espacial;
- astrologia moderna;
- jogos indie minimalistas.

Evitar:

- estética de horóscopo de revista;
- excesso de dourado;
- estética medieval;
- excesso de símbolos esotéricos;
- visual “tarot”;
- excesso de neon cyberpunk.

---

# 4. Paleta de cores

A interface deve utilizar uma paleta predominantemente escura.

## 4.1 Background

### Cosmic Deep

`#090B1A`

Uso:

- background principal;
- áreas externas da interface.

### Cosmic Surface

`#11152B`

Uso:

- cards;
- painéis;
- containers.

### Cosmic Elevated

`#191E38`

Uso:

- cards selecionáveis;
- elementos elevados;
- estados hover.

---

## 4.2 Cores principais

### Cosmic Violet

`#8B5CF6`

Uso:

- CTA;
- seleção;
- elementos interativos;
- progresso.

### Nebula Purple

`#C084FC`

Uso:

- highlights;
- gradientes;
- elementos decorativos.

### Star Gold

`#F6C85F`

Uso:

- sucesso;
- estrelas;
- destaque de elementos importantes.

---

## 4.3 Feedback

### Success

`#6EE7B7`

Uso:

- sucesso;
- progresso;
- estados positivos.

### Warning

`#FBBF24`

Uso:

- instabilidade;
- sucesso parcial.

### Failure

`#FB7185`

Uso:

- fracasso;
- colapso;
- estados negativos.

---

## 4.4 Texto

### Primary

`#F8FAFC`

### Secondary

`#A7AEC4`

### Muted

`#68708A`

---

# 5. Gradientes

Utilizar gradientes com moderação.

### Nebula

```text
#8B5CF6 → #C084FC
```

Uso:

- CTA;
- títulos especiais;
- elementos selecionados.

### Cosmic

```text
#090B1A → #191E38
```

Uso:

- backgrounds;
- hero sections.

### Dawn

```text
#8B5CF6 → #F6C85F
```

Uso excepcionalmente em:

- conclusão do jogo;
- evolução;
- momentos de grande conquista.

---

# 6. Tipografia

## 6.1 Fonte principal

**Inter**

Uso:

- body;
- botões;
- labels;
- nomes dos signos;
- informações de interface.

Pesos:

- Regular 400
- Medium 500
- SemiBold 600
- Bold 700

## 6.2 Fonte de display

**Space Grotesk**

Uso:

- título do jogo;
- títulos de fases;
- grandes números;
- mensagens de resultado.

Pesos:

- Medium 500
- SemiBold 600
- Bold 700

A combinação Inter + Space Grotesk deve criar uma identidade simultaneamente tecnológica e cósmica.

---

# 7. Escala tipográfica

| Token      | Tamanho | Uso                    |
| ---------- | ------: | ---------------------- |
| Display XL |    48px | título principal       |
| Display    |    40px | títulos de tela        |
| Heading 1  |    32px | títulos de fase        |
| Heading 2  |    24px | subtítulos             |
| Heading 3  |    20px | títulos de cards       |
| Body Large |    18px | pergunta principal     |
| Body       |    16px | texto padrão           |
| Body Small |    14px | informações auxiliares |
| Caption    |    12px | labels                 |

Mobile:

- Display XL → 36px
- Display → 32px
- Heading 1 → 28px
- Heading 2 → 22px

---

# 8. Grid e espaçamento

Utilizar sistema de espaçamento baseado em múltiplos de 4.

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
80px
```

## Desktop

Container máximo:

`1200px`

Padding horizontal:

`32px`

## Tablet

Padding:

`24px`

## Mobile

Padding:

`20px`

---

# 9. Border radius

Sistema:

| Token  | Radius |
| ------ | -----: |
| Small  |    8px |
| Medium |   12px |
| Large  |   16px |
| XL     |   24px |
| Pill   |  999px |

Cards principais:

`16px`

Botões:

`12px`

Badges:

`999px`

---

# 10. Sombras e profundidade

A interface não deve depender de sombras fortes.

Preferir:

- contraste de superfície;
- bordas sutis;
- glow;
- transparência.

Border padrão:

`1px solid rgba(255,255,255,0.08)`

Selected:

`1px solid #8B5CF6`

Glow selecionado:

`0 0 24px rgba(139,92,246,0.25)`

---

# 11. Background cósmico

O background deve ser predominantemente escuro e conter uma quantidade pequena de estrelas.

### Regras

- estrelas pequenas;
- baixa opacidade;
- distribuição irregular;
- algumas partículas maiores;
- nenhum excesso visual.

Criar sensação de profundidade com três camadas:

1. background;
2. pequenas estrelas;
3. nebulosas suaves.

As nebulosas devem ser abstratas e discretas.

---

# 12. Iconografia

Utilizar ícones lineares e simples.

Os símbolos dos signos são elementos de destaque e devem possuir tratamento próprio.

## Signos

Cada signo deve possuir:

- símbolo zodiacal;
- nome;
- eventualmente elemento associado.

Exemplo:

```text
♈
Áries
```

Os símbolos devem ter aproximadamente:

`32–40px`

No estado selecionado:

- aumento de escala;
- glow;
- borda;
- contraste maior.

---

# 13. Design dos signos

O signo é o principal elemento interativo do jogo.

## 13.1 Sign Card

Desktop:

`160 × 150px`

Mobile:

`calc(50% - 6px)` com altura aproximada de `120px`.

Estrutura:

```text
┌─────────────────────┐
│                     │
│         ♈          │
│                     │
│       Áries         │
│                     │
└─────────────────────┘
```

---

## 13.2 Estado Default

- background: Cosmic Surface;
- border: 1px solid rgba(255,255,255,0.08);
- símbolo: Secondary;
- nome: Primary.

---

## 13.3 Estado Hover

- background: Cosmic Elevated;
- border: Cosmic Violet;
- símbolo aumenta aproximadamente 5%;
- glow muito discreto.

---

## 13.4 Estado Selected

- background: gradiente Cosmic Violet;
- border: Cosmic Violet;
- símbolo: branco;
- nome: branco;
- glow externo;
- escala: `1.02`.

Adicionar pequeno indicador:

```text
✓
```

no canto superior direito.

---

## 13.5 Estado Disabled

Quando dois signos já foram escolhidos:

- reduzir opacity para `0.4`;
- impedir nova seleção;
- manter os dois escolhidos completamente destacados.

---

# 14. Botões

## Primary Button

Exemplo:

```text
CONFIRMAR ESCOLHA →
```

Características:

- background: Cosmic Violet;
- texto branco;
- 16px;
- SemiBold;
- height: 52px;
- radius: 12px.

Hover:

- aumentar brilho;
- pequena elevação.

Disabled:

- opacity 40%;
- sem interação.

---

## Secondary Button

Background transparente.

Border:

`rgba(255,255,255,0.12)`

Exemplo:

```text
COMO JOGAR
```

---

# 15. Badge de progresso

Formato:

```text
FASE 1 / 6
```

Estilo:

- pill;
- 12–14px;
- uppercase;
- letter spacing;
- background translúcido.

Exemplo:

```text
┌─────────────┐
│ FASE 1 / 6  │
└─────────────┘
```

---

# 16. Indicador de evolução

Criar uma linha visual representando a jornada:

```text
●────○────○────○────○────○
```

Cada ponto representa um estágio.

Estados:

- Completed → Star Gold
- Current → Cosmic Violet + glow
- Locked → Muted
- Failed/current retry → Warning ou Failure

No mobile, o indicador pode ser reduzido para:

```text
● ● ● ○ ○ ○
```

---

# 17. Tela 01 — Landing / Home

## Objetivo

Apresentar o conceito e iniciar o jogo rapidamente.

### Estrutura

```text
┌─────────────────────────────────┐
│                                 │
│            ✦   ·                │
│                                 │
│         ASTROGENESIS            │
│                                 │
│      O destino da humanidade    │
│         está nas estrelas.      │
│                                 │
│                                 │
│            ◉                    │
│         TERRA                   │
│                                 │
│                                 │
│       [ COMEÇAR JORNADA ]       │
│                                 │
│          Como jogar             │
│                                 │
│      ·   ✦       ·      ✧      │
└─────────────────────────────────┘
```

### Elemento central

Uma representação estilizada da Terra.

Não utilizar uma imagem fotográfica realista.

Preferir:

- esfera;
- gradiente;
- brilho atmosférico;
- pequenos pontos de luz.

---

# 18. Tela 02 — Introdução da fase

Antes da seleção, apresentar rapidamente o estágio.

Exemplo:

```text
FASE 1 / 6

SOPA PRIMORDIAL

A Terra ainda é jovem.
Tudo está começando.

      🌍

Prepare o mundo para
receber a vida.
```

CTA:

```text
ESCOLHER SIGNOS →
```

Essa tela pode ser omitida em fases posteriores caso o objetivo seja acelerar a experiência.

---

# 19. Tela 03 — Seleção

Esta é a tela principal do jogo.

### Desktop

```text
┌────────────────────────────────────────────────┐
│ FASE 1 / 6                         ● ○ ○ ○ ○ ○ │
│                                                │
│              SOPA PRIMORDIAL                   │
│                                                │
│   No estágio Sopa Primordial do planeta Terra, │
│   quais os dois signos ideais para que a       │
│   humanidade prospere?                         │
│                                                │
│          ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│          │ ♈ │ │ ♉ │ │♊ │ │ ♋ │           │
│          └────┘ └────┘ └────┘ └────┘           │
│                                                │
│          ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│          │ ♌ │ │ ♍ │ │♎ │ │ ♏ │           │
│          └────┘ └────┘ └────┘ └────┘           │
│                                                │
│          ┌────┐ ┌────┐ ┌────┐ ┌────┐           │
│          │ ♐ │ │ ♑ │ │♒ │ │ ♓ │           │
│          └────┘ └────┘ └────┘ └────┘           │
│                                                │
│              0 / 2 escolhidos                  │
│                                                │
│             [ CONFIRMAR ESCOLHA ]              │
└────────────────────────────────────────────────┘
```

---

# 20. Seleção mobile

Mobile deve utilizar duas colunas.

```text
┌─────────────────────────┐
│ FASE 1 / 6              │
│                         │
│ SOPA PRIMORDIAL         │
│                         │
│ Quais dois signos       │
│ farão a humanidade      │
│ prosperar?              │
│                         │
│ ┌────────┐ ┌────────┐   │
│ │   ♈    │ │   ♉  │  │
│ │ Áries  │ │ Touro  │   │
│ └────────┘ └────────┘   │
│                         │
│ ┌────────┐ ┌────────┐   │
│ │   ♊    │ │   ♋     │
│ │ Gêmeos │ │ Câncer │   │
│ └────────┘ └────────┘   │
│                         │
│ ...                     │
│                         │
│       1 / 2             │
│                         │
│ [ CONFIRMAR ESCOLHA ]   │
└─────────────────────────┘
```

---

# 21. Área de escolha

Quando o jogador selecionar signos, mostrar uma área persistente próxima ao CTA.

Exemplo:

```text
SEU PAR

[ ♉ Touro ]  +  [ ♑ Capricórnio ]
```

Antes de duas escolhas:

```text
SEU PAR

[ + ]  [ + ]
```

Isso reforça visualmente a mecânica principal.

---

# 22. Tela 04 — Resultado: Sucesso

O resultado deve ser uma experiência, não apenas uma mensagem.

## Estrutura

```text
┌───────────────────────────────┐
│                               │
│             ✦                 │
│                               │
│          SUCESSO              │
│                               │
│      ♉  +  ♑                │
│                               │
│     O mundo encontrou         │
│       sua fundação.           │
│                               │
│     ───────────────           │
│                               │
│     A Terra prospera.         │
│                               │
│        [ AVANÇAR → ]          │
│                               │
└───────────────────────────────┘
```

### Visual

- fundo recebe partículas;
- glow dourado/violeta;
- símbolo da Terra evolui;
- pequena animação de expansão.

---

# 23. Tela 05 — Resultado: Sucesso Parcial

Título:

```text
INSTÁVEL
```

Visual:

- amber/yellow;
- partículas irregulares;
- pequeno efeito de oscilação.

Mensagem:

```text
A humanidade sobreviveu.

Mas o equilíbrio ainda
não foi alcançado.
```

CTA:

```text
CONTINUAR →
```

O sucesso parcial deve continuar a fase, mas com uma narrativa diferente.

---

# 24. Tela 06 — Resultado: Fracasso

Título:

```text
COLAPSO
```

Visual:

- background mais escuro;
- elementos da interface temporariamente reduzidos;
- símbolo da Terra rachado ou fragmentado;
- partículas desaparecendo.

Mensagem:

```text
A combinação entrou
em conflito.

O mundo não prosperou.
```

CTA:

```text
TENTAR NOVAMENTE
```

CTA secundário:

```text
VER DICAS
```

O botão "Ver dicas" pode ser incluído apenas em uma versão futura.

---

# 25. Tela 07 — Transição entre fases

Ao avançar:

```text
ERA DESBLOQUEADA

🌱

ERA DAS FLORESTAS

A vida encontrou espaço
para crescer.
```

Duração visual estimada:

`1–2 segundos`

Não criar uma tela obrigatória se isso prejudicar a velocidade do jogo.

Pode ser implementado como uma transição fullscreen.

---

# 26. Tela 08 — Final

Depois da sexta fase:

```text
┌───────────────────────────────┐
│                               │
│          ✦  ✧  ✦             │
│                               │
│       HUMANIDADE              │
│        PROSPEROU              │
│                               │
│            🌍                 │
│                               │
│  Você encontrou o equilíbrio  │
│      entre os astros.         │
│                               │
│     JORNADA COMPLETA          │
│                               │
│    [ JOGAR NOVAMENTE ]        │
│                               │
│       COMPARTILHAR ✦          │
│                               │
└───────────────────────────────┘
```

---

# 27. Componentes do design system

O arquivo Penpot deve possuir uma página chamada:

`00 — Design System`

Ela deve conter:

### Foundations

- Colors
- Typography
- Spacing
- Border Radius
- Shadows
- Gradients

### Components

- Button / Primary
- Button / Secondary
- Zodiac Card / Default
- Zodiac Card / Hover
- Zodiac Card / Selected
- Zodiac Card / Disabled
- Progress Indicator
- Phase Badge
- Selected Sign
- Result Badge
- Icon Button

Todos os componentes devem utilizar variantes quando aplicável.

---

# 28. Páginas do arquivo Penpot

Criar as seguintes páginas:

```text
00 — Design System
01 — Components
02 — Screens — Desktop
03 — Screens — Mobile
04 — Prototype Flow
```

---

# 29. Frames necessários

## Desktop

Criar frames para:

1. Home
2. Introdução da fase
3. Seleção — nenhum signo
4. Seleção — um signo
5. Seleção — dois signos
6. Resultado — sucesso
7. Resultado — sucesso parcial
8. Resultado — fracasso
9. Transição
10. Final

Viewport recomendado:

`1440 × 900`

---

## Mobile

Criar os mesmos frames utilizando:

`390 × 844`

Representar uma experiência mobile realista.

---

# 30. Responsividade

Desktop:

- conteúdo centralizado;
- grid de 4 signos por linha;
- máximo de aproximadamente 900px para conteúdo principal.

Mobile:

- grid de 2 signos;
- conteúdo em coluna;
- CTA próximo à área inferior;
- evitar elementos que exijam scroll excessivo.

Tablet:

- grid de 3 signos.

---

# 31. Microinterações

As microinterações devem ser discretas.

## Selecionar signo

Sequência:

1. scale `1 → 1.03`;
2. glow aparece;
3. border muda;
4. indicador ✓ surge.

Duração:

`150–200ms`

---

## Desselecionar

- scale retorna para 1;
- glow desaparece;
- indicador desaparece.

---

## Confirmar

Transição:

```text
Selection → fade/scale → Result
```

Duração:

`300–500ms`

---

## Sucesso

- estrelas aparecem;
- glow aumenta;
- Terra pulsa;
- partículas sobem.

---

## Fracasso

- card/result screen sofre pequeno shake;
- partículas desaparecem;
- background escurece.

Evitar efeitos exagerados.

---

# 32. Animações

Prioridade:

### P0

- seleção de signo;
- confirmação;
- transição entre telas.

### P1

- estrelas;
- partículas;
- evolução da Terra.

### P2

- efeitos especiais;
- animações complexas de fundo.

O jogo deve continuar funcional mesmo sem animações.

---

# 33. Acessibilidade

### Contraste

Texto principal deve possuir contraste adequado sobre o background.

### Estados

Nunca comunicar estado apenas por cor.

Exemplo:

Sucesso:

```text
✓ SUCESSO
```

Fracasso:

```text
× COLAPSO
```

### Interação

Todos os elementos interativos devem possuir:

- estado hover;
- estado focus;
- estado selected;
- estado disabled.

### Touch

Área mínima recomendada:

`44 × 44px`

---

# 34. Conteúdo das fases

O design deve acomodar os seguintes estágios:

| Fase | Estágio                | Combinação ideal      |
| ---- | ---------------------- | --------------------- |
| 1    | Sopa Primordial        | Touro + Capricórnio   |
| 2    | Nascimento dos Oceanos | Câncer + Peixes       |
| 3    | Era das Florestas      | Virgem + Touro        |
| 4    | Era das Cidades        | Gêmeos + Libra        |
| 5    | Era das Máquinas       | Capricórnio + Aquário |
| 6    | Horizonte Estelar      | Sagitário + Aquário   |

O conteúdo textual definitivo pode ser ajustado posteriormente sem alterar o layout.

---

# 35. Tom de voz

O texto deve ser:

- curto;
- misterioso;
- divertido;
- levemente épico;
- acessível.

Preferir:

> “A Terra encontrou sua fundação.”

Em vez de:

> “A combinação dos signos de Touro e Capricórnio apresentou alta compatibilidade com as características necessárias para o desenvolvimento do planeta.”

O jogo deve **mostrar**, e não explicar excessivamente.

---

# 36. Evitar

Não utilizar:

- excesso de roxo;
- estrelas em todos os elementos;
- bordas brilhantes em tudo;
- gradientes em todos os componentes;
- textos longos;
- cards excessivamente ornamentados;
- fotografias de signos;
- imagens realistas de constelações;
- estética de aplicativo de horóscopo;
- excesso de emojis.

Os símbolos zodiacais podem ser usados, mas devem fazer parte de uma linguagem visual consistente.

---

# 37. Hierarquia visual

Em qualquer tela de gameplay, a prioridade deve ser:

```text
1. Estágio atual
        ↓
2. Pergunta
        ↓
3. Signos
        ↓
4. Escolha atual
        ↓
5. CTA
```

Nada deve competir visualmente com os signos durante a seleção.

---

# 38. Estrutura recomendada no Penpot

O arquivo deve ser organizado para facilitar futura implementação em React.

Exemplo:

```text
AstroVille
│
├── 00 — Design System
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Icons
│   └── Effects
│
├── 01 — Components
│   ├── Buttons
│   ├── Zodiac Cards
│   ├── Progress
│   ├── Phase Header
│   └── Result
│
├── 02 — Screens — Desktop
│   ├── Home
│   ├── Phase Intro
│   ├── Selection
│   ├── Success
│   ├── Partial
│   ├── Failure
│   └── Final
│
├── 03 — Screens — Mobile
│   └── ...
│
└── 04 — Prototype Flow
```

---

# 39. Protótipo

Conectar as telas no seguinte fluxo:

```text
HOME
  ↓
PHASE INTRO
  ↓
SELECTION
  ↓
RESULT
  │
  ├── SUCCESS ──────→ NEXT PHASE
  │
  ├── PARTIAL ──────→ NEXT PHASE
  │
  └── FAILURE ──────→ SELECTION
```

Após a última fase:

```text
RESULT
  ↓
FINAL
```

---

# 40. Critério de conclusão do design

O design será considerado pronto quando:

- [ ] Design system definido
- [ ] Cores definidas
- [ ] Tipografia definida
- [ ] Componentes principais criados
- [ ] Estados dos componentes criados
- [ ] Home criada
- [ ] Gameplay desktop criado
- [ ] Gameplay mobile criado
- [ ] Estados de resultado criados
- [ ] Tela final criada
- [ ] Fluxo de protótipo conectado
- [ ] Responsividade representada
- [ ] Hierarquia visual validada
- [ ] Componentes preparados para futura implementação em React

---

# 41. Instruções para criação via Penpot MCP

O MCP deve interpretar este documento como especificação de design e não como conteúdo para uma única tela.

A ordem recomendada de execução é:

### Passo 1 — Estrutura

Criar o arquivo:

`AstroVille`

Criar as cinco páginas especificadas.

### Passo 2 — Foundations

Criar:

- palette;
- typography;
- spacing;
- radius;
- effects.

### Passo 3 — Components

Criar componentes reutilizáveis antes das telas.

Prioridade:

1. Zodiac Card
2. Primary Button
3. Secondary Button
4. Progress Indicator
5. Phase Header
6. Result Card

### Passo 4 — Desktop

Criar todas as telas desktop utilizando os componentes.

### Passo 5 — Mobile

Adaptar os mesmos componentes e telas para `390 × 844`.

Não redesenhar componentes do zero.

### Passo 6 — Prototype

Conectar as telas seguindo o fluxo definido.

---

# 42. Regra importante para o MCP

Ao encontrar uma decisão não especificada neste documento, priorizar nesta ordem:

1. simplicidade;
2. consistência com o Design System;
3. mobile-first;
4. legibilidade;
5. identidade cósmica;
6. decoração.

**Não adicionar novas funcionalidades ou telas sem necessidade.**

O objetivo desta primeira versão é criar um design visual consistente, divertido e implementável, e não um produto visualmente complexo.

---

# 43. Resultado esperado

O resultado final deve parecer um pequeno **jogo indie cósmico**, e não um dashboard ou aplicativo tradicional.

A sensação desejada é:

> **“Estou brincando de decidir o destino da humanidade através dos astros.”**

A interface deve fazer o jogador querer descobrir:

> **“E se eu escolher esses dois?”**

Esse sentimento de curiosidade é o principal objetivo visual do AstroVille.
