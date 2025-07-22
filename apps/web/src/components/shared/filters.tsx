"use client";

import React from "react";
import { Title } from "./title";
import { Input } from "../ui/input";
import { RangeSlider } from "../ui/range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";

interface Props {
  className?: string;
}

export const Filters: React.FC<Props> = ({ className }) => {
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 50000,
  ]);
  const [selectedBrands, setSelectedBrands] = React.useState<Set<string>>(
    new Set(),
  );
  const [selectedMaterials, setSelectedMaterials] = React.useState<Set<string>>(
    new Set(),
  );
  const [selectedTypes, setSelectedTypes] = React.useState<Set<string>>(
    new Set(),
  );

  const brands = [
    { text: "Zwilling", value: "zwilling" },
    { text: "Wüsthof", value: "wusthof" },
    { text: "Buck Knives", value: "buck" },
    { text: "Spyderco", value: "spyderco" },
    { text: "Chef's Choice", value: "chefs_choice" },
    { text: "Condor", value: "condor" },
  ];

  const materials = [
    { text: "Нержавеющая сталь", value: "stainless_steel" },
    { text: "Углеродистая сталь", value: "carbon_steel" },
    { text: "Дамасская сталь", value: "damascus_steel" },
    { text: "Керамика", value: "ceramic" },
    { text: "Титан", value: "titanium" },
  ];

  const types = [
    { text: "Ножи", value: "knife" },
    { text: "Точилки", value: "sharpener" },
    { text: "Ножны", value: "sheath" },
    { text: "Аксессуары", value: "accessory" },
    { text: "Подарочные наборы", value: "gift_set" },
  ];

  const handlePriceChange = (values: [number, number]) => {
    setPriceRange(values);
  };

  const handleBrandChange = (value: string) => {
    const newSelected = new Set(selectedBrands);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    setSelectedBrands(newSelected);
  };

  const handleMaterialChange = (value: string) => {
    const newSelected = new Set(selectedMaterials);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    setSelectedMaterials(newSelected);
  };

  const handleTypeChange = (value: string) => {
    const newSelected = new Set(selectedTypes);
    if (newSelected.has(value)) {
      newSelected.delete(value);
    } else {
      newSelected.add(value);
    }
    setSelectedTypes(newSelected);
  };

  return (
    <div className={className}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />

      {/* Цена */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={50000}
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([Number(e.target.value), priceRange[1]])
            }
          />
          <Input
            type="number"
            placeholder="50000"
            min={100}
            max={50000}
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], Number(e.target.value)])
            }
          />
        </div>
        <RangeSlider
          min={0}
          max={50000}
          step={100}
          value={priceRange}
          onValueChange={handlePriceChange}
        />
      </div>

      {/* Бренды */}
      <CheckboxFiltersGroup
        title="Бренды"
        name="brands"
        className="mt-5"
        limit={6}
        defaultItems={brands}
        items={brands}
        selected={selectedBrands}
        onClickCheckbox={handleBrandChange}
      />

      {/* Материалы */}
      <CheckboxFiltersGroup
        title="Материалы"
        name="materials"
        className="mt-5"
        limit={5}
        defaultItems={materials}
        items={materials}
        selected={selectedMaterials}
        onClickCheckbox={handleMaterialChange}
      />

      {/* Типы товаров */}
      <CheckboxFiltersGroup
        title="Типы товаров"
        name="types"
        className="mt-5"
        limit={5}
        defaultItems={types}
        items={types}
        selected={selectedTypes}
        onClickCheckbox={handleTypeChange}
      />
    </div>
  );
};
