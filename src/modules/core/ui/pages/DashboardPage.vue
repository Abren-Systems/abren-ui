<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileClock,
  Inbox,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
  Workflow,
} from 'lucide-vue-next'
import { useAuditStore } from '@/shared/infrastructure/audit.store'
import { useAuthStore } from '@/shared/auth/auth.store'
import { PageHeader, WorkspacePanel } from '@/shared/components/workspace'
import { useUsers } from '../../application/composables/useUsers'
import { usePendingApprovals } from '@/modules/workflows/application/composables/usePendingApprovals'
import { usePaymentRequestStats } from '@/modules/finance/ap/application/composables/usePaymentRequestStats'

const authStore = useAuthStore()
const auditStore = useAuditStore()
const { activityLog, totalLogs } = storeToRefs(auditStore)

const { users } = useUsers()
const { tasks, isLoading: isLoadingTasks } = usePendingApprovals()
const { stats, isLoading: isLoadingStats } = usePaymentRequestStats()

const pendingApprovalsCount = computed(() => tasks.value?.length ?? 0)
const activeUsersCount = computed(() => users.value?.length ?? 0)
const submittedRequestsCount = computed(() => stats.value?.submittedCount ?? 0)
const approvedRequestsCount = computed(() => stats.value?.approvedCount ?? 0)
const paidRequestsCount = computed(() => stats.value?.paidCount ?? 0)
const rejectedRequestsCount = computed(() => stats.value?.rejectedCount ?? 0)
const totalOperationalAmount = computed(
  () => stats.value?.totalAmount.format('en-ET') ?? 'Awaiting source',
)
const tenantName = computed(() => authStore.currentTenant?.name ?? 'Current tenant')

const priorityItems = computed(() =>
  (tasks.value ?? []).slice(0, 5).map((task) => ({
    id: task.id,
    title: `${task.entityType.replace(/_/g, ' ')} approval`,
    subtitle: task.targetState
      ? `Move ${task.currentState} to ${task.targetState}`
      : `Currently in ${task.currentState}`,
    submittedAt: formatDate(task.submittedAt),
  })),
)

const recentEvents = computed(() =>
  activityLog.value.slice(0, 6).map((event) => ({
    id: event.metadata.id,
    title: formatEventTitle(event.type),
    sourceModule: event.metadata.sourceModule,
    timestamp: formatDate(event.metadata.timestamp),
  })),
)

const quickLinks = [
  {
    title: 'Workflow Inbox',
    description: 'Process approvals and unblock waiting work.',
    to: { name: 'workflows.inbox' },
  },
  {
    title: 'Payment Requests',
    description: 'Review requests moving through the finance pipeline.',
    to: { name: 'PaymentRequestsList' },
  },
  {
    title: 'Vendor Bills',
    description: 'Validate bill intake and source document coverage.',
    to: { name: 'VendorBillsList' },
  },
  {
    title: 'Chart of Accounts',
    description: 'Maintain the ledger structure and accounting controls.',
    to: { name: 'LedgerCoa' },
  },
]

function formatEventTitle(eventName: string): string {
  const [entity, action] = eventName.split(':')
  const formattedEntity = entity
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

  return action ? `${formattedEntity} ${action.replace(/-/g, ' ')}` : formattedEntity
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return 'Awaiting timestamp'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Awaiting timestamp'
  }

  return new Intl.DateTimeFormat('en-ET', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
</script>

<template>
  <div class="space-y-6">
    <PageHeader
      eyebrow="Workboard"
      title="Operational finance at a glance"
      :description="`Focus ${tenantName} on what needs action now, what is blocked, and what changed recently.`"
    >
      <template #icon>
        <LayoutDashboard class="h-6 w-6" />
      </template>

      <template #actions>
        <RouterLink
          :to="{ name: 'workflows.inbox' }"
          class="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-neutral-900)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_24px_rgba(15,23,42,0.16)] transition-transform hover:-translate-y-0.5"
        >
          Open Inbox
          <ArrowRight class="h-4 w-4" />
        </RouterLink>
      </template>
    </PageHeader>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div
        class="rounded-[24px] border border-[color:var(--color-neutral-200)] bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-[var(--color-neutral-500)]">Pending approvals</p>
          <Inbox class="h-4 w-4 text-[var(--color-primary-600)]" />
        </div>
        <p class="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-neutral-900)]">
          {{ isLoadingTasks ? '...' : pendingApprovalsCount }}
        </p>
        <p class="mt-2 text-sm text-[var(--color-neutral-600)]">
          Waiting on explicit review before work can move forward.
        </p>
      </div>

      <div
        class="rounded-[24px] border border-[color:var(--color-neutral-200)] bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-[var(--color-neutral-500)]">Submitted requests</p>
          <FileClock class="h-4 w-4 text-[var(--color-warning-600)]" />
        </div>
        <p class="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-neutral-900)]">
          {{ isLoadingStats ? '...' : submittedRequestsCount }}
        </p>
        <p class="mt-2 text-sm text-[var(--color-neutral-600)]">
          Work in review before approval and settlement.
        </p>
      </div>

      <div
        class="rounded-[24px] border border-[color:var(--color-neutral-200)] bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-[var(--color-neutral-500)]">Tracked amount</p>
          <CreditCard class="h-4 w-4 text-[var(--color-success-600)]" />
        </div>
        <p class="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-neutral-900)]">
          {{ totalOperationalAmount }}
        </p>
        <p class="mt-2 text-sm text-[var(--color-neutral-600)]">
          Payment request value currently visible in the system.
        </p>
      </div>

      <div
        class="rounded-[24px] border border-[color:var(--color-neutral-200)] bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]"
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium text-[var(--color-neutral-500)]">Active users</p>
          <Users class="h-4 w-4 text-[var(--color-info-600)]" />
        </div>
        <p class="mt-4 text-3xl font-semibold tracking-tight text-[var(--color-neutral-900)]">
          {{ activeUsersCount }}
        </p>
        <p class="mt-2 text-sm text-[var(--color-neutral-600)]">
          Authenticated operators in the current tenant context.
        </p>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <WorkspacePanel
        title="Attention queue"
        description="The items below need a human decision before more work can happen."
      >
        <template #icon>
          <AlertTriangle class="h-5 w-5" />
        </template>

        <template #actions>
          <RouterLink
            :to="{ name: 'workflows.inbox' }"
            class="text-sm font-medium text-[var(--color-primary-700)] hover:text-[var(--color-primary-800)]"
          >
            View all
          </RouterLink>
        </template>

        <div v-if="priorityItems.length" class="space-y-3">
          <RouterLink
            v-for="item in priorityItems"
            :key="item.id"
            :to="{ name: 'workflows.inbox' }"
            class="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-4 py-3 transition-colors hover:bg-white"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-[var(--color-neutral-900)]">
                {{ item.title }}
              </p>
              <p class="mt-1 text-sm text-[var(--color-neutral-600)]">{{ item.subtitle }}</p>
            </div>
            <div class="shrink-0 text-right">
              <p
                class="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-neutral-500)]"
              >
                Submitted
              </p>
              <p class="mt-1 text-sm text-[var(--color-neutral-700)]">{{ item.submittedAt }}</p>
            </div>
          </RouterLink>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-[color:var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-5 py-8 text-center"
        >
          <p class="text-sm font-semibold text-[var(--color-neutral-900)]">
            No approvals are waiting right now.
          </p>
          <p class="mt-2 text-sm text-[var(--color-neutral-600)]">
            When workflow tasks arrive, this queue becomes the fastest way to clear them.
          </p>
        </div>
      </WorkspacePanel>

      <WorkspacePanel
        title="Flow health"
        description="A truthful snapshot of the payment-request pipeline."
      >
        <template #icon>
          <Workflow class="h-5 w-5" />
        </template>

        <div class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <div
              class="rounded-2xl bg-[var(--color-neutral-50)] p-4 ring-1 ring-[color:var(--color-neutral-200)]"
            >
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-neutral-500)]"
              >
                Approved
              </p>
              <p class="mt-3 text-2xl font-semibold text-[var(--color-neutral-900)]">
                {{ isLoadingStats ? '...' : approvedRequestsCount }}
              </p>
            </div>
            <div
              class="rounded-2xl bg-[var(--color-neutral-50)] p-4 ring-1 ring-[color:var(--color-neutral-200)]"
            >
              <p
                class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-neutral-500)]"
              >
                Paid
              </p>
              <p class="mt-3 text-2xl font-semibold text-[var(--color-neutral-900)]">
                {{ isLoadingStats ? '...' : paidRequestsCount }}
              </p>
            </div>
          </div>

          <div
            class="rounded-2xl border border-[color:var(--color-neutral-200)] bg-[linear-gradient(180deg,rgba(248,250,252,0.9),#ffffff)] p-4"
          >
            <div class="flex items-start gap-3">
              <div
                class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-danger-50)] text-[var(--color-danger-700)]"
              >
                <ShieldCheck class="h-4 w-4" />
              </div>
              <div>
                <p class="text-sm font-semibold text-[var(--color-neutral-900)]">
                  Rejected requests
                </p>
                <p class="mt-1 text-sm text-[var(--color-neutral-600)]">
                  {{
                    isLoadingStats
                      ? 'Awaiting source'
                      : `${rejectedRequestsCount} requests currently require follow-up or correction.`
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </WorkspacePanel>
    </section>

    <section class="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <WorkspacePanel
        title="Recent operational trace"
        description="Visible history builds trust. Nothing important should feel untraceable."
      >
        <template #icon>
          <Sparkles class="h-5 w-5" />
        </template>

        <template #actions>
          <span class="text-sm text-[var(--color-neutral-500)]">{{ totalLogs }} total events</span>
        </template>

        <div v-if="recentEvents.length" class="space-y-3">
          <div
            v-for="event in recentEvents"
            :key="event.id"
            class="flex items-start justify-between gap-4 rounded-2xl border border-[color:var(--color-neutral-200)] px-4 py-3"
          >
            <div class="min-w-0">
              <p class="text-sm font-semibold text-[var(--color-neutral-900)]">{{ event.title }}</p>
              <p class="mt-1 text-sm text-[var(--color-neutral-600)]">
                {{ event.sourceModule }} module
              </p>
            </div>
            <p class="shrink-0 text-sm text-[var(--color-neutral-500)]">{{ event.timestamp }}</p>
          </div>
        </div>

        <div
          v-else
          class="rounded-2xl border border-dashed border-[color:var(--color-neutral-200)] bg-[var(--color-neutral-50)] px-5 py-8 text-center"
        >
          <p class="text-sm font-semibold text-[var(--color-neutral-900)]">
            No operational events captured yet.
          </p>
          <p class="mt-2 text-sm text-[var(--color-neutral-600)]">
            The workboard stays honest: it will show activity when real events are flowing.
          </p>
        </div>
      </WorkspacePanel>

      <WorkspacePanel
        title="Jump into work"
        description="Shortcuts into the parts of the system that drive real execution."
      >
        <template #icon>
          <CheckCircle2 class="h-5 w-5" />
        </template>

        <div class="grid gap-3 sm:grid-cols-2">
          <RouterLink
            v-for="link in quickLinks"
            :key="link.title"
            :to="link.to"
            class="group rounded-2xl border border-[color:var(--color-neutral-200)] bg-[linear-gradient(180deg,#ffffff,rgba(248,250,252,0.88))] p-4 transition-transform hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
          >
            <p class="text-sm font-semibold text-[var(--color-neutral-900)]">{{ link.title }}</p>
            <p class="mt-2 text-sm leading-6 text-[var(--color-neutral-600)]">
              {{ link.description }}
            </p>
            <div
              class="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary-700)]"
            >
              Open
              <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </RouterLink>
        </div>
      </WorkspacePanel>
    </section>
  </div>
</template>
