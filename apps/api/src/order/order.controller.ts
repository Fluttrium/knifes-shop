import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';

@ApiTags('Заказы')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Создать заказ' })
  @ApiResponse({ status: 201, description: 'Заказ успешно создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  async createOrder(
    @GetUser('id') userId: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.createOrder(userId, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список заказов пользователя' })
  @ApiResponse({ status: 200, description: 'Список заказов получен' })
  async getOrders(
    @GetUser('id') userId: string,
    @Query() query: OrderQueryDto,
  ) {
    return this.orderService.getOrders(userId, query);
  }

  @Get('number/:orderNumber')
  @ApiOperation({ summary: 'Получить заказ по номеру' })
  @ApiResponse({ status: 200, description: 'Заказ найден' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async getOrderByNumber(
    @GetUser('id') userId: string,
    @Param('orderNumber') orderNumber: string,
  ) {
    return this.orderService.getOrderByNumber(userId, orderNumber);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiResponse({ status: 200, description: 'Заказ найден' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async getOrderById(
    @GetUser('id') userId: string,
    @Param('id') orderId: string,
  ) {
    return this.orderService.getOrderById(userId, orderId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Отменить заказ' })
  @ApiResponse({ status: 200, description: 'Заказ отменен' })
  @ApiResponse({ status: 400, description: 'Заказ нельзя отменить' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  async cancelOrder(
    @GetUser('id') userId: string,
    @Param('id') orderId: string,
  ) {
    return this.orderService.cancelOrder(userId, orderId);
  }
} 