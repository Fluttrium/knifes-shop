import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { ProductCard } from "@/components/shared/product-card";


// Базовый URL вашего NestJS API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1488/api/v1';

// Типы на основе ваших Entity
interface ProductImageEntity {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
}

interface CategoryEntity {
  id: string;
  name: string;
  slug: string;
}

interface ProductEntity {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  brand?: string;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  category: CategoryEntity;
  images: ProductImageEntity[];
}

// Функция для получения всех товаров
async function getAllProducts(): Promise<ProductEntity[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/all-products`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Функция для получения основного изображения
function getPrimaryImage(images: ProductImageEntity[]) {
  const primaryImage = images.find(img => img.isPrimary);
  return primaryImage?.url || images[0]?.url || '/placeholder.jpg';
}

export default async function Home() {
  const products = await getAllProducts();

  return (
    <>
      {/* Заголовок */}
      <Container className="mt-10 pl-4 md:pl-0">
        <Title text="Все товары" size="lg" className="font-extrabold" />
      </Container>

      {/* Товары */}
      <Container className="mt-10 pb-14">
        <div className="pl-4 md:pl-0">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Товары скоро появятся</p>
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
                  isNew={product.isNew}
                  isFeatured={product.isFeatured}
                  isOnSale={product.isOnSale}
                  stockQuantity={product.stockQuantity}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}