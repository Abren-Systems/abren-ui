<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/dialog'
import { AppButton, AppInput } from '@/shared/components/primitives'
import { ShieldCheck, X, Search } from 'lucide-vue-next'
import { useRoles } from '../../application/composables/useRoles'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { createRole, isCreating, permissions } = useRoles()

const form = ref({
  name: '',
  description: '',
  permissions: [] as string[],
})

async function handleSubmit() {
  if (!form.value.name) return

  try {
    await createRole({
      name: form.value.name,
      description: form.value.description,
      permissions: form.value.permissions,
    })
    emit('update:open', false)
    form.value = { name: '', description: '', permissions: [] }
  } catch (err) {
    console.error('Failed to create role:', err)
  }
}

function togglePermission(code: string) {
  const index = form.value.permissions.indexOf(code)
  if (index > -1) {
    form.value.permissions.splice(index, 1)
  } else {
    form.value.permissions.push(code)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent
      class="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl rounded-sm"
    >
      <DialogHeader class="px-8 py-6 bg-white border-b border-[var(--color-neutral-200)]">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-[var(--color-primary-50)] rounded-sm">
            <ShieldCheck class="h-5 w-5 text-[var(--color-primary-600)]" />
          </div>
          <div>
            <DialogTitle class="text-lg font-bold text-[var(--color-neutral-900)]"
              >Define Boundary</DialogTitle
            >
            <DialogDescription class="text-xs text-[var(--color-neutral-500)]">
              Construct a new identity boundary by aggregating granular system permissions.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div class="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-[var(--color-neutral-50)]/30">
        <div class="space-y-1.5">
          <Label
            class="text-[10px] font-bold uppercase tracking-widest text-[var(--color-neutral-500)]"
            >Boundary Name</Label
          >
          <AppInput v-model="form.name" placeholder="e.g. Senior Accountant" />
        </div>

        <div class="space-y-1.5">
          <Label
            class="text-[10px] font-bold uppercase tracking-widest text-[var(--color-neutral-500)]"
            >Purpose / Description</Label
          >
          <AppInput
            v-model="form.description"
            placeholder="Describe the scope of this boundary..."
          />
        </div>

        <div class="space-y-3">
          <Label
            class="text-[10px] font-bold uppercase tracking-widest text-[var(--color-neutral-500)]"
            >System Permissions</Label
          >
          <div
            class="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto border border-[var(--color-neutral-200)] rounded-sm p-4 bg-white shadow-inner"
          >
            <div
              v-for="perm in permissions"
              :key="perm.code"
              class="flex items-center space-x-3 p-2 rounded-sm hover:bg-[var(--color-neutral-50)] transition-colors border border-transparent hover:border-[var(--color-neutral-100)]"
            >
              <input
                type="checkbox"
                :id="perm.code"
                :checked="form.permissions.includes(perm.code)"
                @change="togglePermission(perm.code)"
                class="w-3.5 h-3.5 rounded-sm border-[var(--color-neutral-300)] text-[var(--color-primary-600)] focus:ring-[var(--color-primary-500)]"
              />
              <label
                :for="perm.code"
                class="text-[11px] font-medium text-[var(--color-neutral-700)] cursor-pointer select-none leading-none"
              >
                {{ perm.code }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter
        class="px-8 py-4 bg-white border-t border-[var(--color-neutral-200)] flex items-center justify-end gap-3"
      >
        <AppButton variant="outline" @click="emit('update:open', false)" :disabled="isCreating">
          Cancel
        </AppButton>
        <AppButton variant="primary" @click="handleSubmit" :disabled="!form.name || isCreating">
          {{ isCreating ? 'Creating...' : 'Save Boundary' }}
        </AppButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
