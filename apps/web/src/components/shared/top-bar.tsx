'use client';

import React from 'react';
import { cn } from '@/lib/utils';

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

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveCategory(categoryId);
    }
  };

  return (
    <div className={cn('flex items-center gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => scrollToCategory(category.id)}
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5 transition-colors duration-200 whitespace-nowrap',
            activeCategory === category.id
              ? 'bg-white text-primary shadow-md'
              : 'text-gray-500 hover:bg-white/50'
          )}
        >
          <span>
            {category.name}
            {category.productsCount !== undefined && ` (${category.productsCount})`}
          </span>
        </button>
      ))}
    </div>
  );
};