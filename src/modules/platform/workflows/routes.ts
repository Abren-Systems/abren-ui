import { h } from 'vue'
import { useAuthStore } from '@/core/auth/auth.store'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

export default [
  {
    path: 'states',
    name: 'WorkflowsStates',
    beforeEnter: (
      _to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext,
    ) => {
      if (!useAuthStore().hasFeature('workflows')) return next('/app')
      next()
    },
    component: () =>
      Promise.resolve({
        render: () =>
          h(
            'div',
            { class: 'p-8 text-center text-neutral-500 font-medium' },
            'Workflows States (Stub)',
          ),
      }),
  },
]
