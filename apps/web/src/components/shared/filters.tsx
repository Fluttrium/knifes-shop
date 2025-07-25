'use client';

import React from 'react';
import { Title } from './title';
import { Input } from '../ui/input';
import { RangeSlider } from '../ui/range-slider';
import { CheckboxFiltersGroup } from './checkbox-filters-group';
import { useKnifeFilters } from '@/hooks/use-knife-filters';
import { useQueryFilters } from '@/hooks/use-query-filters';
import { Button } from '../ui/button';
import api from '@repo/api-client';

interface Props {
  className?: string;
}

interface FilterOptions {
  brands: Array<{ text: string; value: string }>;
  materials: Array<{ text: string; value: string }>;
  productTypes: Array<{ text: string; value: string }>;
  handleTypes: Array<{ text: string; value: string }>;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const filters = useKnifeFilters(); // Исправил с useKnifeSort на useKnifeFilters
  useQueryFilters(filters);

  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>({
    brands: [],
    materials: [],
    productTypes: [],
    handleTypes: []
  });
  const [loading, setLoading] = React.useState(true);

  // Загружаем варианты фильтров из API
  React.useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching filter options...');

        // Получаем все товары чтобы извлечь уникальные значения
        const response = await api.products.getProducts({ limit: 1000 });
        const products = response.products;

        // Извлекаем уникальные бренды
        const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))]
          .map(brand => ({ text: brand!, value: brand! }))
          .sort((a, b) => a.text.localeCompare(b.text));

        // Извлекаем уникальные материалы
        const uniqueMaterials = [...new Set(products.map(p => p.material).filter(Boolean))]
          .map(material => ({
            text: getMaterialDisplayName(material!),
            value: material!
          }))
          .sort((a, b) => a.text.localeCompare(b.text));

        // Извлекаем уникальные типы товаров
        const uniqueProductTypes = [...new Set(products.map(p => p.productType))]
          .map(type => ({
            text: getProductTypeDisplayName(type),
            value: type
          }))
          .sort((a, b) => a.text.localeCompare(b.text));

        // Извлекаем уникальные типы рукояток
        const uniqueHandleTypes = [...new Set(products.map(p => p.handleType).filter(Boolean))]
          .map(type => ({
            text: getHandleTypeDisplayName(type!),
            value: type!
          }))
          .sort((a, b) => a.text.localeCompare(b.text));

        setFilterOptions({
          brands: uniqueBrands,
          materials: uniqueMaterials,
          productTypes: uniqueProductTypes,
          handleTypes: uniqueHandleTypes
        });

        console.log('✅ Loaded filter options:', {
          brands: uniqueBrands.length,
          materials: uniqueMaterials.length,
          productTypes: uniqueProductTypes.length,
          handleTypes: uniqueHandleTypes.length
        });

      } catch (error) {
        console.error('❌ Error fetching filter options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handlePriceChange = (values: [number, number]) => {
    const [priceFrom, priceTo] = values;
    filters.setPrices('priceFrom', priceFrom);
    filters.setPrices('priceTo', priceTo);
  };

  const currentPriceRange: [number, number] = [
    filters.prices.priceFrom || 0,
    filters.prices.priceTo || 50000,
  ];

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      {/* Кнопка сброса */}
      <Button
        onClick={filters.resetFilters}
        variant="outline"
        className="w-full mb-5"
      >
        Сбросить фильтры
      </Button>

      {/* Цена */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={50000}

          />
          <Input
            type="number"
            placeholder="50000"
            min={100}
            max={50000}
          />
        </div>
        <RangeSlider
          min={0}
          max={50000}
          step={100}
          value={currentPriceRange}
          onValueChange={handlePriceChange}
        />
      </div>

      {/* Бренды */}
      <CheckboxFiltersGroup
        title="Бренды"
        name="brands"
        className="mt-5"
        limit={6}
        loading={loading}
        defaultItems={filterOptions.brands}
        items={filterOptions.brands}
        selected={filters.brands}
        onClickCheckbox={filters.setBrands}
      />

      {/* Материалы */}
      <CheckboxFiltersGroup
        title="Материалы"
        name="materials"
        className="mt-5"
        limit={5}
        loading={loading}
        defaultItems={filterOptions.materials}
        items={filterOptions.materials}
        selected={filters.materials}
        onClickCheckbox={filters.setMaterials}
      />

      {/* Типы товаров */}
      <CheckboxFiltersGroup
        title="Типы товаров"
        name="productTypes"
        className="mt-5"
        limit={5}
        loading={loading}
        defaultItems={filterOptions.productTypes}
        items={filterOptions.productTypes}
        selected={filters.productTypes}
        onClickCheckbox={filters.setProductTypes}
      />

      {/* Типы рукояток */}
      <CheckboxFiltersGroup
        title="Типы рукояток"
        name="handleTypes"
        className="mt-5"
        limit={3}
        loading={loading}
        defaultItems={filterOptions.handleTypes}
        items={filterOptions.handleTypes}
        selected={filters.handleTypes}
        onClickCheckbox={filters.setHandleTypes}
      />
    </div>
  );
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