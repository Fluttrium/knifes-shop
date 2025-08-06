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
      className={`${className} w-[280px] bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="relative">
        <Link href={`/product/${slug}`}>
          <div className="flex justify-center p-4 bg-gray-50 h-[200px] rounded-t-lg">
            <img
              className="w-full h-full object-contain"
              src={getMainImage()}
              alt={name}
            />

            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isNew && (
                <Badge className="bg-green-500 text-white text-xs">
                  Новинка
                </Badge>
              )}
              {isFeatured && (
                <Badge className="bg-blue-500 text-white text-xs">
                  <Star size={12} className="mr-1" />
                  Хит
                </Badge>
              )}
              {isOnSale && discountPercent > 0 && (
                <Badge variant="destructive" className="text-xs">
                  -{discountPercent}%
                </Badge>
              )}
            </div>

            {stockQuantity === 0 && (
              <div className="absolute top-2 right-2">
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-600 text-xs"
                >
                  Нет в наличии
                </Badge>
              </div>
            )}
          </div>

          <div className="p-4">
            {brand && (
              <p className="text-xs text-gray-500 mb-1 uppercase">{brand}</p>
            )}

            <h3 className="font-semibold text-sm mb-2 line-clamp-2">{name}</h3>

            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-lg font-bold">
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

        <div className="px-4 pb-4">
          <AddToCartButton
            productId={id}
            stockQuantity={stockQuantity}
            variant="secondary"
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
