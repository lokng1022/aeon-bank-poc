export interface Transaction {
    refId: string;
    transferDate: string;
    recipientName: string;
    transferName: string;
    amount: number;
}

export interface TransactionResponse {
    data: Transaction[];
}

export type TransactionDirection = 'incoming' | 'outgoing';