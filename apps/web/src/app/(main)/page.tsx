"use client";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ProductsGroupList } from "@/components/shared/products-group-list";
import { TopBar } from "@/components/shared/top-bar";
import { Stories } from "@/components/shared/stories";
import { Filters } from "@/components/shared/filters";
import { SortPopup } from "@/components/shared/sort-popup";
import { useSearchParams, useRouter } from 'next/navigation';
import { useKnifeFilters } from '@/hooks/use-knife-filters';
import { useQueryFilters } from '@/hooks/use-query-filters';
import api, { Category } from '@repo/api-client';
import { Suspense, useEffect, useState } from "react";

interface CategoryWithProducts extends Category {
  products: any[];
  productsCount: number;
}

function ShopContent() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParamsHook = useSearchParams();
  const router = useRouter();
  const [urlParams, setUrlParams] = useState('');

  const filters = useKnifeFilters();
  useQueryFilters(filters);

  // Текущая сортировка
  const currentSort = searchParamsHook.get('sortBy') || 'popular';

  useEffect(() => {
    const currentParams = searchParamsHook.toString();
    console.log('🌐 URL changed:', window.location.href);
    console.log('🌐 searchParams toString:', currentParams);
    setUrlParams(currentParams);
  }, [searchParamsHook.toString()]);

  // Функция для получения параметров сортировки
  const getSortParams = (sortValue: string) => {
    switch (sortValue) {
      case 'popular':
        return { sortBy: 'sortOrder', sortOrder: 'asc' as const };
      case 'price_asc':
        return { sortBy: 'price', sortOrder: 'asc' as const };
      case 'price_desc':
        return { sortBy: 'price', sortOrder: 'desc' as const };
      case 'name':
        return { sortBy: 'name', sortOrder: 'asc' as const };
      case 'newest':
        return { sortBy: 'createdAt', sortOrder: 'desc' as const };
      default:
        return { sortBy: 'sortOrder', sortOrder: 'asc' as const };
    }
  };

  // ОСНОВНОЙ useEffect для загрузки продуктов по категориям с фильтрами
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const loadProductsByCategories = async () => {
      try {
        setLoading(true);
        console.log('🔥 Main page useEffect triggered! urlParams:', urlParams);
        console.log('🔥 Current window.location.search:', window.location.search);

        // Получаем параметры сортировки
        const sortParams = getSortParams(currentSort);

        // Получаем все параметры из URL для фильтрации
        const filterParams = {
          priceFrom: searchParamsHook.get('priceFrom') ? Number(searchParamsHook.get('priceFrom')) : undefined,
          priceTo: searchParamsHook.get('priceTo') ? Number(searchParamsHook.get('priceTo')) : undefined,
          brands: searchParamsHook.get('brands') || undefined,
          materials: searchParamsHook.get('materials') || undefined,
          productTypes: searchParamsHook.get('productTypes') || undefined,
          handleTypes: searchParamsHook.get('handleTypes') || undefined,
          ...sortParams,
        };

        console.log('🔄 Applying filters:', filterParams);

        // Сначала получаем все категории
        const categoriesData = await api.products.getCategories();

        // Для каждой категории получаем отфильтрованные товары
        const categoriesWithProducts = await Promise.all(
          categoriesData.map(async (category) => {
            try {
              // Формируем параметры для каждой категории
              const queryParams: Record<string, any> = {
                categoryId: category.id,
                limit: 20,
                ...filterParams
              };

              // Убираем undefined значения
              const cleanParams = Object.fromEntries(
                Object.entries(queryParams).filter(([_, value]) => value !== undefined)
              );

              console.log(`📊 Query params for ${category.name}:`, cleanParams);

              const response = await api.products.getProducts(cleanParams);

              return {
                ...category,
                products: response.products,
                productsCount: response.products.length
              };
            } catch (error) {
              console.error(`❌ Error fetching products for category ${category.id}:`, error);
              return {
                ...category,
                products: [],
                productsCount: 0
              };
            }
          })
        );

        // Фильтруем категории только с товарами
        const filteredCategories = categoriesWithProducts.filter(cat => cat.productsCount > 0);

        console.log('📦 Filtered results:', filteredCategories.map(cat => ({
          name: cat.name,
          productsCount: cat.productsCount
        })));

        setCategories(filteredCategories);
      } catch (error) {
        console.error("❌ Ошибка загрузки продуктов:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    timeoutId = setTimeout(loadProductsByCategories, 50);
    return () => clearTimeout(timeoutId);
  }, [
    searchParamsHook.get('priceFrom'),
    searchParamsHook.get('priceTo'),
    searchParamsHook.get('brands'),
    searchParamsHook.get('materials'),
    searchParamsHook.get('productTypes'),
    searchParamsHook.get('handleTypes'),
    searchParamsHook.get('sortBy'),
    urlParams,
    currentSort
  ]);

  const totalProducts = categories.reduce((acc, cat) => acc + (cat.productsCount || 0), 0);
  const hasActiveFilters = filters.brands.size > 0 || filters.materials.size > 0 ||
    filters.productTypes.size > 0 || filters.handleTypes.size > 0 ||
    filters.prices.priceFrom || filters.prices.priceTo;

  if (loading) {
    return (
      <Container className="mt-10">
        <div className="text-center">Загрузка каталога...</div>
      </Container>
    );
  }

  return (
    <>
      {/* Заголовок */}
      <Container className="mt-10 pl-4 md:pl-0">
        <Title text="Магазин ножей" size="lg" className="font-extrabold" />
        <p className="text-gray-600 mt-2">
          Качественные ножи для кухни, охоты и повседневного использования
        </p>

        {/* Информация о фильтрации */}
        {hasActiveFilters && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Применены фильтры: найдено {totalProducts} товар{totalProducts === 1 ? '' : totalProducts > 4 ? 'ов' : 'а'}
            </p>
          </div>
        )}
      </Container>

      {/* TopBar с категориями */}
      <Container className="mt-4 sticky top-0 bg-white z-10 shadow-md">
        <div className="overflow-x-auto pl-4 md:pl-0">
          {loading ? (
            <div className="h-12 bg-gray-100 animate-pulse rounded-lg" />
          ) : (
            <TopBar categories={categories.filter(c => c.productsCount > 0)} />
          )}
        </div>
      </Container>

      {/* Stories */}
      <Container className="mt-10">
        <div className="overflow-x-auto pl-4 md:pl-0">
          <Stories />
        </div>
      </Container>

      {/* Контент */}
      <Container className="mt-10 pb-14">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-[80px]">
          {/* Фильтры */}
          <div className="lg:w-[250px] hidden lg:block">
            <Suspense fallback={<div>Загрузка фильтров…</div>}>
              <Filters />
            </Suspense>
          </div>

          {/* Товары по категориям */}
          <div className="flex-1 pl-4 lg:pl-8">
            {/* Сортировка */}
            <div className="flex justify-between items-center mb-6">
              <Title text={`Найдено товаров: ${totalProducts}`} size="sm" />
              <SortPopup />
            </div>

            {/* Результаты */}
            {categories.length === 0 && hasActiveFilters ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Ничего не найдено
                </h3>
                <p className="text-gray-500">
                  По выбранным фильтрам товары не найдены.
                  Попробуйте изменить параметры фильтрации.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-8 sm:gap-16">
                {categories.map((category) => {
                  const hasProducts = category.products && category.products.length > 0;
                  return hasProducts ? (
                    <ProductsGroupList
                      key={category.id}
                      title={category.name}
                      categoryId={category.id}
                      items={category.products}
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}

// Основной компонент с Suspense
export default function Home() {
  return (
    <Suspense fallback={
      <Container className="mt-10">
        <div className="text-center">Загрузка страницы...</div>
      </Container>
    }>
      <ShopContent />
    </Suspense>
  );
}