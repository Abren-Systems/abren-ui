import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'finance/ledger/coa',
    name: 'LedgerCoa',
    component: () => import('./pages/ChartOfAccountsPage.vue'),
  },
  {
    path: 'finance/ledger/journals',
    name: 'LedgerJournals',
    component: () => import('./pages/JournalEntriesPage.vue'),
  },
]

export default routes
