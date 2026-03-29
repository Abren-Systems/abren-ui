import type { ModuleDefinition } from '@/core/types/module.types'
import CashflowDashboard from './ui/CashflowDashboard.vue'

export const reportingModule: ModuleDefinition = {
  id: 'reporting',
  name: 'Reporting & Analytics',
  category: 'business',
  routes: () => import('./routes').then((m) => m.default),
  permissions: ['reporting.view'],
  menuItems: [{ label: 'Cashflow Insights', route: 'reporting.dashboard', icon: 'bar-chart-3' }],
}

export { CashflowDashboard }
