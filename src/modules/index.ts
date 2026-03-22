import { coreModule } from './core'
import { ledgerModule } from './finance/ledger'
import { bankModule } from './finance/bank'
import { paymentRequestsModule } from './finance/ap/payment-requests'
import { workflowsModule } from './workflows'

/**
 * Central Module Registry
 * 
 * All bounded context modules must be exported here for 
 * dynamic registration in the router and menu system.
 */
export const modules = [
  coreModule,
  ledgerModule,
  bankModule,
  paymentRequestsModule,
  workflowsModule,
]
