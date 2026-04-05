/**
 * Inventory Module API DTOs
 * Synchronized with backend abren_api.modules.inventory.application.dtos
 */

export interface WarehouseDTO {
  id: string
  tenant_id: string
  name: string
  code: string
  is_active: boolean
  is_quarantine: boolean
}

export type TrackingMode = 'NONE' | 'BATCH' | 'SERIAL'

export interface ItemDTO {
  id: string
  tenant_id: string
  product_id: string
  sku: string
  name: string
  tracking_mode: string // String enum from backend
}

export interface StockLevelDTO {
  stock_item_id: string
  tenant_id: string
  item_id: string
  warehouse_id: string
  quantity: number
  weighted_average_cost: number
  total_value: number
}

export interface BatchDTO {
  id: string
  tenant_id: string
  batch_number: string
  item_id: string
  production_date?: string | null
  expiry_date?: string | null
}

export interface SerialNumberDTO {
  id: string
  tenant_id: string
  serial_number: string
  item_id: string
  is_available: boolean
}

export interface AdjustmentLineDTO {
  stock_item_id: string
  quantity_delta: number
  valuation_strategy: 'AUTO' | 'MANUAL'
  manual_unit_cost?: number | null
  batch_number?: string | null
  production_date?: string | null
  expiry_date?: string | null
  serial_ids?: string[] | null
  override_fefo?: boolean
  is_disposal?: boolean
}

export interface AdjustmentCreateDTO {
  warehouse_id: string
  reason: string
  lines: AdjustmentLineDTO[]
}

export interface AdjustmentDTO {
  id: string
  warehouse_id: string
  reason: string
  status: string
}
