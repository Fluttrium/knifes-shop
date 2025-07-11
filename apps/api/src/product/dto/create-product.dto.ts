import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsEnum,
  Min,
  Max,
  IsDecimal,
  IsUUID,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductType, Material, HandleType } from '@prisma/client';

export class CreateProductImageDto {
  @ApiProperty({
    description: 'URL изображения товара',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  url: string;

  @ApiPropertyOptional({
    description: 'Alt текст для изображения',
    example: 'Шеф-нож Santoku',
  })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional({
    description: 'Является ли изображение основным',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description: 'Порядок сортировки изображений',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class CreateProductDto {
  @ApiProperty({
    description: 'Название товара',
    example: 'Шеф-нож Santoku 18см',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'URL-дружественное название товара',
    example: 'chef-knife-santoku-18cm',
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'Подробное описание товара',
    example: 'Профессиональный шеф-нож Santoku с лезвием 18см...',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Краткое описание товара',
    example: 'Профессиональный шеф-нож для кухни',
  })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({
    description: 'Артикул товара (SKU)',
    example: 'KNIFE-001',
  })
  @IsString()
  sku: string;

  @ApiProperty({
    description: 'Цена товара',
    example: 4500.0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Цена для сравнения (зачеркнутая цена)',
    example: 5500.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  comparePrice?: number;

  @ApiPropertyOptional({
    description: 'Себестоимость товара',
    example: 3000.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({
    description: 'Вес товара в граммах',
    example: 250.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({
    description: 'Размеры товара (ДxШxВ в см)',
    example: '18x3x2',
  })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiProperty({
    description: 'Количество товара на складе',
    example: 15,
  })
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @ApiPropertyOptional({
    description: 'Минимальный уровень запасов',
    default: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minStockLevel?: number;

  @ApiPropertyOptional({
    description: 'Максимальный уровень запасов',
    example: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxStockLevel?: number;

  @ApiProperty({
    description: 'Тип товара',
    enum: ProductType,
    example: ProductType.knife,
  })
  @IsEnum(ProductType)
  productType: ProductType;

  @ApiPropertyOptional({
    description: 'Материал товара',
    enum: Material,
    example: Material.stainless_steel,
  })
  @IsOptional()
  @IsEnum(Material)
  material?: Material;

  @ApiPropertyOptional({
    description: 'Тип рукояти',
    enum: HandleType,
    example: HandleType.fixed,
  })
  @IsOptional()
  @IsEnum(HandleType)
  handleType?: HandleType;

  @ApiPropertyOptional({
    description: 'Длина лезвия в см',
    example: 18.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bladeLength?: number;

  @ApiPropertyOptional({
    description: 'Общая длина в см',
    example: 30.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalLength?: number;

  @ApiPropertyOptional({
    description: 'Твердость лезвия по шкале HRC',
    example: 58,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(70)
  bladeHardness?: number;

  @ApiPropertyOptional({
    description: 'Активен ли товар',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Рекомендуемый товар',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Новый товар',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isNew?: boolean;

  @ApiPropertyOptional({
    description: 'Товар на распродаже',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isOnSale?: boolean;

  @ApiPropertyOptional({
    description: 'Порядок сортировки',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    description: 'Meta title для SEO',
    example: 'Шеф-нож Santoku - Купить в интернет-магазине',
  })
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta description для SEO',
    example: 'Профессиональный шеф-нож Santoku с лезвием 18см...',
  })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({
    description: 'ID категории товара',
    example: 'uuid-category-id',
  })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({
    description: 'Изображения товара',
    type: [CreateProductImageDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images?: CreateProductImageDto[];
}
