<script setup lang="ts">
import { DialogTitle, type DialogTitleProps, useForwardProps } from 'radix-vue'
import { cn } from '@/shared/lib/cn'

const props = defineProps<DialogTitleProps & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DialogTitle
    v-bind="forwarded"
    :class="cn('text-lg font-semibold text-neutral-950', props.class)"
  >
    <slot />
  </DialogTitle>
</template>
