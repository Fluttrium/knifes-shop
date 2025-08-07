import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OrderQueryDto } from '../dto/order-query.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderAdminService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders(query: OrderQueryDto) {
    const { page = 1, limit = 10, status, orderNumber, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = {};

    if (status) where.status = status;
    if (orderNumber) where.orderNumber = { contains: orderNumber, mode: 'insensitive' };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
          shippingAddress: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          parcels: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getOrderById(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        payments: {
          orderBy: { createdAt: 'desc' },
        },
        parcels: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        shippingAddress: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        payments: true,
        parcels: true,
      },
    });
  }

  async createParcel(orderId: string, createParcelDto: { trackingNumber: string; carrier: string; comment?: string }) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    // Проверяем, есть ли уже отправление для этого заказа
    const existingParcel = await this.prisma.parcel.findFirst({
      where: { orderId },
    });

    if (existingParcel) {
      // Обновляем существующее отправление
      return this.prisma.parcel.update({
        where: { id: existingParcel.id },
        data: {
          trackingNumber: createParcelDto.trackingNumber,
          carrier: createParcelDto.carrier,
          comment: createParcelDto.comment,
          status: 'shipped',
          shippedAt: new Date(),
        },
        include: {
          order: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    } else {
      // Создаем новое отправление
      return this.prisma.parcel.create({
        data: {
          orderId,
          trackingNumber: createParcelDto.trackingNumber,
          carrier: createParcelDto.carrier,
          comment: createParcelDto.comment,
          status: 'shipped',
          shippedAt: new Date(),
        },
        include: {
          order: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }
  }

  async getOrderStatistics() {
    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      todayOrders,
      todayRevenue,
    ] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { status: 'pending' } }),
      this.prisma.order.count({ where: { status: 'confirmed' } }),
      this.prisma.order.count({ where: { status: 'shipped' } }),
      this.prisma.order.count({ where: { status: 'delivered' } }),
      this.prisma.order.count({ where: { status: 'cancelled' } }),
      this.prisma.order.aggregate({
        where: { status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] } },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      this.prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          status: { in: ['confirmed', 'processing', 'shipped', 'delivered'] },
        },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      todayOrders,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
    };
  }
} 