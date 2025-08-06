export interface UploadFileResponse {
  success: boolean;
  data: {
    url: string;
    originalName: string;
    size: number;
    mimetype: string;
  };
}

export interface UploadMultipleFilesResponse {
  success: boolean;
  data: Array<{
    url: string;
    originalName: string;
    size: number;
    mimetype: string;
  }>;
}

export interface DeleteFileResponse {
  success: boolean;
  message: string;
}

export interface PresignedUrlResponse {
  success: boolean;
  data: {
    presignedUrl: string;
    key: string;
    expiresIn: number;
  };
}

export interface UploadFileDto {
  folder?: string;
}

export interface UploadMultipleFilesDto {
  folder?: string;
}

export interface PresignedUrlDto {
  key: string;
  expiresIn?: number;
}

// Используем существующий тип из product.ts
export type { ProductImage } from './product';

export interface UploadProductImagesResponse {
  success: boolean;
  data: Array<{
    id: string;
    productId: string;
    url: string;
    alt: string;
    isPrimary: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export interface DeleteProductImageResponse {
  success: boolean;
  message: string;
}

export interface ReorderProductImagesResponse {
  success: boolean;
  data: any; // ProductEntity
} 