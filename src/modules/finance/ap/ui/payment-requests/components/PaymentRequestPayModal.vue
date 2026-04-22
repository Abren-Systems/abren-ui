<script setup lang="ts">
import { ref } from 'vue'
import { AppButton, AppInput, AppSelect } from '@/shared/components/primitives'
import { WalletCards, Hash, CheckCircle2, X } from 'lucide-vue-next'

/**
 * ActionModal — Execute Payment.
 * Requires payment method and disbursement reference before confirming.
 */

defineProps<{
  open: boolean
  totalAmount: string
  isPending: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'confirm', data: { payment_method: string; disbursement_reference: string }): void
}>()

const paymentMethod = ref('BANK_TRANSFER')
const disbursementRef = ref('')

function handleConfirm() {
  if (!disbursementRef.value.trim()) return
  emit('confirm', {
    payment_method: paymentMethod.value,
    disbursement_reference: disbursementRef.value.trim(),
  })
  disbursementRef.value = ''
}

function handleCancel() {
  disbursementRef.value = ''
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl rounded-sm">
      <DialogHeader class="px-8 py-6 bg-white border-b border-[var(--color-neutral-200)]">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-[var(--color-primary-50)] rounded-sm">
            <WalletCards class="h-5 w-5 text-[var(--color-primary-600)]" />
          </div>
          <div>
            <DialogTitle class="text-lg font-bold text-[var(--color-neutral-900)]"
              >Execute Payment</DialogTitle
            >
            <DialogDescription class="text-xs text-[var(--color-neutral-500)]">
              Record disbursement details for
              <span class="font-bold text-[var(--color-neutral-900)]">{{ totalAmount }}</span
              >.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div class="px-8 py-6 bg-[var(--color-neutral-50)]/30 space-y-5">
        <div class="space-y-1.5">
          <Label
            class="text-[10px] font-bold uppercase tracking-widest text-[var(--color-neutral-500)]"
            >Payment Instrument</Label
          >
          <AppSelect
            v-model="paymentMethod"
            :options="[
              { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
              { label: 'Cheque / Draft', value: 'CHECK' },
              { label: 'Cash Disbursement', value: 'CASH' },
            ]"
          />
        </div>

        <div class="space-y-1.5">
          <Label
            class="text-[10px] font-bold uppercase tracking-widest text-[var(--color-neutral-500)] flex items-center gap-1"
          >
            <Hash :size="10" />
            Reference / Transaction # <span class="text-[var(--color-danger-600)]">*</span>
          </Label>
          <AppInput v-model="disbursementRef" placeholder="e.g. TRX-2026-0411-001" />
        </div>
      </div>

      <DialogFooter
        class="px-8 py-4 bg-white border-t border-[var(--color-neutral-200)] flex items-center justify-end gap-3"
      >
        <AppButton variant="outline" @click="handleCancel">Cancel</AppButton>
        <AppButton
          variant="primary"
          :disabled="!disbursementRef.trim() || isPending"
          @click="handleConfirm"
        >
          <CheckCircle2 v-if="!isPending" :size="14" class="mr-2" />
          {{ isPending ? 'Processing…' : 'Confirm Disbursement' }}
        </AppButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
