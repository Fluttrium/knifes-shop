"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Package, Eye, Calendar, CheckCircle, Clock, AlertCircle, Truck, CreditCard } from "lucide-react";
import api, { Order } from "@repo/api-client";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

// Статусы жизненного цикла заказа для пользователей
const ORDER_LIFECYCLE = {
  pending: { step: 1, label: "Оформлен", icon: Clock, color: "text-yellow-600", description: "Заказ создан и ожидает подтверждения" },
  confirmed: { step: 2, label: "Подтвержден", icon: CheckCircle, color: "text-blue-600", description: "Заказ подтвержден менеджером" },
  processing: { step: 3, label: "Обрабатывается", icon: Package, color: "text-blue-600", description: "Заказ собирается и готовится к отправке" },
  shipped: { step: 4, label: "Отправлен", icon: Truck, color: "text-purple-600", description: "Заказ отправлен и в пути" },
  delivered: { step: 5, label: "Доставлен", icon: CheckCircle, color: "text-green-600", description: "Заказ успешно доставлен" },
  cancelled: { step: 0, label: "Отменен", icon: AlertCircle, color: "text-red-600", description: "Заказ отменен" },
  refunded: { step: 0, label: "Возвращен", icon: AlertCircle, color: "text-red-600", description: "Заказ возвращен" },
};

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.orders.getOrders();
        setOrders(response.data || []);
      } catch (err) {
        console.error("Ошибка при загрузке заказов:", err);
        setError("Не удалось загрузить заказы");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Ожидает подтверждения", variant: "secondary" as const },
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

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Ожидает оплаты", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Оплачен", variant: "default" as const, color: "bg-green-100 text-green-800" },
      failed: { label: "Ошибка оплаты", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
      refunded: { label: "Возвращен", variant: "outline" as const, color: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
      color: "bg-gray-100 text-gray-800"
    };

    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
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
    });
  };

  const getOrderProgress = (order: Order) => {
    const lifecycle = ORDER_LIFECYCLE[order.status as keyof typeof ORDER_LIFECYCLE];
    if (!lifecycle || lifecycle.step === 0) return 0;
    return (lifecycle.step / 5) * 100;
  };

  const getOrderLifecycleSteps = (order: Order) => {
    const currentStep = ORDER_LIFECYCLE[order.status as keyof typeof ORDER_LIFECYCLE]?.step || 0;
    
    return [
      { step: 1, label: "Оформлен", completed: currentStep >= 1, current: currentStep === 1 },
      { step: 2, label: "Подтвержден", completed: currentStep >= 2, current: currentStep === 2 },
      { step: 3, label: "Обрабатывается", completed: currentStep >= 3, current: currentStep === 3 },
      { step: 4, label: "Отправлен", completed: currentStep >= 4, current: currentStep === 4 },
      { step: 5, label: "Доставлен", completed: currentStep >= 5, current: currentStep === 5 },
    ];
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Доступ запрещен</h2>
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Ошибка загрузки</h2>
          <p className="text-muted-foreground text-center">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Мои заказы</h1>
          <p className="text-muted-foreground">
            Отслеживание статуса и прогресса ваших заказов
          </p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Заказов пока нет</h3>
              <p className="text-muted-foreground text-center mb-4">
                Вы еще не сделали ни одного заказа. Начните с просмотра нашего каталога товаров.
              </p>
              <Link href="/">
                <Button>Перейти к покупкам</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const lifecycleSteps = getOrderLifecycleSteps(order);
              const progress = getOrderProgress(order);
              const currentLifecycle = ORDER_LIFECYCLE[order.status as keyof typeof ORDER_LIFECYCLE];
              
              return (
                <Card key={order.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Заголовок заказа */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">
                          Заказ #{order.orderNumber}
                        </h3>
                        {getStatusBadge(order.status)}
                        {order.payments?.[0]?.status && (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            {getPaymentStatusBadge(order.payments[0].status)}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Подробнее
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Прогресс заказа */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Прогресс выполнения</span>
                          <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                        </div>
                        {currentLifecycle && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <currentLifecycle.icon className="h-4 w-4" />
                            <span>{currentLifecycle.description}</span>
                          </div>
                        )}
                      </div>
                      <Progress value={progress} className="h-3 mb-4" />
                      
                      {/* Этапы жизненного цикла */}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        {lifecycleSteps.map((step) => (
                          <div key={step.step} className="flex flex-col items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${
                              step.completed 
                                ? 'bg-green-500 text-white' 
                                : step.current 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-500'
                            }`}>
                              {step.completed ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : step.current ? (
                                <Clock className="h-3 w-3" />
                              ) : (
                                <span className="text-xs">{step.step}</span>
                              )}
                            </div>
                            <span className="text-center max-w-16">{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Основная информация */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Дата заказа:</span>
                        <p className="font-medium">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Сумма:</span>
                        <p className="font-medium">
                          {formatPrice(order.totalAmount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Товаров:</span>
                        <p className="font-medium">
                          {order.items.length} шт.
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Статус:</span>
                        <p className="font-medium">
                          {currentLifecycle?.label || order.status}
                        </p>
                      </div>
                    </div>

                    {/* Информация о доставке */}
                    {order.parcels?.[0]?.trackingNumber && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Информация о доставке</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Трек-номер:</span> {order.parcels[0].trackingNumber}</p>
                          {order.parcels[0].carrier && (
                            <p><span className="font-medium">Перевозчик:</span> {order.parcels[0].carrier}</p>
                          )}
                          {order.parcels[0].comment && (
                            <p><span className="font-medium">Комментарий:</span> {order.parcels[0].comment}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Примечания */}
                    {order.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Примечание к заказу:</span> {order.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}
