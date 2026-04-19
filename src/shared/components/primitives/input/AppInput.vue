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
  gap: 4px;
  width: 100%;
}

.app-input-label {
  font-size: 13px;
  font-weight: 600;
  color: #323130; /* Neutral Primary in Fluent */
}

.required-mark {
  color: #a4262c; /* Error color in Fluent */
  margin-left: 2px;
}

.app-input-field {
  width: 100%;
  --control-corner-radius: 2px;
  --height-number: 32; /* Dynamics High-Density standard */
}

/* 
 * Standard Fluent text-field tokens for high density 
 */
.app-input-field :deep(::part(control)) {
  font-size: 14px;
}

.app-input-error {
  font-size: 12px;
  color: #a4262c;
  margin-top: 2px;
}
</style>
