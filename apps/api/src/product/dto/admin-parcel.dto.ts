import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ParcelStatus } from '@prisma/client';

export class AdminParcelFilterDto {
  @ApiPropertyOptional({ description: 'ID заказа', example: 'uuid-order-id' })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @ApiPropertyOptional({ description: 'Статус отправления', enum: ParcelStatus })
  @IsOptional()
  @IsEnum(ParcelStatus)
  status?: ParcelStatus;
}

export class AdminUpdateParcelStatusDto {
  @ApiProperty({ description: 'Новый статус отправления', enum: ParcelStatus })
  @IsEnum(ParcelStatus)
  status: ParcelStatus;

  @ApiPropertyOptional({ description: 'Трек-номер', example: 'RU123456789CN' })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({ description: 'Комментарий администратора', example: 'Отправлено через СДЭК' })
  @IsOptional()
  @IsString()
  comment?: string;
} 