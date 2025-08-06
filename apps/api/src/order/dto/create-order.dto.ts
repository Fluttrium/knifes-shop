import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  shippingAddressId: string;

  @IsString()
  @IsOptional()
  notes?: string;
} 