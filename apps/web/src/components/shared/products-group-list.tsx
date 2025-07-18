'use client';

import React from 'react';
import { ProductCard } from './product-card';
import api, { Product, ProductImage } from '@repo/api-client';

interface Props {
  title: string;
  categoryId: string;
  className?: string;
}

export const ProductsGroupList: React.FC<Props> = ({
                                                     title,
                                                     categoryId,
                                                     className,
                                                   }) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log(`🔍 Fetching products for category: ${categoryId}`);

        // Получаем товары с фильтром по категории
        const response = await api.products.getProducts({
          categoryId,
          limit: 20
        });

        console.log(`✅ Fetched ${response.products.length} products for category: ${title}`);
        setProducts(response.products);
      } catch (error) {
        console.error(`❌ Error fetching products for category ${categoryId}:`, error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, title]);

  const getPrimaryImage = (images: ProductImage[] | undefined) => {
    if (!images || images.length === 0) return '/placeholder.jpg';
    const primaryImage = images.find(img => img.isPrimary);
    return primaryImage?.url || images[0]?.url || '/placeholder.jpg';
  };

  if (loading) {
    return (
      <div className={className} id={`category-${categoryId}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className} id={`category-${categoryId}`}>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Товары в этой категории скоро появятся</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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