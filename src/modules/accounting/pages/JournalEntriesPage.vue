<script setup lang="ts">
import { h } from 'vue'
import { type ColumnDef } from '@tanstack/vue-table'
import { DataTable } from '@/core/ui/data-table'
import { Button } from '@/core/ui/button'
import { Plus, Download } from 'lucide-vue-next'

interface JournalEntry {
  id: string
  date: string
  reference: string
  description: string
  amount: number
  status: 'Draft' | 'Posted'
}

const columns: ColumnDef<JournalEntry>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'reference',
    header: 'Reference',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'amount',
    header: () => h('div', { class: 'text-right' }, 'Amount'),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount)
      return h('div', { class: 'text-right font-medium' }, formatted)
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return h('span', { 
        class: `px-2 py-1 rounded-full text-xs font-semibold ${
          status === 'Posted' ? 'bg-success-100 text-success-800' : 'bg-neutral-100 text-neutral-800'
        }` 
      }, status)
    },
  },
]

const data: JournalEntry[] = [
  { id: '1', date: '2026-03-21', reference: 'JE-001', description: 'Monthly Rent', amount: 2500.00, status: 'Posted' },
  { id: '2', date: '2026-03-21', reference: 'JE-002', description: 'Office Supplies', amount: 150.75, status: 'Draft' },
]
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-neutral-900">Journal Entries</h1>
        <p class="text-neutral-500">Record and review financial transactions.</p>
      </div>
      <div class="flex space-x-2">
        <Button variant="outline">
          <Download class="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button>
          <Plus class="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
      <DataTable :columns="columns" :data="data" />
    </div>
  </div>
</template>
