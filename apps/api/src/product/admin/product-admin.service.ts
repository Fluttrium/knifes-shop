import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { UploadService } from '../../upload/upload.service';
import type { Multer } from 'multer';

@Injectable()
export class ProductAdminService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new ConflictException('Товар с таким slug уже существует');
    }

    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingSku) {
      throw new ConflictException('Товар с таким SKU уже существует');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    const { images, ...productData } = createProductDto;

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        images: images
          ? {
              create: images,
            }
          : undefined,
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
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return product as ProductEntity;
  }

  async findAll(
    query: any,
  ): Promise<{ products: ProductEntity[]; total: number }> {
    const { page = 1, limit = 20, search, categoryId, isActive } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

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
          _count: {
            select: {
              orderItems: true,
              reviews: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products as ProductEntity[],
      total,
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
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
            cartItems: true,
            wishlistItems: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product as ProductEntity;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug: updateProductDto.slug },
      });

      if (existingProduct) {
        throw new ConflictException('Товар с таким slug уже существует');
      }
    }

    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });

      if (existingSku) {
        throw new ConflictException('Товар с таким SKU уже существует');
      }
    }

    if (updateProductDto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: updateProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Категория не найдена');
      }
    }

    const { images, ...productData } = updateProductDto;

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(images && {
          images: {
            deleteMany: {},
            create: images,
          },
        }),
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
          orderBy: { sortOrder: 'asc' },
        },
        variants: {
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: {
            orderItems: true,
            reviews: true,
            cartItems: true,
            wishlistItems: true,
          },
        },
      },
    });

    return updatedProduct as ProductEntity;
  }

  async remove(id: string): Promise<void> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            orderItems: true,
            cartItems: true,
            wishlistItems: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    if (product._count.orderItems > 0) {
      throw new BadRequestException(
        'Нельзя удалить товар, который используется в заказах',
      );
    }

    await this.prisma.$transaction([
      this.prisma.cartItem.deleteMany({
        where: { productId: id },
      }),
      this.prisma.wishlistItem.deleteMany({
        where: { productId: id },
      }),
      this.prisma.review.deleteMany({
        where: { productId: id },
      }),
      this.prisma.productImage.deleteMany({
        where: { productId: id },
      }),
      this.prisma.productVariant.deleteMany({
        where: { productId: id },
      }),
      this.prisma.product.delete({
        where: { id },
      }),
    ]);
  }

  async updateStock(id: string, quantity: number): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    if (quantity < 0) {
      throw new BadRequestException('Количество не может быть отрицательным');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { stockQuantity: quantity },
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
    });

    return updatedProduct as ProductEntity;
  }

  async toggleStatus(
    id: string,
    field: 'isActive' | 'isFeatured' | 'isNew' | 'isOnSale',
  ): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: { [field]: !product[field] },
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
    });

    return updatedProduct as ProductEntity;
  }

  async getStatistics(): Promise<{
    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;
    outOfStockProducts: number;
  }> {
    const [
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.product.count({
        where: {
          stockQuantity: {
            lte: 5,
            gt: 0,
          },
        },
      }),
      this.prisma.product.count({
        where: {
          stockQuantity: 0,
        },
      }),
    ]);

    return {
      totalProducts,
      activeProducts,
      lowStockProducts,
      outOfStockProducts,
    };
  }

  async uploadProductImages(
    productId: string,
    files: any[],
  ): Promise<{ success: boolean; images: any[] }> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    try {
      // Загружаем файлы в S3
      const imageUrls = await this.uploadService.uploadMultipleFiles(
        files,
        `products/${productId}`,
      );

      // Создаем записи изображений в базе данных
      const imageData = imageUrls.map((url, index) => ({
        productId,
        url,
        alt: files[index].originalname,
        isPrimary: index === 0, // Первое изображение становится основным
        sortOrder: index,
      }));

      const createdImages = await this.prisma.productImage.createMany({
        data: imageData,
      });

      // Получаем созданные изображения
      const images = await this.prisma.productImage.findMany({
        where: { productId },
        orderBy: { sortOrder: 'asc' },
      });

      return {
        success: true,
        images,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Ошибка загрузки изображений: ${errorMessage}`,
      );
    }
  }

  async deleteProductImage(imageId: string): Promise<void> {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException('Изображение не найдено');
    }

    try {
      // Удаляем файл из S3
      await this.uploadService.deleteFile(image.url);

      // Удаляем запись из базы данных
      await this.prisma.productImage.delete({
        where: { id: imageId },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Ошибка удаления изображения: ${errorMessage}`,
      );
    }
  }

  async updateImageOrder(
    productId: string,
    imageIds: string[],
  ): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    // Обновляем порядок изображений
    const updatePromises = imageIds.map((imageId, index) =>
      this.prisma.productImage.update({
        where: { id: imageId, productId },
        data: { sortOrder: index, isPrimary: index === 0 },
      }),
    );

    await Promise.all(updatePromises);

    // Получаем обновленный продукт
    const updatedProduct = await this.prisma.product.findUnique({
      where: { id: productId },
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
    });

    return updatedProduct as ProductEntity;
  }
}
