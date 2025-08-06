'use client';

import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CountButton } from "@/components/shared/count-button";
import { Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart } = useCart();

  // Обработчики
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    await updateCartItem(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
  };

  const handleClearCart = async () => {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
      await clearCart();
    }
  };

  // Состояния загрузки
  if (!isAuthenticated) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Корзина недоступна</h2>
          <p className="text-muted-foreground text-center">
            Для доступа к корзине необходимо войти в систему
          </p>
          <Link href="/signin">
            <Button>Войти в систему</Button>
          </Link>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p>Загрузка корзины...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Корзина пуста</h2>
          <p className="text-muted-foreground text-center">
            Добавьте товары в корзину для оформления заказа
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Перейти к покупкам
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Корзина</h1>
          <Button variant="outline" onClick={handleClearCart}>
            <Trash2 className="h-4 w-4 mr-2" />
            Очистить корзину
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const productImage = item.product.images.find(img => img.isPrimary) || item.product.images[0];
              const variant = item.variant;
              const price = Number(variant?.price || item.product.price);
              const maxQuantity = variant?.stockQuantity || item.product.stockQuantity || 1;
              
              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Изображение товара */}
                      <div className="relative w-20 h-20 flex-shrink-0">
                        {productImage ? (
                          <Image
                            src={productImage.url}
                            alt={productImage.alt || item.product.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                            <span className="text-muted-foreground text-xs">Нет фото</span>
                          </div>
                        )}
                      </div>

                      {/* Информация о товаре */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">
                          {item.product.name}
                        </h3>
                        {variant && (
                          <p className="text-sm text-muted-foreground">
                            Вариант: {variant.name}
                          </p>
                        )}
                        <p className="text-lg font-semibold text-primary mt-2">
                          {price.toLocaleString('ru-RU')} ₽
                        </p>
                      </div>

                      {/* Управление количеством */}
                      <div className="flex flex-col items-end space-y-2">
                        <CountButton
                          value={item.quantity}
                          onClick={(type) => {
                            if (type === 'plus' && item.quantity < maxQuantity) {
                              handleQuantityChange(item.id, item.quantity + 1);
                            } else if (type === 'minus' && item.quantity > 1) {
                              handleQuantityChange(item.id, item.quantity - 1);
                            }
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Итоги */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Итоги заказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Товаров:</span>
                  <span>{cart.totalItems} шт.</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Итого:</span>
                  <span>{Number(cart.totalPrice).toLocaleString('ru-RU')} ₽</span>
                </div>
                <Link href="/checkout">
                  <Button className="w-full" size="lg">
                    Оформить заказ
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
} 