import type { ModuleDefinition } from '@/core/types/module'

export const identityModule: ModuleDefinition = {
  id: 'identity',
  name: 'Identity',
  routes: () => import('./routes').then(m => m.default),
  permissions: ['identity.view', 'identity.edit'],
  menuItems: [
    { label: 'Users', route: 'IdentityUsers', icon: 'users' },
    { label: 'Roles', route: 'IdentityRoles', icon: 'shield' },
    { label: 'Tenants', route: 'IdentityTenants', icon: 'building' },
  ],
}
