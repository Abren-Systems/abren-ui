# Module Structure & Boundary Rules

> **Parent:** [Frontend Architecture](ARCHITECTURE.md)

---

## 1. Bounded Context → Module Mapping

Each backend module has a 1:1 frontend counterpart:

| Backend Module | Backend Schema | Frontend Module | Route Prefix | Description |
|---|---|---|---|---|
| `core` | `core` | `modules/identity/` | `/identity` | Tenants, Users, Login |
| `accounting` | `accounting` | `modules/accounting/` | `/accounting` | Chart of Accounts, Journal Entries |
| `approvals` | `approvals` | `modules/workflows/` | `/workflows` | Approval policies & workflow config |
| `payment_requests` | `payment_requests` | `modules/payment-requests/` | `/payments` | Payment request lifecycle |
| `bank` | `bank` | `modules/banking/` | `/banking` | Bank accounts, reconciliation |
| `reporting` | — | `modules/reporting/` | `/reporting` | Dashboards, cashflow charts |
| `webhooks` | `webhooks` | `modules/webhooks/` | `/settings/webhooks` | Webhook subscription management |
| `system` | — | `modules/system/` | `/system` | System health, data import |

---

## 2. Module Internal Structure

Every module **MUST** follow this exact directory layout:

```
src/modules/{module-name}/
├── components/              # Vue SFCs scoped to this module
│   ├── {Entity}List.vue     # List/table views
│   ├── {Entity}Form.vue     # Create/edit forms
│   └── {Entity}Card.vue     # Detail/summary cards
│
├── composables/             # Use Case Hooks (business logic)
│   ├── use{Action}.ts       # One composable per business action
│   └── use{Entity}List.ts   # List data fetching + pagination
│
├── mappers/                 # Anti-Corruption Layer
│   └── {entity}.mapper.ts   # DTO → ViewModel pure functions
│
├── pages/                   # Route-level page components
│   ├── {Entity}ListPage.vue
│   └── {Entity}DetailPage.vue
│
├── services/                # API calls (typed HTTP methods)
│   └── {module}.service.ts  # Uses core HTTP client
│
├── stores/                  # Pinia store(s)
│   └── {module}.store.ts    # Module-scoped client state
│
├── types/                   # TypeScript definitions
│   ├── api.types.ts         # Raw API DTO interfaces (from OpenAPI)
│   └── view.types.ts        # ViewModel interfaces (what components use)
│
├── routes.ts                # Lazy-loaded route definitions
└── index.ts                 # ModuleDefinition export
```

---

## 3. Naming Conventions

### Files
| Type | Pattern | Example |
|---|---|---|
| API client | `{module}.service.ts` | `accounting.service.ts` |
| Store | `{module}.store.ts` | `accounting.store.ts` |
| Composable | `use{Action}.ts` | `useVoidEntry.ts` |
| Mapper | `{entity}.mapper.ts` | `journal-entry.mapper.ts` |
| Page | `{Entity}{View}Page.vue` | `JournalEntryListPage.vue` |
| Component | `{Entity}{Role}.vue` | `JournalEntryForm.vue` |
| API types | `api.types.ts` | — |
| View types | `view.types.ts` | — |
| Routes | `routes.ts` | — |

### Composable Naming (Action Alignment)
Composable names mirror the backend's action-oriented API endpoints:

```
Backend: POST /journal-entries/{id}/void  →  useVoidEntry()
Backend: POST /payment-requests/{id}/pay  →  usePayRequest()
Backend: POST /payment-requests/{id}/submit →  useSubmitRequest()
Backend: GET  /accounts                   →  useAccountList()
```

---

## 4. Boundary Rules

### 4.1 Import Rules (Enforced by ESLint)

```typescript
// ✅ ALLOWED: Module imports from core
import { Money } from '@/core/domain/money'
import { httpClient } from '@/core/api/http-client'
import { eventBus } from '@/core/event-bus/event-bus'

// ✅ ALLOWED: Module imports from itself
import { useAccountingStore } from '../stores/accounting.store'
import { toViewModel } from '../mappers/journal-entry.mapper'

// ❌ BANNED: Module imports from another module
import { usePaymentStore } from '@/modules/payment-requests/stores/...'
import AccountCard from '@/modules/accounting/components/AccountCard.vue'
```

### 4.2 ESLint Rule Configuration
```javascript
// eslint.config.js
{
  'no-restricted-imports': ['error', {
    patterns: [
      {
        group: ['@/modules/*/stores/*', '@/modules/*/services/*', '@/modules/*/composables/*'],
        message: 'Cross-module imports are prohibited. Use the Event Bus or Core types.',
      }
    ]
  }]
}
```

### 4.3 Data Flow Between Modules

```
Module A (Payment Requests)          Module B (Accounting)
┌──────────────────────────┐        ┌──────────────────────────┐
│ usePayRequest()          │        │ useJournalEntries()      │
│  └── paymentApi.pay()    │        │  └── accountingApi.list()│
│      └── eventBus.emit() ├──┐     │                          │
│         'pr:paid'        │  │     │ eventBus.on('pr:paid')   │
└──────────────────────────┘  │     │  └── refreshEntries()    │
                               │     └──────────────────────────┘
                               │                  ▲
                               └──────────────────┘
                            Event Bus (Shared Kernel)
```

---

## 5. Route Registration Pattern

Each module exports a `ModuleDefinition` that includes its routes, permissions, and menu items:

```typescript
// modules/accounting/index.ts
import type { ModuleDefinition } from '@/core/types/module'

export const accountingModule: ModuleDefinition = {
  id: 'accounting',
  name: 'Accounting',
  routes: () => import('./routes').then(m => m.default),
  permissions: ['accounting.view', 'accounting.edit'],
  menuItems: [
    { label: 'Chart of Accounts', route: 'AccountingCoa', icon: 'book-open' },
    { label: 'Journal Entries', route: 'AccountingJournals', icon: 'file-text' },
  ],
}
```

The central `app/router/index.ts` aggregates all module definitions dynamically:

```typescript
// app/router/index.ts
import { modules } from '@/modules'

const router = createRouter({
  routes: [
    {
      path: '/app',
      component: AuthenticatedLayout,
      beforeEnter: [requiresAuth],
      children: [], // Populated dynamically from module definitions
    },
  ],
})

// Register module routes dynamically
for (const mod of modules) {
  mod.routes().then(routes => {
    routes.forEach(route => router.addRoute('app', route))
  })
}
```

---

## 6. Adding a New Module Checklist

When creating a new module (e.g., `procurement`):

- [ ] Create `src/modules/procurement/` with the standard directory structure
- [ ] Create `index.ts` — `ModuleDefinition` export with id, permissions, menuItems
- [ ] Create `services/procurement.service.ts` — typed API client for backend endpoints
- [ ] Create `types/api.types.ts` — interfaces matching backend DTOs
- [ ] Create `types/view.types.ts` — ViewModel interfaces for components
- [ ] Create `mappers/` — at least one mapper with unit tests
- [ ] Create `stores/procurement.store.ts` — Pinia store (client state only)
- [ ] Create `routes.ts` — lazy-loaded route definitions
- [ ] Register module in `modules/index.ts` module array
- [ ] Add feature gate check if the module is toggleable
- [ ] Update `docs/OVERVIEW.md` module table
