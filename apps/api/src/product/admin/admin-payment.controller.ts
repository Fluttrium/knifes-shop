import {
  Controller,
  Get,
  Param,
  Query,
  Patch,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminPaymentService } from './admin-payment.service';
import {
  AdminPaymentFilterDto,
  AdminUpdatePaymentStatusDto,
} from '../dto/admin-payment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { RolProtected } from 'src/auth/decorators/rol-protected.decorator';
import { Role } from '@prisma/client';

@ApiTags('Платежи (Админ)')
@ApiBearerAuth()
@Controller('admin/payments')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@RolProtected(Role.admin)
export class AdminPaymentController {
  constructor(private readonly paymentService: AdminPaymentService) {}

  @Get()
  @ApiOperation({
    summary: 'Список платежей',
    description: 'Получить список платежей с фильтрацией',
  })
  @ApiQuery({ name: 'orderId', required: false, description: 'ID заказа' })
  @ApiQuery({ name: 'userId', required: false, description: 'ID пользователя' })
  @ApiQuery({ name: 'status', required: false, description: 'Статус платежа' })
  @ApiQuery({ name: 'method', required: false, description: 'Метод оплаты' })
  @ApiResponse({ status: 200, description: 'Список платежей' })
  async findAll(@Query() filter: AdminPaymentFilterDto) {
    return this.paymentService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Детали платежа',
    description: 'Получить детали платежа по ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID платежа',
    example: 'uuid-payment-id',
  })
  @ApiResponse({ status: 200, description: 'Детали платежа' })
  @ApiResponse({ status: 404, description: 'Платеж не найден' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({
    summary: 'Изменить статус платежа',
    description: 'Изменить статус и комментарий платежа',
  })
  @ApiParam({
    name: 'id',
    description: 'ID платежа',
    example: 'uuid-payment-id',
  })
  @ApiResponse({ status: 200, description: 'Статус платежа обновлен' })
  @ApiResponse({ status: 404, description: 'Платеж не найден' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdatePaymentStatusDto,
  ) {
    return this.paymentService.updateStatus(id, dto);
  }

  @Get('order/:orderId')
  @ApiOperation({
    summary: 'История платежей заказа',
    description: 'Получить историю платежей по заказу',
  })
  @ApiParam({
    name: 'orderId',
    description: 'ID заказа',
    example: 'uuid-order-id',
  })
  @ApiResponse({ status: 200, description: 'История платежей' })
  async getHistoryByOrder(@Param('orderId', ParseUUIDPipe) orderId: string) {
    return this.paymentService.getHistoryByOrder(orderId);
  }
}
