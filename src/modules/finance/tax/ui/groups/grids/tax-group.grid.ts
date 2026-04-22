import { h } from 'vue'
import type { ColumnDef } from '@tanstack/vue-table'
import type { TaxGroup } from '../../../domain/tax.types'
import { Badge } from '@/shared/components/badge'

/**
 * Grid definition for Tax Groups.
 */
export const taxGroupColumns: ColumnDef<TaxGroup>[] = [
  {
    accessorKey: 'name',
    header: 'Group Name',
    cell: ({ row }) => h('div', { class: 'font-medium' }, row.getValue('name')),
  },
  {
    accessorKey: 'method',
    header: 'Calculation Method',
    cell: ({ row }) => {
      const method = row.getValue('method') as string
      return h(Badge, { variant: method === 'COMPOUND' ? 'default' : 'secondary' }, () => method)
    },
  },
  {
    accessorKey: 'ruleIds',
    header: 'Rules Count',
    cell: ({ row }) => {
      const ruleIds = row.getValue('ruleIds') as string[]
      return ruleIds.length.toString()
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const isActive = row.getValue('isActive') as boolean
      return h(Badge, { variant: isActive ? 'outline' : 'destructive' }, () =>
        isActive ? 'Active' : 'Inactive',
      )
    },
  },
]
