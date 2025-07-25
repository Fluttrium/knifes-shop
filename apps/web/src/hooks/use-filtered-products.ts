import { useEffect, useState, useCallback, useMemo } from 'react';
import api, { Product } from '@repo/api-client';
import { KnifeFilters } from './use-knife-filters';

interface UseFilteredProductsProps {
  filters: KnifeFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  categoryId?: string;
  enableDebugLogs?: boolean;
}

// Helper function to filter products
const applyFilters = (products: Product[], filters: KnifeFilters, categoryId?: string): Product[] => {
  let filtered = [...products];

  // Category filter
  const targetCategoryId = categoryId || filters.categoryId;
  if (targetCategoryId) {
    filtered = filtered.filter(product => product.categoryId === targetCategoryId);
  }

  // Price filters
  if (filters.prices.priceFrom !== undefined && filters.prices.priceFrom > 0) {
    filtered = filtered.filter(product => product.price >= filters.prices.priceFrom!);
  }

  if (filters.prices.priceTo !== undefined && filters.prices.priceTo > 0) {
    filtered = filtered.filter(product => product.price <= filters.prices.priceTo!);
  }

  // Brand filter
  if (filters.brands.size > 0) {
    filtered = filtered.filter(product =>
      product.brand && filters.brands.has(product.brand)
    );
  }

  // Material filter
  if (filters.materials.size > 0) {
    filtered = filtered.filter(product =>
      product.material && filters.materials.has(product.material)
    );
  }

  // Product type filter
  if (filters.productTypes.size > 0) {
    filtered = filtered.filter(product =>
      product.productType && filters.productTypes.has(product.productType)
    );
  }

  // Handle type filter
  if (filters.handleTypes.size > 0) {
    filtered = filtered.filter(product =>
      product.handleType && filters.handleTypes.has(product.handleType)
    );
  }

  return filtered;
};

// Helper function to sort products
const sortProducts = (products: Product[], sortBy: string, sortOrder: 'asc' | 'desc'): Product[] => {
  return [...products].sort((a, b) => {
    let aVal: any, bVal: any;

    switch (sortBy) {
      case 'price':
        aVal = a.price;
        bVal = b.price;
        break;
      case 'name':
        aVal = a.name;
        bVal = b.name;
        break;
      case 'brand':
        aVal = a.brand || '';
        bVal = b.brand || '';
        break;
      default:
        aVal = a.createdAt;
        bVal = b.createdAt;
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

export const useFilteredProducts = ({
                                      filters,
                                      sortBy = 'createdAt',
                                      sortOrder = 'desc',
                                      categoryId,
                                      enableDebugLogs = false
                                    }: UseFilteredProductsProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize filtered products to avoid unnecessary recalculations
  const filteredProducts = useMemo(() => {
    if (allProducts.length === 0) return [];

    const filtered = applyFilters(allProducts, filters, categoryId);
    const sorted = sortProducts(filtered, sortBy, sortOrder);

    if (enableDebugLogs) {
      console.log(`✅ Filtered products count: ${filtered.length}`);
      console.log(`📊 Sorted by: ${sortBy} (${sortOrder})`);
    }

    return sorted;
  }, [allProducts, filters, sortBy, sortOrder, categoryId, enableDebugLogs]);

  // Fetch all products once on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        if (enableDebugLogs) {
          console.log('🔍 Fetching all products...');
        }

        const response = await api.products.getProducts({ limit: 1000 });

        if (enableDebugLogs) {
          console.log(`📦 Total products in database: ${response.products.length}`);

          if (response.products.length > 0) {
            const sample = response.products[0];
            console.log('📊 Sample product structure:', {
              name: sample.name,
              price: sample.price,
              brand: sample.brand,
              material: sample.material,
              productType: sample.productType,
              handleType: sample.handleType,
              categoryId: sample.categoryId
            });
          }
        }

        setAllProducts(response.products);
      } catch (err) {
        console.error('❌ Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []); // Only run once on mount

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.products.getProducts({ limit: 1000 });
      setAllProducts(response.products);
    } catch (err) {
      console.error('❌ Error refetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to reload products');
    } finally {
      setLoading(false);
    }
  }, []);

  // Additional helper methods
  const getFilterStats = useCallback(() => {
    if (allProducts.length === 0) return null;

    const brands = new Set(allProducts.map(p => p.brand).filter(Boolean));
    const materials = new Set(allProducts.map(p => p.material).filter(Boolean));
    const productTypes = new Set(allProducts.map(p => p.productType).filter(Boolean));
    const handleTypes = new Set(allProducts.map(p => p.handleType).filter(Boolean));

    return {
      totalProducts: allProducts.length,
      filteredCount: filteredProducts.length,
      availableBrands: Array.from(brands),
      availableMaterials: Array.from(materials),
      availableProductTypes: Array.from(productTypes),
      availableHandleTypes: Array.from(handleTypes),
      priceRange: {
        min: Math.min(...allProducts.map(p => p.price)),
        max: Math.max(...allProducts.map(p => p.price))
      }
    };
  }, [allProducts, filteredProducts]);

  return {
    products: filteredProducts,
    loading,
    error,
    refetch,
    getFilterStats,
    totalProductsCount: allProducts.length
  };
};