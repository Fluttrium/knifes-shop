import {
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsString,
  IsNumber,
  Min,
} from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  @IsOptional()
  currency?: string = 'RUB';

  @IsString()
  @IsOptional()
  description?: string;
}
