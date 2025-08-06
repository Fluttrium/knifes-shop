import { Controller, Get, Patch, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRoleGuard } from '../../auth/guards/user-role/user-role.guard';
import { RolProtected } from '../../auth/decorators/rol-protected.decorator';
import { Role, OrderStatus } from '@prisma/client';
import { OrderAdminService } from './order-admin.service';
import { OrderQueryDto } from '../dto/order-query.dto';
import { IsEnum } from 'class-validator';

class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

@ApiTags('Админ - Заказы')
@Controller('admin/orders')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@ApiBearerAuth()
export class OrderAdminController {
  constructor(private readonly orderAdminService: OrderAdminService) {}

  @Get()
  @RolProtected(Role.admin)
  @ApiOperation({ summary: 'Получить все заказы (админ)' })
  @ApiResponse({ status: 200, description: 'Список заказов получен' })
  async getAllOrders(@Query() query: OrderQueryDto) {
    return this.orderAdminService.getAllOrders(query);
  }

  @Get('statistics')
  @RolProtected(Role.admin)
  @ApiOperation({ summary: 'Получить статистику заказов (админ)' })
  @ApiResponse({ status: 200, description: 'Статистика получена' })
  async getOrderStatistics() {
    return this.orderAdminService.getOrderStatistics();
  }

  @Get(':id')
  @RolProtected(Role.admin)
  @ApiOperation({ summary: 'Получить заказ по ID (админ)' })
  @ApiResponse({ status: 200, description: 'Заказ найден' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async getOrderById(@Param('id') orderId: string) {
    return this.orderAdminService.getOrderById(orderId);
  }

  @Patch(':id/status')
  @RolProtected(Role.admin)
  @ApiOperation({ summary: 'Обновить статус заказа (админ)' })
  @ApiResponse({ status: 200, description: 'Статус заказа обновлен' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.orderAdminService.updateOrderStatus(orderId, updateOrderStatusDto.status);
  }
} 