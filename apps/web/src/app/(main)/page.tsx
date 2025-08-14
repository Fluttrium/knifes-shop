import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ProductsGroupList } from "@/components/shared/products-group-list";
import { TopBar } from "@/components/shared/top-bar";
import { SearchBar } from "@/components/shared/search-bar";
//import { Stories } from "@/components/shared/stories";
import { Filters } from "@/components/shared/filters";
import { FilterProvider } from "@/contexts/filter-context";
import { Suspense } from "react";
import api, { Category } from "@repo/api-client";
import BannerSlider from "@/components/ui/banerSlider";

// Принудительно делаем страницу динамической
export const dynamic = "force-dynamic";

// Функция для получения категорий через API клиент
async function getAllCategories(): Promise<Category[]> {
  try {
    // Fetching categories via API client
    const categories = await api.products.getCategories();
    // Categories loaded successfully
    return categories;
  } catch (error) {
    console.error("❌ Error fetching categories via API client:", error);
    return [];
  }
}

// Функция для получения количества товаров в каждой категории
async function getCategoriesWithCounts(): Promise<Category[]> {
  try {
    const categories = await getAllCategories();

    // Для каждой категории получаем количество товаров
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        try {
          const response = await api.products.getProducts({
            categoryId: category.id,
            limit: 1,
          });
          return {
            ...category,
            productsCount: response.total || 0,
          };
        } catch (error) {
          console.error(
            `Error fetching count for category ${category.id}:`,
            error,
          );
          return {
            ...category,
            productsCount: 0,
          };
        }
      }),
    );

    return categoriesWithCounts.filter((cat) => cat.productsCount > 0);
  } catch (error) {
    console.error("❌ Error fetching categories with counts:", error);
    return [];
  }
}

export default async function Home() {
  // Получаем категории с количеством товаров
  const categories = await getCategoriesWithCounts();

  return (
    <FilterProvider>
      {/* Заголовок */}
      <Container className="mt-6 sm:mt-10 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          {/* Левый блок — текст */}
          <div className="text-center sm:text-left">
            <Title text="Магазин ножей" size="lg" className="font-extrabold" />
            <p className="text-gray-600 mt-2">
              Качественные ножи для кухни, охоты и повседневного использования
            </p>
          </div>

          {/* Правый блок — телефон */}
          <div className="flex justify-center sm:justify-end mt-4 sm:mt-0 sm:pr-6 w-full sm:w-auto">
            <a
              href="tel:+79214570057"
              className="flex items-center bg-gray-100 hover:bg-gray-200 transition-all duration-200 px-4 py-2 rounded-lg text-gray-700 shadow-sm hover:shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-gray-500 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2 5.5A3.5 3.5 0 015.5 2h.8a1 1 0 01.97.757l.7 2.8a1 1 0 01-.27.95l-1.2 1.2a16 16 0 006.8 6.8l1.2-1.2a1 1 0 01.95-.27l2.8.7a1 1 0 01.757.97v.8A3.5 3.5 0 0118.5 22h-1A15.5 15.5 0 012 6.5v-1z"
                />
              </svg>
              +7 921 457-00-57
            </a>
          </div>

        </div>
      </Container>
      {/* Поиск */}
      <Container className=" lg:hidden mt-6 px-4 sm:px-0">
        <SearchBar className="max-w-md" />
      </Container>

      {/* TopBar */}
      <Container className="mt-4 sticky top-0 z-10 shadow-md rounded-2xl">
        <div className="overflow-x-auto px-4 sm:px-0">
          <TopBar categories={categories} />
        </div>
      </Container>
      <BannerSlider />
      {/*/!* Stories *!/*/}
      {/*<Container className="mt-10">*/}
      {/*  <div className="overflow-x-auto px-4 sm:px-0">*/}
      {/*    <Stories />*/}
      {/*  </div>*/}
      {/*</Container>*/}

      {/*/!* Секция распродажи *!/*/}
      {/*<Container className="mt-10">*/}
      {/*  <div className="px-4 sm:px-0">*/}
      {/*    <ProductsGroupList*/}
      {/*      title="Распродажа"*/}
      {/*      categoryId="sale"*/}
      {/*      isSale={true}*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*</Container>*/}

      {/* Контент */}
      <Container className="mt-8 sm:mt-10 pb-14">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Фильтрация */}
          <div className="w-full lg:w-64 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-4">
              <Suspense
                fallback={
                  <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
                }
              >
                <Filters />
              </Suspense>
            </div>
          </div>

          {/* Список товаров */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col gap-12 sm:gap-16">
              {categories.map((category) => (
                <div key={category.id}>
                  <ProductsGroupList
                    title={category.name}
                    categoryId={category.id}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </FilterProvider>
  );
}
