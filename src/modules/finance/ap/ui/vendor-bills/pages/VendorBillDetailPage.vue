<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppBadge, AppButton } from '@/shared/components/primitives'
import { PageHeader, WorkspacePanel, MetricCard } from '@/shared/components/workspace'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  FileText,
  History,
  MoreHorizontal,
  Receipt,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/dropdown-menu'
import { useVendorBill } from '../../../application/composables/useVendorBill'
import { useValidateVendorBill } from '../../../application/composables/useValidateVendorBill'
import { useRejectVendorBill } from '../../../application/composables/useRejectVendorBill'
import { usePermissions } from '@/shared/auth/usePermissions'
import VendorBillTraceSidePane from '../components/VendorBillTraceSidePane.vue'
import VendorBillRejectModal from '../components/VendorBillRejectModal.vue'

const props = defineProps<{ id: string }>()
const router = useRouter()
const { hasPermission } = usePermissions()

const { bill, isLoading } = useVendorBill(props.id)
const { validate, isValidating } = useValidateVendorBill(props.id)
const { reject, isPending: isRejecting } = useRejectVendorBill(props.id)

const isTraceOpen = ref(false)
const isRejectModalOpen = ref(false)

const isActionPending = computed(() => isValidating.value || isRejecting.value)

const statusVariant = computed<'neutral' | 'success' | 'primary' | 'warning' | 'danger' | 'info'>(
  () => {
    switch (bill.value?.status) {
      case 'VALIDATED':
        return 'success'
      case 'PAID':
        return 'primary'
      default:
        return 'neutral'
    }
  },
)

const summaryCards = computed(() => {
  if (!bill.value) return []

  return [
    {
      label: 'Total amount',
      value: bill.value.totalAmount.format('en-ET'),
      detail: 'Supplier invoice value captured for accrual and payment.',
    },
    {
      label: 'Bill number',
      value: bill.value.billNumber,
      detail: 'Supplier-facing reference used during reconciliation.',
    },
    {
      label: 'Issue date',
      value: new Date(bill.value.issueDate).toLocaleDateString('en-ET'),
      detail: 'When the invoice was issued by the supplier.',
    },
    {
      label: 'Due date',
      value: new Date(bill.value.dueDate).toLocaleDateString('en-ET'),
      detail: 'When the liability is expected to be settled.',
    },
  ]
})

const focusGuidance = computed(() => {
  if (!bill.value)
    return 'Review the bill, validate it into the ledger, and use trace for upstream or downstream context.'

  switch (bill.value.status) {
    case 'DRAFT':
      return 'Draft bills should be validated only after invoice details, accounts, and categories are trustworthy.'
    case 'VALIDATED':
      return 'Validated bills are ready to feed the payment-request flow without re-entering the source context.'
    case 'PAID':
      return 'Paid bills are resolved, but trace remains important for audit and supplier follow-up.'
    default:
      return 'Review the bill, validate it into the ledger, and use trace for upstream or downstream context.'
  }
})

async function handleValidate() {
  await validate()
}

async function handleReject(reason: string) {
  await reject(reason)
  isRejectModalOpen.value = false
}

function handleCreatePR() {
  void router.push({ name: 'PaymentRequestsList' })
}

function goBack() {
  void router.push({ name: 'VendorBillsList' })
}
</script>

<template>
  <div v-if="isLoading && !bill" class="flex min-h-[50vh] items-center justify-center">
    <p class="text-sm text-neutral-500">Loading vendor bill...</p>
  </div>

  <div v-else-if="bill" class="space-y-6">
    <PageHeader
      eyebrow="Vendor Bill Focus"
      title="Validate supplier invoice and downstream readiness"
      :description="focusGuidance"
    >
      <template #icon>
        <Receipt class="h-6 w-6" />
      </template>

      <template #actions>
        <AppButton variant="outline" @click="goBack">
          <template #start>
            <ArrowLeft class="h-4 w-4" />
          </template>
          Back to queue
        </AppButton>

        <AppButton variant="outline" @click="isTraceOpen = true">
          <template #start>
            <History class="h-4 w-4" />
          </template>
          Trace
        </AppButton>

        <AppButton
          v-if="bill.status === 'DRAFT' && hasPermission('ap:post')"
          variant="primary"
          :disabled="isActionPending"
          @click="handleValidate"
        >
          <template #start>
            <CheckCircle class="h-4 w-4" />
          </template>
          Validate & Accrue
        </AppButton>

        <AppButton
          v-if="bill.status === 'VALIDATED' && hasPermission('ap:create')"
          variant="primary"
          :disabled="isActionPending"
          @click="handleCreatePR"
        >
          Create Payment Request
        </AppButton>

        <DropdownMenu v-if="bill.status === 'DRAFT' && hasPermission('ap:post')">
          <DropdownMenuTrigger as-child>
            <AppButton variant="stealth">
              <template #start>
                <MoreHorizontal class="h-4 w-4" />
              </template>
            </AppButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <DropdownMenuItem class="text-red-700" @click="isRejectModalOpen = true">
              Void draft bill
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-3 rounded-xl bg-neutral-50 px-4 py-3">
      <AppBadge :variant="statusVariant">{{ bill.status }}</AppBadge>
      <p class="font-mono text-sm text-neutral-500">{{ bill.id }}</p>
      <p class="text-sm text-neutral-600">
        Vendor bills are the source surface. Keep supplier truth clean before triggering payment
        work.
      </p>
    </div>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        v-for="card in summaryCards"
        :key="card.label"
        :title="card.label"
        :value="card.value"
        :subtitle="card.detail"
      />
    </section>

    <section class="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <WorkspacePanel
        title="Invoice context"
        description="Read the source narrative before validating, rejecting, or sending it into payment flow."
      >
        <template #icon>
          <AlertTriangle class="h-5 w-5" />
        </template>

        <div class="space-y-5">
          <div>
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              Justification
            </p>
            <p class="mt-3 text-sm leading-7 text-neutral-700">
              {{ bill.justification }}
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl bg-neutral-50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Vendor ID
              </p>
              <p class="mt-2 font-mono text-sm text-neutral-700">
                {{ bill.vendorId }}
              </p>
            </div>
            <div class="rounded-xl bg-neutral-50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
                Currency
              </p>
              <p class="mt-2 font-mono text-sm text-neutral-700">
                {{ bill.currency }}
              </p>
            </div>
          </div>
        </div>
      </WorkspacePanel>

      <WorkspacePanel
        title="Expense lines"
        description="Validate the accounting shape of the bill before it becomes a payment decision."
        body-class="space-y-4"
      >
        <template #icon>
          <FileText class="h-5 w-5" />
        </template>

        <div class="overflow-hidden rounded-xl border border-neutral-200">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-neutral-50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500"
                  >
                    Description
                  </th>
                  <th
                    class="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500"
                  >
                    Amount
                  </th>
                  <th
                    class="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500"
                  >
                    GL Account
                  </th>
                  <th
                    class="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500"
                  >
                    Category
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[var(--color-neutral-200)] bg-white">
                <tr
                  v-for="(line, index) in bill.lines"
                  :key="line.id ?? `${bill.id}-${index}`"
                  class="transition-colors hover:bg-neutral-50"
                >
                  <td class="px-4 py-3 text-neutral-700">{{ line.description }}</td>
                  <td class="px-4 py-3 text-right font-semibold text-neutral-900">
                    {{ line.amount.format('en-ET') }}
                  </td>
                  <td class="px-4 py-3 font-mono text-xs text-neutral-500">
                    {{ line.accountId ?? 'Not assigned' }}
                  </td>
                  <td class="px-4 py-3 font-mono text-xs text-neutral-500">
                    {{ line.categoryId ?? 'Not assigned' }}
                  </td>
                </tr>
                <tr class="bg-neutral-50 font-semibold">
                  <td class="px-4 py-4 text-neutral-700">Total</td>
                  <td class="px-4 py-4 text-right text-primary-700">
                    {{ bill.totalAmount.format('en-ET') }}
                  </td>
                  <td colspan="2" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </WorkspacePanel>
    </section>

    <VendorBillTraceSidePane v-model:open="isTraceOpen" :bill="bill" />
    <VendorBillRejectModal
      v-model:open="isRejectModalOpen"
      :is-pending="isRejecting"
      @confirm="handleReject"
    />
  </div>
</template>
