
import React, { useState } from 'react';
import { Title } from './title';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  slug: string;
  price: number;
  comparePrice: number;
  brand: string;
  imageUrl: string;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  stockQuantity: number;
  description?: string;
  country?: {
    name: string;
    flag?: string;
    code?: string;
  };
  loading?: boolean;
  onSubmit?: () => void;
  className?: string;
}

export const ChooseProductForm: React.FC<Props> = ({
                                                     name,
                                                     slug,
                                                     price,
                                                     comparePrice,
                                                     brand,
                                                     imageUrl,
                                                     isNew,
                                                     isFeatured,
                                                     isOnSale,
                                                     stockQuantity,
                                                     description,
                                                     country,
                                                     loading = false,
                                                     onSubmit,
                                                     className,
                                                   }) => {
  const [isLoading, setIsLoading] = useState(false);

  const getTotalPrice = () => {
    return price;
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      setIsLoading(true);
      try {
        await onSubmit();
      } finally {
        setIsLoading(false);
      }
    }
  };

  const currentLoading = loading || isLoading;

  return (
    <div className={cn(className, 'flex flex-col lg:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl')}>
      {/* Секция изображения */}
      <div className="lg:w-[45%] relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <img
            src={imageUrl}
            alt={name}
            className="relative z-10 w-full h-auto max-w-[400px] max-h-[400px] object-cover rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-500"
          />
        </div>
        {/* Декоративные элементы */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-pink-200 to-yellow-200 rounded-full opacity-40"></div>
      </div>

      <div className="lg:w-[55%] p-6 lg:p-8 flex flex-col justify-between space-y-6">
        {/* Заголовок и описание */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Title
              text={name}
              size="lg"
              className="font-bold text-gray-800 leading-tight text-2xl"
            />
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>

          {/* Статусы товара */}
          <div className="flex items-center space-x-2 mb-3">
            {isNew && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Новинка
              </span>
            )}
            {isFeatured && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                Рекомендуем
              </span>
            )}
            {isOnSale && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                Скидка
              </span>
            )}
          </div>

          {/* Бренд - исправлено: brand теперь строка */}
          {brand && (
            <div className="flex items-center mb-2 text-sm text-gray-700">
              <span className="font-medium">{brand}</span>
            </div>
          )}

          {/* Страна */}
          {country && (
            <div className="flex items-center mb-3 text-sm text-gray-600">
              {country.flag && (
                <img
                  src={country.flag}
                  alt={`Флаг ${country.name}`}
                  className="w-5 h-3 object-cover rounded mr-2"
                />
              )}
              <span>Произведено в {country.name}</span>
              {country.code && (
                <span className="ml-1 text-gray-400">({country.code})</span>
              )}
            </div>
          )}

          {/* Описание */}
          {description && (
            <div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          )}

          {/* Количество в наличии */}
          <div className="text-sm text-gray-600">
            В наличии: {stockQuantity} шт.
          </div>
        </div>

        {/* Цена и кнопка */}
        <div className="space-y-4">
          {/* Цена */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Цена</p>
            <div className="flex items-baseline space-x-2">
              {/* Если есть скидка, показываем старую цену */}
              {isOnSale && comparePrice > price && (
                <span className="text-lg font-medium text-gray-400 line-through">
                  {comparePrice.toLocaleString()} ₽
                </span>
              )}
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getTotalPrice().toLocaleString()}
              </span>
              <span className="text-xl font-semibold text-gray-600">₽</span>
            </div>
          </div>

          {/* Кнопка добавления в корзину */}
          <Button
            disabled={currentLoading || stockQuantity === 0}
            onClick={handleSubmit}
            size="lg"
            className={cn(
              "w-full h-14 text-lg font-semibold rounded-2xl",
              "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
              "text-white shadow-lg hover:shadow-xl",
              "transform hover:scale-[1.02] active:scale-[0.98]",
              "transition-all duration-200",
              "border-0 focus:ring-4 focus:ring-blue-200"
            )}
          >
            {currentLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Добавляем...</span>
              </div>
            ) : stockQuantity === 0 ? (
              <span>Нет в наличии</span>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8"
                  />
                </svg>
                <span>Добавить в корзину</span>
              </div>
            )}
          </Button>
        </div>

        {/* Дополнительная информация */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 pt-2">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{stockQuantity > 0 ? 'В наличии' : 'Нет в наличии'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            <span>Быстрая доставка</span>
          </div>
        </div>
      </div>
    </div>
  );
};