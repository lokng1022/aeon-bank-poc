import { mockTransactionsResponse } from '@/api/mockTransactions';

const MOCK_DELAY_MS = 450;

export async function fetchTransactions(): Promise<typeof mockTransactionsResponse> {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    
    return mockTransactionsResponse;
}