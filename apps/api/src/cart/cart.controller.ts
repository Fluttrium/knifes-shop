import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Корзина')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получить корзину пользователя' })
  @ApiResponse({ status: 200, description: 'Корзина получена успешно' })
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({ status: 201, description: 'Товар добавлен в корзину' })
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    console.log('Cart controller - user:', req.user);
    console.log('Cart controller - addToCartDto:', addToCartDto);
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Обновить количество товара в корзине' })
  @ApiResponse({ status: 200, description: 'Количество товара обновлено' })
  async updateCartItem(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, id, updateCartItemDto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiResponse({ status: 200, description: 'Товар удален из корзины' })
  async removeFromCart(@Request() req, @Param('id') id: string) {
    return this.cartService.removeFromCart(req.user.id, id);
  }

  @Delete()
  @ApiOperation({ summary: 'Очистить корзину' })
  @ApiResponse({ status: 200, description: 'Корзина очищена' })
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }

  @Get('count')
  @ApiOperation({ summary: 'Получить количество товаров в корзине' })
  @ApiResponse({ status: 200, description: 'Количество товаров получено' })
  async getCartItemCount(@Request() req) {
    return this.cartService.getCartItemCount(req.user.id);
  }
}
