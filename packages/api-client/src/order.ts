import {
  Order,
  OrderResponse,
  CreateOrderDto,
  OrderQueryDto,
  Payment,
  Parcel,
  PaymentQueryDto,
  ParcelQueryDto,
  UpdatePaymentDto,
  UpdateParcelDto,
  Address,
} from "./types/order";
import instance from "./config";

export class OrderService {
  // Пользовательские методы
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const response = await instance.post<Order>("/orders", orderData);
    console.log("✅ Order created successfully");
    return response.data;
  }

  async getOrders(query?: OrderQueryDto): Promise<OrderResponse> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await instance.get<OrderResponse>(`/orders?${params.toString()}`);
    return response.data;
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await instance.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order> {
    const response = await instance.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  }

  async cancelOrder(id: string): Promise<Order> {
    const response = await instance.patch<Order>(`/orders/${id}/cancel`);
    console.log("✅ Order cancelled successfully");
    return response.data;
  }

  // Адреса
  async getAddresses(): Promise<Address[]> {
    const response = await instance.get<Address[]>("/orders/addresses");
    return response.data;
  }

  async getAddressById(id: string): Promise<Address> {
    const response = await instance.get<Address>(`/orders/addresses/${id}`);
    return response.data;
  }

  async createAddress(addressData: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    const response = await instance.post<Address>("/orders/addresses", addressData);
    console.log("✅ Address created successfully");
    return response.data;
  }

  async updateAddress(id: string, addressData: Partial<Address>): Promise<Address> {
    const response = await instance.patch<Address>(`/orders/addresses/${id}`, addressData);
    console.log("✅ Address updated successfully");
    return response.data;
  }

  async deleteAddress(id: string): Promise<{ message: string }> {
    const response = await instance.delete(`/orders/addresses/${id}`);
    console.log("✅ Address deleted successfully");
    return response.data;
  }

  // Админские методы
  async getAllOrdersAdmin(query?: OrderQueryDto): Promise<OrderResponse> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await instance.get<OrderResponse>(`/admin/orders?${params.toString()}`);
    return response.data;
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const response = await instance.patch<Order>(`/admin/orders/${id}/status`, { status });
    console.log("✅ Order status updated successfully");
    return response.data;
  }

  // Платежи (админ)
  async getPayments(query?: PaymentQueryDto): Promise<{ data: Payment[]; total: number; page: number; limit: number }> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await instance.get(`/admin/payments?${params.toString()}`);
    return response.data;
  }

  async getPaymentById(id: string): Promise<Payment> {
    const response = await instance.get<Payment>(`/admin/payments/${id}`);
    return response.data;
  }

  async updatePayment(id: string, paymentData: UpdatePaymentDto): Promise<Payment> {
    const response = await instance.patch<Payment>(`/admin/payments/${id}`, paymentData);
    console.log("✅ Payment updated successfully");
    return response.data;
  }

  async getPaymentHistory(orderId: string): Promise<Payment[]> {
    const response = await instance.get<Payment[]>(`/admin/payments/order/${orderId}/history`);
    return response.data;
  }

  // Посылки (админ)
  async getParcels(query?: ParcelQueryDto): Promise<{ data: Parcel[]; total: number; page: number; limit: number }> {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await instance.get(`/admin/parcels?${params.toString()}`);
    return response.data;
  }

  async getParcelById(id: string): Promise<Parcel> {
    const response = await instance.get<Parcel>(`/admin/parcels/${id}`);
    return response.data;
  }

  async createParcel(orderId: string, parcelData: Omit<Parcel, 'id' | 'orderId' | 'createdAt' | 'updatedAt'>): Promise<Parcel> {
    const response = await instance.post<Parcel>(`/admin/parcels`, { ...parcelData, orderId });
    console.log("✅ Parcel created successfully");
    return response.data;
  }

  async updateParcel(id: string, parcelData: UpdateParcelDto): Promise<Parcel> {
    const response = await instance.patch<Parcel>(`/admin/parcels/${id}`, parcelData);
    console.log("✅ Parcel updated successfully");
    return response.data;
  }

  async deleteParcel(id: string): Promise<{ message: string }> {
    const response = await instance.delete(`/admin/parcels/${id}`);
    console.log("✅ Parcel deleted successfully");
    return response.data;
  }

  async getParcelHistory(orderId: string): Promise<Parcel[]> {
    const response = await instance.get<Parcel[]>(`/admin/parcels/order/${orderId}/history`);
    return response.data;
  }
} 