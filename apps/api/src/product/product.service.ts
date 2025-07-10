import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductEntity, ProductListResponse } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto): Promise<ProductListResponse> {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      productType,
      material,
      handleType,
      minPrice,
      maxPrice,
      isActive = true,
      isFeatured,
      isNew,
      isOnSale,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    // Построение условий фильтрации
    const where: any = {
      isActive,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (productType) {
      where.productType = productType;
    }

    if (material) {
      where.material = material;
    }

    if (handleType) {
      where.handleType = handleType;
    }

    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice };
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice };
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (isNew !== undefined) {
      where.isNew = isNew;
    }

    if (isOnSale !== undefined) {
      where.isOnSale = isOnSale;
    }

    // Получение товаров с пагинацией
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      products: products as ProductEntity[],
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            reviews: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product as ProductEntity;
  }

  async findBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
        reviews: {
          where: { isActive: true },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            reviews: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product as ProductEntity;
  }

  async getFeaturedProducts(limit: number = 8): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          where: { isPrimary: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });

    return products as ProductEntity[];
  }

  async getNewProducts(limit: number = 8): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isNew: true,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          where: { isPrimary: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return products as ProductEntity[];
  }

  async getOnSaleProducts(limit: number = 8): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isOnSale: true,
        comparePrice: {
          not: null,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          where: { isPrimary: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });

    return products as ProductEntity[];
  }

  async getRelatedProducts(productId: string, limit: number = 4): Promise<ProductEntity[]> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { categoryId: true },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    const relatedProducts = await this.prisma.product.findMany({
      where: {
        isActive: true,
        categoryId: product.categoryId,
        id: { not: productId },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          where: { isPrimary: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });

    return relatedProducts as ProductEntity[];
  }

  async checkStockAvailability(productId: string, quantity: number): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { stockQuantity: true },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product.stockQuantity >= quantity;
  }

  async updateStockQuantity(productId: string, quantity: number, operation: 'add' | 'subtract'): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      select: { stockQuantity: true },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    const newQuantity = operation === 'add' 
      ? product.stockQuantity + quantity 
      : product.stockQuantity - quantity;

    if (newQuantity < 0) {
      throw new BadRequestException('Недостаточно товара на складе');
    }

    await this.prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: newQuantity },
    });
  }
} 