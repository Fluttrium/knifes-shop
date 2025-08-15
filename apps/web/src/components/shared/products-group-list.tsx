"use client";

import React from "react";
import { ProductCard } from "./product-card";
import api, { Product, ProductImage } from "@repo/api-client";
import { useFilters } from "@/contexts/filter-context";

interface Props {
  title: string;
  categoryId: string;
  className?: string;
  isSale?: boolean;
}

export const ProductsGroupList: React.FC<Props> = ({
  title,
  categoryId,
  className,
  isSale = false,
}) => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { filters } = useFilters();

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let response;
        if (isSale) {
          // Получаем товары на распродаже с фильтрами
          const saleProducts = await api.products.getOnSaleProducts(100);
          response = applyFilters(saleProducts);
        } else {
          // Получаем товары по категории с фильтрами
          const brandsParam = filters.selectedBrands.size > 0 ? 
            Array.from(filters.selectedBrands) : undefined;
          
          const categoryResponse = await api.products.getProducts({
            categoryId,
            limit: 100,
            minPrice: filters.priceRange[0] !== null ? filters.priceRange[0] : undefined,
            maxPrice: filters.priceRange[1] !== null ? filters.priceRange[1] : undefined,
            search: filters.searchQuery || undefined,
            brands: brandsParam,
          });
          
          response = applyFilters(categoryResponse.products);
        }

        setProducts(response);
        console.log(
          `✅ Fetched ${response.length} products for ${isSale ? "sale" : `category: ${title}`}`,
        );
      } catch (error) {
        console.error(
          `❌ Error fetching products for ${isSale ? "sale" : `category ${categoryId}`}:`,
          error,
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, title, isSale, filters]);

  // Функция для применения фильтров на клиентской стороне
  const applyFilters = (products: Product[]): Product[] => {
    return products.filter((product) => {
      // Фильтр по брендам уже применяется на сервере, поэтому пропускаем

      // Фильтр по материалам
      if (filters.selectedMaterials.size > 0 && product.material) {
        const selectedMaterialsArray = Array.from(filters.selectedMaterials);
        const hasMatchingMaterial = selectedMaterialsArray.some(selectedMaterial => 
          selectedMaterial === product.material
        );
        if (!hasMatchingMaterial) {
          return false;
        }
      }

      // Фильтр по типам товаров
      if (filters.selectedTypes.size > 0) {
        const selectedTypesArray = Array.from(filters.selectedTypes);
        const hasMatchingType = selectedTypesArray.some(selectedType => 
          selectedType === product.productType
        );
        if (!hasMatchingType) {
          return false;
        }
      }

      // Фильтр по цене (уже применяется на сервере, но проверяем еще раз)
      const price = Number(product.price);
      if (filters.priceRange[0] !== null && price < filters.priceRange[0]) {
        return false;
      }
      if (filters.priceRange[1] !== null && price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  };

  const getPrimaryImage = (images: ProductImage[] | undefined) => {
    if (!images || images.length === 0) return "/placeholder.jpg";
    const primaryImage = images.find((img) => img.isPrimary);
    return primaryImage?.url || images[0]?.url || "/placeholder.jpg";
  };

  if (loading) {
    return (
      <div className={className} id={`category-${categoryId}`}>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1  xl:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 animate-pulse rounded-lg aspect-square"
            />
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
          <p className="text-gray-500">
            {isSale
              ? "Товары на распродаже скоро появятся"
              : "Товары в этой категории скоро появятся"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              price={Number(product.price)}
              comparePrice={
                product.comparePrice ? Number(product.comparePrice) : undefined
              }
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
