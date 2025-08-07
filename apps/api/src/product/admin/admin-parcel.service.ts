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
    if (filter.trackingNumber) where.trackingNumber = { contains: filter.trackingNumber };
    
    const parcels = await this.prisma.parcel.findMany({
      where,
      include: {
        order: { 
          select: { 
            orderNumber: true, 
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          } 
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.parcel.count({ where });

    return {
      data: parcels,
      total,
      page: filter.page || 1,
      limit: filter.limit || 10,
    };
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
