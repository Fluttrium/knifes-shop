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
    filters.priceRange[0] !== null ||
    filters.priceRange[1] !== null;

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
        <div className="flex items-center justify-between mb-2">
          <p className="font-bold text-sm">Цена от и до:</p>
          {(filters.priceRange[0] !== null || filters.priceRange[1] !== null) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updatePriceRange([null, null])}
              className="text-xs px-2 py-1 h-6 text-gray-500 hover:text-gray-700"
            >
              Сбросить
            </Button>
          )}
        </div>
        <div className="flex gap-2 mb-3">
          <Input
            type="number"
            placeholder="От"
            min={0}
            max={filters.priceRange[1] !== null ? filters.priceRange[1] : 50000}
            value={filters.priceRange[0] || ""}
            onChange={(e) => {
              const newMin = e.target.value === "" ? null : Number(e.target.value);
              const newMax = filters.priceRange[1];
              if (newMin !== null && newMax !== null && newMin >= newMax) {
                updatePriceRange([newMax - 100, newMax]);
              } else {
                updatePriceRange([newMin, newMax]);
              }
            }}
            className="text-sm h-8"
          />
          <Input
            type="number"
            placeholder="До"
            min={filters.priceRange[0] !== null ? filters.priceRange[0] : 0}
            max={50000}
            value={filters.priceRange[1] || ""}
            onChange={(e) => {
              const newMax = e.target.value === "" ? null : Number(e.target.value);
              const newMin = filters.priceRange[0];
              if (newMax !== null && newMin !== null && newMax <= newMin) {
                updatePriceRange([newMin, newMin + 100]);
              } else {
                updatePriceRange([newMin, newMax]);
              }
            }}
            className="text-sm h-8"
          />
        </div>
        <RangeSlider
          min={0}
          max={50000}
          step={100}
          value={[filters.priceRange[0] || 0, filters.priceRange[1] || 50000]}
          onValueChange={(range) => updatePriceRange(range)}
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
