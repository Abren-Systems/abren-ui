import { h } from 'vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import type { ColumnDef } from '@tanstack/vue-table'
import { BadgeCell, DateCell, ActionCell } from '@/shared/components/data-grid'
import type { User } from '../../domain/user.types'

/**
 * User Grid Column Definitions.
 */
export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => h('span', { class: 'font-medium' }, row.original.email),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => h('span', { class: 'text-neutral-600' }, row.original.role),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) =>
      h(BadgeCell, {
        status: row.original.status.toUpperCase(),
        variants: {
          ACTIVE: 'default',
          INACTIVE: 'secondary',
          SUSPENDED: 'destructive',
        },
      }),
  },
  {
    accessorKey: 'lastLoginAt',
    header: 'Last Login',
    cell: ({ row }) => h(DateCell, { date: row.original.lastLoginAt }),
  },
  {
    id: 'actions',
    cell: ({ row }) =>
      h(ActionCell, {
        row: row.original,
        actions: [
          {
            label: 'Edit User',
            icon: Pencil,
            onClick: (user: User) => console.log('Edit', user),
          },
          {
            label: 'Suspend User',
            icon: Trash2,
            variant: 'destructive',
            onClick: (user: User) => console.log('Suspend', user),
          },
        ],
      }),
  },
]
