import type { ModuleDefinition } from '@/core/types/module'

export const coreModule: ModuleDefinition = {
  id: 'core',
  name: 'Core',
  routes: () => import('./routes').then(m => m.default),
  permissions: ['core.view', 'core.edit'],
  menuItems: [
    { label: 'Users', route: 'CoreUsers', icon: 'users' },
    { label: 'Roles', route: 'CoreRoles', icon: 'shield' },
    { label: 'Tenants', route: 'CoreTenants', icon: 'building' },
  ],
}
