<script setup lang="ts">
import { ref } from 'vue'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/shared/components/drawer'
import { Button } from '@/shared/components/button'
import { Input } from '@/shared/components/input'
import { Label } from '@/shared/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/select'
import { Badge } from '@/shared/components/badge'
import { X, Plus } from 'lucide-vue-next'
import { useCreateTaxGroup, useActiveTaxRules } from '../../../application/useTaxRules'
import type { TaxGroupCreateDTO } from '../../../infrastructure/api.types'

/**
 * Drawer: Create Tax Group.
 *
 * Orchestrates the tax group creation form.
 * Allows selecting multiple tax rules and defining the calculation method.
 */
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const { mutateAsync: createGroup, isPending } = useCreateTaxGroup()
const { data: availableRules } = useActiveTaxRules()

const form = ref<TaxGroupCreateDTO>({
  name: '',
  method: 'SIMPLE',
  rule_ids: [],
})

const selectedRuleId = ref('')

function addRule() {
  if (selectedRuleId.value && !form.value.rule_ids.includes(selectedRuleId.value)) {
    form.value.rule_ids.push(selectedRuleId.value)
    selectedRuleId.value = ''
  }
}

function removeRule(id: string) {
  form.value.rule_ids = form.value.rule_ids.filter((ruleId) => ruleId !== id)
}

function getRuleName(id: string) {
  return availableRules.value?.find((r) => r.id === id)?.name || id
}

async function handleSubmit() {
  if (form.value.rule_ids.length === 0) {
    alert('Please select at least one tax rule.')
    return
  }

  try {
    await createGroup(form.value)
    emit('update:open', false)
    // Reset form
    form.value = {
      name: '',
      method: 'SIMPLE',
      rule_ids: [],
    }
  } catch (error) {
    console.error('Failed to create tax group:', error)
  }
}
</script>

<template>
  <Drawer :open="props.open" @update:open="emit('update:open', $event)">
    <DrawerContent class="sm:max-w-[500px]">
      <DrawerHeader>
        <DrawerTitle>New Tax Group</DrawerTitle>
        <DrawerDescription>
          Combine multiple tax rules into a single group for complex calculations.
        </DrawerDescription>
      </DrawerHeader>

      <div class="grid gap-6 py-4 px-4 overflow-y-auto max-h-[70vh]">
        <div class="grid gap-2">
          <Label for="name">Group Name</Label>
          <Input id="name" v-model="form.name" placeholder="e.g. VAT + Excise" />
        </div>

        <div class="grid gap-2">
          <Label for="method">Calculation Method</Label>
          <Select v-model="form.method">
            <SelectTrigger id="method">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SIMPLE">Simple (Sum of rates)</SelectItem>
              <SelectItem value="COMPOUND">Compound (Tax on Tax)</SelectItem>
            </SelectContent>
          </Select>
          <p class="text-xs text-muted-foreground">
            {{
              form.method === 'COMPOUND'
                ? 'Compound: Each tax is applied to the (base + previous taxes).'
                : 'Simple: All taxes are applied to the same base amount.'
            }}
          </p>
        </div>

        <div class="grid gap-4 p-4 border rounded-lg bg-muted/30">
          <Label>Rules in Group</Label>

          <div class="flex gap-2">
            <Select v-model="selectedRuleId">
              <SelectTrigger class="flex-1">
                <SelectValue placeholder="Add a rule..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="rule in availableRules"
                  :key="rule.id"
                  :value="rule.id"
                  :disabled="form.rule_ids.includes(rule.id)"
                >
                  {{ rule.name }} ({{ (rule.rate * 100).toFixed(1) }}%)
                </SelectItem>
              </SelectContent>
            </Select>
            <Button size="icon" variant="secondary" @click="addRule" :disabled="!selectedRuleId">
              <Plus class="h-4 w-4" />
            </Button>
          </div>

          <div class="flex flex-wrap gap-2">
            <div v-if="form.rule_ids.length === 0" class="text-sm text-muted-foreground py-2">
              No rules added yet.
            </div>
            <Badge
              v-for="id in form.rule_ids"
              :key="id"
              variant="secondary"
              class="flex items-center gap-1 pl-2 py-1"
            >
              {{ getRuleName(id) }}
              <Button
                variant="ghost"
                size="icon"
                class="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                @click="removeRule(id)"
              >
                <X class="h-3 w-3" />
              </Button>
            </Badge>
          </div>
        </div>
      </div>

      <DrawerFooter>
        <Button variant="outline" @click="emit('update:open', false)">Cancel</Button>
        <Button :loading="isPending" @click="handleSubmit">Create Group</Button>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
