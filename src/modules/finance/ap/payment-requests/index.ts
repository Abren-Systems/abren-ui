import type { ModuleDefinition } from '@/core/types/module'

export const paymentRequestsModule: ModuleDefinition = {
  id: 'payment-requests',
  name: 'Payment Requests',
  routes: () => import('./routes').then(m => m.default),
  permissions: ['payment_requests.view'],
  menuItems: [
    { label: 'Requests', route: 'PaymentRequestsList', icon: 'credit-card' },
  ],
}
