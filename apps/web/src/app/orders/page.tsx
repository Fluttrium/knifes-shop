"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@repo/api-client";
import type { Order } from "@repo/api-client";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Eye, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await api.orders.getOrders();
      setOrders(response.data || []);
    } catch (err) {
      console.error("❌ Ошибка при загрузке заказов:", err);
      setError("Ошибка при загрузке заказов");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Ожидает оплаты", variant: "secondary" as const },
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

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Заказы недоступны</h2>
          <p className="text-muted-foreground text-center">
            Для просмотра заказов необходимо войти в систему
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
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-red-600">
                <p>{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Попробовать снова
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  У вас пока нет заказов
                </h3>
                <p className="text-muted-foreground mb-4">
                  Сделайте свой первый заказ и он появится здесь
                </p>
                <Link href="/">
                  <Button>
                    Перейти к покупкам
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Заказ #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(order.status)}
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Подробнее
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Товары в заказе */}
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item) => {
                        return (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3"
                          >
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                                <span className="text-muted-foreground text-xs">
                                  Нет фото
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {item.productName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} шт. ×{" "}
                                {item.unitPrice.toLocaleString("ru-RU")} ₽
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {item.totalPrice.toLocaleString("ru-RU")} ₽
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      {order.items.length > 3 && (
                        <p className="text-sm text-muted-foreground text-center">
                          И еще {order.items.length - 3} товар(ов)
                        </p>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Итого:</span>
                        <span className="text-lg font-semibold">
                          {order.totalAmount.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
