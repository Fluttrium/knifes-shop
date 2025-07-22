import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ProductsGroupList } from "@/components/shared/products-group-list";
import { TopBar } from "@/components/shared/top-bar";
import { Stories } from "@/components/shared/stories";
import { Filters } from "@/components/shared/filters";
import { Suspense } from "react";
import api, { Category } from "@repo/api-client";

// Функция для получения категорий через API клиент
async function getAllCategories(): Promise<Category[]> {
  try {
    console.log("📂 Fetching categories via API client...");
    const categories = await api.products.getCategories();
    console.log(`✅ Fetched ${categories.length} categories via API client`);
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
    <>
      {/* Заголовок с отступом слева для мобильных */}
      <Container className="mt-10 pl-4 md:pl-0">
        <Title text="Магазин ножей" size="lg" className="font-extrabold" />
        <p className="text-gray-600 mt-2">
          Качественные ножи для кухни, охоты и повседневного использования
        </p>
      </Container>

      {/* TopBar с фиксированным положением и горизонтальной прокруткой на мобильных устройствах */}
      <Container className="mt-4 sticky top-0 bg-white z-10 shadow-md">
        <div className="overflow-x-auto pl-4 md:pl-0">
          <TopBar categories={categories} />
        </div>
      </Container>

      {/* Stories с горизонтальной прокруткой на мобильных устройствах */}
      <Container className="mt-10">
        <div className="overflow-x-auto pl-4 md:pl-0">
          <Stories />
        </div>
      </Container>

      {/* Контент */}
      <Container className="mt-10 pb-14">
        <div className="flex flex-col lg:flex-row gap-[80px]">
          {/* Фильтрация с отступом слева и справа для мобильных */}
          <div className="w-full lg:w-[250px] pl-4 pr-4 md:pl-0 md:pr-0">
            <Suspense
              fallback={
                <div className="h-96 bg-gray-100 animate-pulse rounded-lg" />
              }
            >
              <Filters />
            </Suspense>
          </div>

          {/* Список товаров с отдельным скроллом для каждой категории */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map((category) => (
                <div key={category.id}>
                  <div className="pl-4 md:pl-0">
                    <ProductsGroupList
                      title={category.name}
                      categoryId={category.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
