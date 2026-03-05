# Agenda Diária

Aplicativo de agenda pessoal com planejamento semanal, execução diária e histórico.

## Arquitetura

```
src/
├── App.jsx                          ← Raiz: tab routing + estado global
│
├── constants/
│   ├── index.js                     ← Storage keys, universos padrão, config
│   └── dates.js                     ← Nomes de dias/meses, formatação, helpers de data
│
├── utils/
│   └── helpers.js                   ← uid(), conversão de tempo, deepClone
│
├── hooks/
│   ├── index.js                     ← Barrel export
│   ├── useStorage.js                ← Hook genérico: lê/escreve JSON no storage
│   ├── usePlan.js                   ← Hook do planejamento semanal + universos
│   └── useDayData.js                ← Hook do dia: bootstrap automático do plano
│
├── components/
│   ├── shared/                      ← Componentes reutilizados em múltiplas views
│   │   ├── Icons.jsx                ← Todos os ícones SVG inline
│   │   ├── Loader.jsx               ← Spinner de carregamento
│   │   ├── AddRitualForm.jsx        ← Formulário "Novo Rito"
│   │   └── AddActivityInline.jsx    ← Formulário inline "Nova Atividade"
│   │
│   ├── day/                         ← View de execução diária
│   │   ├── DayView.jsx              ← Timeline + régua horária
│   │   ├── RitualCard.jsx           ← Card de rito com progresso e atividades
│   │   └── NotesPanel.jsx           ← Painel de notas do rito
│   │
│   ├── plan/                        ← View de planejamento (template semanal)
│   │   ├── PlanView.jsx             ← Seletor de dia + CRUD de ritos-template
│   │   ├── UniverseManager.jsx      ← CRUD de universos (tags)
│   │   └── CopyDayDropdown.jsx      ← Copiar ritos entre dias
│   │
│   └── history/                     ← View de histórico
│       └── HistoryView.jsx          ← Gráficos de distribuição + conclusão
│
└── styles/
    └── theme.js                     ← Objeto centralizado com todos os estilos
```

## Conceitos-chave

### Fluxo de dados

```
usePlan() ──→ plan (template semanal + universos)
                │
                ▼
useDayData(date, plan) ──→ dayData (execução do dia)
                              │
                              ▼ bootstrap se dia é novo
                           plan.days[dow]
```

- **Plan** é o template. Define quais ritos existem para cada dia da semana.
- **DayData** é a execução. Quando você navega para um dia novo, ele copia o template do plano como ponto de partida. A partir daí, alterações são independentes.
- **Universos** são categorias (tags) configuráveis. Vivem dentro do Plan.

### Storage

Usa `window.storage` (API do Claude artifacts) com chaves hierárquicas:

| Chave                  | Conteúdo                        |
|------------------------|---------------------------------|
| `agenda-v4:plan`       | Template semanal + universos    |
| `agenda-v4:2026-03-05` | Dados do dia (ritos, notas, atividades) |

### Camadas

| Camada       | Responsabilidade                              |
|-------------|-----------------------------------------------|
| `constants` | Dados estáticos, configuração, nomes          |
| `utils`     | Funções puras (sem React)                     |
| `hooks`     | Estado + efeitos (lógica de negócio)          |
| `components`| UI (apresentação + interação)                 |
| `styles`    | Tokens visuais centralizados                  |

### Dependências externas

- **recharts** — gráficos (pizza + barras) na HistoryView
- **Google Fonts** — Fraunces (display) + DM Sans (body)
