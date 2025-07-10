import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentItemDto {
  @ApiProperty({
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({
    description: 'ID варианта товара',
    example: 'uuid-variant-id',
  })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiProperty({
    description: 'Количество товара',
    example: 2,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Цена за единицу товара',
    example: 4500.00,
  })
  @IsNumber()
  unitPrice: number;
}

export class CreatePaymentDto {
  @ApiProperty({
    description: 'ID пользователя',
    example: 'uuid-user-id',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'ID адреса доставки',
    example: 'uuid-address-id',
  })
  @IsUUID()
  shippingAddressId: string;

  @ApiProperty({
    description: 'ID способа доставки',
    example: 'uuid-shipping-method-id',
  })
  @IsUUID()
  shippingMethodId: string;

  @ApiPropertyOptional({
    description: 'ID купона для скидки',
    example: 'uuid-coupon-id',
  })
  @IsOptional()
  @IsUUID()
  couponId?: string;

  @ApiProperty({
    description: 'Товары в заказе',
    type: [PaymentItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentItemDto)
  items: PaymentItemDto[];

  @ApiPropertyOptional({
    description: 'Комментарий к заказу',
    example: 'Доставка до 18:00',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class YooKassaPaymentDto {
  @ApiProperty({
    description: 'ID заказа в системе',
    example: 'uuid-order-id',
  })
  @IsString()
  orderId: string;

  @ApiProperty({
    description: 'Сумма к оплате в копейках',
    example: 450000,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Валюта платежа',
    example: 'RUB',
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Описание платежа',
    example: 'Заказ #12345 в магазине ножей',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Email для отправки чека',
    example: 'user@example.com',
  })
  @IsString()
  email: string;

  @ApiPropertyOptional({
    description: 'Телефон для связи',
    example: '+79001234567',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Данные для чека',
    type: 'object',
  })
  receipt: {
    customer: {
      email: string;
      phone?: string;
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

export class PaymentResponseDto {
  @ApiProperty({
    description: 'ID платежа в ЮKassa',
    example: 'uuid-payment-id',
  })
  paymentId: string;

  @ApiProperty({
    description: 'Статус платежа',
    example: 'pending',
  })
  status: string;

  @ApiProperty({
    description: 'Ссылка для оплаты',
    example: 'https://yoomoney.ru/checkout/payments/v2/contract',
  })
  confirmationUrl?: string;

  @ApiProperty({
    description: 'ID заказа',
    example: 'uuid-order-id',
  })
  orderId: string;
} 