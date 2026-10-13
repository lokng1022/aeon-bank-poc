import { create } from 'zustand';
import { TransactionRepository } from '@repositories/TransactionRepository';
import type { Transaction } from '@/types/transaction';
import { sortTransactionsByLatest } from '@/utils/transactions';
import { MockTransactionRepository } from '@repositories/MockTransactionRepository';

export interface TransactionState {
    transactions: readonly Transaction[];
    isLoading: boolean;
    error: 'LOAD_TRANSACTIONS_FAILED' | null;
    fetchTransactions: () => Promise<void>;
    getTransactionByRefId: (refId: string) => Transaction | undefined;
}

let transactionRepository: TransactionRepository = new MockTransactionRepository();

export function setTransactionRepository(
    repository: TransactionRepository,
): void {
    transactionRepository = repository;
}

export const useTransactionStore = create<TransactionState>()(
    (set, get) => ({
        transactions: [],
        isLoading: false,
        error: null,

        async fetchTransactions() {
            if (get().isLoading) {
                return;
            }

            set({ isLoading: true, error: null });

            try {
                const transactions =
                    await transactionRepository.getTransactions();

                set({
                    transactions: sortTransactionsByLatest(transactions),
                });
            } catch {
                set({
                    error: 'LOAD_TRANSACTIONS_FAILED',
                });
            } finally {
                set({
                    isLoading: false,
                });
            }
        },

        getTransactionByRefId(refId: string) {
            return get().transactions.find(
                (transaction) => transaction.refId === refId,
            );
        },
    }),
);