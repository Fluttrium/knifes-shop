"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  productsCount?: number;
}

interface Props {
  categories: Category[];
  className?: string;
}

export const TopBar: React.FC<Props> = ({ categories, className }) => {
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element && containerRef.current) {
      element.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveCategory(categoryId);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full overflow-x-auto no-scrollbar",
        "bg-gray-50 p-2 rounded-2xl",
        className
      )}
    >
      <div className="flex gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            id={`topbar-${category.id}`}
            onClick={() => scrollToCategory(category.id)}
            className={cn(
              "flex-shrink-0",
              "font-semibold h-10 sm:h-11 rounded-full px-4 sm:px-5",
              "transition-all duration-200 whitespace-nowrap",
              activeCategory === category.id
                ? "bg-white text-primary shadow-md"
                : "text-gray-600 hover:bg-white/60 hover:text-primary"
            )}
          >
            {category.name}
            {category.productsCount !== undefined && (
              <span className="opacity-70"> ({category.productsCount})</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
