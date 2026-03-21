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
