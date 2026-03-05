# Agenda Diária

Aplicativo de agenda pessoal com blocos reutilizáveis, planejamento semanal, execução diária e histórico.

## Como rodar

```bash
npm install
npm run dev
```

Isso inicia dois processos: o servidor Express (porta 3001) e o Vite (porta 5173).
Os dados ficam salvos em arquivos JSON na pasta `data/`.

## Arquitetura

```
├── server/
│   └── index.js                     ← Express API (lê/escreve JSON em data/)
│
├── data/                            ← Armazenamento local (JSON no disco)
│   ├── universes.json               ← Definições de universos (tags)
│   ├── templates.json               ← Blocos reutilizáveis de ritos
│   ├── plan.json                    ← Plano semanal (referencia templates)
│   └── days/                        ← Dados de execução por dia
│       └── 2026-03-05.json
│
├── src/
│   ├── App.jsx                      ← Raiz: 4 abas + estado global
│   ├── api/
│   │   └── storage.js               ← Client HTTP → Express API
│   ├── constants/
│   │   ├── index.js                 ← Config, universos padrão, shapes
│   │   └── dates.js                 ← Formatação de datas
│   ├── utils/
│   │   └── helpers.js               ← uid(), tempo, deepClone
│   ├── hooks/
│   │   ├── useUniverses.js          ← CRUD universos via API
│   │   ├── useTemplates.js          ← CRUD templates via API
│   │   ├── usePlan.js               ← Plano semanal via API
│   │   └── useDayData.js            ← Bootstrap plan+templates → execução
│   ├── components/
│   │   ├── templates/TemplatesView  ← Aba "Blocos": CRUD de blocos
│   │   ├── plan/PlanView            ← Aba "Planejamento": atribui blocos
│   │   ├── day/DayView              ← Aba "Dia": execução com timeline
│   │   └── history/HistoryView      ← Aba "Histórico": gráficos
│   └── styles/
│       └── theme.js
```

## Modelo de dados

```
Templates (blocos reutilizáveis)
  { id, name, activities: [{ id, name, duration, universe }] }
        │
        │  referenciado por templateId
        ▼
Plan (plano semanal)
  { days: { 0: [{ id, templateId, startTime }], ... } }
        │
        │  materializado no primeiro acesso ao dia
        ▼
Day (execução)
  { rituals: [{ id, templateId, name, startTime, notes,
                activities: [{ ..., done }] }] }
```

## API REST

| Método | Rota            | Descrição            |
|--------|-----------------|----------------------|
| GET    | /api/universes  | Lista universos      |
| PUT    | /api/universes  | Salva universos      |
| GET    | /api/templates  | Lista templates      |
| PUT    | /api/templates  | Salva templates      |
| GET    | /api/plan       | Lê plano semanal     |
| PUT    | /api/plan       | Salva plano semanal  |
| GET    | /api/days/:date | Lê dados do dia      |
| PUT    | /api/days/:date | Salva dados do dia   |
