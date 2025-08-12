import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty({
    description: 'Папка для загрузки файла',
    example: 'products',
    required: false,
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class UploadMultipleFilesDto {
  @ApiProperty({
    description: 'Папка для загрузки файлов',
    example: 'products',
    required: false,
  })
  @IsOptional()
  @IsString()
  folder?: string;
}

export class PresignedUrlDto {
  @ApiProperty({
    description: 'Ключ файла в S3',
    example: 'products/image-123.jpg',
  })
  @IsString()
  key: string;

  @ApiProperty({
    description: 'Время жизни URL в секундах',
    example: 3600,
    required: false,
    minimum: 60,
    maximum: 86400,
  })
  @IsOptional()
  @IsNumber()
  @Min(60)
  @Max(86400)
  expiresIn?: number;
}
