import { mockTransactionsResponse } from '@/api/mockTransactions';
import type { TransactionRepository } from '@/repositories/TransactionRepository';
import type { Transaction } from '@/types/transaction';

export class MockTransactionRepository implements TransactionRepository {
  async getTransactions(): Promise<Transaction[]> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockTransactionsResponse.data;
  }
}