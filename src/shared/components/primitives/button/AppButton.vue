<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /**
   * The visual appearance of the button.
   * Maps to Microsoft Fluent's appearance tokens.
   */
  variant?: 'primary' | 'secondary' | 'stealth' | 'outline' | 'neutral' | 'danger'
  /** Standard button behavior types */
  type?: 'button' | 'submit' | 'reset'
  /** Disables interaction */
  disabled?: boolean
  /** Loading state (optional ERP enhancement) */
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  type: 'button',
  disabled: false,
  loading: false,
})

/**
 * Maps our AppButton variants to native Fluent appearance types.
 */
const fluentAppearance = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'accent'
    case 'stealth':
      return 'stealth'
    case 'outline':
      return 'outline'
    case 'danger':
      return 'neutral' // We'll style it with custom CSS below
    case 'neutral':
    case 'secondary':
    default:
      return 'neutral'
  }
})

// Define emits to ensure standard events are passed through
defineEmits(['click'])
</script>

<template>
  <fluent-button
    :appearance="fluentAppearance"
    :disabled="disabled || loading"
    :type="type"
    class="app-button-root"
    :class="[`variant-${variant}`]"
    @click="$emit('click', $event)"
  >
    <!-- Start Icon Slot -->
    <slot v-if="$slots.start" name="start" slot="start" />

    <!-- Progress Ring for Loading -->
    <fluent-progress-ring v-if="loading" slot="start" class="loading-ring" />

    <!-- Main Content -->
    <slot />

    <!-- End Icon Slot -->
    <slot v-if="$slots.end" name="end" slot="end" />
  </fluent-button>
</template>

<style scoped>
/*
 * High-Density ERP Overrides
 * We target the custom element to ensure the spacing fits the Dynamics 365 Sales aesthetic.
 */
.app-button-root {
  /* Restore Dynamics 365 / Fluent high-density standard */
  height: 32px;
  cursor: pointer;
  transition:
    background-color 0.1s ease,
    box-shadow 0.1s ease;
  --control-corner-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: var(--text-body-sm);
  font-weight: 600;

  /* Fluent Web Component Padding/Gap Tokens */
  --accent-fill-rest: var(--color-primary-600);
  --accent-fill-hover: var(--color-primary-700);
  --accent-fill-active: var(--color-primary-800);
  --button-padding-left: 12px;
  --button-padding-right: 12px;
  --density-filter-size: 0;

  /* Ensure the button doesn't stretch and centers its content */
  display: inline-flex;
  width: auto;
  min-width: 80px; /* Dynamics 365 / Fluent standard min-width */
}

.app-button-root::part(control) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.app-button-root[appearance='accent'] {
  box-shadow: var(--elevation-1);
}

.app-button-root[appearance='accent']:hover {
  box-shadow: var(--elevation-2);
}

.app-button-root[appearance='accent']:active {
  box-shadow: var(--elevation-1);
}

/* 
 * Danger Variant Styling
 * Microsoft Fluent doesn't have a built-in 'destructive' appearance that matches 
 * our theme, so we manually apply our danger tokens.
 */
.app-button-root.variant-danger {
  --neutral-fill-rest: var(--color-danger-600);
  --neutral-fill-hover: var(--color-danger-700);
  --neutral-fill-active: var(--color-danger-800);
  --neutral-foreground-rest: #ffffff;
  --neutral-foreground-hover: #ffffff;
  --neutral-foreground-active: #ffffff;
  border-color: transparent;
}
</style>
