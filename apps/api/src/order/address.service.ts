import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateAddressDto {
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateAddressDto extends Partial<CreateAddressDto> {}

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async getAddresses(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async getAddressById(userId: string, addressId: string) {
    const address = await this.prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      throw new NotFoundException('Адрес не найден');
    }

    return address;
  }

  async createAddress(userId: string, createAddressDto: CreateAddressDto) {
    const { isDefault, ...addressData } = createAddressDto;

    // Если новый адрес должен быть по умолчанию, сбрасываем флаг у других адресов
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...addressData,
        userId,
        isDefault: isDefault || false,
      },
    });
  }

  async updateAddress(
    userId: string,
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.getAddressById(userId, addressId);
    const { isDefault, ...addressData } = updateAddressDto;

    // Если адрес становится по умолчанию, сбрасываем флаг у других адресов
    if (isDefault) {
      await this.prisma.address.updateMany({
        where: {
          userId,
          id: { not: addressId },
        },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id: addressId },
      data: {
        ...addressData,
        isDefault: isDefault !== undefined ? isDefault : address.isDefault,
      },
    });
  }

  async deleteAddress(userId: string, addressId: string) {
    const address = await this.getAddressById(userId, addressId);

    // Проверяем, не используется ли адрес в заказах
    const ordersWithAddress = await this.prisma.order.findFirst({
      where: {
        shippingAddressId: addressId,
        userId,
      },
    });

    if (ordersWithAddress) {
      throw new BadRequestException(
        'Нельзя удалить адрес, который используется в заказах',
      );
    }

    await this.prisma.address.delete({
      where: { id: addressId },
    });

    return { message: 'Адрес успешно удален' };
  }

  async setDefaultAddress(userId: string, addressId: string) {
    await this.getAddressById(userId, addressId);

    // Сбрасываем флаг по умолчанию у всех адресов пользователя
    await this.prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Устанавливаем новый адрес по умолчанию
    return this.prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }
}
