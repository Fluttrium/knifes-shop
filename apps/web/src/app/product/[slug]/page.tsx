"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Package, Truck, Shield, ArrowLeft } from "lucide-react";
import api, { Product } from "@repo/api-client";
import { AddToCartButton } from "@/components/shared/add-to-cart-button";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const slug = params.slug as string;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await api.products.getProductBySlug(slug);
        setProduct(productData);
        
        // Устанавливаем основное изображение
        if (productData.images && productData.images.length > 0) {
          const primaryImage = productData.images.find(img => img.isPrimary);
          const imageUrl = primaryImage?.url || productData.images[0]?.url;
          if (imageUrl) {
            setSelectedImage(imageUrl);
          }
        }
      } catch (err) {
        console.error("Ошибка при загрузке товара:", err);
        setError("Товар не найден");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  const getDiscountPercent = () => {
    if (!product?.comparePrice || !product?.price) return 0;
    return Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
  };

  const getMaterialLabel = (material: string) => {
    const materials = {
      stainless_steel: "Нержавеющая сталь",
      carbon_steel: "Углеродистая сталь",
      damascus_steel: "Дамасская сталь",
      ceramic: "Керамика",
      titanium: "Титан",
      wood: "Дерево",
      plastic: "Пластик",
      leather: "Кожа",
      synthetic: "Синтетика",
    };
    return materials[material as keyof typeof materials] || material;
  };

  const getProductTypeLabel = (type: string) => {
    const types = {
      knife: "Нож",
      sharpener: "Точилка",
      sheath: "Ножны",
      accessory: "Аксессуар",
      gift_set: "Подарочный набор",
    };
    return types[type as keyof typeof types] || type;
  };

  const getHandleTypeLabel = (type: string) => {
    const types = {
      fixed: "Фиксированный",
      folding: "Складной",
      multi_tool: "Мультитул",
    };
    return types[type as keyof typeof types] || type;
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Товар не найден</h2>
          <p className="text-muted-foreground text-center">
            {error || "Запрашиваемый товар не существует"}
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться в каталог
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Главная
          </Link>
          <span>/</span>
          <Link href={`/category/${product.category.slug}`} className="hover:text-foreground">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Галерея изображений */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={selectedImage || "/placeholder-image.jpg"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(image.url)}
                    className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === image.url ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || product.name}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            {/* Заголовок и бренд */}
            <div>
              {product.brand && (
                <p className="text-sm text-muted-foreground uppercase mb-2">{product.brand}</p>
              )}
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              {/* Бейджи */}
              <div className="flex gap-2 mb-4">
                {product.isNew && (
                  <Badge className="bg-primary text-primary-foreground">
                    Новинка
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-primary text-primary-foreground">
                    <Star size={12} className="mr-1" />
                    Хит
                  </Badge>
                )}
                {product.isOnSale && getDiscountPercent() > 0 && (
                  <Badge variant="destructive">
                    -{getDiscountPercent()}%
                  </Badge>
                )}
                {product.stockQuantity === 0 && (
                  <Badge variant="outline" className="text-destructive">
                    Нет в наличии
                  </Badge>
                )}
              </div>
            </div>

            {/* Цена */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
              {product.stockQuantity > 0 && (
                <p className="text-sm text-green-600">
                  В наличии: {product.stockQuantity} шт.
                </p>
              )}
            </div>

            {/* Краткое описание */}
            {product.shortDescription && (
              <div>
                <h3 className="font-semibold mb-2">Краткое описание</h3>
                <p className="text-muted-foreground">{product.shortDescription}</p>
              </div>
            )}

            {/* Кнопка добавления в корзину */}
            <div className="space-y-4">
              <AddToCartButton
                productId={product.id}
                stockQuantity={product.stockQuantity}
                className="w-full"
                size="lg"
              />
              
              {/* Информация о доставке */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                <span>Бесплатная доставка от 5000 ₽</span>
              </div>
            </div>

            {/* Характеристики */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Характеристики</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Тип товара:</span>
                  <span>{getProductTypeLabel(product.productType)}</span>
                </div>
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Материал:</span>
                    <span>{getMaterialLabel(product.material)}</span>
                  </div>
                )}
                {product.handleType && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Тип рукояти:</span>
                    <span>{getHandleTypeLabel(product.handleType)}</span>
                  </div>
                )}
                {product.bladeLength && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Длина лезвия:</span>
                    <span>{product.bladeLength} см</span>
                  </div>
                )}
                {product.totalLength && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Общая длина:</span>
                    <span>{product.totalLength} см</span>
                  </div>
                )}
                {product.bladeHardness && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Твердость лезвия:</span>
                    <span>{product.bladeHardness} HRC</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Вес:</span>
                    <span>{product.weight} г</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Размеры:</span>
                    <span>{product.dimensions}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Подробное описание */}
            {product.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Описание</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {product.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
