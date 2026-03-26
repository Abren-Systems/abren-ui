import { apiGet, apiPost } from '@/core/api/http-client'
import type { Account } from '../domain/account.types'
import { mapAccount } from './ledger.mapper'
import type { components } from '@/core/api/generated.types'

type AccountRead = components['schemas']['AccountRead']
type JournalEntryRead = components['schemas']['JournalEntryRead']
type JournalEntryCreate = components['schemas']['JournalEntryCreate']
type FiscalPeriodRead = components['schemas']['FiscalPeriodRead']
type FiscalPeriodCreate = components['schemas']['FiscalPeriodCreate']
type LedgerSettingsRead = components['schemas']['LedgerSettingsRead']
type LedgerSettingsUpdate = components['schemas']['LedgerSettingsUpdate']

/**
 * Ledger API Adapter
 */
export const ledgerAdapter = {
  /**
   * Fetches the accounts and maps them via the ACL Mapper
   */
  async getAccounts(): Promise<Account[]> {
    const dtos = await apiGet<AccountRead[]>('/finance/ledger/accounts')
    return dtos.map(mapAccount)
  },

  async getJournalEntries(): Promise<JournalEntryRead[]> {
    // For now, JE might stay as DTO until we define the JE entity
    return apiGet<JournalEntryRead[]>('/finance/ledger/journal-entries')
  },

  async createJournalEntry(data: JournalEntryCreate): Promise<JournalEntryRead> {
    return apiPost<JournalEntryRead>('/finance/ledger/journal-entries', data)
  },

  async postJournalEntry(entryId: string): Promise<JournalEntryRead> {
    return apiPost<JournalEntryRead>(`/finance/ledger/journal-entries/${entryId}/post`)
  },

  // --- Fiscal Periods ---

  async getFiscalPeriods(): Promise<FiscalPeriodRead[]> {
    return apiGet<FiscalPeriodRead[]>('/finance/ledger/fiscal-periods')
  },

  async createFiscalPeriod(data: FiscalPeriodCreate): Promise<FiscalPeriodRead> {
    return apiPost<FiscalPeriodRead>('/finance/ledger/fiscal-periods', data)
  },

  // --- Ledger Settings ---

  async getLedgerSettings(): Promise<LedgerSettingsRead> {
    return apiGet<LedgerSettingsRead>('/finance/ledger/settings')
  },

  async updateLedgerSettings(data: LedgerSettingsUpdate): Promise<LedgerSettingsRead> {
    return apiPost<LedgerSettingsRead>('/finance/ledger/settings', data, { method: 'PATCH' })
  },
}
