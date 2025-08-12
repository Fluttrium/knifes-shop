"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Package,
  MapPin,
  Phone,
  Calendar,
  Truck,
} from "lucide-react";
import api, { Order } from "@repo/api-client";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await api.orders.getOrderById(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error("Ошибка при загрузке заказа:", err);
        setError("Не удалось загрузить информацию о заказе");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, isAuthenticated, router]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Ожидает подтверждения",
        variant: "secondary" as const,
      },
      confirmed: { label: "Подтвержден", variant: "default" as const },
      processing: { label: "Обрабатывается", variant: "default" as const },
      shipped: { label: "Отправлен", variant: "default" as const },
      delivered: { label: "Доставлен", variant: "default" as const },
      cancelled: { label: "Отменен", variant: "destructive" as const },
      refunded: { label: "Возвращен", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Заказ не найден</h2>
          <p className="text-muted-foreground text-center">
            {error || "Заказ с указанным ID не существует"}
          </p>
          <Link href="/profile/orders">
            <Button>Вернуться к заказам</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        {/* Заголовок */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/profile/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />К заказам
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Заказ #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
              Создан {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Статус заказа */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Статус заказа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-2">{getStatusBadge(order.status)}</div>
                    <p className="text-sm text-muted-foreground">
                      Последнее обновление: {formatDate(order.updatedAt)}
                    </p>
                  </div>
                  {order.parcels?.[0]?.trackingNumber && (
                    <div className="text-right">
                      <p className="text-sm font-medium">Трек-номер</p>
                      <p className="text-sm text-muted-foreground">
                        {order.parcels[0].trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Товары */}
            <Card>
              <CardHeader>
                <CardTitle>Товары в заказе</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{item.productName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Количество: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatPrice(item.unitPrice)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Итого: {formatPrice(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Информация о доставке */}
            {order.parcels &&
              order.parcels.length > 0 &&
              (() => {
                const parcel = order.parcels[0];
                if (!parcel) return null;

                return (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Информация о доставке
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            Статус доставки:
                          </span>
                          <Badge variant="outline">{parcel.status}</Badge>
                        </div>
                        {parcel.trackingNumber && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Трек-номер:
                            </span>
                            <span className="text-sm font-medium">
                              {parcel.trackingNumber}
                            </span>
                          </div>
                        )}
                        {parcel.carrier && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Перевозчик:
                            </span>
                            <span className="text-sm font-medium">
                              {parcel.carrier}
                            </span>
                          </div>
                        )}
                        {parcel.shippedAt && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Дата отправки:
                            </span>
                            <span className="text-sm font-medium">
                              {formatDate(parcel.shippedAt)}
                            </span>
                          </div>
                        )}
                        {parcel.deliveredAt && (
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Дата доставки:
                            </span>
                            <span className="text-sm font-medium">
                              {formatDate(parcel.deliveredAt)}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Адрес доставки */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Адрес доставки
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">
                    {order.shippingAddress.firstName}{" "}
                    {order.shippingAddress.lastName}
                  </p>
                  <p className="text-sm">{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && (
                    <p className="text-sm">{order.shippingAddress.address2}</p>
                  )}
                  <p className="text-sm">
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p className="text-sm">{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <div className="flex items-center gap-1 mt-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {order.shippingAddress.phone}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Итоги заказа */}
            <Card>
              <CardHeader>
                <CardTitle>Итоги заказа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Товары:
                    </span>
                    <span className="text-sm">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Доставка:
                    </span>
                    <span className="text-sm">
                      {formatPrice(order.shippingAmount)}
                    </span>
                  </div>
                  {order.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Налог:
                      </span>
                      <span className="text-sm">
                        {formatPrice(order.taxAmount)}
                      </span>
                    </div>
                  )}
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Скидка:
                      </span>
                      <span className="text-sm text-green-600">
                        -{formatPrice(order.discountAmount)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>Итого:</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Примечания */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Примечания к заказу</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
