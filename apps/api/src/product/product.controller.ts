import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductEntity, ProductListResponse } from './entities/product.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Товары (Пользователь)')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить список товаров',
    description: 'Получение списка товаров с фильтрацией, поиском и пагинацией',
  })
  @ApiResponse({
    status: 200,
    description: 'Список товаров успешно получен',
    type: ProductListResponse,
  })
  async findAll(@Query() query: ProductQueryDto): Promise<ProductListResponse> {
    return this.productService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({
    summary: 'Получить рекомендуемые товары',
    description: 'Получение списка рекомендуемых товаров',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Количество товаров',
    example: 8,
  })
  @ApiResponse({
    status: 200,
    description: 'Рекомендуемые товары получены',
    type: [ProductEntity],
  })
  async getFeaturedProducts(
    @Query('limit') limit?: number,
  ): Promise<ProductEntity[]> {
    return this.productService.getFeaturedProducts(limit);
  }

  @Get('new')
  @ApiOperation({
    summary: 'Получить новые товары',
    description: 'Получение списка новых товаров',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Количество товаров',
    example: 8,
  })
  @ApiResponse({
    status: 200,
    description: 'Новые товары получены',
    type: [ProductEntity],
  })
  async getNewProducts(
    @Query('limit') limit?: number,
  ): Promise<ProductEntity[]> {
    return this.productService.getNewProducts(limit);
  }

  @Get('sale')
  @ApiOperation({
    summary: 'Получить товары на распродаже',
    description: 'Получение списка товаров на распродаже',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Количество товаров',
    example: 8,
  })
  @ApiResponse({
    status: 200,
    description: 'Товары на распродаже получены',
    type: [ProductEntity],
  })
  async getOnSaleProducts(
    @Query('limit') limit?: number,
  ): Promise<ProductEntity[]> {
    return this.productService.getOnSaleProducts(limit);
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Получить товар по slug',
    description: 'Получение подробной информации о товаре по его slug',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug товара',
    example: 'chef-knife-santoku-18cm',
  })
  @ApiResponse({
    status: 200,
    description: 'Товар успешно найден',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async findBySlug(@Param('slug') slug: string): Promise<ProductEntity> {
    return this.productService.findBySlug(slug);
  }

  @Get(':id/related')
  @ApiOperation({
    summary: 'Получить похожие товары',
    description: 'Получение списка похожих товаров из той же категории',
  })
  @ApiParam({
    name: 'id',
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Количество товаров',
    example: 4,
  })
  @ApiResponse({
    status: 200,
    description: 'Похожие товары получены',
    type: [ProductEntity],
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async getRelatedProducts(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('limit') limit?: number,
  ): Promise<ProductEntity[]> {
    return this.productService.getRelatedProducts(id, limit);
  }

  @Get(':id/stock')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Проверить наличие товара',
    description: 'Проверка наличия товара на складе (требует авторизации)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  @ApiQuery({
    name: 'quantity',
    required: true,
    description: 'Количество для проверки',
    example: 2,
  })
  @ApiResponse({
    status: 200,
    description: 'Проверка выполнена',
    schema: {
      type: 'object',
      properties: {
        available: {
          type: 'boolean',
          example: true,
        },
        stockQuantity: {
          type: 'number',
          example: 15,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async checkStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('quantity') quantity: number,
  ): Promise<{ available: boolean; stockQuantity: number }> {
    const available = await this.productService.checkStockAvailability(
      id,
      quantity,
    );
    const product = await this.productService.findOne(id);
    return {
      available,
      stockQuantity: product.stockQuantity,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить товар по ID',
    description: 'Получение подробной информации о товаре по его ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Товар успешно найден',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductEntity> {
    return this.productService.findOne(id);
  }
}
