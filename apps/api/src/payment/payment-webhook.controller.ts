import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentService } from './payment.service';

@ApiTags('Webhooks')
@Controller('webhooks/payment')
export class PaymentWebhookController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('yookassa')
  @ApiOperation({ summary: 'Webhook от ЮKassa' })
  @ApiResponse({ status: 200, description: 'Webhook обработан' })
  @ApiResponse({ status: 400, description: 'Ошибка обработки webhook' })
  async handleYooKassaWebhook(
    @Body() paymentData: any,
    @Headers('x-yookassa-signature') signature?: string,
  ) {
    // В реальном проекте здесь должна быть проверка подписи
    // if (!this.verifySignature(signature, paymentData)) {
    //   throw new BadRequestException('Неверная подпись webhook');
    // }

    await this.paymentService.handlePaymentWebhook(paymentData);

    return { success: true };
  }
}
