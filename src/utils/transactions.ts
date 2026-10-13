import type { Transaction } from '@/types/transaction';

export function sortTransactionsByLatest(
  transactions: readonly Transaction[],
): Transaction[] {
  return [...transactions].sort(
    (first, second) =>
      Date.parse(second.transferDate) -
      Date.parse(first.transferDate),
  );
}