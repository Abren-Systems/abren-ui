import { coreModule } from './platform/core'
import { ledgerModule } from './business/finance/ledger'
import { bankModule } from './business/finance/bank'
import { apModule } from './business/finance/ap'
import { reportingModule } from './business/reporting'
import { workflowsModule } from './platform/workflows'
import type { BusinessDomain, PlatformEngine } from '@/core/types/module.types'

/**
 * Categorized Module Registry
 *
 * Separates "Business Domains" (User Apps) from "Platform Engines" (Internals).
 */
export const businessModules: BusinessDomain[] = [
  ledgerModule,
  bankModule,
  apModule,
  reportingModule,
] as unknown as BusinessDomain[]

export const platformModules: PlatformEngine[] = [coreModule, workflowsModule]

// All modules for convenience (e.g. router)
export const allModules = [...businessModules, ...platformModules]
