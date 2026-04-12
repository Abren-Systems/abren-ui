<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/card'
import { Button } from '@/shared/components/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/select'
import { Input } from '@/shared/components/input'
import { Label } from '@/shared/components/label'
import { Textarea } from '@/shared/components/textarea'
import DebouncedCombobox from '@/shared/components/combobox/DebouncedCombobox.vue'
import type { ComboboxOption } from '@/shared/components/combobox/DebouncedCombobox.vue'
import FileUploadZone from '@/shared/components/dropzone/FileUploadZone.vue'
import { useCreateVendorBill } from '../../../application/composables/useCreateVendorBill'
import { useFormPersistence } from '@/shared/composables/useFormPersistence'
import { Trash2, Plus, AlertCircle, Eye, EyeOff } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/alert'

/**
 * VendorBillCreatePage — Dedicated creation form.
 *
 * Uses the Macro-Create pattern (Full Page) to support complex 
 * tabular line items and maximum data density.
 */

const router = useRouter()
const { form, error: submissionError } = useCreateVendorBill()

const showSourceDoc = ref(false)
const sourceFile = ref<File | null>(null)
const sourceFileUrl = ref<string | null>(null)

// Draft Persistence
useFormPersistence(form, 'abren_draft_vendor_bill')

function goBack() {
  router.push({ name: 'VendorBillsList' })
}

function handleFileSelected(file: File) {
  sourceFile.value = file
  if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
    sourceFileUrl.value = URL.createObjectURL(file)
  }
}

function handleFileCleared() {
  sourceFile.value = null
  if (sourceFileUrl.value) {
    URL.revokeObjectURL(sourceFileUrl.value)
    sourceFileUrl.value = null
  }
}

// Mocked search functions for rapid UI mapping
const searchVendors = async (q: string): Promise<ComboboxOption[]> => {
  return [
    { value: 'vend-123', label: 'Acme Corp', description: 'vend-123' },
    { value: 'vend-456', label: 'Global Tech', description: 'vend-456' },
    { value: 'vend-789', label: 'Local Supply', description: 'vend-789' },
  ].filter(v => v.label.toLowerCase().includes(q.toLowerCase()))
}

const searchAccounts = async (q: string): Promise<ComboboxOption[]> => {
  return [
    { value: 'acc-6200', label: '6200 - Office Supplies', description: 'Expense' },
    { value: 'acc-6300', label: '6300 - IT Hardware', description: 'Expense' },
    { value: 'acc-6400', label: '6400 - Travel', description: 'Expense' },
  ].filter(v => v.label.toLowerCase().includes(q.toLowerCase()) || v.value.includes(q))
}

const searchCategories = async (q: string): Promise<ComboboxOption[]> => {
  return [
    { value: 'cat-opex', label: 'OPEX - Operations', description: 'cat-opex' },
    { value: 'cat-capex', label: 'CAPEX - Capital', description: 'cat-capex' },
  ].filter(v => v.label.toLowerCase().includes(q.toLowerCase()))
}
</script>

<template>
  <div class="p-6 space-y-6 min-h-screen">
    <!-- Header -->
    <div class="flex items-center justify-between mx-auto" :class="showSourceDoc ? 'max-w-none w-full' : 'max-w-4xl'">
      <div>
        <button
          class="mb-2 flex items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-neutral-900"
          @click="goBack"
        >
          ← Back to Bills
        </button>
        <h1 class="text-2xl font-bold tracking-tight">Register Vendor Bill</h1>
        <p class="text-sm text-neutral-500">
          Record a supplier invoice to generate an AP accrual.
        </p>
      </div>
      
      <Button variant="outline" size="sm" @click="showSourceDoc = !showSourceDoc">
        <Eye v-if="!showSourceDoc" class="mr-2 h-4 w-4" />
        <EyeOff v-else class="mr-2 h-4 w-4" />
        {{ showSourceDoc ? 'Hide Document' : 'View Source Document' }}
      </Button>
    </div>

    <!-- Layout Container -->
    <div class="flex gap-6 mx-auto items-start" :class="showSourceDoc ? 'max-w-none w-full' : 'max-w-4xl'">
      
      <!-- Source Document Split View (Left) -->
      <aside v-if="showSourceDoc" class="w-1/2 sticky top-6 bg-white border border-neutral-200 rounded-lg shadow-sm flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div class="p-4 border-b bg-neutral-50 flex items-center justify-between shrink-0">
           <h2 class="font-semibold text-sm">Source Invoice</h2>
           <span v-if="sourceFile" class="text-xs text-neutral-500">{{ sourceFile.name }}</span>
        </div>
        
        <div class="flex-1 overflow-auto bg-neutral-100/50 p-4 relative flex flex-col items-center justify-center">
          <FileUploadZone 
            v-if="!sourceFile"
            accept="application/pdf,image/*" 
            :max-size-m-b="10"
            @file-selected="handleFileSelected" 
          />
          
          <template v-else-if="sourceFileUrl">
            <iframe v-if="sourceFile.type === 'application/pdf'" :src="sourceFileUrl" class="w-full h-full rounded shadow-sm border-0"></iframe>
            <img v-else :src="sourceFileUrl" class="max-w-full rounded shadow-sm" alt="Source Document" />
          </template>
          
          <div v-if="sourceFile" class="absolute bottom-4 flex justify-center w-full">
             <Button variant="destructive" size="sm" class="shadow-lg" @click="handleFileCleared">
                <Trash2 class="h-4 w-4 mr-2" /> Remove Attachment
             </Button>
          </div>
        </div>
      </aside>

      <!-- Data Entry Form (Right / Center) -->
      <div :class="showSourceDoc ? 'w-1/2' : 'w-full'">
        <!-- Submission Error -->
        <Alert v-if="submissionError" variant="destructive" class="mb-6">
          <AlertCircle class="h-4 w-4" />
          <AlertTitle>Error registering bill</AlertTitle>
          <AlertDescription>
            {{ submissionError.detail ?? 'An unexpected error occurred.' }}
          </AlertDescription>
        </Alert>

        <form
          class="space-y-6"
          @submit.prevent="(e) => { (e as Event).stopPropagation(); form.handleSubmit() }"
        >
          <Card>
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <div class="flex gap-4">
                <form.Field name="vendorId">
                  <template #default="{ field, state }">
                    <div class="flex-1 grid gap-1.5">
                      <Label :for="field.name">Vendor ID <span class="text-destructive">*</span></Label>
                      <DebouncedCombobox
                        :model-value="field.state.value"
                        :fetch-options="searchVendors"
                        placeholder="Search vendors..."
                        @update:model-value="(val) => field.handleChange(val as string)"
                      />
                      <p v-if="state.meta.errors.length" class="text-xs text-destructive">
                        {{ state.meta.errors.join(', ') }}
                      </p>
                    </div>
                  </template>
                </form.Field>

                <form.Field name="billNumber">
                  <template #default="{ field, state }">
                    <div class="flex-1 grid gap-1.5">
                      <Label :for="field.name">Bill Number <span class="text-destructive">*</span></Label>
                      <Input
                        :id="field.name"
                        :model-value="field.state.value"
                        placeholder="e.g. INV-2023-001"
                        @update:model-value="(val) => field.handleChange(val as string)"
                      />
                      <p v-if="state.meta.errors.length" class="text-xs text-destructive">
                        {{ state.meta.errors.join(', ') }}
                      </p>
                    </div>
                  </template>
                </form.Field>
              </div>

              <div class="flex gap-4">
                <form.Field name="issueDate">
                  <template #default="{ field }">
                    <div class="flex-1 grid gap-1.5">
                      <Label :for="field.name">Issue Date</Label>
                      <Input
                        :id="field.name"
                        type="date"
                        :model-value="field.state.value"
                        @update:model-value="(val) => field.handleChange(val as string)"
                      />
                    </div>
                  </template>
                </form.Field>

                <form.Field name="dueDate">
                  <template #default="{ field }">
                    <div class="flex-1 grid gap-1.5">
                      <Label :for="field.name">Due Date</Label>
                      <Input
                        :id="field.name"
                        type="date"
                        :model-value="field.state.value"
                        @update:model-value="(val) => field.handleChange(val as string)"
                      />
                    </div>
                  </template>
                </form.Field>

                <form.Field name="currency">
                  <template #default="{ field }">
                    <div class="flex-none w-32 grid gap-1.5">
                      <Label :for="field.name">Currency</Label>
                      <Select
                        :model-value="field.state.value"
                        @update:model-value="(val) => field.handleChange(val as string)"
                      >
                        <SelectTrigger :id="field.name">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ETB">ETB</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </template>
                </form.Field>
              </div>

              <form.Field name="justification">
                <template #default="{ field, state }">
                  <div class="grid gap-1.5">
                    <Label :for="field.name">Justification <span class="text-destructive">*</span></Label>
                    <Textarea
                      :id="field.name"
                      :model-value="field.state.value"
                      rows="2"
                      placeholder="Description of the purchase…"
                      @update:model-value="(val) => field.handleChange(val as string)"
                    />
                    <p v-if="state.meta.errors.length" class="text-xs text-destructive">
                      {{ state.meta.errors.join(', ') }}
                    </p>
                  </div>
                </template>
              </form.Field>
            </CardContent>
          </Card>

          <!-- Line Items -->
          <Card>
            <CardHeader>
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold tracking-tight">
                  Expense Lines
                </h3>
                <form.Field name="lines">
                  <template #default="{ field }">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      class="h-8 text-xs"
                      @click="
                        field.pushValue({ description: '', amount: 0, accountId: '', categoryId: '' })
                      "
                    >
                      <Plus class="mr-1 h-3 w-3" /> Add Line
                    </Button>
                  </template>
                </form.Field>
              </div>
            </CardHeader>
            <CardContent class="space-y-4">
              <form.Field name="lines">
                <template #default="{ field }">
                  <div
                    v-for="(_, idx) in field.state.value"
                    :key="idx"
                    class="space-y-3 rounded-lg border p-4"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Line #{{ (idx as number) + 1 }}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        class="h-7 w-7 text-neutral-400 hover:text-destructive"
                        :disabled="field.state.value.length === 1"
                        @click="field.removeValue(idx)"
                      >
                        <Trash2 class="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <form.Field :name="`lines[${idx}].description`" :index="idx">
                        <template #default="{ field: lf }">
                          <div class="grid gap-1.5 flex-1 w-full col-span-2">
                            <Label class="text-xs">Description *</Label>
                            <Input
                              size="sm"
                              :model-value="lf.state.value"
                              placeholder="e.g. Server Hosting"
                              @update:model-value="(val) => lf.handleChange(val as string)"
                            />
                          </div>
                        </template>
                      </form.Field>

                      <form.Field :name="`lines[${idx}].amount`" :index="idx">
                        <template #default="{ field: lf }">
                          <div class="grid gap-1.5">
                            <Label class="text-xs">Gross Amount *</Label>
                            <Input
                              size="sm"
                              type="number"
                              step="0.01"
                              :model-value="lf.state.value"
                              class="text-right tabular-nums"
                              @update:model-value="(val) => lf.handleChange(Number(val))"
                            />
                          </div>
                        </template>
                      </form.Field>

                      <div class="grid grid-cols-2 gap-3 col-span-2">
                        <form.Field :name="`lines[${idx}].accountId`" :index="idx">
                          <template #default="{ field: lf }">
                            <div class="grid gap-1.5">
                              <Label class="text-xs">GL Account</Label>
                              <DebouncedCombobox
                                :model-value="lf.state.value"
                                :fetch-options="searchAccounts"
                                placeholder="Search accounts..."
                                @update:model-value="(val) => lf.handleChange(val as string)"
                              />
                            </div>
                          </template>
                        </form.Field>

                        <form.Field :name="`lines[${idx}].categoryId`" :index="idx">
                          <template #default="{ field: lf }">
                            <div class="grid gap-1.5">
                              <Label class="text-xs">Category</Label>
                              <DebouncedCombobox
                                :model-value="lf.state.value"
                                :fetch-options="searchCategories"
                                placeholder="Search categories..."
                                @update:model-value="(val) => lf.handleChange(val as string)"
                                @keydown.enter.prevent="() => {
                                  if (idx === field.state.value.length - 1) {
                                    field.pushValue({ description: '', amount: 0, accountId: '', categoryId: '' });
                                  }
                                }"
                              />
                              <p class="text-[10px] text-neutral-400">Press Enter to add new line</p>
                            </div>
                          </template>
                        </form.Field>
                      </div>
                    </div>
                  </div>
                </template>
              </form.Field>
            </CardContent>
          </Card>

          <div class="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" @click="goBack">Cancel</Button>
            <form.Subscribe v-slot="state">
              <Button
                :disabled="!state.canSubmit || state.isSubmitting"
                type="submit"
              >
                {{ state.isSubmitting ? 'Registering…' : 'Register Bill' }}
              </Button>
            </form.Subscribe>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
