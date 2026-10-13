import {
  formatAmount,
  formatTransferDate,
} from '@/utils/formatters';
import { sortTransactionsByLatest } from '@/utils/transactions';

import { refund, salary } from './fixtures/transactions';

describe('transaction utilities', () => {
  it('sorts latest first without changing the original array', () => {
    const input = Object.freeze([refund, salary]);

    const result = sortTransactionsByLatest(input);

    expect(result.map((transaction) => transaction.refId)).toEqual([
      '123ABC',
      '789GHI',
    ]);

    expect(input.map((transaction) => transaction.refId)).toEqual([
      '789GHI',
      '123ABC',
    ]);
  });

  it('handles an empty transaction list', () => {
    expect(sortTransactionsByLatest([])).toEqual([]);
  });

  it('formats incoming amounts in MYR with two decimal places', () => {
    expect(formatAmount(1500)).toBe('+ RM 1,500.00');
    expect(formatAmount(2300.75)).toBe('+ RM 2,300.75');
  });

  it('formats outgoing amounts with a negative sign', () => {
    expect(formatAmount(-500)).toBe('− RM 500.00');
  });

  it('uses Malaysia time across a UTC date boundary', () => {
    expect(
      formatTransferDate('2024-10-05T16:18:30Z'),
    ).toBe('06 Oct 2024 00:18');
  });
});