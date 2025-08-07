import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";

interface Props {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  brand?: string;
  imageUrl?: string;
  images?: Array<{
    id: string;
    url: string;
    alt?: string;
    isPrimary: boolean;
    sortOrder: number;
  }>;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  stockQuantity: number;
  className?: string;
}

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  slug,
  price,
  comparePrice,
  brand,
  imageUrl,
  images,
  isNew,
  isFeatured,
  isOnSale,
  stockQuantity,
  className,
}) => {
  const discountPercent =
    comparePrice && comparePrice > price
      ? Math.round(((comparePrice - price) / comparePrice) * 100)
      : 0;

  const getMainImage = () => {
    if (images && images.length > 0) {
      const primaryImage = images.find(img => img.isPrimary);
      return primaryImage?.url || images[0]?.url;
    }
    return imageUrl || '/placeholder-image.jpg';
  };

  return (
    <div
      className={`${className} product-card-hover bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden`}
    >
      <div className="relative">
        <Link href={`/product/${slug}`} className="block">
          {/* Изображение */}
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <img
              className="w-full h-full object-contain p-4 transition-transform duration-200 group-hover:scale-105"
              src={getMainImage()}
              alt={name}
            />

            {/* Бейджи */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {isNew && (
                <Badge className="bg-blue-500 text-white text-xs px-2 py-1 shadow-sm">
                  Новинка
                </Badge>
              )}
              {isFeatured && (
                <Badge className="bg-yellow-500 text-white text-xs px-2 py-1 shadow-sm">
                  <Star size={10} className="mr-1" />
                  Хит
                </Badge>
              )}
              {isOnSale && discountPercent > 0 && (
                <Badge variant="destructive" className="text-xs px-2 py-1 shadow-sm">
                  -{discountPercent}%
                </Badge>
              )}
            </div>

            {/* Статус наличия */}
            {stockQuantity === 0 && (
              <div className="absolute top-3 right-3">
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-600 border-red-200 text-xs px-2 py-1 shadow-sm"
                >
                  Нет в наличии
                </Badge>
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="p-4">
            {/* Бренд */}
            {brand && (
              <p className="text-xs text-gray-500 mb-2 font-medium tracking-wide uppercase">
                {brand}
              </p>
            )}

            {/* Название */}
            <h3 className="font-medium text-sm text-gray-900 mb-3 line-clamp-2 min-h-[2.5rem] leading-tight">
              {name}
            </h3>

            {/* Цена */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900">
                  {price.toLocaleString()} ₽
                </span>
                {comparePrice && comparePrice > price && (
                  <span className="text-sm text-gray-400 line-through">
                    {comparePrice.toLocaleString()} ₽
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Кнопка добавления в корзину */}
        <div className="px-4 pb-4">
          <AddToCartButton
            productId={id}
            stockQuantity={stockQuantity}
            variant="secondary"
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
