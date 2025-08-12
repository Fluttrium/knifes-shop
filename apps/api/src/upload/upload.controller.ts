import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Delete,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolProtected } from '../auth/decorators/rol-protected.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { UserRoleGuard } from '../auth/guards/user-role/user-role.guard';
import {
  UploadFileDto,
  UploadMultipleFilesDto,
  PresignedUrlDto,
} from './dto/upload-file.dto';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('single')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @RolProtected(ValidRoles.admin)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузить один файл' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        folder: {
          type: 'string',
          description: 'Папка для загрузки (опционально)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Файл успешно загружен' })
  async uploadSingleFile(
    @UploadedFile() file: any,
    @Body() uploadFileDto: UploadFileDto,
  ) {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    const fileUrl = await this.uploadService.uploadFile(
      file,
      uploadFileDto.folder,
    );
    return {
      success: true,
      data: {
        url: fileUrl,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
    };
  }

  @Post('multiple')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @RolProtected(ValidRoles.admin)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiOperation({ summary: 'Загрузить несколько файлов' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
        folder: {
          type: 'string',
          description: 'Папка для загрузки (опционально)',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Файлы успешно загружены' })
  async uploadMultipleFiles(
    @UploadedFiles() files: any[],
    @Body() uploadMultipleFilesDto: UploadMultipleFilesDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Файлы не предоставлены');
    }

    const fileUrls = await this.uploadService.uploadMultipleFiles(
      files,
      uploadMultipleFilesDto.folder,
    );
    const fileData = files.map((file, index) => ({
      url: fileUrls[index],
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    }));

    return {
      success: true,
      data: fileData,
    };
  }

  @Delete(':fileUrl')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @RolProtected(ValidRoles.admin)
  @ApiOperation({ summary: 'Удалить файл' })
  @ApiResponse({ status: 200, description: 'Файл успешно удален' })
  async deleteFile(@Param('fileUrl') fileUrl: string) {
    await this.uploadService.deleteFile(decodeURIComponent(fileUrl));
    return {
      success: true,
      message: 'Файл успешно удален',
    };
  }

  @Post('presigned-url')
  @UseGuards(JwtAuthGuard, UserRoleGuard)
  @RolProtected(ValidRoles.admin)
  @ApiOperation({ summary: 'Получить presigned URL для загрузки' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description: 'Ключ файла в S3',
        },
        expiresIn: {
          type: 'number',
          description: 'Время жизни URL в секундах (по умолчанию 3600)',
        },
      },
      required: ['key'],
    },
  })
  @ApiResponse({ status: 200, description: 'Presigned URL получен' })
  async getPresignedUrl(@Body() presignedUrlDto: PresignedUrlDto) {
    const presignedUrl = await this.uploadService.getPresignedUrl(
      presignedUrlDto.key,
      presignedUrlDto.expiresIn,
    );
    return {
      success: true,
      data: {
        presignedUrl,
        key: presignedUrlDto.key,
        expiresIn: presignedUrlDto.expiresIn || 3600,
      },
    };
  }
}
