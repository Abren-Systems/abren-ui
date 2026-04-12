<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/shared/components/button'
import { Badge } from '@/shared/components/badge'
import {
  ArrowLeft,
  MoreHorizontal,
  History,
  CheckCircle,
  FileText,
} from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/shared/components/dropdown-menu'
import { useVendorBill } from '../../../application/composables/useVendorBill'
import { useValidateVendorBill } from '../../../application/composables/useValidateVendorBill'
import { useRejectVendorBill } from '../../../application/composables/useRejectVendorBill'
import { usePermissions } from '@/shared/auth/usePermissions'
import VendorBillTraceDrawer from '../components/VendorBillTraceDrawer.vue'
import VendorBillRejectModal from '../components/VendorBillRejectModal.vue'

/**
 * Stage 2: Focus Canvas — Vendor Bill Detail Page.
 *
 * Progressive Disclosure flow (UX_ARCHITECTURE.md §2):
 *   VendorBillsListPage → THIS PAGE → TraceDrawer / ActionModals
 *
 * Action Surface (3-tier hierarchy per UX_ARCHITECTURE.md §6):
 *   Primary:  Validate & Accrue (DRAFT), Create PR (VALIDATED)
 *   Secondary: View Trace
 *   Tertiary: Reject/Void (destructive, via overflow + RejectModal)
 */

const props = defineProps<{ id: string }>()
const router = useRouter()
const { hasPermission } = usePermissions()

const { bill, isLoading } = useVendorBill(props.id)
const { validate, isValidating: isValidating } = useValidateVendorBill(props.id)
const { reject, isPending: isRejecting } = useRejectVendorBill(props.id)

// Overlay state
const isTraceOpen = ref(false)
const isRejectModalOpen = ref(false)

const isActionPending = computed(
  () => isValidating.value || isRejecting.value,
)

const STATUS_VARIANT: Record<string, 'default' | 'secondary'> = {
  DRAFT: 'secondary',
  VALIDATED: 'default',
  PAID: 'default',
}

async function handleValidate() {
  await validate()
}

async function handleReject(reason: string) {
  await reject(reason)
  isRejectModalOpen.value = false
}

function handleCreatePR() {
  void router.push({ name: 'PaymentRequestsList' }) // In real impl, would perhaps pass bill ID as query param
}

function goBack() {
  router.push({ name: 'VendorBillsList' })
}
</script>

<template>
  <div v-if="isLoading && !bill" class="flex h-full items-center justify-center">
    <p class="text-sm text-neutral-500">Loading vendor bill…</p>
  </div>

  <div v-else-if="bill" class="flex h-full flex-col">
    <!-- ── Header / Action Surface ──────────────────────────── -->
    <div class="flex shrink-0 items-center justify-between border-b px-6 py-4">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" @click="goBack">
          <ArrowLeft class="h-4 w-4" />
        </Button>
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-lg font-semibold tracking-tight">Vendor Bill</h1>
            <Badge :variant="STATUS_VARIANT[bill.status] || 'default'">
              {{ bill.status }}
            </Badge>
          </div>
          <p class="mt-0.5 font-mono text-xs text-neutral-400">{{ bill.id }}</p>
        </div>
      </div>

      <!-- Action Surface: 3-tier hierarchy -->
      <div class="flex items-center gap-2">

        <!-- Secondary: Trace -->
        <Button variant="outline" size="sm" @click="isTraceOpen = true">
          <History class="mr-1.5 h-3.5 w-3.5" />
          Trace
        </Button>

        <!-- Primary: Validate (DRAFT → VALIDATED) -->
        <Button
          v-if="bill.status === 'DRAFT' && hasPermission('ap:validate_bill')"
          size="sm"
          :disabled="isActionPending"
          @click="handleValidate"
        >
          <CheckCircle class="mr-1.5 h-3.5 w-3.5" />
          Validate & Accrue
        </Button>

        <!-- Primary: Create PR (VALIDATED → PR Flow) -->
        <Button
          v-if="bill.status === 'VALIDATED' && hasPermission('ap:create_request')"
          size="sm"
          :disabled="isActionPending"
          @click="handleCreatePR"
        >
          <FileText class="mr-1.5 h-3.5 w-3.5" />
          Create Payment Request
        </Button>

        <!-- Tertiary: Overflow for destructive actions -->
        <DropdownMenu v-if="bill.status === 'DRAFT' && hasPermission('ap:validate_bill')">
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="h-8 w-8">
              <MoreHorizontal class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <DropdownMenuItem
              class="text-destructive"
              @click="isRejectModalOpen = true"
            >
              Void Draft Bill
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- ── Main Canvas: Bill Details ──────────────────────── -->
    <div class="flex-1 overflow-y-auto p-6 space-y-6">
      <!-- Metadata summary -->
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div class="rounded-lg border p-4">
          <p class="text-xs font-medium uppercase text-neutral-400">Total Amount</p>
          <p class="mt-1 text-xl font-bold tabular-nums">{{ bill.totalAmount.format() }}</p>
        </div>
        <div class="rounded-lg border p-4">
          <p class="text-xs font-medium uppercase text-neutral-400">Bill Number</p>
          <p class="mt-1 font-mono text-lg font-semibold">{{ bill.billNumber }}</p>
        </div>
        <div class="rounded-lg border p-4">
          <p class="text-xs font-medium uppercase text-neutral-400">Date Issued</p>
          <p class="mt-1 text-lg font-semibold">{{ bill.issueDate.toLocaleDateString() }}</p>
        </div>
        <div class="rounded-lg border p-4">
          <p class="text-xs font-medium uppercase text-neutral-400">Vendor ID</p>
          <code class="mt-1 block text-sm text-neutral-700 bg-neutral-100 px-2 py-1 rounded truncate">{{ bill.vendorId }}</code>
        </div>
      </div>

      <!-- Justification -->
      <div class="rounded-lg border p-4">
        <p class="mb-1 text-xs font-medium uppercase text-neutral-400">Justification</p>
        <p class="text-sm text-neutral-700">{{ bill.justification }}</p>
      </div>

      <!-- Expense Lines -->
      <div>
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wider text-neutral-500">
          Expense Lines
        </h2>
        <div class="overflow-hidden rounded-lg border">
          <table class="w-full text-sm">
            <thead class="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th class="px-4 py-2.5 text-left font-medium text-neutral-500">Description</th>
                <th class="px-4 py-2.5 text-right font-medium text-neutral-500 tabular-nums">Amount</th>
                <th class="px-4 py-2.5 text-left font-medium text-neutral-500">GL Account</th>
                <th class="px-4 py-2.5 text-left font-medium text-neutral-500">Category</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="line in bill.lines"
                :key="line.id || Math.random().toString()"
                class="border-t transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30"
              >
                <td class="px-4 py-2.5">{{ line.description }}</td>
                <td class="px-4 py-2.5 text-right tabular-nums font-semibold">
                  {{ line.amount.format() }}
                </td>
                <td class="px-4 py-2.5 font-mono text-xs text-neutral-500">
                  {{ line.accountId?.slice(0, 8) ?? '—' }}
                </td>
                <td class="px-4 py-2.5 font-mono text-xs text-neutral-500">
                  {{ line.categoryId?.slice(0, 8) ?? '—' }}
                </td>
              </tr>
              <tr class="border-t bg-neutral-50/50 font-semibold dark:bg-neutral-900/20">
                <td class="px-4 py-2.5">Total</td>
                <td class="px-4 py-2.5 text-right tabular-nums font-bold">
                  {{ bill.totalAmount.format() }}
                </td>
                <td colspan="2" />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Stage 3: TraceDrawer ───────────────────────────────── -->
    <VendorBillTraceDrawer
      v-model:open="isTraceOpen"
      :bill="bill"
    />

    <!-- ── Guard: Reject ActionModal (destructive) ────────────── -->
    <VendorBillRejectModal
      v-model:open="isRejectModalOpen"
      :is-pending="isRejecting"
      @confirm="handleReject"
    />
  </div>
</template>
