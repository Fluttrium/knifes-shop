import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    // Получаем корзину пользователя
    const cart = await this.cartService.getCart(userId);
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Корзина пуста');
    }

    // Проверяем адрес доставки
    const shippingAddress = await this.prisma.address.findFirst({
      where: {
        id: createOrderDto.shippingAddressId,
        userId,
      },
    });

    if (!shippingAddress) {
      throw new NotFoundException('Адрес доставки не найден');
    }

    // Проверяем наличие товаров
    for (const cartItem of cart.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: cartItem.productId },
        include: { variants: true },
      });

      if (!product) {
        throw new NotFoundException(`Товар с ID ${cartItem.productId} не найден`);
      }

      if (cartItem.variantId) {
        const variant = product.variants.find(v => v.id === cartItem.variantId);
        if (!variant) {
          throw new NotFoundException(`Вариант товара с ID ${cartItem.variantId} не найден`);
        }
        if (variant.stockQuantity < cartItem.quantity) {
          throw new BadRequestException(`Недостаточно товара ${product.name} (вариант: ${variant.name})`);
        }
      } else {
        if (product.stockQuantity < cartItem.quantity) {
          throw new BadRequestException(`Недостаточно товара ${product.name}`);
        }
      }
    }

    // Рассчитываем стоимость
    let subtotal = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: cartItem.productId },
        include: { variants: true },
      });

      const variant = cartItem.variantId 
        ? product.variants.find(v => v.id === cartItem.variantId)
        : null;

      const unitPrice = Number(variant?.price || product.price);
      const totalPrice = unitPrice * cartItem.quantity;
      subtotal += totalPrice;

      orderItems.push({
        productId: cartItem.productId,
        variantId: cartItem.variantId,
        productName: product.name,
        productSku: variant?.sku || product.sku,
        quantity: cartItem.quantity,
        unitPrice,
        totalPrice,
      });
    }

    // Создаем заказ
    const order = await this.prisma.order.create({
      data: {
        orderNumber: this.generateOrderNumber(),
        userId,
        shippingAddressId: createOrderDto.shippingAddressId,
        subtotal,
        totalAmount: subtotal, // Пока без налогов и доставки
        notes: createOrderDto.notes,
        items: {
          create: orderItems,
        },
      },
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
      },
    });

    // Очищаем корзину
    await this.cartService.clearCart(userId);

    return order;
  }

  async getOrders(userId: string, query: OrderQueryDto) {
    const { page = 1, limit = 10, status, orderNumber, startDate, endDate, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: any = { userId };

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
          payments: {
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

  async getOrderById(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
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

  async getOrderByNumber(userId: string, orderNumber: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        orderNumber,
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
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

  async cancelOrder(userId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Можно отменить только заказы в статусе "Ожидает"');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'cancelled' },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        shippingAddress: true,
      },
    });
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
} 