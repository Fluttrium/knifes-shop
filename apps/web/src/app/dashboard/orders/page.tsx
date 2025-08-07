"use client";

import { useEffect, useState } from "react";
import { api } from "@repo/api-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Eye, 
  Edit3, 
  User, 
  Package, 
  DollarSign, 
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import { Order, Payment } from "@repo/api-client";
import { notify } from "@/components/ui/toats/basic-toats";

interface OrderDisplay {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  updatedAt: string;
}

// Статусы жизненного цикла заказа
const ORDER_LIFECYCLE = {
  pending: { step: 1, label: "Оформлен", icon: Clock, color: "text-yellow-600" },
  confirmed: { step: 2, label: "Подтвержден", icon: CheckCircle, color: "text-blue-600" },
  processing: { step: 3, label: "Обрабатывается", icon: Package, color: "text-blue-600" },
  shipped: { step: 4, label: "Отправлен", icon: Truck, color: "text-purple-600" },
  delivered: { step: 5, label: "Доставлен", icon: CheckCircle, color: "text-green-600" },
  cancelled: { step: 0, label: "Отменен", icon: AlertCircle, color: "text-red-600" },
  refunded: { step: 0, label: "Возвращен", icon: AlertCircle, color: "text-red-600" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [carrier, setCarrier] = useState<string>("");
  const [shippingComment, setShippingComment] = useState<string>("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("orders");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchOrders = async () => {
    try {
      const response = await api.orders.getAllOrdersAdmin();
      setOrders(response.data || []);
    } catch (err) {
      console.error("❌ Error fetching orders:", err);
      setError("Ошибка при загрузке заказов");
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.payments.getAllPaymentsAdmin({});
      setPayments(response);
    } catch (err) {
      console.error("❌ Error fetching payments:", err);
      setError("Ошибка при загрузке платежей");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPayments();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Ожидает", variant: "secondary" as const },
      processing: { label: "Обрабатывается", variant: "default" as const },
      shipped: { label: "Отправлен", variant: "default" as const },
      delivered: { label: "Доставлен", variant: "default" as const },
      cancelled: { label: "Отменен", variant: "destructive" as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
    };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number, currency: string = "RUB") => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Ожидает", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      paid: { label: "Оплачен", variant: "default" as const, color: "bg-green-100 text-green-800" },
      failed: { label: "Ошибка", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
      refunded: { label: "Возврат", variant: "outline" as const, color: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
      color: "bg-gray-100 text-gray-800"
    };

    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = {
      card: { label: "Карта", color: "bg-blue-100 text-blue-800" },
      cash: { label: "Наличные", color: "bg-green-100 text-green-800" },
      bank_transfer: { label: "Банковский перевод", color: "bg-purple-100 text-purple-800" },
    };

    const config = methodConfig[method as keyof typeof methodConfig] || {
      label: method,
      color: "bg-gray-100 text-gray-800"
    };

    return <Badge variant="outline" className={config.color}>{config.label}</Badge>;
  };

  const handlePaymentStatusUpdate = async (paymentId: string, newStatus: string) => {
    try {
      await api.payments.updatePaymentStatusAdmin(paymentId, {
        status: newStatus as any,
        comment: "Статус обновлен администратором"
      });
      notify("Статус платежа обновлен", "success");
      fetchPayments();
      setPaymentDialogOpen(false);
    } catch (error) {
      console.error("Ошибка при обновлении статуса платежа:", error);
      notify("Ошибка при обновлении статуса платежа", "error");
    }
  };

  const getOrderByPaymentId = (paymentId: string) => {
    return orders.find(order => 
      order.payments?.some(payment => payment.id === paymentId)
    );
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

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      // Обновляем статус заказа
      await api.orders.updateOrderStatus(selectedOrder.id, newStatus as any);
      
      // Если указан трек-номер, создаем или обновляем отправление
      if (trackingNumber.trim()) {
        try {
          // Пытаемся создать новое отправление
          await api.orders.createParcel(selectedOrder.id, {
            trackingNumber: trackingNumber.trim(),
            carrier: carrier.trim() || "Почта России", // Can be made dynamic
            status: "shipped",
            shippedAt: new Date(),
            comment: shippingComment.trim(),
          });
        } catch (error) {
          console.error("Ошибка при создании отправления:", error);
        }
      }

      notify("Статус заказа обновлен", "success");
      setStatusDialogOpen(false);
      setSelectedOrder(null);
      setNewStatus("");
      setTrackingNumber("");
      setCarrier("");
      setShippingComment("");
      fetchOrders(); // Обновляем список заказов
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
      notify("Ошибка при обновлении статуса", "error");
    }
  };

  const openStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNumber(order.parcels?.[0]?.trackingNumber || "");
    setCarrier(order.parcels?.[0]?.carrier || "");
    setShippingComment(order.parcels?.[0]?.comment || "");
    setStatusDialogOpen(true);
  };

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Заказы и платежи</h1>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Заказы и платежи</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p>{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Попробовать снова
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Управление заказами</h1>
          <p className="text-muted-foreground">
            Полный жизненный цикл заказов: от оформления до доставки
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Фильтр по статусу" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все заказы</SelectItem>
              <SelectItem value="pending">Ожидают</SelectItem>
              <SelectItem value="confirmed">Подтверждены</SelectItem>
              <SelectItem value="processing">Обрабатываются</SelectItem>
              <SelectItem value="shipped">Отправлены</SelectItem>
              <SelectItem value="delivered">Доставлены</SelectItem>
              <SelectItem value="cancelled">Отменены</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Заказы ({filteredOrders.length})
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Платежи ({payments.length})
          </TabsTrigger>
        </TabsList>

        {/* Вкладка Заказы */}
        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Жизненный цикл заказов</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const lifecycleSteps = getOrderLifecycleSteps(order);
                  const progress = getOrderProgress(order);
                  
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
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle>Детали заказа #{order.orderNumber}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  {/* Прогресс заказа */}
                                  <div>
                                    <Label className="text-base font-medium mb-3 block">Прогресс заказа</Label>
                                    <div className="space-y-4">
                                      <Progress value={progress} className="h-3" />
                                      <div className="flex justify-between text-sm text-muted-foreground">
                                        {lifecycleSteps.map((step, idx) => (
                                          <div key={step.step} className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                              step.completed 
                                                ? 'bg-green-500 text-white' 
                                                : step.current 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-gray-200 text-gray-500'
                                            }`}>
                                              {step.completed ? (
                                                <CheckCircle className="h-4 w-4" />
                                              ) : step.current ? (
                                                <Clock className="h-4 w-4" />
                                              ) : (
                                                <span className="text-xs">{step.step}</span>
                                              )}
                                            </div>
                                            <span className="text-xs text-center">{step.label}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Информация о заказе */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Статус заказа</Label>
                                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                                    </div>
                                    <div>
                                      <Label>Статус оплаты</Label>
                                      <div className="mt-1">
                                        {order.payments?.[0]?.status && getPaymentStatusBadge(order.payments[0].status)}
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Сумма</Label>
                                      <p className="text-sm font-medium">
                                        {formatCurrency(order.totalAmount, order.currency)}
                                      </p>
                                    </div>
                                    <div>
                                      <Label>Дата создания</Label>
                                      <p className="text-sm">{formatDate(order.createdAt.toString())}</p>
                                    </div>
                                  </div>

                                  {/* Информация о клиенте */}
                                  <div>
                                    <Label className="text-base font-medium mb-2 block">Информация о клиенте</Label>
                                    <div className="p-3 bg-muted rounded-md">
                                      <div className="flex items-center gap-2 mb-2">
                                        <User className="h-4 w-4" />
                                        <span className="font-medium">
                                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm">{order.shippingAddress?.phone || 'Нет телефона'}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-sm">
                                          {order.shippingAddress?.address1}, {order.shippingAddress?.city}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Товары в заказе */}
                                  <div>
                                    <Label className="text-base font-medium mb-2 block">Товары в заказе</Label>
                                    <div className="space-y-2">
                                      {order.items?.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                          <div className="flex items-center gap-3">
                                            <Package className="h-4 w-4" />
                                            <div>
                                              <p className="font-medium">{item.productName}</p>
                                              <p className="text-sm text-muted-foreground">
                                                Количество: {item.quantity} × {formatCurrency(item.unitPrice)}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
                                          </div>
                                        </div>
                                      ))}
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
                                    <div>
                                      <Label>Примечания к заказу</Label>
                                      <p className="text-sm mt-1 p-2 bg-muted rounded">{order.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openStatusDialog(order)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Прогресс заказа */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Прогресс выполнения</span>
                            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>

                        {/* Основная информация */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Клиент:</span>
                            <p className="font-medium">
                              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Сумма:</span>
                            <p className="font-medium">
                              {formatCurrency(order.totalAmount, order.currency)}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Дата:</span>
                            <p className="font-medium">
                              {formatDate(order.createdAt.toString())}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Товаров:</span>
                            <p className="font-medium">
                              {order.items?.length || 0} шт.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {filteredOrders.length === 0 && !loading && (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {filterStatus === "all" ? "Заказы не найдены" : `Заказы со статусом "${filterStatus}" не найдены`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Вкладка Платежи */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Список платежей</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID платежа</TableHead>
                    <TableHead>Заказ</TableHead>
                    <TableHead>Сумма</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Метод</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">
                        {payment.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {getOrderByPaymentId(payment.id)?.orderNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium">
                            {formatCurrency(payment.amount, payment.currency)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                      <TableCell>{getPaymentMethodBadge(payment.method || "")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formatDate(payment.createdAt.toString())}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Детали платежа</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>ID платежа</Label>
                                    <p className="text-sm font-mono">{payment.id}</p>
                                  </div>
                                  <div>
                                    <Label>Заказ</Label>
                                    <p className="text-sm">
                                      #{getOrderByPaymentId(payment.id)?.orderNumber || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Сумма</Label>
                                    <p className="text-sm font-medium">
                                      {formatCurrency(payment.amount, payment.currency)}
                                    </p>
                                  </div>
                                  <div>
                                    <Label>Статус</Label>
                                    <div className="mt-1">{getPaymentStatusBadge(payment.status)}</div>
                                  </div>
                                  <div>
                                    <Label>Метод оплаты</Label>
                                    <div className="mt-1">{getPaymentMethodBadge(payment.method || "")}</div>
                                  </div>
                                  <div>
                                    <Label>Дата создания</Label>
                                    <p className="text-sm">{formatDate(payment.createdAt.toString())}</p>
                                  </div>
                                </div>
                                {payment.comment && (
                                  <div>
                                    <Label>Комментарий</Label>
                                    <p className="text-sm mt-1">{payment.comment}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setPaymentDialogOpen(true);
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {payments.length === 0 && !loading && (
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Платежи не найдены</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Диалог изменения статуса */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Управление заказом #{selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Статус заказа */}
            <div>
              <Label htmlFor="status" className="text-base font-medium">Статус заказа</Label>
              <Select
                value={newStatus}
                onValueChange={setNewStatus}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает подтверждения</SelectItem>
                  <SelectItem value="confirmed">Подтвержден</SelectItem>
                  <SelectItem value="processing">Обрабатывается</SelectItem>
                  <SelectItem value="shipped">Отправлен</SelectItem>
                  <SelectItem value="delivered">Доставлен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Информация о доставке */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Информация о доставке</Label>
              
              <div>
                <Label htmlFor="trackingNumber">Трек-номер</Label>
                <input
                  type="text"
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  placeholder="Введите трек-номер"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="carrier">Перевозчик</Label>
                  <Select
                    value={carrier}
                    onValueChange={setCarrier}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Выберите перевозчика" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="russian_post">Почта России</SelectItem>
                      <SelectItem value="cdek">СДЭК</SelectItem>
                      <SelectItem value="boxberry">Boxberry</SelectItem>
                      <SelectItem value="pickpoint">PickPoint</SelectItem>
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="fedex">FedEx</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="shippingDate">Дата отправки</Label>
                  <input
                    type="date"
                    id="shippingDate"
                    className="w-full p-2 border rounded-md mt-1"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shippingComment">Комментарий к отправке</Label>
                <textarea
                  id="shippingComment"
                  value={shippingComment}
                  onChange={(e) => setShippingComment(e.target.value)}
                  className="w-full p-2 border rounded-md mt-1"
                  rows={3}
                  placeholder="Дополнительная информация о доставке..."
                />
              </div>
            </div>

            {/* Уведомления */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Уведомления</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifyCustomer"
                    defaultChecked
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="notifyCustomer" className="text-sm">
                    Уведомить клиента об изменении статуса
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notifyShipping"
                    defaultChecked
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="notifyShipping" className="text-sm">
                    Отправить трек-номер клиенту
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateStatus}>
                Сохранить изменения
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог изменения статуса платежа */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус платежа</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="paymentStatus">Новый статус</Label>
              <Select
                value={selectedPayment?.status || "pending"}
                onValueChange={(value) => {
                  if (selectedPayment) {
                    handlePaymentStatusUpdate(selectedPayment.id, value);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="paid">Оплачен</SelectItem>
                  <SelectItem value="failed">Ошибка</SelectItem>
                  <SelectItem value="refunded">Возврат</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
