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
├── api/                     # HTTP client for this module's endpoints
│   └── {module}.api.ts      # Typed API calls (uses shared http-client)
│
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
├── stores/                  # Pinia store(s)
│   └── {module}.store.ts    # Module-scoped reactive state
│
├── types/                   # TypeScript definitions
│   ├── api.types.ts         # Raw API DTO interfaces (from OpenAPI)
│   └── view.types.ts        # ViewModel interfaces (what components use)
│
└── routes.ts                # Lazy-loaded route definitions
```

---

## 3. Naming Conventions

### Files
| Type | Pattern | Example |
|---|---|---|
| API client | `{module}.api.ts` | `accounting.api.ts` |
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
// ✅ ALLOWED: Module imports from shared
import { Money } from '@/shared/domain/money'
import { httpClient } from '@/shared/api/http-client'
import { eventBus } from '@/shared/event-bus/event-bus'

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
        group: ['@/modules/*/stores/*', '@/modules/*/api/*', '@/modules/*/composables/*'],
        message: 'Cross-module imports are prohibited. Use the Event Bus or Shared Kernel.',
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

Each module exports a `routes.ts` that defines lazy-loaded pages:

```typescript
// modules/accounting/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const accountingRoutes: RouteRecordRaw[] = [
  {
    path: '/accounting',
    meta: { requiresAuth: true, feature: 'accounting' },
    children: [
      {
        path: 'accounts',
        name: 'accounting.accounts',
        component: () => import('./pages/AccountListPage.vue'),
      },
      {
        path: 'journal-entries',
        name: 'accounting.journal-entries',
        component: () => import('./pages/JournalEntryListPage.vue'),
      },
      {
        path: 'journal-entries/:id',
        name: 'accounting.journal-entry-detail',
        component: () => import('./pages/JournalEntryDetailPage.vue'),
      },
    ],
  },
]
```

The central `app/router.ts` aggregates all module routes:

```typescript
// app/router.ts
import { accountingRoutes } from '@/modules/accounting/routes'
import { identityRoutes } from '@/modules/identity/routes'
import { paymentRequestRoutes } from '@/modules/payment-requests/routes'
// ... other modules

const router = createRouter({
  routes: [
    {
      path: '/app',
      component: AuthenticatedLayout,
      children: [
        ...identityRoutes,
        ...accountingRoutes,
        ...paymentRequestRoutes,
        // ... all module routes flattened here
      ],
    },
  ],
})
```

---

## 6. Adding a New Module Checklist

When creating a new module (e.g., `procurement`):

- [ ] Create `src/modules/procurement/` with the standard directory structure
- [ ] Create `api/procurement.api.ts` — typed API client for backend endpoints
- [ ] Create `types/api.types.ts` — interfaces matching backend DTOs
- [ ] Create `types/view.types.ts` — ViewModel interfaces for components
- [ ] Create `mappers/` — at least one mapper with unit tests
- [ ] Create `stores/procurement.store.ts` — Pinia store
- [ ] Create `routes.ts` — lazy-loaded route definitions
- [ ] Register routes in `app/router.ts`
- [ ] Add feature gate check if the module is toggleable
- [ ] Update `docs/OVERVIEW.md` module table
