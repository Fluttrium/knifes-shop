import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AdminPaymentFilterDto,
  AdminUpdatePaymentStatusDto,
} from '../dto/admin-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class AdminPaymentService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: AdminPaymentFilterDto) {
    const where: any = {};
    if (filter.orderId) where.orderId = filter.orderId;
    if (filter.userId) where.userId = filter.userId;
    if (filter.status) where.status = filter.status;
    if (filter.method) where.method = filter.method;
    return this.prisma.payment.findMany({
      where,
      include: {
        order: { select: { orderNumber: true, userId: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: true,
        user: true,
      },
    });
    if (!payment) throw new NotFoundException('Платеж не найден');
    return payment;
  }

  async updateStatus(id: string, dto: AdminUpdatePaymentStatusDto) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Платеж не найден');
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: dto.status,
        comment: dto.comment,
      },
    });
  }

  async getHistoryByOrder(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
