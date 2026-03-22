<script setup lang="ts">
import { h } from 'vue'
import { type ColumnDef } from '@tanstack/vue-table'
import { DataGrid, DataGridColumnHeader, useDataGrid } from '@/core/ui/data-grid'
import { Button } from '@/core/ui/button'
import { Plus } from 'lucide-vue-next'
import { useLedgerAccounts } from '../application/composables/useLedgerAccounts'
import * as formatter from '../ui/utils/account-formatter'
import type { Account } from '../domain/account.types'

// ── Grid state (sorting, selection, global filter) ─────────────
const { sorting, rowSelection, columnVisibility, globalFilter } = useDataGrid()

// ── Column definitions ─────────────────────────────────────────
const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'code',
    size: 100,
    enableSorting: true,
    header: ({ column }) =>
      h(DataGridColumnHeader, { column, title: 'Code' }),
    cell: ({ row }) =>
      h('span', { style: 'font-family: var(--font-mono); font-size: 11.5px; color: var(--color-grid-text-muted);' },
        row.getValue('code'),
      ),
  },
  {
    accessorKey: 'name',
    size: 300,
    enableSorting: true,
    header: ({ column }) =>
      h(DataGridColumnHeader, { column, title: 'Name' }),
    cell: ({ row }) =>
      h('span', { style: 'font-weight: 500;' }, row.getValue('name')),
  },
  {
    accessorKey: 'type',
    size: 140,
    enableSorting: true,
    header: ({ column }) =>
      h(DataGridColumnHeader, { column, title: 'Type' }),
    cell: ({ row }) => {
      const account = row.original as Account
      const color = formatter.getAccountTypeColor(account.type)
      return h('span', {
        style: `
          display: inline-block;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: ${color};
          background: color-mix(in srgb, ${color} 12%, transparent);
          padding: 2px 6px;
          border-radius: 3px;
        `,
      }, account.type)
    },
  },
  {
    accessorKey: 'currency',
    size: 80,
    enableSorting: false,
    header: ({ column }) =>
      h(DataGridColumnHeader, { column, title: 'Currency' }),
    cell: ({ row }) =>
      h('span', { style: 'text-align: right; display: block;' },
        row.getValue('currency') ?? '—',
      ),
  },
  {
    accessorKey: 'isActive',
    size: 80,
    enableSorting: true,
    header: ({ column }) =>
      h(DataGridColumnHeader, { column, title: 'Status' }),
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>('isActive')
      return h('span', {
        style: `
          display: inline-block;
          font-size: 10.5px; font-weight: 600;
          color: ${isActive ? '#10b981' : 'var(--color-grid-text-muted)'};
          background: ${isActive ? 'color-mix(in srgb, #10b981 12%, transparent)' : 'transparent'};
          padding: 2px 6px; border-radius: 3px;
          text-transform: uppercase; letter-spacing: 0.04em;
        `,
      }, formatter.getAccountStatusLabel(isActive))
    },
  },
]

// ── Data fetching ──────────────────────────────────────────────
const { accounts: data, isPending } = useLedgerAccounts()
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px; height: 100%;">
    <!-- Page Header -->
    <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-shrink: 0;">
      <div>
        <h1 style="font-size: 22px; font-weight: 700; color: var(--color-grid-text); margin: 0;">
          Chart of Accounts
        </h1>
        <p style="font-size: 13px; color: var(--color-grid-text-muted); margin: 4px 0 0;">
          Manage your ledger accounts and financial structure.
        </p>
      </div>
    </div>

    <!-- DataGrid -->
    <div style="flex: 1; min-height: 0;">
      <DataGrid
        :columns="columns"
        :data="data ?? []"
        :loading="isPending"
        v-model:sorting="sorting"
        v-model:row-selection="rowSelection"
        v-model:column-visibility="columnVisibility"
        v-model:global-filter="globalFilter"
        placeholder="Search accounts…"
      >
        <!-- Toolbar actions -->
        <template #toolbar>
          <Button size="sm" style="height: 26px; font-size: 12px; padding: 0 10px;">
            <Plus :size="13" style="margin-right: 4px;" />
            New Account
          </Button>
        </template>
      </DataGrid>
    </div>
  </div>
</template>
