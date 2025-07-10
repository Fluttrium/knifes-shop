import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType, Material, HandleType } from '@prisma/client';

export class ProductImageEntity {
  @ApiProperty({
    description: 'ID изображения',
    example: 'uuid-image-id',
  })
  id: string;

  @ApiProperty({
    description: 'URL изображения',
    example: 'https://example.com/image.jpg',
  })
  url: string;

  @ApiPropertyOptional({
    description: 'Alt текст для изображения',
    example: 'Шеф-нож Santoku',
  })
  alt?: string;

  @ApiProperty({
    description: 'Является ли изображение основным',
    example: true,
  })
  isPrimary: boolean;

  @ApiProperty({
    description: 'Порядок сортировки',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'Дата создания',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}

export class CategoryEntity {
  @ApiProperty({
    description: 'ID категории',
    example: 'uuid-category-id',
  })
  id: string;

  @ApiProperty({
    description: 'Название категории',
    example: 'Кухонные ножи',
  })
  name: string;

  @ApiProperty({
    description: 'Slug категории',
    example: 'kitchen-knives',
  })
  slug: string;
}

export class ProductEntity {
  @ApiProperty({
    description: 'ID товара',
    example: 'uuid-product-id',
  })
  id: string;

  @ApiProperty({
    description: 'Название товара',
    example: 'Шеф-нож Santoku 18см',
  })
  name: string;

  @ApiProperty({
    description: 'URL-дружественное название товара',
    example: 'chef-knife-santoku-18cm',
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'Подробное описание товара',
    example: 'Профессиональный шеф-нож Santoku с лезвием 18см...',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Краткое описание товара',
    example: 'Профессиональный шеф-нож для кухни',
  })
  shortDescription?: string;

  @ApiProperty({
    description: 'Артикул товара (SKU)',
    example: 'KNIFE-001',
  })
  sku: string;

  @ApiProperty({
    description: 'Цена товара',
    example: 4500.00,
  })
  price: any; // Prisma Decimal type

  @ApiPropertyOptional({
    description: 'Цена для сравнения (зачеркнутая цена)',
    example: 5500.00,
  })
  comparePrice?: any; // Prisma Decimal type

  @ApiPropertyOptional({
    description: 'Себестоимость товара',
    example: 3000.00,
  })
  costPrice?: any; // Prisma Decimal type

  @ApiPropertyOptional({
    description: 'Вес товара в граммах',
    example: 250.0,
  })
  weight?: any; // Prisma Decimal type

  @ApiPropertyOptional({
    description: 'Размеры товара (ДxШxВ в см)',
    example: '18x3x2',
  })
  dimensions?: string;

  @ApiProperty({
    description: 'Количество товара на складе',
    example: 15,
  })
  stockQuantity: number;

  @ApiProperty({
    description: 'Минимальный уровень запасов',
    example: 5,
  })
  minStockLevel: number;

  @ApiPropertyOptional({
    description: 'Максимальный уровень запасов',
    example: 100,
  })
  maxStockLevel?: number;

  @ApiProperty({
    description: 'Тип товара',
    enum: ProductType,
    example: ProductType.knife,
  })
  productType: ProductType;

  @ApiPropertyOptional({
    description: 'Материал товара',
    enum: Material,
    example: Material.stainless_steel,
  })
  material?: Material;

  @ApiPropertyOptional({
    description: 'Тип рукояти',
    enum: HandleType,
    example: HandleType.fixed,
  })
  handleType?: HandleType;

  @ApiPropertyOptional({
    description: 'Длина лезвия в см',
    example: 18.0,
  })
  bladeLength?: any; // Prisma Decimal type

  @ApiPropertyOptional({
    description: 'Общая длина в см',
    example: 30.0,
  })
  totalLength?: any; // Prisma Decimal type

  @ApiPropertyOptional({
    description: 'Твердость лезвия по шкале HRC',
    example: 58,
  })
  bladeHardness?: number;

  @ApiProperty({
    description: 'Активен ли товар',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Рекомендуемый товар',
    example: false,
  })
  isFeatured: boolean;

  @ApiProperty({
    description: 'Новый товар',
    example: false,
  })
  isNew: boolean;

  @ApiProperty({
    description: 'Товар на распродаже',
    example: false,
  })
  isOnSale: boolean;

  @ApiProperty({
    description: 'Порядок сортировки',
    example: 0,
  })
  sortOrder: number;

  @ApiPropertyOptional({
    description: 'Meta title для SEO',
    example: 'Шеф-нож Santoku - Купить в интернет-магазине',
  })
  metaTitle?: string;

  @ApiPropertyOptional({
    description: 'Meta description для SEO',
    example: 'Профессиональный шеф-нож Santoku с лезвием 18см...',
  })
  metaDescription?: string;

  @ApiProperty({
    description: 'Дата создания',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Дата обновления',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Категория товара',
    type: CategoryEntity,
  })
  category: CategoryEntity;

  @ApiProperty({
    description: 'Изображения товара',
    type: [ProductImageEntity],
  })
  images: ProductImageEntity[];
}

export class ProductListResponse {
  @ApiProperty({
    description: 'Список товаров',
    type: [ProductEntity],
  })
  products: ProductEntity[];

  @ApiProperty({
    description: 'Общее количество товаров',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Текущая страница',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Количество товаров на странице',
    example: 20,
  })
  limit: number;

  @ApiProperty({
    description: 'Общее количество страниц',
    example: 5,
  })
  totalPages: number;
} 