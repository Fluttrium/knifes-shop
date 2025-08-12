import apiClient from "./config";
import {
  UploadFileResponse,
  UploadMultipleFilesResponse,
  DeleteFileResponse,
  PresignedUrlResponse,
  UploadFileDto,
  UploadMultipleFilesDto,
  PresignedUrlDto,
  UploadProductImagesResponse,
  DeleteProductImageResponse,
  ReorderProductImagesResponse,
} from "./types";

export const uploadApi = {
  // Загрузка одного файла
  uploadSingleFile: async (
    file: File,
    data?: UploadFileDto,
  ): Promise<UploadFileResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    if (data?.folder) {
      formData.append("folder", data.folder);
    }

    const response = await apiClient.post("/upload/single", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Загрузка нескольких файлов
  uploadMultipleFiles: async (
    files: File[],
    data?: UploadMultipleFilesDto,
  ): Promise<UploadMultipleFilesResponse> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    if (data?.folder) {
      formData.append("folder", data.folder);
    }

    const response = await apiClient.post("/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Удаление файла
  deleteFile: async (fileUrl: string): Promise<DeleteFileResponse> => {
    const response = await apiClient.delete(
      `/upload/${encodeURIComponent(fileUrl)}`,
    );
    return response.data;
  },

  // Получение presigned URL
  getPresignedUrl: async (
    data: PresignedUrlDto,
  ): Promise<PresignedUrlResponse> => {
    const response = await apiClient.post("/upload/presigned-url", data);
    return response.data;
  },

  // Загрузка изображений продукта
  uploadProductImages: async (
    productId: string,
    files: File[],
  ): Promise<UploadProductImagesResponse> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await apiClient.post(
      `/admin/products/${productId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  // Удаление изображения продукта
  deleteProductImage: async (
    imageId: string,
  ): Promise<DeleteProductImageResponse> => {
    const response = await apiClient.delete(
      `/admin/products/images/${imageId}`,
    );
    return response.data;
  },

  // Изменение порядка изображений продукта
  reorderProductImages: async (
    productId: string,
    imageIds: string[],
  ): Promise<ReorderProductImagesResponse> => {
    const response = await apiClient.post(
      `/admin/products/${productId}/images/reorder`,
      {
        imageIds,
      },
    );
    return response.data;
  },
};
