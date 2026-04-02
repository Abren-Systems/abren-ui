import type { BusinessDomain } from '@/shared/types/module.types'
import routes from './routes'

export const ledgerModule: BusinessDomain = {
  id: 'ledger',
  name: 'General Ledger',
  category: 'business',
  routes,
  permissions: ['ledger.view', 'ledger.edit'],
  menuItems: [
    { label: 'Chart of Accounts', route: 'LedgerCoa', icon: 'book-open' },
    { label: 'Journal Entries', route: 'LedgerEntries', icon: 'file-text' },
  ],
}
