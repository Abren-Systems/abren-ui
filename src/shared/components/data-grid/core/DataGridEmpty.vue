<script setup lang="ts">
import { FileSearch } from 'lucide-vue-next'

defineProps<{
  message?: string
  colspan: number
}>()
</script>

<template>
  <tr class="hover:bg-transparent">
    <td :colspan="colspan" class="h-96 py-12 bg-neutral-50/10">
      <div class="flex flex-col items-center justify-center gap-6 max-w-sm mx-auto text-center">
        <div class="relative">
          <div class="absolute -inset-4 rounded-full bg-neutral-100/50 animate-pulse" />
          <FileSearch :size="48" stroke-width="1.2" class="relative text-neutral-300" />
        </div>
        <div class="space-y-1.5">
          <h3 class="text-sm font-bold text-neutral-900">{{ message ?? 'No records found' }}</h3>
          <p class="text-[11px] leading-relaxed text-neutral-400 font-medium">
            We couldn't find any data matching your current filters. Try adjusting your search or
            clearing the status filters.
          </p>
        </div>
        <slot name="action" />
      </div>
    </td>
  </tr>
</template>
