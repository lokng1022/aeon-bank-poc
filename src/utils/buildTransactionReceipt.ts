import type { TFunction } from 'i18next';

import type { Transaction } from '@/types/transaction';
import {
  formatAmount,
  formatTransferDate,
} from '@/utils/formatters';

export function buildTransactionReceipt(
  transaction: Transaction,
  t: TFunction,
): string {
  const direction =
    transaction.amount >= 0
      ? t('transactions.incoming')
      : t('transactions.outgoing');

  return [
    t('receipt.heading'),
    '',
    `${t('receipt.referenceId')}: ${transaction.refId}`,
    `${t('receipt.transferName')}: ${transaction.transferName}`,
    `${t('receipt.recipient')}: ${transaction.recipientName}`,
    `${t('receipt.date')}: ${formatTransferDate(transaction.transferDate)} (UTC+08:00)`,
    `${t('receipt.amount')}: ${formatAmount(transaction.amount)}`,
    `${t('receipt.direction')}: ${direction}`,
  ].join('\n');
}