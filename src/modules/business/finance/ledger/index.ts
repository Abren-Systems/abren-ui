import type { BusinessDomain } from '@/core/types/module.types'

export const ledgerModule: BusinessDomain = {
  id: 'ledger',
  name: 'Ledger',
  category: 'business',
  routes: () => import('./routes').then(m => m.default),
  permissions: ['ledger.view', 'ledger.edit'],
  menuItems: [
    { label: 'Chart of Accounts', route: 'LedgerCoa', icon: 'book-open' },
    { label: 'Journal Entries', route: 'LedgerJournals', icon: 'file-text' },
  ],
}
