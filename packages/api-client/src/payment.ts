import {
  Payment,
  CreatePaymentDto,
  PaymentStatusResponse,
  AdminPaymentFilterDto,
  AdminUpdatePaymentStatusDto,
} from "./types/payment";
import instance from "./config";

export class PaymentService {
  async createPayment(paymentData: CreatePaymentDto): Promise<Payment> {
    const response = await instance.post<Payment>("/payments", paymentData);
    return response.data;
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await instance.get<PaymentStatusResponse>(
      `/payments/${paymentId}/status`,
    );
    return response.data;
  }

  // Admin methods
  async getAllPaymentsAdmin(
    filter?: AdminPaymentFilterDto,
  ): Promise<Payment[]> {
    const response = await instance.get<Payment[]>("/admin/payments", {
      params: filter,
    });
    return response.data;
  }

  async getPaymentByIdAdmin(paymentId: string): Promise<Payment> {
    const response = await instance.get<Payment>(
      `/admin/payments/${paymentId}`,
    );
    return response.data;
  }

  async updatePaymentStatusAdmin(
    paymentId: string,
    data: AdminUpdatePaymentStatusDto,
  ): Promise<Payment> {
    const response = await instance.patch<Payment>(
      `/admin/payments/${paymentId}/status`,
      data,
    );
    return response.data;
  }

  async getPaymentHistoryByOrderAdmin(orderId: string): Promise<Payment[]> {
    const response = await instance.get<Payment[]>(
      `/admin/payments/order/${orderId}`,
    );
    return response.data;
  }
}
