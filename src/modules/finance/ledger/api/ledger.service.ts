import { apiGet, apiPost } from '@/core/api/http-client';
import type { components } from '@/core/api/generated.types';

type AccountRead = components['schemas']['AccountRead'];
type JournalEntryRead = components['schemas']['JournalEntryRead'];
type JournalEntryCreate = components['schemas']['JournalEntryCreate'];

/**
 * Ledger Module - API Service
 * Provides type-safe methods for ledger and Chart of Accounts operations.
 */
export const ledgerService = {
  /**
   * Fetches the complete Chart of Accounts for the current tenant.
   */
  async getAccounts(): Promise<AccountRead[]> {
    return apiGet<AccountRead[]>('/finance/ledger/accounts');
  },

  /**
   * Fetches all journal entries with optional pagination/filtering.
   */
  async getJournalEntries(): Promise<JournalEntryRead[]> {
    return apiGet<JournalEntryRead[]>('/finance/ledger/journal-entries');
  },

  /**
   * Creates a new draft journal entry.
   */
  async createJournalEntry(data: JournalEntryCreate): Promise<JournalEntryRead> {
    return apiPost<JournalEntryRead>('/finance/ledger/journal-entries', data);
  },

  /**
   * Posts a draft journal entry to the General Ledger.
   */
  async postJournalEntry(entryId: string): Promise<JournalEntryRead> {
    return apiPost<JournalEntryRead>(`/finance/ledger/journal-entries/${entryId}/post`);
  },
};
