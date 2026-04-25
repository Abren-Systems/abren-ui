import type { components } from '@/shared/api/generated.types'
import type { z } from 'zod'
import type {
  PaymentRequestLineSchema,
  PaymentRequestSchema,
  PaymentRequestStatsSchema,
  VendorBillLineSchema,
  VendorBillSchema,
} from './api.schemas'

/** Consolidated AP Domain DTOs (Strictly aligned to backend Pydantic models via Zod schemas) */

export type Schemas = components['schemas']

// --- Payment Request DTOs ---

export type PaymentRequestStatusDTO = z.infer<typeof PaymentRequestSchema>['status']
export type PaymentRequestLineDTO = z.infer<typeof PaymentRequestLineSchema>
export type PaymentRequestDTO = z.infer<typeof PaymentRequestSchema>
export type PaymentRequestLineCreateDTO = Schemas['PaymentRequestLineCreateRequest']
export type PaymentRequestCreateDTO = Schemas['PaymentRequestCreateRequest']
export type PaymentRequestAuthorizeDTO = void
export type PaymentRequestRejectDTO = Schemas['PaymentRequestRejectRequest']
export type PaymentRequestStatsDTO = z.infer<typeof PaymentRequestStatsSchema>

// --- Vendor Bill DTOs ---

export type VendorBillLineDTO = z.infer<typeof VendorBillLineSchema>
export type VendorBillDTO = z.infer<typeof VendorBillSchema>
export type VendorBillCreateDTO = Schemas['VendorBillCreateRequest']
export type VendorBillLineCreateDTO = Schemas['VendorBillLineRequest']
