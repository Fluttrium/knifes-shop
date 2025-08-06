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
import { 
  Eye, 
  Edit3, 
  User, 
  Package, 
  DollarSign, 
  Calendar,
  MapPin,
  Phone
} from "lucide-react";

import { Order } from "@repo/api-client";

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("📦 Fetching orders...");
        const response = await api.orders.getAllOrdersAdmin();
        console.log("✅ Orders fetched:", response);
        setOrders(response.data || []);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        setError("Ошибка при загрузке заказов");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;
    
    try {
      await api.orders.updateOrderStatus(selectedOrder.id, newStatus as any);
      setStatusDialogOpen(false);
      fetchOrders(); // Обновляем список
    } catch (err) {
      console.error("❌ Error updating order status:", err);
      setError("Ошибка при обновлении статуса заказа");
    }
  };

  const openStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  const formatCurrency = (amount: number, currency: string = "RUB") => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currency || "RUB",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Заказы</h1>
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
          <h1 className="text-3xl font-bold">Заказы</h1>
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
        <h1 className="text-3xl font-bold">Заказы</h1>
        <div className="text-sm text-muted-foreground">
          Всего заказов: {orders.length}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список заказов</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Заказов пока нет</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер заказа</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.shippingAddress?.firstName}{" "}
                          {order.shippingAddress?.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ID: {order.userId}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: order.currency || "RUB",
                      }).format(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      {formatDate(order.createdAt.toString())}
                    </TableCell>
                    <TableCell>
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
                              {/* Информация о заказе */}
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Номер заказа</Label>
                                  <p className="text-sm font-mono">{order.orderNumber}</p>
                                </div>
                                <div>
                                  <Label>Статус</Label>
                                  <div className="mt-1">{getStatusBadge(order.status)}</div>
                                </div>
                                <div>
                                  <Label>Сумма заказа</Label>
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
                                <Label className="text-base font-medium">Информация о клиенте</Label>
                                <div className="mt-2 p-3 bg-muted rounded-md">
                                  <div className="flex items-center gap-2 mb-2">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">
                                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Phone className="h-4 w-4" />
                                    <span className="text-sm">{order.shippingAddress?.phone}</span>
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
                                <Label className="text-base font-medium">Товары в заказе</Label>
                                <div className="mt-2 space-y-2">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Диалог изменения статуса */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить статус заказа</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Новый статус</Label>
              <Select
                value={newStatus}
                onValueChange={setNewStatus}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="processing">Обрабатывается</SelectItem>
                  <SelectItem value="shipped">Отправлен</SelectItem>
                  <SelectItem value="delivered">Доставлен</SelectItem>
                  <SelectItem value="cancelled">Отменен</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
                Отмена
              </Button>
              <Button onClick={handleUpdateStatus}>
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
