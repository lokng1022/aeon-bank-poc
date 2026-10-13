import type { TransactionRepository } from '@/repositories/TransactionRepository';
import {
  setTransactionRepository,
  useTransactionStore,
} from '@/store/transactionStore';
import type { Transaction } from '@/types/transaction';

import { refund, salary } from './fixtures/transactions';

const getTransactions = jest.fn(
  async (): Promise<readonly Transaction[]> => [],
);

const repository: TransactionRepository = {
  getTransactions,
};

beforeEach(() => {
  useTransactionStore.setState(
    useTransactionStore.getInitialState(),
    true,
  );

  getTransactions.mockReset().mockResolvedValue([]);
  setTransactionRepository(repository);
});

afterEach(() => {
  useTransactionStore.setState(
    useTransactionStore.getInitialState(),
    true,
  );
});

describe('transaction store', () => {
  it('loads transactions latest first and clears a previous error', async () => {
    getTransactions.mockResolvedValue([refund, salary]);

    useTransactionStore.setState({
      error: 'FETCH_TRANSACTIONS_FAILED',
    });

    await useTransactionStore.getState().fetchTransactions();

    const state = useTransactionStore.getState();

    expect(
      state.transactions.map((transaction) => transaction.refId),
    ).toEqual(['123ABC', '789GHI']);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.getTransactionByRefId('123ABC')).toEqual(salary);
    expect(state.getTransactionByRefId('UNKNOWN')).toBeUndefined();
  });

  it('keeps existing transactions when refreshing fails', async () => {
    useTransactionStore.setState({
      transactions: [salary],
    });

    getTransactions.mockRejectedValue(
      new Error('Network unavailable'),
    );

    await useTransactionStore.getState().fetchTransactions();

    const state = useTransactionStore.getState();

    expect(state.transactions).toEqual([salary]);
    expect(state.error).toBe('FETCH_TRANSACTIONS_FAILED');
    expect(state.isLoading).toBe(false);
  });

  it('replaces previous records with an empty successful response', async () => {
    useTransactionStore.setState({
      transactions: [salary],
    });

    await useTransactionStore.getState().fetchTransactions();

    expect(useTransactionStore.getState()).toMatchObject({
      transactions: [],
      error: null,
      isLoading: false,
    });
  });

  it('shows loading and prevents overlapping repository requests', async () => {
    let finishFetch: (
      transactions: readonly Transaction[],
    ) => void = () => {
      throw new Error('Repository request has not started');
    };

    getTransactions.mockImplementationOnce(
      () =>
        new Promise<readonly Transaction[]>((resolve) => {
          finishFetch = resolve;
        }),
    );

    const first = useTransactionStore.getState().fetchTransactions();
    const second = useTransactionStore.getState().fetchTransactions();

    expect(useTransactionStore.getState().isLoading).toBe(true);
    expect(getTransactions).toHaveBeenCalledTimes(1);

    finishFetch([salary]);

    await Promise.all([first, second]);

    expect(useTransactionStore.getState().isLoading).toBe(false);
    expect(useTransactionStore.getState().transactions).toEqual([
      salary,
    ]);
  });
});