<script setup lang="ts">
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/shared/components/sheet'
import { AppBadge } from '@/shared/components/primitives'
import {
  History,
  Search,
  FileText,
  Globe,
  Clock,
  User,
  ShieldCheck,
  Banknote,
  CreditCard,
} from 'lucide-vue-next'
import type { PaymentRequest } from '../../../domain/ap.types'

/**
 * Stage 3: TraceDrawer — Payment Request Provenance.
 *
 * Lazy-loaded contextual panel: workflow history, GL journal impact,
 * and linked source documents. Only shown when the user explicitly requests it.
 */

defineProps<{
  open: boolean
  request: PaymentRequest
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()
</script>

<template>
  <Sheet :open="open" @update:open="emit('update:open', $event)">
    <SheetContent class="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl flex flex-col">
      <SheetHeader class="px-8 py-6 bg-white border-b border-[var(--color-neutral-200)]">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-[var(--color-primary-50)] rounded-sm">
            <History class="h-5 w-5 text-[var(--color-primary-600)]" />
          </div>
          <div>
            <SheetTitle class="text-lg font-bold text-[var(--color-neutral-900)]"
              >Trace: Payment Request</SheetTitle
            >
            <SheetDescription class="text-xs text-[var(--color-neutral-500)]">
              Workflow history and financial impact of this request.
            </SheetDescription>
          </div>
        </div>
      </SheetHeader>

      <div class="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-[var(--color-neutral-50)]/30">
        <!-- Workflow Timeline -->
        <section>
          <h3
            class="mb-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-neutral-400)] flex items-center gap-2"
          >
            <Clock :size="12" />
            Workflow History
          </h3>
          <div class="space-y-3">
            <div
              class="flex items-start gap-4 p-4 bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm"
            >
              <div class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-neutral-400)]" />
              <div class="flex-1">
                <p class="text-xs font-bold text-[var(--color-neutral-900)]">Created</p>
                <p class="text-[10px] text-[var(--color-neutral-500)] mt-0.5">
                  Requested by {{ request.requesterId }}
                </p>
              </div>
              <AppBadge variant="neutral">DRAFT</AppBadge>
            </div>

            <div
              v-if="['SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'].includes(request.status)"
              class="flex items-start gap-4 p-4 bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm"
            >
              <div class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary-400)]" />
              <div class="flex-1">
                <p class="text-xs font-bold text-[var(--color-neutral-900)]">
                  Submitted for Approval
                </p>
                <p class="text-[10px] text-[var(--color-neutral-500)] mt-0.5">
                  {{ request.submittedAt ?? 'Date unavailable' }}
                </p>
              </div>
              <AppBadge variant="primary">SUBMITTED</AppBadge>
            </div>

            <div
              v-if="request.status === 'APPROVED' || request.status === 'PAID'"
              class="flex items-start gap-4 p-4 bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm"
            >
              <div class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success-500)]" />
              <div class="flex-1">
                <p class="text-xs font-bold text-[var(--color-neutral-900)]">Approved</p>
                <p class="text-[10px] text-[var(--color-neutral-500)] mt-0.5">
                  Approved by {{ request.assignedApproverId ?? 'approver' }}
                </p>
              </div>
              <AppBadge variant="success">APPROVED</AppBadge>
            </div>

            <div
              v-if="request.status === 'REJECTED'"
              class="flex items-start gap-4 p-4 bg-[var(--color-danger-50)]/30 rounded-sm border border-[var(--color-danger-200)] shadow-sm"
            >
              <div class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-danger-500)]" />
              <div class="flex-1">
                <p class="text-xs font-bold text-[var(--color-danger-700)]">Rejected</p>
              </div>
              <AppBadge variant="danger">REJECTED</AppBadge>
            </div>

            <div
              v-if="request.status === 'PAID'"
              class="flex items-start gap-4 p-4 bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm"
            >
              <div class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-success-600)]" />
              <div class="flex-1">
                <p class="text-xs font-bold text-[var(--color-neutral-900)]">Payment Recorded</p>
                <p class="text-[10px] text-[var(--color-neutral-500)] mt-0.5">
                  {{ request.paidAt ?? 'Date unavailable' }}
                </p>
              </div>
              <AppBadge variant="success">PAID</AppBadge>
            </div>
          </div>
        </section>

        <!-- GL Journal Impact -->
        <section v-if="request.targetLiabilityAccountId">
          <h3
            class="mb-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-neutral-400)] flex items-center gap-2"
          >
            <Banknote :size="12" />
            Financial Impact (GL)
          </h3>
          <div
            class="bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm overflow-hidden"
          >
            <div
              class="px-4 py-3 flex justify-between items-center border-b border-[var(--color-neutral-100)]"
            >
              <span
                class="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider"
                >Liability Account</span
              >
              <code
                class="text-[10px] font-bold text-[var(--color-primary-600)] bg-[var(--color-primary-50)] px-1.5 py-0.5 rounded-sm"
              >
                {{ request.targetLiabilityAccountId.slice(0, 8) }}…
              </code>
            </div>
            <div class="px-4 py-3 flex justify-between items-center">
              <span
                class="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider"
                >Disbursement Account</span
              >
              <code
                class="text-[10px] font-bold text-[var(--color-neutral-600)] bg-[var(--color-neutral-50)] px-1.5 py-0.5 rounded-sm"
              >
                {{ request.bankAccountId?.slice(0, 8) ?? '—' }}
              </code>
            </div>
          </div>
        </section>

        <!-- Source Document -->
        <section v-if="request.sourceModule">
          <h3
            class="mb-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-neutral-400)] flex items-center gap-2"
          >
            <FileText :size="12" />
            Source Document
          </h3>
          <div
            class="bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm overflow-hidden"
          >
            <div
              class="px-4 py-3 flex justify-between items-center border-b border-[var(--color-neutral-100)]"
            >
              <span
                class="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider"
                >Originating Module</span
              >
              <span class="text-xs font-bold text-[var(--color-neutral-900)]">{{
                request.sourceModule
              }}</span>
            </div>
            <div class="px-4 py-3 flex justify-between items-center">
              <span
                class="text-[10px] font-bold text-[var(--color-neutral-500)] uppercase tracking-wider"
                >Internal Reference</span
              >
              <code
                class="text-[10px] font-bold text-[var(--color-neutral-600)] bg-[var(--color-neutral-50)] px-1.5 py-0.5 rounded-sm"
                >{{ request.sourceId ?? '—' }}</code
              >
            </div>
          </div>
        </section>
      </div>
    </SheetContent>
  </Sheet>
</template>
