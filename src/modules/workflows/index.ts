import type { ModuleDefinition } from '@/core/types/module'

export const workflowsModule: ModuleDefinition = {
  id: 'workflows',
  name: 'Workflows',
  routes: () => import('./routes').then(m => m.default),
  permissions: ['workflows.view'],
  menuItems: [
    { label: 'States', route: 'WorkflowsStates', icon: 'git-branch' },
  ],
}
