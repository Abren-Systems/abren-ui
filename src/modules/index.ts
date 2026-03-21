import { identityModule } from './identity'
import { accountingModule } from './accounting'

/**
 * Central Module Registry
 * 
 * All bounded context modules must be exported here for 
 * dynamic registration in the router and menu system.
 */
export const modules = [
  identityModule,
  accountingModule,
]
