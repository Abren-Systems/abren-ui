import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: 'accounting/coa',
    name: 'AccountingCoa',
    component: () => import('./pages/ChartOfAccountsPage.vue'),
  },
  {
    path: 'accounting/journals',
    name: 'AccountingJournals',
    component: () => import('./pages/JournalEntriesPage.vue'),
  },
]

export default routes
