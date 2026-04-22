import { z } from 'zod'

export const TaxRuleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  rate: z.union([z.number(), z.string()]),
  tax_type: z.enum(['VAT', 'WHT']),
  direction: z.enum(['INPUT', 'OUTPUT', 'NON_DIRECTIONAL']),
  gl_account_id: z.string().uuid(),
  is_active: z.boolean(),
})

export const TaxGroupSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  method: z.enum(['SIMPLE', 'COMPOUND']),
  rule_ids: z.array(z.string().uuid()),
  rules: z.array(TaxRuleSchema).optional(),
  is_active: z.boolean(),
})

export const TaxCalculationResponseSchema = z.object({
  net: z.union([z.number(), z.string()]),
  tax: z.union([z.number(), z.string()]),
  gross: z.union([z.number(), z.string()]),
  currency: z.string(),
  breakdown: z.record(z.union([z.number(), z.string()])).optional(),
})
