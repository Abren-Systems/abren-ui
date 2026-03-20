# Abren ERP UI

A **domain-aware frontend** for the Abren ERP Financial Operating System, built on a modular architecture that aligns with the backend's bounded contexts.

**Tech Stack:** Vue 3 · Vite · Pinia · TypeScript

## Documentation

→ **[docs/OVERVIEW.md](docs/OVERVIEW.md)** — Start here for the full documentation map.

For the authoritative frontend architectural manifesto:
→ **[docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)**

For how this repo coexists with the backend:
→ **[docs/REPOSITORY_STRATEGY.md](docs/REPOSITORY_STRATEGY.md)**

## Quick Start

```bash
npm install
npm run dev
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for full setup instructions.

## Project Structure

```
src/
├── app/          # Application shell, router, layouts
├── shared/       # Shared Kernel — types, components, utilities
├── modules/      # Bounded Contexts — one per backend module
│   ├── identity/
│   ├── accounting/
│   ├── workflows/
│   ├── payment-requests/
│   ├── banking/
│   ├── reporting/
│   ├── webhooks/
│   └── system/
└── styles/       # Design tokens, global CSS
```

## Backend

This project consumes the [Abren ERP API](../abren-erp-api/) — a multi-tenant, modular monolith built with FastAPI, SQLAlchemy, and DDD patterns.
