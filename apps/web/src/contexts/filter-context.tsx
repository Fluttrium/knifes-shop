"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@repo/api-client";

export interface FilterState {
  priceRange: [number, number];
  selectedBrands: Set<string>;
  selectedMaterials: Set<string>;
  selectedTypes: Set<string>;
  searchQuery: string;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  brands: Array<{ text: string; value: string }>;
  materials: Array<{ text: string; value: string }>;
  types: Array<{ text: string; value: string }>;
  loading: boolean;
  updatePriceRange: (range: [number, number]) => void;
  toggleBrand: (brand: string) => void;
  toggleMaterial: (material: string) => void;
  toggleType: (type: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 50000],
    selectedBrands: new Set(),
    selectedMaterials: new Set(),
    selectedTypes: new Set(),
    searchQuery: "",
  });

  const [brands, setBrands] = useState<Array<{ text: string; value: string }>>([]);
  const [materials, setMaterials] = useState<Array<{ text: string; value: string }>>([]);
  const [types, setTypes] = useState<Array<{ text: string; value: string }>>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем данные для фильтров
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setLoading(true);
        
        // Получаем бренды из API
        const brandsData = await api.products.getBrands();
        const brandsOptions = brandsData.map(brand => ({
          text: brand,
          value: brand.toLowerCase().replace(/\s+/g, '_')
        }));

        // Материалы из enum
        const materialsOptions = [
          { text: "Нержавеющая сталь", value: "stainless_steel" },
          { text: "Углеродистая сталь", value: "carbon_steel" },
          { text: "Дамасская сталь", value: "damascus_steel" },
          { text: "Керамика", value: "ceramic" },
          { text: "Титан", value: "titanium" },
          { text: "Дерево", value: "wood" },
          { text: "Пластик", value: "plastic" },
          { text: "Кожа", value: "leather" },
          { text: "Синтетика", value: "synthetic" },
        ];

        // Типы товаров из enum
        const typesOptions = [
          { text: "Ножи", value: "knife" },
          { text: "Точилки", value: "sharpener" },
          { text: "Ножны", value: "sheath" },
          { text: "Аксессуары", value: "accessory" },
          { text: "Подарочные наборы", value: "gift_set" },
        ];

        setBrands(brandsOptions);
        setMaterials(materialsOptions);
        setTypes(typesOptions);
      } catch (error) {
        console.error("Ошибка при загрузке данных фильтров:", error);
        // Fallback к базовым данным
        setBrands([
          { text: "Zwilling", value: "zwilling" },
          { text: "Wüsthof", value: "wusthof" },
          { text: "Buck Knives", value: "buck" },
          { text: "Spyderco", value: "spyderco" },
          { text: "Chef's Choice", value: "chefs_choice" },
          { text: "Condor", value: "condor" },
        ]);
        setMaterials([
          { text: "Нержавеющая сталь", value: "stainless_steel" },
          { text: "Углеродистая сталь", value: "carbon_steel" },
          { text: "Дамасская сталь", value: "damascus_steel" },
          { text: "Керамика", value: "ceramic" },
          { text: "Титан", value: "titanium" },
        ]);
        setTypes([
          { text: "Ножи", value: "knife" },
          { text: "Точилки", value: "sharpener" },
          { text: "Ножны", value: "sheath" },
          { text: "Аксессуары", value: "accessory" },
          { text: "Подарочные наборы", value: "gift_set" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadFilterData();
  }, []);

  const updatePriceRange = (range: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange: range }));
  };

  const toggleBrand = (brand: string) => {
    setFilters(prev => {
      const newSelected = new Set(prev.selectedBrands);
      if (newSelected.has(brand)) {
        newSelected.delete(brand);
      } else {
        newSelected.add(brand);
      }
      return { ...prev, selectedBrands: newSelected };
    });
  };

  const toggleMaterial = (material: string) => {
    setFilters(prev => {
      const newSelected = new Set(prev.selectedMaterials);
      if (newSelected.has(material)) {
        newSelected.delete(material);
      } else {
        newSelected.add(material);
      }
      return { ...prev, selectedMaterials: newSelected };
    });
  };

  const toggleType = (type: string) => {
    setFilters(prev => {
      const newSelected = new Set(prev.selectedTypes);
      if (newSelected.has(type)) {
        newSelected.delete(type);
      } else {
        newSelected.add(type);
      }
      return { ...prev, selectedTypes: newSelected };
    });
  };

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 50000],
      selectedBrands: new Set(),
      selectedMaterials: new Set(),
      selectedTypes: new Set(),
      searchQuery: "",
    });
  };

  const value: FilterContextType = {
    filters,
    setFilters,
    brands,
    materials,
    types,
    loading,
    updatePriceRange,
    toggleBrand,
    toggleMaterial,
    toggleType,
    setSearchQuery,
    clearFilters,
  };

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  );
};
