export interface PaymentTransaction {
    id: string;
    merchantId: string;
    merchantKey: string;
    amount: number;
    itemName: string;
    itemDescription?: string;
    emailAddress: string;
    nameFirst: string;
    nameLast: string;
    cellNumber?: string;
    status: PaymentStatus;
    paymentId?: string;
    pfPaymentId?: string;
    paymentDate: Date;
    createdAt: Date;
}

export const PaymentStatus = {
    PENDING: 'pending',
    COMPLETE: 'complete',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export interface PayFastConfig {
    merchantId: string;
    merchantKey: string;
    passphrase: string;
    sandbox: boolean; // true for testing, false for production
}

export interface PayFastPaymentRequest {
    merchant_id: string;
    merchant_key: string;
    return_url: string;
    cancel_url: string;
    notify_url: string;
    name_first: string;
    name_last: string;
    email_address: string;
    cell_number?: string;
    m_payment_id: string;
    amount: string;
    item_name: string;
    item_description?: string;
    custom_int1?: number;
    custom_str1?: string;
    signature?: string;
}

export interface PayFastNotification {
    m_payment_id: string;
    pf_payment_id: string;
    payment_status: 'COMPLETE' | 'FAILED' | 'CANCELLED';
    item_name: string;
    item_description: string;
    amount_gross: string;
    amount_fee: string;
    amount_net: string;
    signature: string;
}

export interface TutoringPackage {
    id: string;
    name: string;
    description: string;
    sessions: number;
    pricePerSession: number;
    totalPrice: number;
    duration: string; // e.g., "1 hour", "90 minutes"
    subjects: string[];
    features: string[];
}
