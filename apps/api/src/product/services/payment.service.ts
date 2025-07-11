import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePaymentDto,
  YooKassaPaymentDto,
  PaymentResponseDto,
} from '../dto/payment.dto';

@Injectable()
export class PaymentService {
  private readonly yooKassaShopId: string;
  private readonly yooKassaSecretKey: string;
  private readonly yooKassaApiUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.yooKassaShopId = this.configService.get<string>('YOO_KASSA_SHOP_ID');
    this.yooKassaSecretKey = this.configService.get<string>(
      'YOO_KASSA_SECRET_KEY',
    );
    this.yooKassaApiUrl = this.configService.get<string>(
      'YOO_KASSA_API_URL',
      'https://api.yookassa.ru/v3',
    );
  }

  async createOrder(
    paymentData: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    // Проверка существования пользователя
    const user = await this.prisma.user.findUnique({
      where: { id: paymentData.userId },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверка существования адреса доставки
    const shippingAddress = await this.prisma.address.findUnique({
      where: { id: paymentData.shippingAddressId },
    });

    if (!shippingAddress) {
      throw new NotFoundException('Адрес доставки не найден');
    }

    // Проверка существования способа доставки
    const shippingMethod = await this.prisma.shippingMethod.findUnique({
      where: { id: paymentData.shippingMethodId },
    });

    if (!shippingMethod) {
      throw new NotFoundException('Способ доставки не найден');
    }

    // Получение товаров и расчет стоимости
    const orderItems = await Promise.all(
      paymentData.items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Товар с ID ${item.productId} не найден`);
        }

        if (!product.isActive) {
          throw new BadRequestException(`Товар ${product.name} неактивен`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Недостаточно товара ${product.name} на складе`,
          );
        }

        const variant = item.variantId
          ? await this.prisma.productVariant.findUnique({
              where: { id: item.variantId },
            })
          : null;

        if (item.variantId && !variant) {
          throw new NotFoundException(
            `Вариант товара с ID ${item.variantId} не найден`,
          );
        }

        const unitPrice = variant?.price || product.price;
        const totalPrice = Number(unitPrice) * item.quantity;

        return {
          product,
          variant,
          quantity: item.quantity,
          unitPrice: Number(unitPrice),
          totalPrice,
        };
      }),
    );

    // Расчет итоговой стоимости
    const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const shippingAmount = Number(shippingMethod.price);
    const totalAmount = subtotal + shippingAmount;

    // Создание заказа в базе данных
    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        userId: paymentData.userId,
        shippingAddressId: paymentData.shippingAddressId,
        subtotal,
        shippingAmount,
        totalAmount,
        notes: paymentData.notes,
        items: {
          create: orderItems.map((item) => ({
            productId: item.product.id,
            variantId: item.variant?.id,
            productName: item.product.name,
            productSku: item.product.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        shippingAddress: true,
      },
    });

    // Создание платежа в ЮKassa
    const yooKassaPayment = await this.createYooKassaPayment({
      orderId: order.id,
      amount: Math.round(totalAmount * 100), // Конвертация в копейки
      currency: 'RUB',
      description: `Заказ #${order.orderNumber} в магазине ножей`,
      email: order.user.email,
      phone: order.shippingAddress.phone,
      receipt: {
        customer: {
          email: order.user.email,
          phone: order.shippingAddress.phone,
        },
        items: orderItems.map((item) => ({
          description: item.product.name,
          quantity: item.quantity.toString(),
          amount: {
            value: item.unitPrice.toString(),
            currency: 'RUB',
          },
          vat_code: 1, // НДС 20%
          payment_subject: 'commodity',
          payment_mode: 'full_payment',
        })),
      },
    });

    return {
      paymentId: yooKassaPayment.id,
      status: yooKassaPayment.status,
      confirmationUrl: yooKassaPayment.confirmation?.confirmation_url,
      orderId: order.id,
    };
  }

  private async createYooKassaPayment(
    paymentData: YooKassaPaymentDto,
  ): Promise<any> {
    const auth = Buffer.from(
      `${this.yooKassaShopId}:${this.yooKassaSecretKey}`,
    ).toString('base64');

    const response = await fetch(`${this.yooKassaApiUrl}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Idempotence-Key': this.generateIdempotenceKey(),
      },
      body: JSON.stringify({
        amount: {
          value: paymentData.amount.toString(),
          currency: paymentData.currency,
        },
        capture: true,
        confirmation: {
          type: 'redirect',
          return_url: `${this.configService.get('FRONTEND_URL')}/payment/success`,
        },
        description: paymentData.description,
        receipt: paymentData.receipt,
        metadata: {
          orderId: paymentData.orderId,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new BadRequestException(
        `Ошибка создания платежа: ${error.description || 'Неизвестная ошибка'}`,
      );
    }

    return response.json();
  }

  async handlePaymentWebhook(paymentData: any): Promise<void> {
    // Проверка подписи webhook'а
    if (!this.verifyWebhookSignature(paymentData)) {
      throw new BadRequestException('Неверная подпись webhook');
    }

    const orderId = paymentData.object.metadata?.orderId;
    if (!orderId) {
      throw new BadRequestException('OrderId не найден в метаданных');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    // Обновление статуса заказа в зависимости от статуса платежа
    switch (paymentData.object.status) {
      case 'succeeded':
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'confirmed',
            paymentStatus: 'paid',
          },
        });

        // Уменьшение количества товаров на складе
        for (const item of order.items) {
          await this.prisma.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }
        break;

      case 'canceled':
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'cancelled',
            paymentStatus: 'failed',
          },
        });
        break;

      case 'pending':
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'pending',
          },
        });
        break;
    }
  }

  private verifyWebhookSignature(paymentData: any): boolean {
    // Здесь должна быть реализация проверки подписи webhook'а от ЮKassa
    // Для демонстрации возвращаем true
    return true;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    return `ORDER-${timestamp}-${random}`;
  }

  private generateIdempotenceKey(): string {
    return `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    const auth = Buffer.from(
      `${this.yooKassaShopId}:${this.yooKassaSecretKey}`,
    ).toString('base64');

    const response = await fetch(
      `${this.yooKassaApiUrl}/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new BadRequestException('Ошибка получения статуса платежа');
    }

    return response.json();
  }
}
