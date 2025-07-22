import {
  CreatePaymentDto,
  PaymentStatusResponse,
  YooKassaPaymentResponse,
  PaymentHistoryItem,
} from "./types/payment";
import instance from "./config";

export class PaymentService {
  // Создание платежа через YooKassa
  async createPayment(
    paymentData: CreatePaymentDto,
  ): Promise<YooKassaPaymentResponse> {
    const response = await instance.post<YooKassaPaymentResponse>(
      "/payments/create",
      paymentData,
    );
    console.log("✅ Payment created successfully");
    return response.data;
  }

  // Получение статуса платежа
  async getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await instance.get<PaymentStatusResponse>(
      `/payments/${paymentId}/status`,
    );
    return response.data;
  }

  // Подтверждение платежа (capture)
  async capturePayment(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await instance.post<PaymentStatusResponse>(
      `/payments/${paymentId}/capture`,
    );
    console.log("✅ Payment captured successfully");
    return response.data;
  }

  // Отмена платежа
  async cancelPayment(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await instance.post<PaymentStatusResponse>(
      `/payments/${paymentId}/cancel`,
    );
    console.log("✅ Payment cancelled successfully");
    return response.data;
  }

  // Возврат платежа
  async refundPayment(
    paymentId: string,
    amount?: number,
  ): Promise<PaymentStatusResponse> {
    const response = await instance.post<PaymentStatusResponse>(
      `/payments/${paymentId}/refund`,
      {
        amount,
      },
    );
    console.log("✅ Payment refunded successfully");
    return response.data;
  }

  // Получение истории платежей для заказа
  async getPaymentHistory(orderId: string): Promise<PaymentHistoryItem[]> {
    const response = await instance.get<PaymentHistoryItem[]>(
      `/payments/order/${orderId}/history`,
    );
    return response.data;
  }

  // Получение информации о платеже
  async getPaymentInfo(paymentId: string): Promise<PaymentStatusResponse> {
    const response = await instance.get<PaymentStatusResponse>(
      `/payments/${paymentId}`,
    );
    return response.data;
  }

  // Проверка доступности платежной системы
  async checkPaymentSystemStatus(): Promise<{
    status: string;
    message: string;
  }> {
    const response = await instance.get<{ status: string; message: string }>(
      "/payments/status",
    );
    return response.data;
  }

  // Получение URL для оплаты
  async getPaymentUrl(paymentId: string): Promise<{ paymentUrl: string }> {
    const response = await instance.get<{ paymentUrl: string }>(
      `/payments/${paymentId}/url`,
    );
    return response.data;
  }

  // Валидация платежных данных
  async validatePaymentData(
    paymentData: CreatePaymentDto,
  ): Promise<{ isValid: boolean; errors?: string[] }> {
    const response = await instance.post<{
      isValid: boolean;
      errors?: string[];
    }>("/payments/validate", paymentData);
    return response.data;
  }
}
