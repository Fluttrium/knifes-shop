"use client";

import React from "react";
import { Title } from "./title";
import { Input } from "../ui/input";
import { RangeSlider } from "../ui/range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import { Button } from "../ui/button";
import { useFilters } from "@/contexts/filter-context";
import { X } from "lucide-react";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const {
    filters,
    brands,
    materials,
    types,
    loading,
    updatePriceRange,
    toggleBrand,
    toggleMaterial,
    toggleType,
    clearFilters,
  } = useFilters();

  const hasActiveFilters =
    filters.selectedBrands.size > 0 ||
    filters.selectedMaterials.size > 0 ||
    filters.selectedTypes.size > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 50000;

  if (loading) {
    return (
      <div className={className}>
        <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} bg-white rounded-lg border border-gray-200 p-3 lg:p-4 max-w-full`}
    >
      <div className="flex items-center justify-between mb-4">
        <Title text="Фильтрация" size="sm" className="font-bold text-sm" />
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs px-2 py-1 h-7"
          >
            <X className="h-3 w-3" />
            Очистить
          </Button>
        )}
      </div>

      {/* Цена */}
      <div className="mt-4 border-y border-y-neutral-100 py-4">
        <p className="font-bold mb-2 text-sm">Цена от и до:</p>
        <div className="flex gap-2 mb-3">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={50000}
            value={filters.priceRange[0]}
            onChange={(e) =>
              updatePriceRange([Number(e.target.value), filters.priceRange[1]])
            }
            className="text-sm h-8"
          />
          <Input
            type="number"
            placeholder="50000"
            min={100}
            max={50000}
            value={filters.priceRange[1]}
            onChange={(e) =>
              updatePriceRange([filters.priceRange[0], Number(e.target.value)])
            }
            className="text-sm h-8"
          />
        </div>
        <RangeSlider
          min={0}
          max={50000}
          step={100}
          value={filters.priceRange}
          onValueChange={updatePriceRange}
        />
      </div>

      {/* Бренды */}
      {brands.length > 0 && (
        <CheckboxFiltersGroup
          title="Бренды"
          name="brands"
          className="mt-4"
          limit={4}
          defaultItems={brands}
          items={brands}
          selected={filters.selectedBrands}
          onClickCheckbox={toggleBrand}
        />
      )}

      {/* Материалы */}
      <CheckboxFiltersGroup
        title="Материалы"
        name="materials"
        className="mt-4"
        limit={4}
        defaultItems={materials}
        items={materials}
        selected={filters.selectedMaterials}
        onClickCheckbox={toggleMaterial}
      />

      {/* Типы товаров */}
      <CheckboxFiltersGroup
        title="Типы товаров"
        name="types"
        className="mt-4"
        limit={4}
        defaultItems={types}
        items={types}
        selected={filters.selectedTypes}
        onClickCheckbox={toggleType}
      />
    </div>
  );
};
