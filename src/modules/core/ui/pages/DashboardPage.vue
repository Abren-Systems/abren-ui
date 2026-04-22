<script setup lang="ts">
import { useAuditStore } from '@/shared/infrastructure/audit.store'
import { storeToRefs } from 'pinia'
import GlobalActivityFeed from '../components/GlobalActivityFeed.vue'
import { Activity, DollarSign, TrendingUp, Users, LayoutDashboard, Zap } from 'lucide-vue-next'
import { useUsers } from '../../application/composables/useUsers'
import { computed } from 'vue'

const auditStore = useAuditStore()
const { totalLogs } = storeToRefs(auditStore)

const { users, isPending: isLoadingUsers } = useUsers()
const activeUsersCount = computed(() => users.value?.length ?? 0)
</script>

<template>
  <div class="flex h-full flex-col bg-[var(--app-canvas)]">
    <!-- Page Header -->
    <div
      class="flex shrink-0 items-center justify-between px-8 py-6 bg-white border-b border-[var(--color-neutral-200)]"
    >
      <div class="flex items-center gap-4">
        <div class="p-2 bg-[var(--color-primary-50)] rounded-sm">
          <LayoutDashboard class="h-6 w-6 text-[var(--color-primary-600)]" />
        </div>
        <div>
          <h1 class="m-0 text-xl font-bold tracking-tight text-[var(--color-neutral-900)]">
            Dashboard
          </h1>
          <p class="mt-1 text-sm text-[var(--color-neutral-500)]">
            Real-time financial visibility & system monitoring.
          </p>
        </div>
      </div>

      <div
        class="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-success-50)] rounded-sm border border-[var(--color-success-200)]"
      >
        <div class="w-1.5 h-1.5 rounded-full bg-[var(--color-success-600)] animate-pulse"></div>
        <span
          class="text-[10px] font-bold text-[var(--color-success-700)] uppercase tracking-widest"
          >System Live</span
        >
      </div>
    </div>

    <div class="flex-1 overflow-y-auto p-8 space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div class="p-6 bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs font-bold uppercase tracking-wider text-[var(--color-neutral-500)]">
              System Activity
            </p>
            <Activity class="w-4 h-4 text-[var(--color-primary-500)]" />
          </div>
          <p class="text-3xl font-bold text-[var(--color-neutral-900)] tabular-nums">
            {{ totalLogs }}
          </p>
          <div class="mt-2 flex items-center gap-1.5">
            <Zap :size="12" class="text-[var(--color-primary-600)]" />
            <p
              class="text-[10px] text-[var(--color-primary-600)] font-bold tracking-widest uppercase"
            >
              Hardened Events
            </p>
          </div>
        </div>

        <div class="p-6 bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs font-bold uppercase tracking-wider text-[var(--color-neutral-500)]">
              Total Revenue
            </p>
            <DollarSign class="w-4 h-4 text-[var(--color-success-500)]" />
          </div>
          <p class="text-3xl font-bold text-[var(--color-neutral-900)] tabular-nums">$45,231</p>
          <p
            class="mt-2 text-[10px] text-[var(--color-success-600)] font-bold tracking-widest uppercase"
          >
            +20.1% growth
          </p>
        </div>

        <div class="p-6 bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs font-bold uppercase tracking-wider text-[var(--color-neutral-500)]">
              Active Users
            </p>
            <Users class="w-4 h-4 text-[var(--color-info-500)]" />
          </div>
          <div
            v-if="isLoadingUsers"
            class="h-9 w-12 bg-[var(--color-neutral-100)] animate-pulse rounded"
          ></div>
          <p v-else class="text-3xl font-bold text-[var(--color-neutral-900)]">
            {{ activeUsersCount }}
          </p>
          <p
            class="mt-2 text-[10px] text-[var(--color-info-600)] font-bold tracking-widest uppercase"
          >
            Tenant Context
          </p>
        </div>

        <div class="p-6 bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs font-bold uppercase tracking-wider text-[var(--color-neutral-500)]">
              Avg Latency
            </p>
            <TrendingUp class="w-4 h-4 text-[var(--color-warning-500)]" />
          </div>
          <p class="text-3xl font-bold text-[var(--color-neutral-900)] tabular-nums">140ms</p>
          <p
            class="mt-2 text-[10px] text-[var(--color-warning-600)] font-bold tracking-widest uppercase"
          >
            Api Performance
          </p>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
        <!-- Activity Feed -->
        <div
          class="bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm h-[600px] overflow-hidden flex flex-col"
        >
          <div
            class="px-6 py-4 border-b border-[var(--color-neutral-100)] bg-[var(--color-neutral-50)]"
          >
            <h3
              class="text-xs font-bold uppercase tracking-widest text-[var(--color-neutral-600)] flex items-center gap-2"
            >
              <Activity :size="14" />
              Global Activity Stream
            </h3>
          </div>
          <div class="flex-1 overflow-y-auto p-6">
            <GlobalActivityFeed />
          </div>
        </div>

        <!-- Secondary Metrics -->
        <div
          class="bg-white rounded-sm border border-[var(--color-neutral-200)] shadow-sm h-[600px] overflow-hidden flex flex-col"
        >
          <div
            class="px-6 py-4 border-b border-[var(--color-neutral-100)] bg-[var(--color-neutral-50)]"
          >
            <h3
              class="text-xs font-bold uppercase tracking-widest text-[var(--color-neutral-600)] flex items-center gap-2"
            >
              <TrendingUp :size="14" />
              Cashflow Projection
            </h3>
          </div>
          <div
            class="flex-1 flex flex-col items-center justify-center p-6 text-[var(--color-neutral-400)] italic space-y-4"
          >
            <div
              class="w-full h-64 bg-[var(--color-neutral-50)] rounded-sm border border-dashed border-[var(--color-neutral-200)] flex items-center justify-center"
            >
              <TrendingUp :size="48" class="opacity-10" />
            </div>
            <p class="text-xs font-medium uppercase tracking-wider">
              Financial intelligence engine warming up...
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
