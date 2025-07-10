import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType, Material, HandleType } from '@prisma/client';

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Страница для пагинации',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Количество товаров на странице',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Поиск по названию или описанию',
    example: 'шеф-нож',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'ID категории для фильтрации',
    example: 'uuid-category-id',
  })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Тип товара для фильтрации',
    enum: ProductType,
  })
  @IsOptional()
  @IsEnum(ProductType)
  productType?: ProductType;

  @ApiPropertyOptional({
    description: 'Материал для фильтрации',
    enum: Material,
  })
  @IsOptional()
  @IsEnum(Material)
  material?: Material;

  @ApiPropertyOptional({
    description: 'Тип рукояти для фильтрации',
    enum: HandleType,
  })
  @IsOptional()
  @IsEnum(HandleType)
  handleType?: HandleType;

  @ApiPropertyOptional({
    description: 'Минимальная цена',
    example: 1000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Максимальная цена',
    example: 10000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Только активные товары',
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    description: 'Только рекомендуемые товары',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Только новые товары',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isNew?: boolean;

  @ApiPropertyOptional({
    description: 'Только товары на распродаже',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isOnSale?: boolean;

  @ApiPropertyOptional({
    description: 'Поле для сортировки',
    example: 'price',
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Порядок сортировки',
    example: 'desc',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
} 