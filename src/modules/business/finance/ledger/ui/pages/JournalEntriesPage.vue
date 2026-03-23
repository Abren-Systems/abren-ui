<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { DataGrid, useDataGrid } from '@/core/ui/data-grid'

const { sorting, rowSelection, columnVisibility, globalFilter } = useDataGrid()

type JournalEntryRow = {
  id: string
  date: string
  description: string
  status: string
}

const columns: ColumnDef<JournalEntryRow>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'date', header: 'Date' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'status', header: 'Status' },
]

const data: JournalEntryRow[] = []
const isPending = false
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px; height: 100%">
    <h1 style="font-size: 22px; font-weight: 700; color: var(--color-grid-text); margin: 0">
      Journal Entries
    </h1>

    <div style="flex: 1; min-height: 0">
      <DataGrid
        :columns="columns"
        :data="data"
        :loading="isPending"
        v-model:sorting="sorting"
        v-model:row-selection="rowSelection"
        v-model:column-visibility="columnVisibility"
        v-model:global-filter="globalFilter"
        placeholder="Search entries…"
      />
    </div>
  </div>
</template>
