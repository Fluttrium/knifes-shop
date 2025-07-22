export interface YooKassaPaymentRequest {
  amount: number;
  currency: string;
  description: string;
  orderId: string;
  returnUrl: string;
  capture: boolean;
  confirmation: {
    type: "redirect";
    returnUrl: string;
  };
  receipt?: {
    customer: {
      email: string;
    };
    items: Array<{
      description: string;
      quantity: string;
      amount: {
        value: string;
        currency: string;
      };
      vatCode: number;
      paymentSubject: string;
      paymentMode: string;
    }>;
  };
}

export interface YooKassaPaymentResponse {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  recipient: {
    accountId: string;
    gatewayId: string;
  };
  paymentMethod: {
    type: string;
    id: string;
    saved: boolean;
    title: string;
    login: string;
  };
  capturedAt?: string;
  createdAt: string;
  expiresAt: string;
  confirmation: {
    type: string;
    confirmationUrl: string;
  };
  test: boolean;
  paid: boolean;
  refundable: boolean;
  receiptRegistration: string;
  metadata: Record<string, unknown>;
}

export interface PaymentStatusResponse {
  id: string;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded";
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionId?: string;
  paymentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  customerEmail?: string;
  items?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export interface PaymentHistoryItem {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}
