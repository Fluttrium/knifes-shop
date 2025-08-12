import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFiles,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProductAdminService } from './product-admin.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolProtected } from '../../auth/decorators/rol-protected.decorator';
import { ValidRoles } from '../../auth/interfaces/valid-roles';
import { UserRoleGuard } from '../../auth/guards/user-role/user-role.guard';

@ApiTags('Product Images')
@Controller('admin/products')
@UseGuards(JwtAuthGuard, UserRoleGuard)
@RolProtected(ValidRoles.admin)
export class ProductImagesController {
  constructor(private readonly productAdminService: ProductAdminService) {}

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  @ApiOperation({ summary: 'Загрузить изображения для продукта' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Изображения продукта (максимум 10 файлов)',
        },
      },
      required: ['images'],
    },
  })
  @ApiResponse({ status: 201, description: 'Изображения успешно загружены' })
  async uploadImages(
    @Param('id') productId: string,
    @UploadedFiles() files: any[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Изображения не предоставлены');
    }

    const result = await this.productAdminService.uploadProductImages(
      productId,
      files,
    );
    return {
      success: true,
      data: result.images,
    };
  }

  @Delete('images/:imageId')
  @ApiOperation({ summary: 'Удалить изображение продукта' })
  @ApiResponse({ status: 200, description: 'Изображение успешно удалено' })
  async deleteImage(@Param('imageId') imageId: string) {
    await this.productAdminService.deleteProductImage(imageId);
    return {
      success: true,
      message: 'Изображение успешно удалено',
    };
  }

  @Post(':id/images/reorder')
  @ApiOperation({ summary: 'Изменить порядок изображений продукта' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageIds: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Массив ID изображений в нужном порядке',
        },
      },
      required: ['imageIds'],
    },
  })
  @ApiResponse({ status: 200, description: 'Порядок изображений изменен' })
  async reorderImages(
    @Param('id') productId: string,
    @Body('imageIds') imageIds: string[],
  ) {
    if (!imageIds || imageIds.length === 0) {
      throw new BadRequestException('Список ID изображений не предоставлен');
    }

    const updatedProduct = await this.productAdminService.updateImageOrder(
      productId,
      imageIds,
    );
    return {
      success: true,
      data: updatedProduct,
    };
  }
}
