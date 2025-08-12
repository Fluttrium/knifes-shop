"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/shared/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Package,
} from "lucide-react";
import api, { Payment } from "@repo/api-client";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function TestPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paymentId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
      return;
    }

    fetchPayment();
  }, [paymentId, isAuthenticated, router]);

  const fetchPayment = async () => {
    try {
      setLoading(true);
      const response = await api.payments.getPaymentStatus(paymentId);
      setPayment(response as any);
    } catch (err) {
      console.error("Ошибка при загрузке платежа:", err);
      setError("Платеж не найден или у вас нет доступа к нему");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessPayment = async () => {
    setProcessing(true);
    try {
      // Имитируем успешную оплату
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Обновляем статус платежа через админский API
      await api.payments.updatePaymentStatusAdmin(paymentId, {
        status: "paid",
        comment: "Тестовая оплата",
      });

      // Перенаправляем на страницу заказа
      if (payment?.orderId) {
        router.push(`/orders/${payment.orderId}`);
      }
    } catch (err) {
      console.error("Ошибка при обработке платежа:", err);
      setError("Ошибка при обработке платежа");
    } finally {
      setProcessing(false);
    }
  };

  const handleFailedPayment = async () => {
    setProcessing(true);
    try {
      // Имитируем неудачную оплату
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Обновляем статус платежа через админский API
      await api.payments.updatePaymentStatusAdmin(paymentId, {
        status: "failed",
        comment: "Тестовая неудачная оплата",
      });

      setError("Платеж не прошел");
    } catch (err) {
      console.error("Ошибка при обработке платежа:", err);
      setError("Ошибка при обработке платежа");
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(price);
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <CreditCard className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Доступ запрещен</h2>
          <p className="text-muted-foreground text-center">
            Для доступа к платежу необходимо войти в систему
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

  if (error || !payment) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <CreditCard className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Платеж не найден</h2>
          <p className="text-muted-foreground text-center">
            {error || "Платеж не найден"}
          </p>
          <Link href="/profile/orders">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />К заказам
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        label: "Ожидает оплаты",
        variant: "secondary" as const,
        icon: Clock,
      },
      paid: {
        label: "Оплачен",
        variant: "default" as const,
        icon: CheckCircle,
      },
      failed: {
        label: "Ошибка оплаты",
        variant: "destructive" as const,
        icon: XCircle,
      },
      refunded: {
        label: "Возвращен",
        variant: "outline" as const,
        icon: XCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
      icon: Clock,
    };

    return (
      <div className="flex items-center gap-2">
        <config.icon className="h-4 w-4" />
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>
    );
  };

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
            <h1 className="text-3xl font-bold">Тестовая оплата</h1>
          </div>
          <p className="text-muted-foreground">
            Это тестовая страница для имитации процесса оплаты
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Информация о платеже */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Информация о платеже
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  ID платежа:
                </span>
                <span className="font-mono text-sm">{payment.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Статус:</span>
                {getStatusBadge(payment.status)}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Сумма:</span>
                <span className="font-semibold text-lg">
                  {formatPrice(payment.amount)}
                </span>
              </div>
              {payment.comment && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">
                    Описание:
                  </span>
                  <span className="text-sm text-right max-w-xs">
                    {payment.comment}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Тестовые кнопки */}
          {payment.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Тестирование оплаты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Выберите результат тестирования платежа:
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleSuccessPayment}
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {processing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Обработка...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Успешная оплата
                      </div>
                    )}
                  </Button>

                  <Button
                    onClick={handleFailedPayment}
                    disabled={processing}
                    variant="destructive"
                  >
                    {processing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Обработка...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4" />
                        Ошибка оплаты
                      </div>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Это тестовая среда. В реальном приложении здесь будет
                  интеграция с платежной системой.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Результат */}
          {payment.status === "paid" && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-green-800">
                  <CheckCircle className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Оплата прошла успешно!</h3>
                    <p className="text-sm">
                      Ваш заказ подтвержден и будет обработан.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href={`/orders/${payment.orderId}`}>
                    <Button className="w-full">Перейти к заказу</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {payment.status === "failed" && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-800">
                  <XCircle className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Ошибка оплаты</h3>
                    <p className="text-sm">
                      Платеж не прошел. Попробуйте еще раз.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href={`/orders/${payment.orderId}`}>
                    <Button variant="outline" className="w-full">
                      Вернуться к заказу
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-red-800">
                  <XCircle className="h-6 w-6" />
                  <div>
                    <h3 className="font-semibold">Ошибка</h3>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
