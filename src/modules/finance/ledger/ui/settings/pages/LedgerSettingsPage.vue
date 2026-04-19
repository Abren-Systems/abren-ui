<script setup lang="ts">
import { useLedgerSettings } from '../../../application/composables/useLedgerSettings'
import { useLedgerAccounts } from '../../../application/composables/useLedgerAccounts'
import { usePermissions } from '@/shared/auth/usePermissions'
import { Button } from '@/shared/components/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/select'
import { AlertCircle, ArrowRight } from 'lucide-vue-next'
import { Label } from '@/shared/components/label'
import { watch } from 'vue'
import { useForm } from '@tanstack/vue-form'
import { z } from 'zod'

const { hasPermission } = usePermissions()
const canEdit = hasPermission('ledger:manage_accounts')

const { settings, isLoading, updateSettings } = useLedgerSettings()
const { accounts, isPending: isAccountsLoading } = useLedgerAccounts()

const ledgerSettingsSchema = z.object({
  default_bridge_account_id: z.string(),
  pr_payable_account_id: z.string(),
})

type LedgerSettingsFormValues = z.infer<typeof ledgerSettingsSchema>

const form = useForm({
  defaultValues: {
    default_bridge_account_id: '',
    pr_payable_account_id: '',
  } as LedgerSettingsFormValues,
  validators: {
    onChange: ledgerSettingsSchema,
  },
  onSubmit: async ({ value }) => {
    await updateSettings({
      default_bridge_account_id: value.default_bridge_account_id || null,
      pr_payable_account_id: value.pr_payable_account_id || null,
    })
  },
})

// Sync server state to form state
watch(
  settings,
  (newVal) => {
    if (newVal) {
      form.setFieldValue('default_bridge_account_id', newVal.default_bridge_account_id || '')
      form.setFieldValue('pr_payable_account_id', newVal.pr_payable_account_id || '')
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex h-full flex-col gap-5">
    <!-- Page Header -->
    <div class="flex shrink-0 items-start justify-between">
      <div>
        <h1 class="m-0 text-heading text-[var(--color-grid-text)]">Ledger Settings</h1>
        <p class="mt-1 text-body-sm text-[var(--color-grid-text-muted)]">
          Configure global reconciliation and subledger accounts.
        </p>
      </div>
    </div>

    <!-- Settings Canvas -->
    <div class="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Account Mappings</CardTitle>
          <CardDescription>
            Configure global reconciliation and subledger accounts.
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-6">
          <template v-if="!isAccountsLoading && accounts && accounts.length === 0">
            <div
              class="bg-red-50 text-red-900 border border-red-200 rounded-md p-4 flex flex-col gap-3"
            >
              <div class="flex items-center gap-2 font-medium">
                <AlertCircle class="h-4 w-4" />
                <span>Missing Prerequisites</span>
              </div>
              <p class="text-sm text-red-800">
                Your Chart of Accounts must be established before you can configure ledger mappings.
                Without accounts, the system cannot reconcile or accrue transactions.
              </p>
              <div>
                <router-link :to="{ name: 'LedgerCoa' }">
                  <Button
                    variant="outline"
                    size="sm"
                    class="mt-2 text-red-900 border-red-300 hover:bg-red-100"
                  >
                    Setup Chart of Accounts <ArrowRight :size="14" class="ml-2" />
                  </Button>
                </router-link>
              </div>
            </div>
          </template>

          <form
            v-else
            @submit.prevent="
              (e) => {
                e.stopPropagation()
                form.handleSubmit()
              }
            "
          >
            <div class="grid gap-6">
              <form.Field name="default_bridge_account_id">
                <template #default="{ field }">
                  <div class="grid gap-2">
                    <Label :for="field.name">Default Bridge Account</Label>
                    <Select
                      :model-value="field.state.value"
                      :disabled="isLoading || !canEdit"
                      @update:model-value="field.handleChange"
                    >
                      <SelectTrigger :id="field.name">
                        <SelectValue placeholder="Select bridge account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="acc in accounts" :key="acc.id" :value="acc.id">
                          {{ acc.code }} - {{ acc.name }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p class="text-sm text-neutral-500">
                      Used for temporary holding during multi-step reconciliations.
                    </p>
                  </div>
                </template>
              </form.Field>

              <form.Field name="pr_payable_account_id">
                <template #default="{ field }">
                  <div class="grid gap-2">
                    <Label :for="field.name">PR Payable Account</Label>
                    <Select
                      :model-value="field.state.value"
                      :disabled="isLoading || !canEdit"
                      @update:model-value="field.handleChange"
                    >
                      <SelectTrigger :id="field.name">
                        <SelectValue placeholder="Select payable account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem v-for="acc in accounts" :key="acc.id" :value="acc.id">
                          {{ acc.code }} - {{ acc.name }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p class="text-sm text-neutral-500">
                      Default liability account for Payment Request accruals.
                    </p>
                  </div>
                </template>
              </form.Field>

              <div class="flex justify-end">
                <Button v-if="canEdit" type="submit" :disabled="isLoading">
                  {{ isLoading ? 'Saving…' : 'Save Settings' }}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
