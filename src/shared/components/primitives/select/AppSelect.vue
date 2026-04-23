<script setup lang="ts">
/**
 * AppSelect.vue
 *
 * High-density wrapper for fluent-select.
 * Provides both a prop-based option interface for speed and slot support for customization.
 */

interface Option {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | null
  label?: string
  options?: Option[]
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  options: () => [],
  placeholder: 'Select an option',
  disabled: false,
  required: false,
  error: '',
})

const emit = defineEmits(['update:modelValue', 'change'])

/**
 * Handle selection changes.
 * fluent-select emits a standard DOM change event.
 */
const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
  emit('change', target.value)
}
</script>

<template>
  <div class="app-select-container">
    <label v-if="label" class="app-select-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <fluent-select
      :value="modelValue ?? ''"
      :disabled="disabled"
      class="app-select-field"
      @change="handleChange"
    >
      <!-- Optional Placeholder / Default -->
      <fluent-option v-if="placeholder" value="">
        {{ placeholder }}
      </fluent-option>

      <!-- Prop-based options -->
      <fluent-option
        v-for="opt in options"
        :key="String(opt.value)"
        :value="String(opt.value)"
        :disabled="opt.disabled"
      >
        {{ opt.label }}
      </fluent-option>

      <!-- Slot for custom options or additional content -->
      <slot />
    </fluent-select>

    <span v-if="error" class="app-input-error">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.app-select-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.app-select-label {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-neutral-500);
}

.required-mark {
  color: var(--color-danger-600);
  margin-left: 2px;
}

.app-select-field {
  width: 100%;
  --control-corner-radius: var(--radius-sm);
  --height-number: 32; /* Standard Fluent High-Density */
  --neutral-stroke-rest: var(--color-neutral-300);
  --neutral-stroke-hover: var(--color-neutral-400);
  --neutral-fill-rest: var(--app-surface);
}

.app-select-field :deep(::part(control)) {
  font-size: var(--text-body-sm);
  color: var(--color-neutral-900);
  border-radius: var(--radius-sm);
  transition: border-color 0.1s ease;
}

.app-select-field :deep(::part(control):focus-within) {
  border-color: var(--color-primary-600);
}

.app-input-error {
  font-size: var(--text-micro);
  font-weight: 600;
  color: var(--color-danger-600);
  margin-top: 2px;
}
</style>
