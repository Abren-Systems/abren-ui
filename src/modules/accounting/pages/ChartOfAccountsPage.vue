<script setup lang="ts">
import { h } from 'vue'
import { type ColumnDef } from '@tanstack/vue-table'
import { DataTable } from '@/core/ui/data-table'
import { Button } from '@/core/ui/button'
import { Plus } from 'lucide-vue-next'

interface Account {
  id: string
  code: string
  name: string
  type: string
  balance: number
  currency: string
}

const columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'currency',
    header: 'Currency',
  },
  {
    accessorKey: 'balance',
    header: () => h('div', { class: 'text-right' }, 'Balance'),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('balance'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: row.getValue('currency') as string,
      }).format(amount)
      return h('div', { class: 'text-right font-medium' }, formatted)
    },
  },
]

const data: Account[] = [
  { id: '1', code: '1000', name: 'Cash in Hand', type: 'Asset', balance: 12500.00, currency: 'USD' },
  { id: '2', code: '1100', name: 'Bank Account - ETB', type: 'Asset', balance: 450000.00, currency: 'ETB' },
  { id: '3', code: '2000', name: 'Accounts Payable', type: 'Liability', balance: -2500.00, currency: 'USD' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-neutral-900">Chart of Accounts</h1>
        <p class="text-neutral-500">Manage your ledger accounts and financial structure.</p>
      </div>
      <Button>
        <Plus class="mr-2 h-4 w-4" />
        Add Account
      </Button>
    </div>

    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
      <DataTable :columns="columns" :data="data" />
    </div>
  </div>
</template>
