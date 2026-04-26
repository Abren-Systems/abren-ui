<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, FileText, Hash, CheckCircle2 } from 'lucide-vue-next'
import { AppBadge } from '@/shared/components/primitives'

interface Props {
  totalFormatted: string
  lineCount: number
  status?: string
  statusColor?: string
  validationState?: {
    isValid: boolean
    errors: string[]
    errorCount: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  status: 'DRAFT',
  statusColor: 'bg-neutral-100 text-neutral-600',
  validationState: () => ({
    isValid: true,
    errors: [],
    errorCount: 0,
  }),
})

const hasErrors = computed(
  () => !props.validationState.isValid && props.validationState.errorCount > 0,
)
</script>

<template>
  <div
    class="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col"
  >
    <!-- Header -->
    <div class="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
      <h3
        class="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2"
      >
        <FileText :size="14" class="text-neutral-400" />
        Financial Summary
      </h3>
      <AppBadge
        v-if="status"
        :class="statusColor"
        variant="outline"
        class="text-[10px] font-semibold tracking-wider"
      >
        {{ status }}
      </AppBadge>
    </div>

    <!-- Body -->
    <div class="p-5 space-y-6">
      <!-- Total -->
      <div>
        <p class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">
          Total Amount
        </p>
        <div class="text-3xl font-bold text-neutral-900 tabular-nums tracking-tight">
          {{ totalFormatted }}
        </div>
      </div>

      <!-- Metrics -->
      <div class="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4">
        <div>
          <p
            class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1 flex items-center gap-1.5"
          >
            <Hash :size="12" />
            Line Items
          </p>
          <div class="text-lg font-semibold text-neutral-700 tabular-nums">
            {{ lineCount }}
          </div>
        </div>
      </div>

      <!-- Validation State -->
      <div v-if="hasErrors" class="bg-red-50 rounded-lg p-4 border border-red-100 mt-4">
        <div class="flex items-start gap-2.5">
          <AlertCircle :size="16" class="text-red-600 mt-0.5 shrink-0" />
          <div>
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-red-700 mb-1">
              {{ validationState.errorCount }} Validation
              {{ validationState.errorCount === 1 ? 'Error' : 'Errors' }}
            </h4>
            <ul class="text-xs text-red-600 space-y-1 list-disc pl-3">
              <li v-for="(err, idx) in validationState.errors.slice(0, 3)" :key="idx">
                {{ err }}
              </li>
              <li v-if="validationState.errors.length > 3" class="text-[10px] font-semibold italic">
                + {{ validationState.errors.length - 3 }} more errors...
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        v-else
        class="bg-emerald-50/50 rounded-lg p-3 border border-emerald-100/50 flex items-center gap-2 mt-4"
      >
        <CheckCircle2 :size="14" class="text-emerald-500" />
        <span class="text-xs font-medium text-emerald-700">Form meets financial controls</span>
      </div>
    </div>
  </div>
</template>
