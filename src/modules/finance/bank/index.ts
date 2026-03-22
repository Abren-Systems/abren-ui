import type { ModuleDefinition } from '@/core/types/module'

export const bankModule: ModuleDefinition = {
  id: 'bank',
  name: 'Banking',
  routes: () => import('./routes').then(m => m.default),
  permissions: ['bank.view'],
  menuItems: [
    { label: 'Accounts', route: 'BankAccounts', icon: 'bank' },
  ],
}
