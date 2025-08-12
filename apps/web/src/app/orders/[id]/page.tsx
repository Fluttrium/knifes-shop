"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  User,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import api, { Order } from "@repo/api-client";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

// Статусы жизненного цикла заказа
const ORDER_LIFECYCLE = {
  pending: {
    step: 1,
    label: "Оформлен",
    icon: Clock,
    color: "text-yellow-600",
    description: "Заказ создан и ожидает подтверждения",
  },
  confirmed: {
    step: 2,
    label: "Подтвержден",
    icon: CheckCircle,
    color: "text-blue-600",
    description: "Заказ подтвержден менеджером",
  },
  processing: {
    step: 3,
    label: "Обрабатывается",
    icon: Package,
    color: "text-blue-600",
    description: "Заказ собирается и готовится к отправке",
  },
  shipped: {
    step: 4,
    label: "Отправлен",
    icon: Truck,
    color: "text-purple-600",
    description: "Заказ отправлен и в пути",
  },
  delivered: {
    step: 5,
    label: "Доставлен",
    icon: CheckCircle,
    color: "text-green-600",
    description: "Заказ успешно доставлен",
  },
  cancelled: {
    step: 0,
    label: "Отменен",
    icon: AlertCircle,
    color: "text-red-600",
    description: "Заказ отменен",
  },
  refunded: {
    step: 0,
    label: "Возвращен",
    icon: AlertCircle,
    color: "text-red-600",
    description: "Заказ возвращен",
  },
};

export default function OrderTrackingPage() {
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

    fetchOrder();
  }, [orderId, isAuthenticated, router]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.orders.getOrderById(orderId);
      setOrder(response);
    } catch (err) {
      console.error("Ошибка при загрузке заказа:", err);
      setError("Заказ не найден или у вас нет доступа к нему");
    } finally {
      setLoading(false);
    }
  };

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

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Ожидает оплаты",
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800",
      },
      paid: {
        label: "Оплачен",
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
      },
      failed: {
        label: "Ошибка оплаты",
        variant: "destructive" as const,
        color: "bg-red-100 text-red-800",
      },
      refunded: {
        label: "Возвращен",
        variant: "outline" as const,
        color: "bg-gray-100 text-gray-800",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
      color: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
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

  const getOrderProgress = (order: Order) => {
    const lifecycle =
      ORDER_LIFECYCLE[order.status as keyof typeof ORDER_LIFECYCLE];
    if (!lifecycle || lifecycle.step === 0) return 0;
    return (lifecycle.step / 5) * 100;
  };

  const getOrderLifecycleSteps = (order: Order) => {
    const currentStep =
      ORDER_LIFECYCLE[order.status as keyof typeof ORDER_LIFECYCLE]?.step || 0;

    return [
      {
        step: 1,
        label: "Оформлен",
        completed: currentStep >= 1,
        current: currentStep === 1,
      },
      {
        step: 2,
        label: "Подтвержден",
        completed: currentStep >= 2,
        current: currentStep === 2,
      },
      {
        step: 3,
        label: "Обрабатывается",
        completed: currentStep >= 3,
        current: currentStep === 3,
      },
      {
        step: 4,
        label: "Отправлен",
        completed: currentStep >= 4,
        current: currentStep === 4,
      },
      {
        step: 5,
        label: "Доставлен",
        completed: currentStep >= 5,
        current: currentStep === 5,
      },
    ];
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Доступ запрещен</h2>
          <p className="text-muted-foreground text-center">
            Для просмотра заказа необходимо войти в систему
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
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
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
            {error || "Заказ не найден"}
          </p>
          <Link href="/profile/orders">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к заказам
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const lifecycleSteps = getOrderLifecycleSteps(order);
  const progress = getOrderProgress(order);
  const currentLifecycle =
    ORDER_LIFECYCLE[order.status as keyof typeof ORDER_LIFECYCLE];

  return (
    <Container>
      <div className="py-8">
        {/* Заголовок */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/profile/orders">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />К заказам
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Заказ #{order.orderNumber}</h1>
          </div>
          <p className="text-muted-foreground">
            Отслеживание статуса и прогресса заказа
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная информация */}
          <div className="lg:col-span-2 space-y-6">
            {/* Прогресс заказа */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Прогресс заказа
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Прогресс-бар */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium">
                          Выполнение заказа
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      {currentLifecycle && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <currentLifecycle.icon className="h-4 w-4" />
                          <span>{currentLifecycle.description}</span>
                        </div>
                      )}
                    </div>
                    <Progress value={progress} className="h-4 mb-6" />

                    {/* Этапы жизненного цикла */}
                    <div className="flex justify-between">
                      {lifecycleSteps.map((step) => (
                        <div
                          key={step.step}
                          className="flex flex-col items-center"
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                              step.completed
                                ? "bg-green-500 text-white"
                                : step.current
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            {step.completed ? (
                              <CheckCircle className="h-5 w-5" />
                            ) : step.current ? (
                              <Clock className="h-5 w-5" />
                            ) : (
                              <span className="text-sm font-medium">
                                {step.step}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-center max-w-20">
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Товары в заказе */}
            <Card>
              <CardHeader>
                <CardTitle>Товары в заказе</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Количество: {item.quantity} ×{" "}
                            {formatPrice(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {formatPrice(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Информация о доставке */}
            {order.parcels?.[0]?.trackingNumber && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Информация о доставке
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Трек-номер</span>
                      </div>
                      <p className="font-mono text-lg mb-2">
                        {order.parcels[0].trackingNumber}
                      </p>
                      {order.parcels[0].carrier && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">Перевозчик:</span>{" "}
                          {order.parcels[0].carrier}
                        </p>
                      )}
                      {order.parcels[0].comment && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Комментарий:</span>{" "}
                          {order.parcels[0].comment}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Отследить посылку
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Примечания */}
            {order.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Примечание к заказу</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm p-3 bg-muted rounded-lg">
                    {order.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Статус заказа */}
            <Card>
              <CardHeader>
                <CardTitle>Статус заказа</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">Статус:</span>
                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                </div>
                {order.payments?.[0]?.status && (
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Оплата:
                    </span>
                    <div className="mt-1">
                      {getPaymentStatusBadge(order.payments[0].status)}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-sm text-muted-foreground">
                    Дата заказа:
                  </span>
                  <p className="mt-1 font-medium">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Информация о клиенте */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Информация о доставке
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {order.shippingAddress?.firstName}{" "}
                    {order.shippingAddress?.lastName}
                  </span>
                </div>
                {order.shippingAddress?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {order.shippingAddress.phone}
                    </span>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="text-sm">
                    <p>{order.shippingAddress?.address1}</p>
                    {order.shippingAddress?.address2 && (
                      <p>{order.shippingAddress.address2}</p>
                    )}
                    <p>
                      {order.shippingAddress?.city},{" "}
                      {order.shippingAddress?.state}{" "}
                      {order.shippingAddress?.postalCode}
                    </p>
                    <p>{order.shippingAddress?.country}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Итоги заказа */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Итоги заказа
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Товары:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.shippingAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Доставка:</span>
                    <span>{formatPrice(order.shippingAmount)}</span>
                  </div>
                )}
                {order.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Налог:</span>
                    <span>{formatPrice(order.taxAmount)}</span>
                  </div>
                )}
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Скидка:</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Итого:</span>
                    <span>{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
