import type { components } from '@/shared/api/generated.types'

export type TaxRuleDTO = components['schemas']['TaxRuleResponse']
export type TaxRuleCreateDTO = components['schemas']['TaxRuleCreateRequest']

export type TaxGroupDTO = components['schemas']['TaxGroupResponse']
export type TaxGroupCreateDTO = components['schemas']['TaxGroupCreateRequest']

export type CalculateTaxRequest = components['schemas']['CalculateTaxRequest']
export type TaxCalculationResponse = components['schemas']['TaxCalculationResponse']
