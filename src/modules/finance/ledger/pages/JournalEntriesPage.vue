<script setup lang="ts">
import { h } from 'vue'
import { type ColumnDef } from '@tanstack/vue-table'
import { DataTable } from '@/core/ui/data-table'
import { Button } from '@/core/ui/button'
import { Plus, Download, FileText, CheckCircle2 } from 'lucide-vue-next'
import { useApiQuery } from '@/core/composables/useApiQuery'
import { ledgerService } from '../api/ledger.service'
import type { components } from '@/core/api/generated.types'

type JournalEntry = components['schemas']['JournalEntryRead']

const columns: ColumnDef<JournalEntry>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'entry_number',
    header: 'Entry #',
    cell: ({ row }) => h('div', { class: 'font-mono text-xs' }, row.getValue('entry_number')),
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const isPosted = status === 'POSTED'
      return h('div', { 
        class: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          isPosted ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }` 
      }, [
        isPosted ? h(CheckCircle2, { class: 'mr-1 h-3 w-3' }) : h(FileText, { class: 'mr-1 h-3 w-3' }),
        status
      ])
    },
  },
]

const { data, isLoading } = useApiQuery(
  ['ledger-journal-entries'],
  () => ledgerService.getJournalEntries()
)
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

    <div v-if="isLoading" class="flex items-center justify-center p-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
    </div>
    <div v-else class="bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
      <DataTable :columns="columns" :data="data || []" />
    </div>
  </div>
</template>
