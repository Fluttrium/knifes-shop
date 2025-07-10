import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

export class AdminPaymentFilterDto {
  @ApiPropertyOptional({ description: 'ID заказа', example: 'uuid-order-id' })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiPropertyOptional({ description: 'ID пользователя', example: 'uuid-user-id' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Статус платежа', enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Метод оплаты', enum: PaymentMethod })
  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;
}

export class AdminUpdatePaymentStatusDto {
  @ApiProperty({ description: 'Новый статус платежа', enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiPropertyOptional({ description: 'Комментарий администратора', example: 'Оплата подтверждена вручную' })
  @IsOptional()
  @IsString()
  comment?: string;
} 