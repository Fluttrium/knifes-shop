import { useSearchParams } from 'next/navigation';
import { useSet } from 'react-use';
import { useRouter } from 'next/navigation';
import React from 'react';

interface PriceProps {
  priceFrom?: number;
  priceTo?: number;
}

interface QueryFilters extends PriceProps {
  brands: string;
  materials: string;
  productTypes: string;
  handleTypes: string;
  categoryId: string;
}

export interface KnifeFilters {
  brands: Set<string>;
  materials: Set<string>;
  productTypes: Set<string>;
  handleTypes: Set<string>;
  categoryId: string;
  prices: PriceProps;
}

interface ReturnProps extends KnifeFilters {
  setPrices: (name: keyof PriceProps, value: number) => void;
  setBrands: (value: string) => void;
  setMaterials: (value: string) => void;
  setProductTypes: (value: string) => void;
  setHandleTypes: (value: string) => void;
  setCategoryId: (value: string) => void;
  resetFilters: () => void;
}

export const useKnifeSort = (): ReturnProps => {
  const searchParams = useSearchParams() as unknown as Map<keyof QueryFilters, string>;
  const router = useRouter();

  // Фильтры с использованием useSet для toggle функциональности
  const [brands, { toggle: toggleBrands, reset: resetBrands }] = useSet(
    new Set<string>(searchParams.get('brands')?.split(',').filter(Boolean) || []),
  );

  const [materials, { toggle: toggleMaterials, reset: resetMaterials }] = useSet(
    new Set<string>(searchParams.get('materials')?.split(',').filter(Boolean) || []),
  );

  const [productTypes, { toggle: toggleProductTypes, reset: resetProductTypes }] = useSet(
    new Set<string>(searchParams.get('productTypes')?.split(',').filter(Boolean) || []),
  );

  const [handleTypes, { toggle: toggleHandleTypes, reset: resetHandleTypes }] = useSet(
    new Set<string>(searchParams.get('handleTypes')?.split(',').filter(Boolean) || []),
  );

  // Категория (одиночное значение)
  const [categoryId, setCategoryId] = React.useState<string>(
    searchParams.get('categoryId') || '',
  );

  // Цены
  const [prices, setPrices] = React.useState<PriceProps>({
    priceFrom: searchParams.get('priceFrom') ? Number(searchParams.get('priceFrom')) : undefined,
    priceTo: searchParams.get('priceTo') ? Number(searchParams.get('priceTo')) : undefined,
  });

  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrices((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    // Сбрасываем все фильтры
    resetBrands();
    resetMaterials();
    resetProductTypes();
    resetHandleTypes();
    setCategoryId('');
    setPrices({
      priceFrom: undefined,
      priceTo: undefined,
    });

    // Очищаем URL
    router.push(window.location.pathname);
  };

  return React.useMemo(
    () => ({
      brands,
      materials,
      productTypes,
      handleTypes,
      categoryId,
      prices,
      setPrices: updatePrice,
      setBrands: toggleBrands,
      setMaterials: toggleMaterials,
      setProductTypes: toggleProductTypes,
      setHandleTypes: toggleHandleTypes,
      setCategoryId,
      resetFilters,
    }),
    [brands, materials, productTypes, handleTypes, categoryId, prices, toggleBrands, toggleMaterials, toggleProductTypes, toggleHandleTypes, resetBrands, resetMaterials, resetProductTypes, resetHandleTypes],
  );
};