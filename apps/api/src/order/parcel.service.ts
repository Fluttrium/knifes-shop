import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParcelStatus } from '@prisma/client';

@Injectable()
export class ParcelService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создает посылку для заказа
   */
  async createParcelForOrder(
    orderId: string,
    carrier: string = 'Стандартная доставка',
  ) {
    return this.prisma.parcel.create({
      data: {
        orderId,
        status: 'created',
        carrier,
        comment: 'Заказ создан, ожидает обработки',
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

  /**
   * Обновляет статус посылки
   */
  async updateParcelStatus(
    parcelId: string,
    status: ParcelStatus,
    trackingNumber?: string,
    comment?: string,
  ) {
    const parcel = await this.prisma.parcel.findUnique({
      where: { id: parcelId },
    });

    if (!parcel) {
      throw new NotFoundException('Посылка не найдена');
    }

    const updateData: any = { status };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (comment) {
      updateData.comment = comment;
    }

    // Устанавливаем даты в зависимости от статуса
    if (status === 'shipped') {
      updateData.shippedAt = new Date();
    } else if (status === 'delivered') {
      updateData.deliveredAt = new Date();
    }

    return this.prisma.parcel.update({
      where: { id: parcelId },
      data: updateData,
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

  /**
   * Получает посылку по ID заказа
   */
  async getParcelByOrderId(orderId: string) {
    return this.prisma.parcel.findFirst({
      where: { orderId },
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

  /**
   * Получает все посылки с фильтрацией
   */
  async getAllParcels(filters: {
    status?: ParcelStatus;
    orderId?: string;
    trackingNumber?: string;
  }) {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.orderId) where.orderId = filters.orderId;
    if (filters.trackingNumber) {
      where.trackingNumber = { contains: filters.trackingNumber };
    }

    return this.prisma.parcel.findMany({
      where,
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
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Автоматически обновляет статус посылки при изменении статуса заказа
   */
  async updateParcelStatusByOrderStatus(orderId: string, orderStatus: string) {
    const parcel = await this.getParcelByOrderId(orderId);

    if (!parcel) {
      return null;
    }

    let newParcelStatus: ParcelStatus = 'created';
    let comment = '';

    switch (orderStatus) {
      case 'confirmed':
        newParcelStatus = 'ready';
        comment = 'Заказ подтвержден, готов к отправке';
        break;
      case 'processing':
        newParcelStatus = 'ready';
        comment = 'Заказ обрабатывается';
        break;
      case 'shipped':
        newParcelStatus = 'shipped';
        comment = 'Заказ отправлен';
        break;
      case 'delivered':
        newParcelStatus = 'delivered';
        comment = 'Заказ доставлен';
        break;
      case 'cancelled':
        newParcelStatus = 'cancelled';
        comment = 'Заказ отменен';
        break;
      default:
        return parcel;
    }

    return this.updateParcelStatus(
      parcel.id,
      newParcelStatus,
      undefined,
      comment,
    );
  }
}
