<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { DataGrid, useDataGrid } from '@/shared/components/data-grid'
import { AppButton } from '@/shared/components/primitives'
import { Plus } from 'lucide-vue-next'
import CreateAccountDrawer from '../components/CreateAccountDrawer.vue'
import { useLedgerAccounts } from '../../../application/composables/useLedgerAccounts'
import { accountColumns } from '../grids/account.grid'
import { usePermissions } from '@/shared/auth/usePermissions'
import type { Account } from '../../../domain/account.types'

// ── Grid state (sorting, selection, global filter) ─────────────
const { sorting, rowSelection, columnVisibility, globalFilter } = useDataGrid()

// ── Application Layer Orchestration ────────────────────────────
const { accounts: data, isPending } = useLedgerAccounts()
const { hasPermission } = usePermissions()
const router = useRouter()

const isDrawerOpen = ref(false)

function handleRowClick(row: Account) {
  void router.push({ name: 'LedgerCoaDetail', params: { accountId: row.id } })
}
</script>

<template>
  <div class="flex h-full flex-col gap-6">
    <!-- Page Header -->
    <div class="flex shrink-0 items-start justify-between p-1">
      <div>
        <h1 class="m-0 text-[24px] font-semibold text-[#201f1e]">Chart of Accounts</h1>
        <p class="mt-1 text-[14px] text-[#605e5c]">
          Manage your ledger accounts and financial structure.
        </p>
      </div>
    </div>

    <!-- DataGrid Orchestration -->
    <div class="min-h-0 flex-1 px-6 pb-6">
      <DataGrid
        v-model:sorting="sorting"
        v-model:row-selection="rowSelection"
        v-model:column-visibility="columnVisibility"
        v-model:global-filter="globalFilter"
        :columns="accountColumns"
        :data="data ?? []"
        :loading="isPending"
        placeholder="Search accounts…"
        empty-message="Your Chart of Accounts is not set up yet. Establish your financial foundation to begin recording transactions."
        row-clickable
        @row-click="handleRowClick"
      >
        <!-- Toolbar actions -->
        <template #toolbar>
          <AppButton
            v-if="hasPermission('ledger:manage_accounts')"
            variant="primary"
            @click="isDrawerOpen = true"
          >
            <Plus :size="14" class="mr-2" />
            New Account
          </AppButton>
        </template>

        <!-- Empty State Operational Action -->
        <template #empty-action>
          <AppButton
            v-if="hasPermission('ledger:manage_accounts')"
            variant="primary"
            class="mt-4"
            @click="isDrawerOpen = true"
          >
            <Plus :size="16" class="mr-2" />
            Setup Chart of Accounts
          </AppButton>
        </template>
      </DataGrid>
    </div>

    <!-- Creation Context -->
    <CreateAccountDrawer v-model:open="isDrawerOpen" />
  </div>
</template>
