import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';

interface YooKassaPaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  description: string;
  email: string;
  phone: string;
  receipt: {
    customer: {
      email: string;
      phone: string;
    };
    items: Array<{
      description: string;
      quantity: string;
      amount: {
        value: string;
        currency: string;
      };
      vat_code: number;
      payment_subject: string;
      payment_mode: string;
    }>;
  };
}

interface YooKassaPaymentResponse {
  id: string;
  status: string;
  paid: boolean;
  amount: {
    value: string;
    currency: string;
  };
  confirmation: {
    type: string;
    confirmation_url: string;
  };
  created_at: string;
  description: string;
  metadata: {
    orderId: string;
  };
}

@Injectable()
export class PaymentService {
  private readonly yooKassaShopId: string;
  private readonly yooKassaSecretKey: string;
  private readonly yooKassaApiUrl: string;

  constructor(private prisma: PrismaService) {
    this.yooKassaShopId = process.env.YOO_KASSA_SHOP_ID;
    this.yooKassaSecretKey = process.env.YOO_KASSA_SECRET_KEY;
    this.yooKassaApiUrl = process.env.YOO_KASSA_API_URL || 'https://api.yookassa.ru/v3';

    // Проверка наличия обязательных переменных
    if (!this.yooKassaShopId || !this.yooKassaSecretKey) {
      throw new Error('YooKassa credentials are not configured in environment variables');
    }

    // Проверка на тестовые значения
    if (
      this.yooKassaShopId === 'your-shop-id' ||
      this.yooKassaSecretKey === 'your-secret-key'
    ) {
      throw new Error(
        'YooKassa credentials are using default values. Please set proper environment variables.',
      );
    }
  }

  async createPayment(createPaymentDto: CreatePaymentDto, userId: string) {
    console.log('=== PaymentService.createPayment called ===');
    const { orderId, amount, currency, description } = createPaymentDto;

    // Проверяем заказ
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        shippingAddress: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    if (order.paymentStatus === 'paid') {
      throw new BadRequestException('Заказ уже оплачен');
    }

    // Проверяем обязательные поля для ЮKassa
    if (!order.user.email) {
      throw new BadRequestException('Email пользователя обязателен для оплаты');
    }

    if (!order.shippingAddress?.phone) {
      throw new BadRequestException('Номер телефона обязателен для оплаты');
    }

    // Валидируем и форматируем телефон
    const phone = this.formatPhoneForYooKassa(order.shippingAddress.phone);
    if (!phone) {
      throw new BadRequestException('Неверный формат номера телефона');
    }

    // Создаем платеж в базе данных
    const payment = await this.prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        currency,
        status: 'pending',
        method: 'card',
        comment: description,
      },
    });

    try {
      // Проверяем, настроены ли ключи ЮKassa
      console.log('YooKassa Shop ID:', this.yooKassaShopId);
      console.log('YooKassa Secret Key exists:', !!this.yooKassaSecretKey);
      console.log(
        'YooKassa Secret Key length:',
        this.yooKassaSecretKey?.length || 0,
      );
      console.log('YooKassa API URL:', this.yooKassaApiUrl);

      if (!this.yooKassaShopId || !this.yooKassaSecretKey) {
        throw new Error('YooKassa credentials not configured');
      }

      // Проверяем, что не используются дефолтные значения
      if (
        this.yooKassaShopId === 'your-shop-id' ||
        this.yooKassaSecretKey === 'your-secret-key'
      ) {
        throw new Error(
          'YooKassa credentials are using default values. Please set proper environment variables.',
        );
      }

      // Предупреждение о тестовом ключе в продакшене
      if (
        this.yooKassaSecretKey.startsWith('test_') &&
        process.env.NODE_ENV === 'production'
      ) {
        console.warn(
          '⚠️  WARNING: Using test YooKassa key in production environment!',
        );
      }

      // Создаем платеж в ЮKassa
      const yooKassaPayment = await this.createYooKassaPayment({
        orderId: payment.id,
        amount: Math.round(amount * 100), // Конвертация в копейки
        currency,
        description:
          description || `Заказ #${order.orderNumber} в магазине ножей`,
        email: order.user.email,
        phone: phone,
        receipt: {
          customer: {
            email: order.user.email,
            phone: phone,
          },
          items: order.items.map((item) => ({
            description: item.product.name,
            quantity: item.quantity.toString(),
            amount: {
              value: item.unitPrice.toString(),
              currency,
            },
            vat_code: 1, // НДС 20%
            payment_subject: 'commodity',
            payment_mode: 'full_payment',
          })),
        },
      });

      // Обновляем платеж с данными от ЮKassa
      const updatedPayment = await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          externalId: yooKassaPayment.id,
          status:
            yooKassaPayment.status === 'pending'
              ? PaymentStatus.pending
              : PaymentStatus.failed,
        },
      });

      return {
        ...updatedPayment,
        paymentUrl: yooKassaPayment.confirmation.confirmation_url,
      };
    } catch (error) {
      console.error('Error creating YooKassa payment:', error);

      // Если ошибка при создании платежа в ЮKassa, удаляем запись из БД
      await this.prisma.payment.delete({
        where: { id: payment.id },
      });
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string, userId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
        userId,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Платеж не найден');
    }

    if (payment.externalId) {
      try {
        // Получаем актуальный статус из ЮKassa
        const yooKassaPayment = await this.getYooKassaPayment(
          payment.externalId,
        );

        // Обновляем статус в базе данных
        const yooKassaStatus =
          yooKassaPayment.status === 'succeeded'
            ? PaymentStatus.paid
            : yooKassaPayment.status === 'pending'
              ? PaymentStatus.pending
              : PaymentStatus.failed;

        await this.prisma.payment.update({
          where: { id: paymentId },
          data: { status: yooKassaStatus },
        });

        payment.status = yooKassaStatus;
      } catch (error) {
        console.error('Ошибка при получении статуса платежа из ЮKassa:', error);
      }
    }

    return payment;
  }

  async handlePaymentWebhook(paymentData: any) {
    // Проверка подписи webhook'а
    if (!this.verifyWebhookSignature(paymentData)) {
      throw new BadRequestException('Неверная подпись webhook');
    }

    const paymentId = paymentData.object.metadata?.orderId;
    if (!paymentId) {
      throw new BadRequestException('PaymentId не найден в метаданных');
    }

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: { items: true },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Платеж не найден');
    }

    // Обновление статуса платежа и заказа
    switch (paymentData.object.status) {
      case 'succeeded':
        await this.prisma.$transaction(async (tx) => {
          // Обновляем статус платежа
          await tx.payment.update({
            where: { id: paymentId },
            data: { status: PaymentStatus.paid },
          });

          // Обновляем статус заказа
          await tx.order.update({
            where: { id: payment.orderId },
            data: {
              status: 'confirmed',
              paymentStatus: 'paid',
            },
          });

          // Уменьшаем количество товаров на складе
          for (const item of payment.order.items) {
            if (item.variantId) {
              await tx.productVariant.update({
                where: { id: item.variantId },
                data: {
                  stockQuantity: {
                    decrement: item.quantity,
                  },
                },
              });
            } else {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  stockQuantity: {
                    decrement: item.quantity,
                  },
                },
              });
            }
          }
        });
        break;

      case 'canceled':
        await this.prisma.payment.update({
          where: { id: paymentId },
          data: { status: PaymentStatus.failed },
        });
        break;

      case 'pending':
        await this.prisma.payment.update({
          where: { id: paymentId },
          data: { status: PaymentStatus.pending },
        });
        break;
    }
  }

  private async createYooKassaPayment(
    paymentData: YooKassaPaymentRequest,
  ): Promise<YooKassaPaymentResponse> {
    console.log('=== createYooKassaPayment called ===');

    // Получаем заказ для правильного URL возврата
    const order = await this.prisma.order.findUnique({
      where: { id: paymentData.orderId },
      select: { id: true },
    });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const returnUrl = order
      ? `${frontendUrl}/orders/${order.id}`

      : `${frontendUrl}/profile/orders`;
    // Логируем данные для авторизации
    const authString = `${this.yooKassaShopId}:${this.yooKassaSecretKey}`;
    const authBase64 = Buffer.from(authString).toString('base64');
    console.log('Auth string format check:', {
      shopId: this.yooKassaShopId,
      secretKeyFirst5: this.yooKassaSecretKey?.substring(0, 5) + '...',
      isTestKey: this.yooKassaSecretKey?.startsWith('test_'),
      authStringLength: authString.length,
      base64Length: authBase64.length,
    });

    const response = await fetch(`${this.yooKassaApiUrl}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authBase64}`,
        'Idempotence-Key': paymentData.orderId,
      },
      body: JSON.stringify({
        amount: {
          value: paymentData.amount.toString(),
          currency: paymentData.currency,
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: returnUrl,
        },
        description: paymentData.description,
        receipt: paymentData.receipt,
        metadata: {
          orderId: paymentData.orderId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('YooKassa API error:', error);
      throw new BadRequestException(
        `Ошибка создания платежа в ЮKassa: ${error}`,
      );
    }

    const result = await response.json();
    console.log('YooKassa payment created:', result);
    return result;
  }

  private async getYooKassaPayment(
    paymentId: string,
  ): Promise<YooKassaPaymentResponse> {
    const authBase64 = Buffer.from(
      `${this.yooKassaShopId}:${this.yooKassaSecretKey}`,
    ).toString('base64');
    const response = await fetch(
      `${this.yooKassaApiUrl}/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${authBase64}`,
        },
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Ошибка получения платежа из ЮKassa');
    }

    return response.json();
  }

  private verifyWebhookSignature(paymentData: any): boolean {
    // В реальном проекте здесь должна быть проверка подписи webhook'а
    // Для демонстрации возвращаем true
    return true;
  }

  private formatPhoneForYooKassa(phone: string): string | null {
    if (!phone) return null;

    // Очищаем от нецифровых символов
    const cleanedPhone = phone.replace(/\D/g, '');

    // Проверяем длину
    if (cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      return null;
    }

    // Если номер начинается с 8, заменяем на 7
    let formattedPhone = cleanedPhone;
    if (formattedPhone.startsWith('8') && formattedPhone.length === 11) {
      formattedPhone = '7' + formattedPhone.slice(1);
    }

    // Если номер начинается с 7 и имеет 11 цифр, добавляем +
    if (formattedPhone.startsWith('7') && formattedPhone.length === 11) {
      return `+${formattedPhone}`;
    }

    // Если номер имеет 10 цифр, добавляем +7
    if (formattedPhone.length === 10) {
      return `+7${formattedPhone}`;
    }

    // Если номер уже в международном формате
    if (formattedPhone.startsWith('+')) {
      return formattedPhone;
    }

    return null;
  }

  async checkYooKassaConfig() {
    return {
      shopId: this.yooKassaShopId,
      secretKeyExists: !!this.yooKassaSecretKey,
      secretKeyLength: this.yooKassaSecretKey?.length || 0,
      secretKeyPrefix: this.yooKassaSecretKey?.substring(0, 10) + '...',
      isTestKey: this.yooKassaSecretKey?.startsWith('test_'),
      apiUrl: this.yooKassaApiUrl,
      nodeEnv: process.env.NODE_ENV,
    };
  }
}
