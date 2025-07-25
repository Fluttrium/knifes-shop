import { useState, useEffect } from 'react';
import api from '@repo/api-client';

interface FilterOption {
  text: string;
  value: string;
  count?: number; // Количество товаров с этим значением
}

interface FilterOptions {
  brands: FilterOption[];
  materials: FilterOption[];
  productTypes: FilterOption[];
  handleTypes: FilterOption[];
}

export const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    materials: [],
    productTypes: [],
    handleTypes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔍 Fetching filter options from API...');

        // Получаем все товары для анализа
        const response = await api.products.getProducts({ limit: 1000 });
        const products = response.products;

        console.log(`📊 Analyzing ${products.length} products for filter options...`);

        // Подсчитываем бренды с количеством товаров
        const brandCounts = new Map<string, number>();
        products.forEach(product => {
          if (product.brand) {
            brandCounts.set(product.brand, (brandCounts.get(product.brand) || 0) + 1);
          }
        });

        // Подсчитываем материалы
        const materialCounts = new Map<string, number>();
        products.forEach(product => {
          if (product.material) {
            materialCounts.set(product.material, (materialCounts.get(product.material) || 0) + 1);
          }
        });

        // Подсчитываем типы товаров
        const productTypeCounts = new Map<string, number>();
        products.forEach(product => {
          productTypeCounts.set(product.productType, (productTypeCounts.get(product.productType) || 0) + 1);
        });

        // Подсчитываем типы рукояток
        const handleTypeCounts = new Map<string, number>();
        products.forEach(product => {
          if (product.handleType) {
            handleTypeCounts.set(product.handleType, (handleTypeCounts.get(product.handleType) || 0) + 1);
          }
        });

        // Формируем финальные опции с сортировкой по популярности
        const brands = Array.from(brandCounts.entries())
          .map(([value, count]) => ({
            text: value,
            value,
            count
          }))
          .sort((a, b) => b.count - a.count);

        const materials = Array.from(materialCounts.entries())
          .map(([value, count]) => ({
            text: getMaterialDisplayName(value),
            value,
            count
          }))
          .sort((a, b) => b.count - a.count);

        const productTypes = Array.from(productTypeCounts.entries())
          .map(([value, count]) => ({
            text: getProductTypeDisplayName(value),
            value,
            count
          }))
          .sort((a, b) => b.count - a.count);

        const handleTypes = Array.from(handleTypeCounts.entries())
          .map(([value, count]) => ({
            text: getHandleTypeDisplayName(value),
            value,
            count
          }))
          .sort((a, b) => b.count - a.count);

        setFilterOptions({
          brands,
          materials,
          productTypes,
          handleTypes
        });

        console.log('✅ Filter options loaded:', {
          brands: brands.length,
          materials: materials.length,
          productTypes: productTypes.length,
          handleTypes: handleTypes.length
        });

      } catch (err) {
        console.error('❌ Error fetching filter options:', err);
        setError(err instanceof Error ? err.message : 'Failed to load filter options');
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return {
    filterOptions,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      // useEffect перезапустится автоматически
    }
  };
};

// Функции для преобразования enum значений в читаемые названия
function getMaterialDisplayName(material: string): string {
  const materialNames: Record<string, string> = {
    stainless_steel: 'Нержавеющая сталь',
    carbon_steel: 'Углеродистая сталь',
    damascus_steel: 'Дамасская сталь',
    ceramic: 'Керамика',
    titanium: 'Титан',
    wood: 'Дерево',
    plastic: 'Пластик',
    leather: 'Кожа',
    synthetic: 'Синтетика'
  };
  return materialNames[material] || material;
}

function getProductTypeDisplayName(type: string): string {
  const typeNames: Record<string, string> = {
    knife: 'Ножи',
    sharpener: 'Точилки',
    sheath: 'Ножны',
    accessory: 'Аксессуары',
    gift_set: 'Подарочные наборы'
  };
  return typeNames[type] || type;
}

function getHandleTypeDisplayName(type: string): string {
  const typeNames: Record<string, string> = {
    fixed: 'Фиксированные',
    folding: 'Складные',
    multi_tool: 'Мультитул'
  };
  return typeNames[type] || type;
}