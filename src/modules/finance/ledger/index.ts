import type { ModuleDefinition } from '@/core/types/module'

export const ledgerModule: ModuleDefinition = {
  id: 'ledger',
  name: 'Ledger',
  routes: () => import('./routes').then(m => m.default),
  permissions: ['ledger.view', 'ledger.edit'],
  menuItems: [
    { label: 'Chart of Accounts', route: 'LedgerCoa', icon: 'book-open' },
    { label: 'Journal Entries', route: 'LedgerJournals', icon: 'file-text' },
  ],
}
