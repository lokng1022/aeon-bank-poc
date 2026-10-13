import type { Transaction } from '@/types/transaction';

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isUtcTimestamp(value: unknown): value is string {
  if (typeof value !== 'string') {
    return false;
  }

  // The assessment supplies ISO timestamps in UTC, ending in Z.
  const pattern =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

  if (!pattern.test(value)) {
    return false;
  }

  const date = new Date(value);

  // Reject invalid dates and calendar values that JS normalizes.
  return (
    Number.isFinite(date.getTime()) &&
    date.toISOString().slice(0, 19) === value.slice(0, 19)
  );
}

export function parseTransactions(
  response: unknown,
): readonly Transaction[] {
  if (!isRecord(response) || !Array.isArray(response.data)) {
    throw new Error('INVALID_TRANSACTION_RESPONSE');
  }

  const references = new Set<string>();

  return response.data.map((value: unknown): Transaction => {
    if (
      !isRecord(value) ||
      !isNonEmptyString(value.refId) ||
      !isUtcTimestamp(value.transferDate) ||
      !isNonEmptyString(value.recipientName) ||
      !isNonEmptyString(value.transferName) ||
      typeof value.amount !== 'number' ||
      !Number.isFinite(value.amount) ||
      references.has(value.refId)
    ) {
      throw new Error('INVALID_TRANSACTION_RESPONSE');
    }

    references.add(value.refId);

    return {
      refId: value.refId,
      transferDate: value.transferDate,
      recipientName: value.recipientName,
      transferName: value.transferName,
      amount: value.amount,
    };
  });
}