<script setup lang="ts">
/**
 * AppBadge
 *
 * A high-density status indicator wrapping <fluent-badge>.
 * Used for financial statuses (Draft, Posted, Voided, etc).
 */
interface Props {
  /**
   * Semantic color intent
   */
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'primary'
  /**
   * Optional circle shape (default is rounded-rect)
   */
  circular?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'neutral',
  circular: false,
})
</script>

<template>
  <fluent-badge :circular="circular" :class="['app-badge-root', `variant-${variant}`]">
    <slot />
  </fluent-badge>
</template>

<style scoped>
.app-badge-root {
  /* High-density ERP sizing */
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  height: 18px;
  min-width: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px; /* Standard sharp corner */
  text-transform: uppercase;
  letter-spacing: 0.02em;

  /* Reset default Fluent styles that might conflict */
  --badge-fill-primary: transparent;
  --badge-color-primary: inherit;
}

/* 
 * Semantic Variant Mapping
 * We map our color tokens to the badge background and text.
 */
.variant-neutral {
  background-color: var(--color-neutral-100);
  color: var(--color-neutral-700);
  border: 1px solid var(--color-neutral-200);
}

.variant-primary {
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
  border: 1px solid var(--color-primary-100);
}

.variant-success {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
  border: 1px solid var(--color-success-100);
}

.variant-warning {
  background-color: var(--color-warning-50);
  color: var(--color-warning-700);
  border: 1px solid var(--color-warning-100);
}

.variant-danger {
  background-color: var(--color-danger-50);
  color: var(--color-danger-700);
  border: 1px solid var(--color-danger-100);
}

.variant-info {
  background-color: var(--color-info-50);
  color: var(--color-info-700);
  border: 1px solid var(--color-info-100);
}
</style>
