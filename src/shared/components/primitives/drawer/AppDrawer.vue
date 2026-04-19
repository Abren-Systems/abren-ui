<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import { AppButton } from '../button'

/**
 * AppDrawer
 *
 * A native Tier 1 primitive wrapping <fluent-dialog> to create
 * a slide-out "Provenance" or "Creation" panel.
 */
interface Props {
  /** 控制抽屜是否打開 */
  open: boolean
  /** 抽屜標題 */
  title?: string
  /** 抽屜描述/副標題 */
  description?: string
  /** 寬度 (預設為 400px) */
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  size: 'md',
})

const emit = defineEmits(['update:open', 'close'])

const dialogRef = ref<HTMLElement | null>(null)

// Sync internal Fluent state with Vue "open" prop
watch(
  () => props.open,
  (newVal) => {
    if (dialogRef.value) {
      if (newVal) {
        dialogRef.value.hidden = false
      } else {
        dialogRef.value.hidden = true
      }
    }
  },
)

function close() {
  emit('update:open', false)
  emit('close')
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}
</script>

<template>
  <fluent-dialog
    ref="dialogRef"
    :hidden="!open"
    trap-focus
    class="app-drawer-root"
    @dismiss="close"
  >
    <div :class="['drawer-content', sizeClasses[size]]">
      <!-- Header -->
      <div class="drawer-header">
        <div class="header-text">
          <h2 class="title">{{ title }}</h2>
          <p v-if="description" class="description">{{ description }}</p>
        </div>
        <AppButton variant="stealth" class="close-btn" @click="close">
          <X :size="20" />
        </AppButton>
      </div>

      <!-- Main Body -->
      <div class="drawer-body">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="drawer-footer">
        <slot name="footer" />
      </div>
    </div>
  </fluent-dialog>
</template>

<style scoped>
/* 
 * Drawer implementation via Pivot/Dialog styling 
 * We position the dialog shadow host to the right.
 */
.app-drawer-root {
  --dialog-width: auto;
  --dialog-height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 1000;
}

/* Reach into the Fluent Shadow DOM to position the internal container */
.app-drawer-root::part(control) {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  border-radius: 0;
  margin: 0;
  border: none;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 400px; /* Base width for md */
  background: var(--app-surface);
}

.drawer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid var(--color-neutral-200);
}

.header-text {
  flex: 1;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-neutral-900);
}

.description {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: var(--color-neutral-500);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.drawer-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-neutral-200);
  background: var(--color-neutral-50);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
