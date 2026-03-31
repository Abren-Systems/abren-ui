import type { BusinessDomain } from '@/core/types/module.types'

export const apModule: BusinessDomain = {
  id: 'ap',
  name: 'Accounts Payable',
  category: 'business',
  routes: () => import('./routes').then((m) => m.default),
  permissions: ['ap.view'], // Consolidates ap.view
  menuItems: [
    { label: 'Payment Requests', route: 'PaymentRequestsList', icon: 'credit-card' },
    { label: 'Vendor Bills', route: 'VendorBillsList', icon: 'file-text' },
  ],
}
