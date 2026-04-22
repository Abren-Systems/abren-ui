<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/components/dialog'
import { AppButton, AppSelect } from '@/shared/components/primitives'
import { UserCog, Shield, ChevronRight } from 'lucide-vue-next'
import { useRoles } from '../../application/composables/useRoles'
import { useUsers } from '../../application/composables/useUsers'
import type { User } from '../../domain/user.types'

const props = defineProps<{
  user: User | null
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { roles, isRolesPending } = useRoles()
const { assignRole, isAssigning } = useUsers()

const selectedRoleId = ref<string>('')

async function handleAssign() {
  if (!props.user || !selectedRoleId.value) return

  try {
    await assignRole({
      user_id: props.user.id,
      role_id: selectedRoleId.value,
    })
    emit('update:open', false)
    selectedRoleId.value = ''
  } catch (err) {
    console.error('Failed to assign role:', err)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px] p-0 overflow-hidden border-none shadow-2xl rounded-sm">
      <DialogHeader class="px-8 py-6 bg-white border-b border-[var(--color-neutral-200)]">
        <div class="flex items-center gap-4">
          <div class="p-2 bg-[var(--color-primary-50)] rounded-sm">
            <UserCog class="h-5 w-5 text-[var(--color-primary-600)]" />
          </div>
          <div>
            <DialogTitle class="text-lg font-bold text-[var(--color-neutral-900)]"
              >Assign Access</DialogTitle
            >
            <DialogDescription class="text-xs text-[var(--color-neutral-500)]">
              Grant additional access boundaries to <strong>{{ user?.email }}</strong
              >.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div class="px-8 py-6 bg-[var(--color-neutral-50)]/30">
        <div class="space-y-1.5">
          <Label
            class="text-[10px] font-bold uppercase tracking-widest text-[var(--color-neutral-500)]"
            >Available Roles</Label
          >
          <AppSelect
            v-model="selectedRoleId"
            :options="roles?.map((r) => ({ label: r.name, value: r.id })) ?? []"
            placeholder="Select a boundary..."
          />
          <p
            v-if="isRolesPending"
            class="text-[10px] text-[var(--color-neutral-400)] italic animate-pulse"
          >
            Hydrating identity boundaries...
          </p>
        </div>
      </div>

      <DialogFooter
        class="px-8 py-4 bg-white border-t border-[var(--color-neutral-200)] flex items-center justify-end gap-3"
      >
        <AppButton variant="outline" @click="emit('update:open', false)" :disabled="isAssigning">
          Cancel
        </AppButton>
        <AppButton
          variant="primary"
          @click="handleAssign"
          :disabled="!selectedRoleId || isAssigning"
        >
          {{ isAssigning ? 'Assigning...' : 'Assign Access' }}
        </AppButton>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
