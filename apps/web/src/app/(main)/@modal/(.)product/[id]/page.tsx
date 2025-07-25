'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { CartButton } from "@/components/ui/card-button";
import { Title } from "@/components/shared/title";
import { ArrowLeft, Home } from "lucide-react";
import { SearchInput } from "@/components/shared/search-input";
import { ProductForm } from "@/components/shared/product-form";
import { ProductService } from "@repo/api-client";
import type { Product } from "@repo/api-client";

const productService = new ProductService();

// Расширяем Product, делая обязательными флаги isNew и isOnSale
type FrontendProduct = Omit<Product, 'isNew' | 'isOnSale'> & {
  isNew: boolean;
  isOnSale: boolean;
};

async function fetchProduct(id: number): Promise<FrontendProduct> {
  const product = await productService.getProductById(id.toString());
  return {
    ...product,
    isNew: product.isNew ?? false,         // нормализация
    isOnSale: product.isOnSale ?? false,   // нормализация
  };
}

export default function ProductPage() {
  const [product, setProduct] = useState<FrontendProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams(); // { id: string }
  const id = Number(params.id);
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/shop');
  };

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const pd = await fetchProduct(id);
        if (!pd) setError('Продукт не найден');
        else setProduct(pd);
      } catch (err) {
        console.error(err);
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return renderLoading();
  if (error) return renderError(error);
  if (!product) return renderNotFound();

  return (
    <Container>
      <TopBar onBack={handleBack} />
      <ProductForm slug={""} />
    </Container>
  );

  function renderLoading() {
    return (
      <Container>
        <TopBar onBack={handleBack} />
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Container>
    );
  }

  function renderError(msg: string) {
    return (
      <Container>
        <TopBar onBack={handleBack} />
        <div className="min-h-[400px] flex items-center justify-center text-red-600">{msg}</div>
      </Container>
    );
  }

  function renderNotFound() {
    return (
      <Container>
        <TopBar onBack={handleBack} />
        <div className="min-h-[400px] flex items-center justify-center text-gray-600">
          Товар не найден
        </div>
      </Container>
    );
  }
}

function TopBar({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  return (
    <div className="sticky top-0 bg-white border-b z-40 py-4 flex items-center justify-between px-4 mb-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack}>
          <ArrowLeft />
          <span className="ml-2">Назад</span>
        </button>
        <Title text="Редактирование товара" size="lg" />
      </div>
      <div className="flex items-center gap-3">
        <SearchInput />
        <CartButton />
        <button onClick={() => router.push('/shop')}>
          <Home />
          <span className="ml-2">Каталог</span>
        </button>
      </div>
    </div>
  );
}
