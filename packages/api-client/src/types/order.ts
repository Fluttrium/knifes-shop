export interface Address {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded";
  paymentMethod: "yookassa" | "card" | "cash";
  transactionId?: string;
  paymentUrl?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Parcel {
  id: string;
  orderId: string;
  trackingNumber?: string;
  carrier: string;
  status: "pending" | "shipped" | "delivered" | "returned" | "lost";
  shippedAt?: Date;
  deliveredAt?: Date;
  estimatedDelivery?: Date;
  weight?: number;
  dimensions?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productVariantId?: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  shippingAddressId: string;
  billingAddressId: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: "yookassa" | "card" | "cash";
  notes?: string;
  items: OrderItem[];
  payment?: Payment;
  parcel?: Parcel;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDto {
  items: Array<{
    productId: string;
    productVariantId?: string;
    quantity: number;
  }>;
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: "yookassa" | "card" | "cash";
  notes?: string;
}

export interface OrderQueryDto {
  page?: number;
  limit?: number;
  status?: string;
  userId?: string;
  orderNumber?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "totalAmount" | "orderNumber";
  sortOrder?: "asc" | "desc";
}

export interface OrderResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentQueryDto {
  page?: number;
  limit?: number;
  status?: string;
  orderId?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "amount";
  sortOrder?: "asc" | "desc";
}

export interface ParcelQueryDto {
  page?: number;
  limit?: number;
  status?: string;
  orderId?: string;
  carrier?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "createdAt" | "shippedAt";
  sortOrder?: "asc" | "desc";
}

export interface UpdatePaymentDto {
  status:
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded";
  transactionId?: string;
  notes?: string;
}

export interface UpdateParcelDto {
  trackingNumber?: string;
  carrier?: string;
  status: "pending" | "shipped" | "delivered" | "returned" | "lost";
  shippedAt?: Date;
  deliveredAt?: Date;
  estimatedDelivery?: Date;
  weight?: number;
  dimensions?: string;
  notes?: string;
}
