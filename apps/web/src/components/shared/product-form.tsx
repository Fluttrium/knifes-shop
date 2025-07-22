"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ShoppingCart, Heart, Star } from "lucide-react";

interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
}

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price?: number;
  stockQuantity: number;
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  brand?: string;
  price: number;
  comparePrice?: number;
  weight?: number;
  dimensions?: string;
  stockQuantity: number;
  productType: string;
  material?: string;
  handleType?: string;
  bladeLength?: number;
  totalLength?: number;
  bladeHardness?: number;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

interface Props {
  product: Product;
  onSubmit?: VoidFunction;
}

export const ProductForm: React.FC<Props> = ({ product, onSubmit }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null,
  );
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const sortedImages = product.images.sort((a, b) => a.sortOrder - b.sortOrder);

  const getCurrentPrice = () => {
    return selectedVariant?.price || product.price;
  };

  const getStockQuantity = () => {
    return selectedVariant?.stockQuantity || product.stockQuantity;
  };

  const discountPercent =
    product.comparePrice && product.comparePrice > getCurrentPrice()
      ? Math.round(
          ((product.comparePrice - getCurrentPrice()) / product.comparePrice) *
            100,
        )
      : 0;

  const formatMaterial = (material: string) => {
    return material.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // Логика добавления в корзину
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Имитация API
      onSubmit?.();
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
      {/* Изображения */}
      <div className="space-y-4">
        <div className="relative bg-gray-50 rounded-lg p-4 h-[400px] flex items-center justify-center">
          <img
            src={sortedImages[selectedImage]?.url || "/placeholder.jpg"}
            alt={sortedImages[selectedImage]?.alt || product.name}
            className="max-w-full max-h-full object-contain"
          />

          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <Badge className="bg-green-500 text-white">Новинка</Badge>
            )}
            {product.isFeatured && (
              <Badge className="bg-blue-500 text-white">
                <Star size={12} className="mr-1" />
                Хит продаж
              </Badge>
            )}
            {discountPercent > 0 && (
              <Badge variant="destructive">-{discountPercent}%</Badge>
            )}
          </div>
        </div>

        {sortedImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 bg-gray-50 rounded border-2 p-1 ${
                  selectedImage === index
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt || product.name}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Информация о товаре */}
      <div className="space-y-6">
        <div>
          {product.brand && (
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
              {product.brand}
            </p>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-sm text-gray-600">Артикул: {product.sku}</p>

          {product.shortDescription && (
            <p className="text-gray-700 mt-3">{product.shortDescription}</p>
          )}
        </div>

        {/* Варианты */}
        {product.variants.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Варианты:</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <Button
                  key={variant.id}
                  variant={
                    selectedVariant?.id === variant.id ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedVariant(variant)}
                  disabled={!variant.isActive || variant.stockQuantity === 0}
                >
                  {variant.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Цена */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {Number(getCurrentPrice()).toLocaleString()} ₽
            </span>
            {product.comparePrice &&
              product.comparePrice > getCurrentPrice() && (
                <span className="text-lg text-gray-400 line-through">
                  {Number(product.comparePrice).toLocaleString()} ₽
                </span>
              )}
          </div>
        </div>

        {/* Количество */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="font-medium">Количество:</span>
            <div className="flex items-center border rounded">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="px-4 py-2 min-w-[50px] text-center">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= getStockQuantity()}
              >
                +
              </Button>
            </div>
            <span className="text-sm text-gray-500">
              Доступно: {getStockQuantity()} шт.
            </span>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={loading || getStockQuantity() === 0}
              className="flex-1 h-12"
              size="lg"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {getStockQuantity() === 0
                ? "Нет в наличии"
                : "Добавить в корзину"}
            </Button>
            <Button variant="outline" size="lg" className="h-12">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Характеристики */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Характеристики</h3>
          <div className="grid grid-cols-1 gap-2 text-sm">
            {product.material && (
              <div className="flex justify-between">
                <span className="text-gray-600">Материал:</span>
                <span className="font-medium">
                  {formatMaterial(product.material)}
                </span>
              </div>
            )}
            {product.bladeLength && (
              <div className="flex justify-between">
                <span className="text-gray-600">Длина лезвия:</span>
                <span className="font-medium">
                  {Number(product.bladeLength)} см
                </span>
              </div>
            )}
            {product.totalLength && (
              <div className="flex justify-between">
                <span className="text-gray-600">Общая длина:</span>
                <span className="font-medium">
                  {Number(product.totalLength)} см
                </span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between">
                <span className="text-gray-600">Вес:</span>
                <span className="font-medium">{Number(product.weight)} г</span>
              </div>
            )}
            {product.bladeHardness && (
              <div className="flex justify-between">
                <span className="text-gray-600">Твердость стали:</span>
                <span className="font-medium">{product.bladeHardness} HRC</span>
              </div>
            )}
          </div>
        </div>

        {/* Описание */}
        {product.description && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Описание</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
