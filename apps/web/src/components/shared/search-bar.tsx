"use client";

import React from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useFilters } from "@/contexts/filter-context";

interface Props {
  className?: string;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({
  className,
  placeholder = "Поиск товаров...",
}) => {
  const { filters, setSearchQuery } = useFilters();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder={placeholder}
        value={filters.searchQuery}
        onChange={handleSearchChange}
        className="pl-10"
      />
    </div>
  );
};
