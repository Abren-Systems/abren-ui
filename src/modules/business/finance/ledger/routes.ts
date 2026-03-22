import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'coa',
    name: 'LedgerCoa',
    component: () => import('./pages/ChartOfAccountsPage.vue'),
  },
  {
    path: 'journals',
    name: 'LedgerJournals',
    component: () => import('./pages/JournalEntriesPage.vue'),
  },
]

export default routes
