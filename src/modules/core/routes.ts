import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('./ui/pages/LoginPage.vue'),
    meta: { layout: 'public' },
  },
  {
    path: 'users',
    name: 'CoreUsers',
    component: () => import('./ui/pages/UsersPage.vue'),
  },
  {
    path: 'roles',
    name: 'CoreRoles',
    component: () => import('./ui/pages/RolesListPage.vue'),
  },
  {
    path: 'tenants',
    name: 'CoreTenants',
    component: () => import('./ui/pages/TenantsListPage.vue'),
  },
]

export default routes
