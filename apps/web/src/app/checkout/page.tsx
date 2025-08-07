'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { api } from '@repo/api-client';
import type { Address } from '@repo/api-client';
import { Container } from '@/components/shared/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { cart, loading: cartLoading } = useCart();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/signin');
      return;
    }

    if (cart && cart.items.length === 0) {
      router.push('/cart');
      return;
    }

    fetchAddresses();
  }, [isAuthenticated, cart, router]);

  const fetchAddresses = async () => {
    try {
      const response = await api.orders.getAddresses();
      setAddresses(response);
      
      // Выбираем адрес по умолчанию
      const defaultAddress = response.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (response.length > 0) {
        setSelectedAddressId(response[0]?.id || '');
      }
    } catch (err) {
      console.error('Ошибка при загрузке адресов:', err);
      setError('Ошибка при загрузке адресов');
    }
  };

  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      setError('Выберите адрес доставки');
      return;
    }

    // Проверяем, что выбранный адрес имеет телефон
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress?.phone) {
      setError('В выбранном адресе отсутствует номер телефона. Пожалуйста, добавьте телефон в адрес доставки.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!cart) {
        throw new Error('Корзина недоступна');
      }

      // Создаем заказ
      const orderData = {
        shippingAddressId: selectedAddressId,
        notes,
      };

      const order = await api.orders.createOrder(orderData);
      // Order created successfully

      // Создаем платеж
      const paymentData = {
        orderId: order.id,
        amount: Number(order.totalAmount),
        currency: order.currency,
        description: `Оплата заказа #${order.orderNumber}`,
      };

      const payment = await api.payments.createPayment(paymentData);
              // Payment created successfully

      // Перенаправляем на страницу оплаты
      if (payment.paymentUrl) {
        window.location.href = payment.paymentUrl;
      } else {
        router.push(`/orders/${order.id}`);
      }
    } catch (err) {
      console.error('❌ Ошибка при создании заказа:', err);
      setError('Ошибка при создании заказа. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || cartLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-muted-foreground">Корзина пуста</p>
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
          <h1 className="text-3xl font-bold">Оформление заказа</h1>
          <Link href="/cart">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться в корзину
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Адрес доставки */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Адрес доставки
                </CardTitle>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      У вас нет сохраненных адресов
                    </p>
                    <Link href="/profile/addresses">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить адрес
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedAddressId === address.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        } ${!address.phone ? 'border-red-200 bg-red-50' : ''}`}
                        onClick={() => setSelectedAddressId(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">
                                {address.firstName} {address.lastName}
                              </span>
                              {address.isDefault && (
                                <Badge variant="secondary">По умолчанию</Badge>
                              )}
                              {!address.phone && (
                                <Badge variant="destructive">Нет телефона</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {address.address1}
                              {address.address2 && `, ${address.address2}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.city}, {address.state} {address.postalCode}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {address.country}
                            </p>
                            {address.phone ? (
                              <p className="text-sm text-green-600 font-medium">
                                📞 {address.phone}
                              </p>
                            ) : (
                              <p className="text-sm text-red-600">
                                ⚠️ Номер телефона не указан
                              </p>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                              {selectedAddressId === address.id && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Комментарий к заказу */}
            <Card>
              <CardHeader>
                <CardTitle>Комментарий к заказу</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Дополнительная информация к заказу (необязательно)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Товары в заказе */}
            <Card>
              <CardHeader>
                <CardTitle>Товары в заказе</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.items.map((item) => {
                    const productImage = item.product.images.find(img => img.isPrimary) || item.product.images[0];
                    const variant = item.variant;
                    const price = Number(variant?.price || item.product.price);
                    
                    return (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
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
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">
                            {item.product.name}
                          </h3>
                          {variant && (
                            <p className="text-sm text-muted-foreground">
                              Вариант: {variant.name}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            Количество: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {(price * item.quantity).toLocaleString('ru-RU')} ₽
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {price.toLocaleString('ru-RU')} ₽ за шт.
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Итоги заказа */}
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
                <div className="flex justify-between">
                  <span>Стоимость товаров:</span>
                  <span>{Number(cart.totalPrice).toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка:</span>
                  <span>Бесплатно</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Итого к оплате:</span>
                  <span>{Number(cart.totalPrice).toLocaleString('ru-RU')} ₽</span>
                </div>
                
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCreateOrder}
                  disabled={loading || !selectedAddressId}
                >
                  {loading ? 'Обработка...' : 'Оформить заказ'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Нажимая кнопку «Оформить заказ», вы соглашаетесь с условиями покупки
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
} 