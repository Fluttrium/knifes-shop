import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto, PaymentResponseDto } from '../dto/payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Платежи')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Создать заказ и платеж',
    description: 'Создание заказа и инициализация платежа через ЮKassa',
  })
  @ApiResponse({
    status: 201,
    description: 'Заказ и платеж созданы успешно',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных или недостаточно товара',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь, адрес или товар не найден',
  })
  async createPayment(
    @Body() createPaymentDto: CreatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.paymentService.createOrder(createPaymentDto);
  }

  @Get('status/:paymentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Получить статус платежа',
    description: 'Получение текущего статуса платежа из ЮKassa',
  })
  @ApiParam({
    name: 'paymentId',
    description: 'ID платежа в ЮKassa',
    example: 'uuid-payment-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус платежа получен',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: 'uuid-payment-id',
        },
        status: {
          type: 'string',
          example: 'succeeded',
        },
        amount: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              example: '4500.00',
            },
            currency: {
              type: 'string',
              example: 'RUB',
            },
          },
        },
        created_at: {
          type: 'string',
          example: '2024-01-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка получения статуса платежа',
  })
  async getPaymentStatus(@Param('paymentId') paymentId: string): Promise<any> {
    return this.paymentService.getPaymentStatus(paymentId);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook от ЮKassa',
    description: 'Обработка webhook уведомлений от ЮKassa о статусе платежа',
  })
  @ApiResponse({
    status: 200,
    description: 'Webhook обработан успешно',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка обработки webhook',
  })
  async handleWebhook(@Body() webhookData: any): Promise<void> {
    return this.paymentService.handlePaymentWebhook(webhookData);
  }
}
