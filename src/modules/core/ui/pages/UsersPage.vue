<script setup lang="ts">
import { DataGrid, useDataGrid } from '@/shared/components/data-grid'
import { useUsers } from '../../application/composables/useUsers'
import { userColumns } from '../grids/user.grid'

const { users, isLoading } = useUsers()
const { sorting, rowSelection, columnVisibility, globalFilter } = useDataGrid()
</script>

<template>
  <div class="p-6 space-y-6">
    <header>
      <h1 class="text-2xl font-bold tracking-tight">Users</h1>
      <p class="text-sm text-neutral-500">
        Manage user accounts and permissions within your tenant.
      </p>
    </header>

    <DataGrid
      v-model:sorting="sorting"
      v-model:row-selection="rowSelection"
      v-model:column-visibility="columnVisibility"
      v-model:global-filter="globalFilter"
      :data="users || []"
      :columns="userColumns"
      :loading="isLoading"
      placeholder="Search users…"
    />

    <div class="p-8 text-center text-neutral-400 border-2 border-dashed rounded-xl">
      <p>Fine-grained User & RBAC Management (Coming Soon)</p>
    </div>
  </div>
</template>
