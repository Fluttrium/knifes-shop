'use client';

import React from 'react';
import { ProductCard } from './product-card';
import { Product, ProductImage } from '@repo/api-client';

interface Props {
  title: string;
  categoryId: string;
  items: Product[];
  className?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
                                                     title,
                                                     categoryId,
                                                     items,
                                                     className,
                                                   }) => {
  const getPrimaryImage = (images: ProductImage[] | undefined): string => {
    if (!images || images.length === 0) return '/placeholder.jpg';
    const primaryImage = images.find(img => img.isPrimary);
    return primaryImage?.url || images[0]?.url || '/placeholder.jpg';
  };

  return (
    <div className={className} id={`category-${categoryId}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Товары в этой категории скоро появятся</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={Number(product.price)}
              comparePrice={product.comparePrice ? Number(product.comparePrice) : undefined}
              brand={product.brand}
              imageUrl={getPrimaryImage(product.images)}
              isNew={Boolean(product.isNew)}
              isFeatured={Boolean(product.isFeatured)}
              isOnSale={Boolean(product.isOnSale)}
              stockQuantity={product.stockQuantity}
            />
          ))}
        </div>
      )}
    </div>
  );
};