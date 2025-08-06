import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: 'ID товара' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'ID варианта товара (опционально)', required: false })
  @IsOptional()
  @IsString()
  variantId?: string;

  @ApiProperty({ description: 'Количество товара', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity: number;
} 