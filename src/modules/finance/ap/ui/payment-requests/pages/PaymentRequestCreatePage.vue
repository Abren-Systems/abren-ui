<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AppButton, AppSelect, AppInput, AppTextarea } from '@/shared/components/primitives'
import { useCreatePaymentRequest } from '../../../application/composables/useCreatePaymentRequest'
import { useFormPersistence } from '@/shared/composables/useFormPersistence'
import { Trash2, Plus, AlertCircle, ArrowLeft, CreditCard } from 'lucide-vue-next'
import { useUsers } from '@/modules/core/application/composables/useUsers'
import SelectLedgerAccount from '@/shared/components/finance/SelectLedgerAccount.vue'

/**
 * PaymentRequestCreatePage — Dedicated creation form.
 *
 * Uses the Macro-Create pattern (Full Page) to support complex
 * tabular line items and maximum data density.
 */

const router = useRouter()
const { form, error: submissionError } = useCreatePaymentRequest()
const { users, isPending: isLoadingUsers } = useUsers()

// Draft Persistence
useFormPersistence(form, 'abren_draft_payment_request')

function goBack() {
  router.push({ name: 'PaymentRequestsList' })
}
</script>

<template>
  <div class="flex h-full flex-col bg-neutral-50/50">
    <!-- Header -->
    <PageHeader
      title="New Payment Request"
      description="Standalone request — accrual entry generated automatically on approval."
    >
      <template #start>
        <AppButton variant="stealth" size="sm" class="h-8 w-8 p-0 -ml-2" @click="goBack">
          <ArrowLeft :size="16" />
        </AppButton>
      </template>
      <template #actions>
        <form.Subscribe v-slot="state">
          <AppButton
            variant="primary"
            :loading="state.isSubmitting"
            :disabled="!state.canSubmit"
            @click="form.handleSubmit"
          >
            Submit Request
          </AppButton>
        </form.Subscribe>
      </template>
    </PageHeader>

    <div class="flex-1 overflow-y-auto p-6 scrollbar-thin">
      <div class="max-w-5xl mx-auto space-y-6">
        <!-- Submission Error -->
        <div
          v-if="submissionError"
          class="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 shadow-sm mb-6"
        >
          <AlertCircle class="h-5 w-5 text-red-600 shrink-0" />
          <div>
            <h3 class="text-[10px] font-bold uppercase tracking-widest text-red-700">
              Error creating request
            </h3>
            <p class="text-xs text-red-600 mt-1">
              {{ submissionError.detail ?? 'An unexpected error occurred.' }}
            </p>
          </div>
        </div>

        <form
          class="space-y-6"
          @submit.prevent="
            (e) => {
              ;(e as Event).stopPropagation()
              form.handleSubmit()
            }
          "
        >
          <!-- Request Metadata -->
          <div class="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
            <h2
              class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 border-b pb-4 -mx-6 px-6"
            >
              General Information
            </h2>

            <div class="grid grid-cols-12 gap-6">
              <div class="col-span-12 md:col-span-8">
                <form.Field name="beneficiaryId">
                  <template #default="{ field, state }">
                    <AppSelect
                      label="Beneficiary Vendor"
                      :model-value="field.state.value"
                      required
                      :disabled="isLoadingUsers"
                      :error="state.meta.errors[0]"
                      :options="users?.map((u) => ({ label: u.email, value: u.id })) || []"
                      @update:model-value="(val) => field.handleChange(val as string)"
                    />
                  </template>
                </form.Field>
              </div>

              <div class="col-span-12 md:col-span-4">
                <form.Field name="currency">
                  <template #default="{ field, state }">
                    <AppSelect
                      label="Currency"
                      :model-value="field.state.value"
                      :options="[
                        { label: 'ETB - Ethiopian Birr', value: 'ETB' },
                        { label: 'USD - US Dollar', value: 'USD' },
                      ]"
                      :error="state.meta.errors[0]"
                      @update:model-value="(val) => field.handleChange(val as string)"
                    />
                  </template>
                </form.Field>
              </div>

              <div class="col-span-12">
                <form.Field name="justification">
                  <template #default="{ field, state }">
                    <AppTextarea
                      label="Description / Justification"
                      :model-value="field.state.value"
                      placeholder="Explain the purpose of this request for approval review..."
                      required
                      :rows="2"
                      :error="state.meta.errors[0]"
                      @update:model-value="(val) => field.handleChange(val as string)"
                    />
                  </template>
                </form.Field>
              </div>
            </div>
          </div>

          <!-- Line Items Section -->
          <div class="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
            <div
              class="flex items-center justify-between px-6 py-3 bg-neutral-50/50 border-b border-neutral-200"
            >
              <h3 class="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Request Line Items
              </h3>
              <form.Field name="lines">
                <template #default="{ field }">
                  <AppButton
                    variant="stealth"
                    size="sm"
                    type="button"
                    class="h-7 text-xs"
                    @click="
                      field.pushValue({
                        description: '',
                        amount: 0,
                        accountId: '',
                        categoryId: '',
                        taxAmount: 0,
                      })
                    "
                  >
                    <template #start>
                      <Plus :size="14" />
                    </template>
                    Add Line Item
                  </AppButton>
                </template>
              </form.Field>
            </div>

            <div class="p-0">
              <form.Field name="lines">
                <template #default="{ field }">
                  <div
                    v-for="(_, idx) in field.state.value"
                    :key="idx"
                    class="group relative border-b border-neutral-100 last:border-0 hover:bg-neutral-50/30 transition-colors"
                  >
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-4">
                        <span
                          class="text-[9px] font-bold uppercase tracking-widest text-neutral-400 border border-neutral-200 px-2 py-0.5 rounded-md"
                        >
                          Line Item #{{ (idx as number) + 1 }}
                        </span>
                        <AppButton
                          v-if="field.state.value.length > 1"
                          variant="stealth"
                          type="button"
                          class="h-6 w-6 p-0 text-neutral-300 hover:text-red-500 transition-colors"
                          @click="field.removeValue(idx)"
                        >
                          <Trash2 :size="14" />
                        </AppButton>
                      </div>

                      <div class="grid grid-cols-12 gap-6">
                        <form.Field :name="`lines[${idx}].description`" :index="idx">
                          <template #default="{ field: lf, state: ls }">
                            <div class="col-span-12 lg:col-span-6">
                              <AppInput
                                label="Item Description"
                                :model-value="lf.state.value"
                                placeholder="What is being paid for?"
                                required
                                :error="ls.meta.errors[0]"
                                @update:model-value="(val) => lf.handleChange(val as string)"
                              />
                            </div>
                          </template>
                        </form.Field>

                        <form.Field :name="`lines[${idx}].accountId`" :index="idx">
                          <template #default="{ field: lf, state: ls }">
                            <div class="col-span-12 lg:col-span-4 space-y-1.5">
                              <label
                                class="text-[10px] font-bold uppercase tracking-widest text-neutral-500"
                                >GL Account *</label
                              >
                              <SelectLedgerAccount
                                :model-value="lf.state.value"
                                class="h-8"
                                @update:model-value="(val) => lf.handleChange(val)"
                              />
                              <p
                                v-if="ls.meta.errors.length"
                                class="text-[9px] text-red-600 font-medium"
                              >
                                {{ ls.meta.errors[0] }}
                              </p>
                            </div>
                          </template>
                        </form.Field>

                        <form.Field :name="`lines[${idx}].amount`" :index="idx">
                          <template #default="{ field: lf, state: ls }">
                            <div class="col-span-12 lg:col-span-2">
                              <AppInput
                                label="Amount"
                                type="number"
                                step="0.01"
                                :model-value="lf.state.value"
                                required
                                :error="ls.meta.errors[0]"
                                class="text-right tabular-nums"
                                @update:model-value="(val) => lf.handleChange(Number(val))"
                              />
                            </div>
                          </template>
                        </form.Field>
                      </div>
                    </div>
                  </div>
                </template>
              </form.Field>
            </div>

            <!-- Totals Area -->
            <div
              class="bg-neutral-50 p-6 flex justify-end items-center gap-4 border-t border-neutral-100"
            >
              <span class="text-[10px] font-bold uppercase tracking-widest text-neutral-500"
                >Total Amount</span
              >
              <div class="text-xl font-bold text-neutral-900 tabular-nums">
                <form.Subscribe v-slot="state">
                  {{ state.values.currency }}
                  {{
                    state.values.lines
                      ?.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0)
                      .toLocaleString(undefined, { minimumFractionDigits: 2 })
                  }}
                </form.Subscribe>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
