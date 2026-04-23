<script setup lang="ts">
/**
 * AppInput.vue
 *
 * A high-density wrapper for fluent-text-field.
 * Bridges Vue's v-model to native Web Component properties.
 */

interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'url'
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '',
  placeholder: '',
  type: 'text',
  disabled: false,
  readonly: false,
  required: false,
  error: '',
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

/**
 * Handle input changes from the web component.
 * fluent-text-field emits standard DOM input events.
 */
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="app-input-container">
    <label v-if="label" class="app-input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <fluent-text-field
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      class="app-input-field"
      @input="handleInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    >
      <slot name="start" slot="start" />
      <slot name="end" slot="end" />
    </fluent-text-field>

    <span v-if="error" class="app-input-error">
      {{ error }}
    </span>
  </div>
</template>

<style scoped>
.app-input-container {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.app-input-label {
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

.app-input-field {
  width: 100%;
  --control-corner-radius: var(--radius-sm);
  --height-number: 32; /* Standard Fluent High-Density */
  --stroke-width: 1;
  --accent-fill-rest: var(--color-primary-600);
  --neutral-stroke-rest: var(--color-neutral-300);
  --neutral-stroke-hover: var(--color-neutral-400);
  --neutral-fill-rest: var(--app-surface);
}

.app-input-field :deep(::part(control)) {
  font-size: var(--text-body-sm);
  color: var(--color-neutral-900);
  border-radius: var(--radius-sm);
  transition: border-color 0.1s ease;
}

.app-input-field :deep(::part(control):focus-within) {
  border-color: var(--color-primary-600);
  /* Fluent uses a bottom-border emphasis or subtle 1px increase, not a halo */
}

.app-input-error {
  font-size: var(--text-micro);
  font-weight: 600;
  color: var(--color-danger-600);
  margin-top: 2px;
}
</style>
