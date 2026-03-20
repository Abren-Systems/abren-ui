# Abren ERP UI

> Frontend for the Abren ERP Financial Operating System.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Vue 3 + TypeScript (Composition API) |
| Build | Vite |
| UI System | Custom Design System (`core/ui/`) |
| Accessible Primitives | Radix Vue |
| DataGrid Engine | TanStack Table + TanStack Virtual |
| Server State | TanStack Query |
| Form State | TanStack Form + Zod |
| Client State | Pinia |
| Styling | Tailwind CSS v4 |
| HTTP | Axios |
| Testing | Vitest + Playwright |

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (proxies /api to localhost:8000)
npm run dev

# Run unit tests
npm run test:unit

# Generate API types from backend
npm run generate-types
```

## Project Structure

```
src/
├── app/              # Application shell (router, layouts)
├── core/             # Infrastructure (NO domain logic)
│   ├── api/          # Axios client, typed helpers
│   ├── auth/         # Auth store (JWT, tenant, features)
│   ├── composables/  # useApiQuery, useApiMutation, useFeatureGate
│   ├── domain/       # Money VO, Currency, branded types
│   ├── event-bus/    # Typed cross-module communication
│   ├── types/        # ModuleDefinition, shared contracts
│   └── ui/           # Custom Design System (components, patterns, primitives)
├── modules/          # Bounded Contexts (one per backend module)
│   ├── identity/     # Login, users, tenants
│   ├── accounting/   # Chart of accounts, journal entries
│   ├── payment-requests/
│   ├── banking/
│   ├── reporting/
│   ├── workflows/
│   ├── webhooks/
│   └── system/
└── assets/           # Tailwind v4 entry + @theme design tokens
```

## Documentation

| Document | Path |
|---|---|
| Architecture | [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md) |
| Module Structure | [docs/architecture/MODULE_STRUCTURE.md](docs/architecture/MODULE_STRUCTURE.md) |
| State Management | [docs/architecture/STATE_MANAGEMENT.md](docs/architecture/STATE_MANAGEMENT.md) |
| API Integration | [docs/architecture/API_INTEGRATION.md](docs/architecture/API_INTEGRATION.md) |
| Testing Strategy | [docs/architecture/TESTING_STRATEGY.md](docs/architecture/TESTING_STRATEGY.md) |
| Repository Strategy | [docs/REPOSITORY_STRATEGY.md](docs/REPOSITORY_STRATEGY.md) |
| Development Guide | [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) |
