"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { X, ZoomIn, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductImagesProps {
  images: ProductImage[];
  onImageDelete?: (imageId: string) => void;
  onReorder?: (imageIds: string[]) => void;
  editable?: boolean;
  className?: string;
}

export const ProductImages: React.FC<ProductImagesProps> = ({
  images,
  onImageDelete,
  onReorder,
  editable = false,
  className = "",
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const primaryImage =
    sortedImages.find((img) => img.isPrimary) || sortedImages[0];

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "Escape") {
      setIsLightboxOpen(false);
    }
  };

  if (images.length === 0) {
    return (
      <Card className={cn("p-8 text-center text-gray-500", className)}>
        <p>Изображения не найдены</p>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Основное изображение */}
      <div className="relative aspect-square overflow-hidden rounded-lg">
        <img
          src={primaryImage?.url}
          alt={primaryImage?.alt || "Основное изображение продукта"}
          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
          onClick={() => handleImageClick(0)}
        />
        {editable && primaryImage && (
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity"
            onClick={() => onImageDelete?.(primaryImage.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-2 right-2 opacity-0 hover:opacity-100 transition-opacity"
          onClick={() => handleImageClick(0)}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      {/* Миниатюры */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {sortedImages.map((image, index) => (
            <div
              key={image.id}
              className="relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={image.url}
                alt={image.alt || `Изображение ${index + 1}`}
                className={cn(
                  "w-full h-full object-cover cursor-pointer transition-all duration-200",
                  image.isPrimary ? "ring-2 ring-primary" : "hover:scale-105",
                )}
                onClick={() => handleImageClick(index)}
              />
              {editable && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 hover:opacity-100 transition-opacity"
                  onClick={() => onImageDelete?.(image.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Лайтбокс */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/90 border-0">
          <div className="relative w-full h-full">
            <img
              src={sortedImages[selectedImageIndex]?.url}
              alt={
                sortedImages[selectedImageIndex]?.alt ||
                `Изображение ${selectedImageIndex + 1}`
              }
              className="w-full h-full object-contain"
              onKeyDown={handleKeyDown}
              tabIndex={0}
            />

            {/* Навигационные кнопки */}
            {sortedImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={handlePrevious}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={handleNext}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Индикатор */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {sortedImages.length}
            </div>

            {/* Кнопка закрытия */}
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
