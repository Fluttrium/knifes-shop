export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  status: "pending" | "paid" | "failed" | "refunded";
  method: "card" | "cash" | "bank_transfer";
  amount: number;
  currency: string;
  externalId?: string;
  comment?: string;
  paymentUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentDto {
  orderId: string;
  amount: number;
  currency?: string;
  description?: string;
}

export interface PaymentStatusResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
  paymentUrl?: string;
  order: {
    id: string;
    orderNumber: string;
    status: string;
    totalAmount: number;
  };
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

// Admin types
export interface AdminPaymentFilterDto {
  orderId?: string;
  userId?: string;
  status?: string;
  method?: string;
  page?: number;
  limit?: number;
}

export interface AdminUpdatePaymentStatusDto {
  status: "pending" | "paid" | "failed" | "refunded";
  comment?: string;
}
