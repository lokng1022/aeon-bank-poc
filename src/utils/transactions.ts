import type { Transaction } from '../types/transaction';

export function sortTransactionsByLatest(
  transactions: Transaction[],
): Transaction[] {
  return [...transactions].sort(
    (a, b) =>
      Date.parse(b.transferDate) - Date.parse(a.transferDate),
  );
}