import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Платежи')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Создать платеж' })
  @ApiResponse({ status: 201, description: 'Платеж создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  async createPayment(
    @GetUser('id') userId: string,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentService.createPayment(createPaymentDto, userId);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Получить статус платежа' })
  @ApiResponse({ status: 200, description: 'Статус платежа получен' })
  @ApiResponse({ status: 404, description: 'Платеж не найден' })
  async getPaymentStatus(
    @GetUser('id') userId: string,
    @Param('id') paymentId: string,
  ) {
    return this.paymentService.getPaymentStatus(paymentId, userId);
  }

  @Get('config/check')
  @ApiOperation({
    summary: 'Проверить конфигурацию ЮKassa (только для отладки)',
  })
  @ApiResponse({ status: 200, description: 'Конфигурация проверена' })
  async checkYooKassaConfig() {
    return this.paymentService.checkYooKassaConfig();
  }
}
