<script setup lang="ts">
import { h, ref } from 'vue'
import { DataGrid, useDataGrid } from '@/shared/components/data-grid'
import { AppButton, AppBadge } from '@/shared/components/primitives'
import { Shield, ShieldPlus } from 'lucide-vue-next'
import { useRoles } from '../../application/composables/useRoles'
import type { Role } from '../../domain/user.types'
import CreateRoleDialog from '../components/CreateRoleDialog.vue'

const { roles, isRolesPending } = useRoles()
const gridState = useDataGrid()

const isCreateOpen = ref(false)

const roleColumns = [
  {
    accessorKey: 'name',
    header: 'Role Identity',
    cell: ({ row }: { row: { original: Role } }) => {
      return h('div', { class: 'font-medium flex items-center gap-2' }, [
        row.original.name,
        row.original.isSystem ? h(AppBadge, { variant: 'info' }, () => 'System') : null,
      ])
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'permissions',
    header: 'Access Scope (Permissions)',
    cell: ({ row }: { row: { original: Role } }) => {
      // Just show the first 3 permissions to avoid massive table row wrapping
      const perms = row.original.permissions || []
      const display = perms.slice(0, 3)
      const remainder = perms.length - 3

      const chips = display.map((p: string) =>
        h(AppBadge, { variant: 'neutral' }, () => p.toLowerCase()),
      )

      if (remainder > 0) {
        chips.push(h(AppBadge, { variant: 'neutral' }, () => `+${remainder} more`))
      }

      if (chips.length === 0)
        return h(
          'span',
          { class: 'text-[var(--color-neutral-400)] italic text-xs' },
          'No Boundaries Defined',
        )

      return h('div', { class: 'flex flex-wrap gap-1' }, chips)
    },
  },
]

function handleRowClick(role: Role) {
  // Navigation for a future side-bar editor
  console.log('Open Role Matrix Sidebar for:', role.id)
}
</script>

<template>
  <div class="flex h-full flex-col bg-[var(--app-canvas)]">
    <!-- Page Header -->
    <div
      class="flex shrink-0 items-center justify-between px-8 py-6 bg-white border-b border-[var(--color-neutral-200)]"
    >
      <div class="flex items-center gap-4">
        <div class="p-2 bg-[var(--color-primary-50)] rounded-sm">
          <Shield class="h-6 w-6 text-[var(--color-primary-600)]" />
        </div>
        <div>
          <h1 class="m-0 text-xl font-bold tracking-tight text-[var(--color-neutral-900)]">
            Identity Roles
          </h1>
          <p class="mt-1 text-sm text-[var(--color-neutral-500)]">
            Manage system boundaries and custom multi-tenant permission matrices.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <AppButton variant="primary" @click="isCreateOpen = true">
          <template #start>
            <ShieldPlus :size="14" />
          </template>
          Define Boundary
        </AppButton>
      </div>
    </div>

    <!-- DataGrid Orchestration -->
    <div class="min-h-0 flex-1 p-8">
      <DataGrid
        :data="roles || []"
        :columns="roleColumns"
        :loading="isRolesPending"
        :state="gridState"
        empty-message="No custom roles defined. Create functional boundaries to segregate access."
        @row-click="handleRowClick"
      >
        <template #empty-action>
          <AppButton class="mt-4" @click="isCreateOpen = true">
            <template #start>
              <ShieldPlus :size="14" />
            </template>
            Define Identity Boundary
          </AppButton>
        </template>
      </DataGrid>
    </div>

    <CreateRoleDialog v-model:open="isCreateOpen" />
  </div>
</template>
