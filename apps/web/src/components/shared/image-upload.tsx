'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { api } from '@repo/api-client';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImagesUploaded: (images: string[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedFileTypes?: string[];
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesUploaded,
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
  className = '',
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      setIsUploading(true);
      try {
        const response = await api.upload.uploadMultipleFiles(acceptedFiles, {
          folder: 'products',
        });

        const newImageUrls = response.data.map((file) => file.url);
        const updatedImages = [...uploadedImages, ...newImageUrls];
        
        setUploadedImages(updatedImages);
        onImagesUploaded(updatedImages);
        
        toast.success(`Загружено ${acceptedFiles.length} изображений`);
      } catch (error) {
        console.error('Ошибка загрузки изображений:', error);
        toast.error('Ошибка при загрузке изображений');
      } finally {
        setIsUploading(false);
      }
    },
    [uploadedImages, onImagesUploaded],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': acceptedFileTypes,
    },
    maxFiles,
    maxSize,
  });

  const removeImage = (index: number) => {
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    onImagesUploaded(updatedImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center space-y-2">
          <Upload className="h-8 w-8 text-gray-400" />
          {isDragActive ? (
            <p className="text-sm text-gray-600">Отпустите файлы здесь...</p>
          ) : (
            <div>
              <p className="text-sm text-gray-600">
                Перетащите изображения сюда или{' '}
                <span className="text-primary hover:underline">выберите файлы</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Поддерживаются: JPEG, PNG, WebP (макс. {Math.round(maxSize / 1024 / 1024)}MB)
              </p>
            </div>
          )}
        </div>
      </div>

      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Загруженные изображения:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <Card key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Изображение ${index + 1}`}
                  className="w-full h-24 object-cover rounded-t-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                <div className="p-2">
                  <p className="text-xs text-gray-500 truncate">
                    Изображение {index + 1}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          <span>Загрузка изображений...</span>
        </div>
      )}
    </div>
  );
}; 