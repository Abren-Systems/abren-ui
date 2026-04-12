<script setup lang="ts">
import { useTenantSettings } from '../../application/composables/useTenantSettings'
import { DataGrid, useDataGrid } from '@/shared/components/data-grid'
import { Button } from '@/shared/components/button'
import { usePermissions } from '@/shared/auth/usePermissions'

const { settings, isSettingsPending } = useTenantSettings()
const { hasPermission } = usePermissions()
const gridState = useDataGrid()

const settingColumns = [
  {
    accessorKey: 'key',
    header: 'Configuration Key',
  },
  {
    accessorKey: 'value',
    header: 'Current Value',
    cell: ({ row }: { row: { original: { value: string | null } } }) =>
      row.original.value || 'Default',
  },
]
</script>

<template>
  <div class="p-6 space-y-6">
    <header class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Tenant Settings</h1>
        <p class="text-sm text-muted-foreground mt-1">
          Configure system-wide parameters and module thresholds for your organisation.
        </p>
      </div>
      <Button v-if="hasPermission('core:tenant_edit')" variant="outline"> Bulk Edit </Button>
    </header>

    <DataGrid
      :data="settings || []"
      :columns="settingColumns"
      :loading="isSettingsPending"
      :state="gridState"
    />
  </div>
</template>
