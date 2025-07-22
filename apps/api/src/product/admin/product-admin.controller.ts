import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductAdminService } from './product-admin.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolProtected } from 'src/auth/decorators/rol-protected.decorator';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { Role } from '@prisma/client';

@ApiTags('Товары (Админ)')
@ApiBearerAuth()
@Controller('admin/products')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@RolProtected(Role.admin)
export class ProductAdminController {
  constructor(private readonly productAdminService: ProductAdminService) {}

  @Post()
  @ApiOperation({
    summary: 'Создать товар',
    description: 'Создание нового товара (только для администраторов)',
  })
  @ApiResponse({
    status: 201,
    description: 'Товар успешно создан',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных',
  })
  @ApiResponse({
    status: 409,
    description: 'Товар с таким slug или SKU уже существует',
  })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productAdminService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить список товаров',
    description:
      'Получение списка товаров для администраторов с расширенной информацией',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Номер страницы',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Количество товаров на странице',
    example: 20,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Поиск по названию, описанию или SKU',
    example: 'шеф-нож',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'ID категории для фильтрации',
    example: 'uuid-category-id',
  })
  @ApiQuery({
    name: 'isActive',
    required: false,
    description: 'Фильтр по активности товара',
    example: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Список товаров получен',
    schema: {
      type: 'object',
      properties: {
        products: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductEntity' },
        },
        total: {
          type: 'number',
          example: 100,
        },
      },
    },
  })
  async findAll(
    @Query() query: any,
    @Res({ passthrough: true }) res: any,
  ): Promise<{ products: ProductEntity[]; total: number }> {
    // Отключаем кэширование
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });
    return this.productAdminService.findAll(query);
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'Получить статистику товаров',
    description: 'Получение статистики по товарам для администраторов',
  })
  @ApiResponse({
    status: 200,
    description: 'Статистика получена',
    schema: {
      type: 'object',
      properties: {
        totalProducts: {
          type: 'number',
          example: 150,
        },
        activeProducts: {
          type: 'number',
          example: 120,
        },
        lowStockProducts: {
          type: 'number',
          example: 10,
        },
        outOfStockProducts: {
          type: 'number',
          example: 5,
        },
      },
    },
  })
  async getStatistics(): Promise<{
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  }> {
    return this.productAdminService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить товар по ID',
    description: 'Получение подробной информации о товаре для администраторов',
  })
  @ApiParam({
    name: 'id',
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Товар найден',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductEntity> {
    return this.productAdminService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить товар',
    description: 'Обновление информации о товаре (только для администраторов)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Товар успешно обновлен',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  @ApiResponse({
    status: 409,
    description: 'Товар с таким slug или SKU уже существует',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return this.productAdminService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @ApiOperation({
    summary: 'Обновить количество товара на складе',
    description:
      'Обновление количества товара на складе (только для администраторов)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Количество товара обновлено',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Количество не может быть отрицательным',
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('quantity', ParseIntPipe) quantity: number,
  ): Promise<ProductEntity> {
    return this.productAdminService.updateStock(id, quantity);
  }

  @Patch(':id/toggle/:field')
  @ApiOperation({
    summary: 'Переключить статус товара',
    description:
      'Переключение статуса товара (активность, рекомендуемый, новый, распродажа)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  @ApiParam({
    name: 'field',
    description: 'Поле для переключения',
    example: 'isActive',
    enum: ['isActive', 'isFeatured', 'isNew', 'isOnSale'],
  })
  @ApiResponse({
    status: 200,
    description: 'Статус товара переключен',
    type: ProductEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async toggleStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('field') field: 'isActive' | 'isFeatured' | 'isNew' | 'isOnSale',
  ): Promise<ProductEntity> {
    return this.productAdminService.toggleStatus(id, field);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить товар',
    description:
      'Удаление товара (только для администраторов). Товар не может быть удален, если используется в заказах.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Товар успешно удален',
  })
  @ApiResponse({
    status: 400,
    description: 'Нельзя удалить товар, который используется в заказах',
  })
  @ApiResponse({
    status: 404,
    description: 'Товар не найден',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.productAdminService.remove(id);
  }
}
