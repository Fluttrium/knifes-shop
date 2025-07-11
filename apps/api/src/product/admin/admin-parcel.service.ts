import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AdminParcelFilterDto,
  AdminUpdateParcelStatusDto,
} from '../dto/admin-parcel.dto';
import { ParcelStatus } from '@prisma/client';

@Injectable()
export class AdminParcelService {
  constructor(private prisma: PrismaService) {}

  async findAll(filter: AdminParcelFilterDto) {
    const where: any = {};
    if (filter.orderId) where.orderId = filter.orderId;
    if (filter.status) where.status = filter.status;
    return this.prisma.parcel.findMany({
      where,
      include: {
        order: { select: { orderNumber: true, userId: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id },
      include: {
        order: true,
      },
    });
    if (!parcel) throw new NotFoundException('Отправление не найдено');
    return parcel;
  }

  async updateStatus(id: string, dto: AdminUpdateParcelStatusDto) {
    const parcel = await this.prisma.parcel.findUnique({ where: { id } });
    if (!parcel) throw new NotFoundException('Отправление не найдено');
    return this.prisma.parcel.update({
      where: { id },
      data: {
        status: dto.status,
        trackingNumber: dto.trackingNumber,
        comment: dto.comment,
      },
    });
  }

  async getHistoryByOrder(orderId: string) {
    return this.prisma.parcel.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
