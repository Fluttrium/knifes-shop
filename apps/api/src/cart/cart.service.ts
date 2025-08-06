import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            images: true,
            variants: true,
          },
        },
        variant: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => {
      const price = Number(item.variant?.price || item.product.price);
      return sum + (price * item.quantity);
    }, 0);

    return {
      items: cartItems,
      totalItems,
      totalPrice,
    };
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    try {
      const { productId, variantId, quantity } = addToCartDto;

      console.log('Adding to cart:', { userId, productId, variantId, quantity });

      // Проверяем существование товара
      const product = await this.prisma.product.findUnique({
        where: { id: productId },
        include: { variants: true },
      });

      if (!product) {
        throw new NotFoundException('Товар не найден');
      }

      console.log('Product found:', product.name);

    // Если указан вариант, проверяем его существование
    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId);
      if (!variant) {
        throw new NotFoundException('Вариант товара не найден');
      }
      
      // Проверяем остаток на складе
      if (variant.stockQuantity < quantity) {
        throw new BadRequestException('Недостаточно товара на складе');
      }
    } else {
      // Проверяем остаток основного товара
      if (product.stockQuantity < quantity) {
        throw new BadRequestException('Недостаточно товара на складе');
      }
    }

    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      // Обновляем количество существующего товара
      const newQuantity = existingItem.quantity + quantity;
      
      // Проверяем остаток с учетом нового количества
      if (variantId) {
        const variant = product.variants.find(v => v.id === variantId);
        if (variant && variant.stockQuantity < newQuantity) {
          throw new BadRequestException('Недостаточно товара на складе');
        }
      } else {
        if (product.stockQuantity < newQuantity) {
          throw new BadRequestException('Недостаточно товара на складе');
        }
      }

      return this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
        include: {
          product: {
            include: {
              images: true,
              variants: true,
            },
          },
          variant: true,
        },
      });
    }

    // Создаем новый товар в корзине
    const cartItemData: any = {
      userId,
      productId,
      quantity,
    };

    // Добавляем variantId только если он указан
    if (variantId) {
      cartItemData.variantId = variantId;
    }

    return this.prisma.cartItem.create({
      data: cartItemData,
      include: {
        product: {
          include: {
            images: true,
            variants: true,
          },
        },
        variant: true,
      },
    });
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  }

  async updateCartItem(userId: string, itemId: string, updateCartItemDto: UpdateCartItemDto) {
    const { quantity } = updateCartItemDto;

    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: {
        product: {
          include: { variants: true },
        },
        variant: true,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар в корзине не найден');
    }

    // Проверяем остаток на складе
    if (cartItem.variantId) {
      const variant = cartItem.product.variants.find(v => v.id === cartItem.variantId);
      if (variant && variant.stockQuantity < quantity) {
        throw new BadRequestException('Недостаточно товара на складе');
      }
    } else {
      if (cartItem.product.stockQuantity < quantity) {
        throw new BadRequestException('Недостаточно товара на складе');
      }
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: {
        product: {
          include: {
            images: true,
            variants: true,
          },
        },
        variant: true,
      },
    });
  }

  async removeFromCart(userId: string, itemId: string) {
    const cartItem = await this.prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });

    if (!cartItem) {
      throw new NotFoundException('Товар в корзине не найден');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return { message: 'Товар удален из корзины' };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { message: 'Корзина очищена' };
  }

  async getCartItemCount(userId: string) {
    const result = await this.prisma.cartItem.aggregate({
      where: { userId },
      _sum: { quantity: true },
    });

    return { count: result._sum.quantity || 0 };
  }
} 