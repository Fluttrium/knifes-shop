import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CategoryEntity } from './entities/product.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolProtected } from 'src/auth/decorators/rol-protected.decorator';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// DTO для создания категории
class CreateCategoryDto {
  name: string;
  slug: string;
  sortOrder?: number;
  isActive?: boolean;
}

// DTO для обновления категории
class UpdateCategoryDto {
  name?: string;
  slug?: string;
  sortOrder?: number;
  isActive?: boolean;
}

@ApiTags('Категории')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly productService: ProductService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Получить все категории',
    description: 'Получение списка всех активных категорий',
  })
  @ApiResponse({
    status: 200,
    description: 'Список категорий получен',
    type: [CategoryEntity],
  })
  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
    }));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Получить категорию по ID',
    description: 'Получение информации о категории по её ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID категории',
    example: 'uuid-category-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Категория найдена',
    type: CategoryEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'Категория не найдена',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<CategoryEntity> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Категория не найдена');
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
  }

  @Get(':id/products')
  @ApiOperation({
    summary: 'Получить товары категории',
    description: 'Получение всех товаров в категории',
  })
  @ApiParam({
    name: 'id',
    description: 'ID категории',
    example: 'uuid-category-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Товары категории получены',
    type: [CategoryEntity],
  })
  async getCategoryProducts(@Param('id', ParseUUIDPipe) id: string) {
    const products = await this.prisma.product.findMany({
      where: { 
        categoryId: id,
        isActive: true 
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
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }
}

@ApiTags('Категории (Админ)')
@ApiBearerAuth()
@Controller('admin/categories')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@RolProtected(Role.admin)
export class CategoryAdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @ApiOperation({
    summary: 'Создать категорию',
    description: 'Создание новой категории (только для администраторов)',
  })
  @ApiResponse({
    status: 201,
    description: 'Категория успешно создана',
    type: CategoryEntity,
  })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryEntity> {
    const category = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        slug: createCategoryDto.slug,
        sortOrder: createCategoryDto.sortOrder || 0,
        isActive: createCategoryDto.isActive !== undefined ? createCategoryDto.isActive : true,
      },
    });

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Обновить категорию',
    description: 'Обновление информации о категории (только для администраторов)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID категории',
    example: 'uuid-category-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Категория успешно обновлена',
    type: CategoryEntity,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    const updateData: any = {};
    
    if (updateCategoryDto.name !== undefined) {
      updateData.name = updateCategoryDto.name;
    }
    if (updateCategoryDto.slug !== undefined) {
      updateData.slug = updateCategoryDto.slug;
    }
    if (updateCategoryDto.sortOrder !== undefined) {
      updateData.sortOrder = updateCategoryDto.sortOrder;
    }
    if (updateCategoryDto.isActive !== undefined) {
      updateData.isActive = updateCategoryDto.isActive;
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: updateData,
    });

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Удалить категорию',
    description: 'Удаление категории (только для администраторов)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID категории',
    example: 'uuid-category-id',
  })
  @ApiResponse({
    status: 200,
    description: 'Категория успешно удалена',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Категория успешно удалена' };
  }
} 