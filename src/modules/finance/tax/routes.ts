import type { RouteRecordRaw } from 'vue-router'

/**
 * Routes for the Tax module.
 * Organized by sub-features: Rules and Groups.
 */
export const taxRoutes: RouteRecordRaw[] = [
  {
    path: '/finance/tax',
    name: 'finance.tax.root',
    redirect: { name: 'finance.tax.rules' },
    children: [
      {
        path: 'rules',
        name: 'finance.tax.rules',
        component: () => import('./ui/rules/pages/TaxRulesListPage.vue'),
        meta: {
          title: 'Tax Rules',
          permission: 'finance:tax:view',
        },
      },
      {
        path: 'groups',
        name: 'finance.tax.groups',
        component: () => import('./ui/groups/pages/TaxGroupsListPage.vue'),
        meta: {
          title: 'Tax Groups',
          permission: 'finance:tax:view',
        },
      },
    ],
  },
]
