import { useRouter } from 'next/navigation';
import React from 'react';
import { KnifeFilters } from './use-knife-filters';

export const useQueryFilters = (filters: KnifeFilters) => {
  const router = useRouter();

  React.useEffect(() => {
    const params = new URLSearchParams();

    // Добавляем фильтры в URL
    if (filters.brands.size > 0) {
      params.set('brands', Array.from(filters.brands).join(','));
    }

    if (filters.materials.size > 0) {
      params.set('materials', Array.from(filters.materials).join(','));
    }

    if (filters.productTypes.size > 0) {
      params.set('productTypes', Array.from(filters.productTypes).join(','));
    }

    if (filters.handleTypes.size > 0) {
      params.set('handleTypes', Array.from(filters.handleTypes).join(','));
    }

    if (filters.categoryId) {
      params.set('categoryId', filters.categoryId);
    }

    if (filters.prices.priceFrom !== undefined) {
      params.set('priceFrom', String(filters.prices.priceFrom));
    }

    if (filters.prices.priceTo !== undefined) {
      params.set('priceTo', String(filters.prices.priceTo));
    }

    // Обновляем URL без перезагрузки страницы
    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;

    router.push(newUrl, { scroll: false });
  }, [filters, router]);

  return {
    // Возвращаем объект с параметрами для API запросов
    getQueryParams: () => ({
      brands: filters.brands.size > 0 ? Array.from(filters.brands).join(',') : undefined,
      materials: filters.materials.size > 0 ? Array.from(filters.materials).join(',') : undefined,
      productTypes: filters.productTypes.size > 0 ? Array.from(filters.productTypes).join(',') : undefined,
      handleTypes: filters.handleTypes.size > 0 ? Array.from(filters.handleTypes).join(',') : undefined,
      categoryId: filters.categoryId || undefined,
      minPrice: filters.prices.priceFrom,
      maxPrice: filters.prices.priceTo,
    }),
  };
};