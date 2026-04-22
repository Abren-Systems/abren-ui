import type { BusinessDomain } from '@/shared/types/module.types'
import { taxRoutes } from './routes'

/**
 * Tax Module Definition.
 * Handles configuration for the taxation subdomain.
 */
export const taxModule: BusinessDomain = {
  id: 'tax',
  name: 'Taxation',
  category: 'business',
  routes: taxRoutes,
  permissions: ['finance:tax:view'],
  menuItems: [
    {
      label: 'Tax Rules',
      route: 'finance.tax.rules',
      icon: 'percent',
    },
    {
      label: 'Tax Groups',
      route: 'finance.tax.groups',
      icon: 'layout-grid',
    },
  ],
}
