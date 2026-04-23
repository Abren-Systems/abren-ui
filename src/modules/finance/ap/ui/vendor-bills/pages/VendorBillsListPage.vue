<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { DataGrid, useDataGrid } from '@/shared/components/data-grid'
import { AppButton } from '@/shared/components/primitives'
import { PageHeader, WorkspacePanel } from '@/shared/components/workspace'
import { ArrowRight, FileText, Plus, Receipt, ShieldCheck } from 'lucide-vue-next'
import { vendorBillColumns } from '../grids/vendor-bill.grid'
import { useVendorBills } from '../../../application/composables/useVendorBills'
import { usePermissions } from '@/shared/auth/usePermissions'
import type { VendorBill } from '../../../domain/ap.types'

const router = useRouter()
const { hasPermission } = usePermissions()
const { bills, isLoading } = useVendorBills()
const { sorting, rowSelection, columnVisibility, globalFilter } = useDataGrid()

const draftCount = computed(
  () => (bills.value ?? []).filter((bill) => bill.status === 'DRAFT').length,
)
const validatedCount = computed(
  () => (bills.value ?? []).filter((bill) => bill.status === 'VALIDATED').length,
)
const totalCount = computed(() => bills.value?.length ?? 0)

function handleRowClick(bill: VendorBill) {
  void router.push({ name: 'VendorBillDetail', params: { id: bill.id } })
}

function handleCreate() {
  void router.push({ name: 'VendorBillCreate' })
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      dense
      eyebrow="Accounts Payable Workspace"
      title="Vendor Bills"
      description="Review supplier invoices, validate them into the ledger, and move clean bills into downstream payment workflows."
    >
      <template #icon>
        <FileText class="h-6 w-6" />
      </template>

      <template #actions>
        <AppButton v-if="hasPermission('ap:create')" variant="primary" @click="handleCreate">
          <template #start>
            <Plus :size="14" />
          </template>
          New Bill
        </AppButton>
      </template>
    </PageHeader>

    <section class="grid gap-3 md:grid-cols-3">
      <div
        class="rounded-[20px] border border-[color:var(--color-neutral-200)] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.045)]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-[var(--color-neutral-500)]">Total bills</p>
          <Receipt class="h-5 w-5 text-[var(--color-primary-700)]" />
        </div>
        <p class="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-neutral-900)]">
          {{ totalCount }}
        </p>
        <p class="mt-2 text-sm text-[var(--color-neutral-600)]">
          Supplier invoices currently visible in the AP intake workspace.
        </p>
      </div>

      <div
        class="rounded-[20px] border border-[color:var(--color-neutral-200)] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.045)]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-[var(--color-neutral-500)]">Draft intake</p>
          <FileText class="h-5 w-5 text-[var(--color-warning-700)]" />
        </div>
        <p class="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-neutral-900)]">
          {{ draftCount }}
        </p>
        <p class="mt-2 text-sm text-[var(--color-neutral-600)]">
          Bills that still need validation, correction, or accrual review.
        </p>
      </div>

      <div
        class="rounded-[20px] border border-[color:var(--color-neutral-200)] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.045)]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-[var(--color-neutral-500)]">Validated bills</p>
          <ShieldCheck class="h-5 w-5 text-[var(--color-success-700)]" />
        </div>
        <p class="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-neutral-900)]">
          {{ validatedCount }}
        </p>
        <p class="mt-2 text-sm text-[var(--color-neutral-600)]">
          Bills that are ready for downstream payment-request creation.
        </p>
      </div>
    </section>

    <WorkspacePanel
      dense
      title="Vendor bill intake queue"
      description="Validate supplier invoices here, then open a focused record view for ledger and payment decisions."
      body-class="space-y-4"
    >
      <template #icon>
        <Receipt class="h-5 w-5" />
      </template>

      <template #actions>
        <RouterLink
          :to="{ name: 'PaymentRequestsList' }"
          class="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary-700)]"
        >
          Go to payment requests
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </template>

      <div
        class="rounded-[18px] bg-[var(--color-neutral-50)] px-4 py-2.5 text-sm text-[var(--color-neutral-700)]"
      >
        Clean bill intake reduces downstream payment and ledger noise. Validate first, then create
        payment intent.
      </div>

      <DataGrid
        v-model:sorting="sorting"
        v-model:row-selection="rowSelection"
        v-model:column-visibility="columnVisibility"
        v-model:global-filter="globalFilter"
        :data="bills ?? []"
        :columns="vendorBillColumns"
        :loading="isLoading"
        placeholder="Search vendor bills..."
        row-clickable
        @row-click="handleRowClick"
      />
    </WorkspacePanel>
  </div>
</template>
