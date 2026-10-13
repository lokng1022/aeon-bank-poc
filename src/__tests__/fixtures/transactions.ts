import type { Transaction } from '@/types/transaction';

export const salary: Transaction = {
  refId: '123ABC',
  transferDate: '2024-10-15T12:34:56Z',
  recipientName: 'John Doe',
  transferName: 'Salary Payment',
  amount: 1500,
};

export const refund: Transaction = {
  refId: '789GHI',
  transferDate: '2024-10-05T16:18:30Z',
  recipientName: 'Robert Brown',
  transferName: 'Refund',
  amount: -500,
};