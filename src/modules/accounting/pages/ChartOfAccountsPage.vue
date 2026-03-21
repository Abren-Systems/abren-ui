<script setup lang="ts">
import { h } from 'vue'
import { type ColumnDef } from '@tanstack/vue-table'
import { DataTable } from '@/core/ui/data-table'
import { Button } from '@/core/ui/button'
import { Plus, CheckCircle2, XCircle } from 'lucide-vue-next'
import { useApiQuery } from '@/core/composables/useApiQuery'
import { accountingService } from '../api/accounting.service'
import type { components } from '@/core/api/generated.types'

type Account = components['schemas']['AccountRead']

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
    accessorKey: 'account_type',
    header: 'Type',
  },
  {
    accessorKey: 'is_active',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('is_active') as boolean
      return h('div', { class: 'flex items-center gap-2' }, [
        isActive
          ? h(CheckCircle2, { class: 'h-4 w-4 text-green-500' })
          : h(XCircle, { class: 'h-4 w-4 text-neutral-400' }),
        h('span', isActive ? 'Active' : 'Inactive'),
      ])
    },
  },
]

const { data, isLoading } = useApiQuery(
  ['accounts'],
  () => accountingService.getAccounts()
)
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

    <div v-if="isLoading" class="flex items-center justify-center p-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
    </div>
    <div v-else class="bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
      <DataTable :columns="columns" :data="data || []" />
    </div>
  </div>
</template>
