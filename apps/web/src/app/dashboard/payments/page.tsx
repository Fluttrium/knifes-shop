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
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  Download,
  CreditCard,
  DollarSign,
  Calendar,
  User
} from "lucide-react";

import { Payment, AdminPaymentFilterDto, AdminUpdatePaymentStatusDto } from "@repo/api-client";

interface PaymentDisplay extends Payment {
  order?: {
    orderNumber: string;
    userId: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AdminPaymentFilterDto>({});
  const [selectedPayment, setSelectedPayment] = useState<PaymentDisplay | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState<AdminUpdatePaymentStatusDto>({
    status: "pending",
    comment: ""
  });

  useEffect(() => {
    fetchPayments();
  }, [filters]);

  const fetchPayments = async () => {
    try {
      console.log("💳 Fetching payments...");
      const response = await api.payments.getAllPaymentsAdmin(filters);
      console.log("✅ Payments fetched:", response);
      setPayments(response);
    } catch (err) {
      console.error("❌ Error fetching payments:", err);
      setError("Ошибка при загрузке платежей");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedPayment) return;
    
    try {
      await api.payments.updatePaymentStatusAdmin(selectedPayment.id, updateData);
      setUpdateDialogOpen(false);
      fetchPayments(); // Обновляем список
    } catch (err) {
      console.error("❌ Error updating payment status:", err);
      setError("Ошибка при обновлении статуса платежа");
    }
  };

  const getStatusBadge = (status: string) => {
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

  const getMethodBadge = (method: string) => {
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

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: currency || "RUB",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Платежи</h1>
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Платежи</h1>
          <p className="text-muted-foreground">
            Управление платежами и их статусами
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Экспорт
        </Button>
      </div>

      {/* Фильтры */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Фильтры
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Статус</Label>
              <Select
                value={filters.status || ""}
                onValueChange={(value) => setFilters({ ...filters, status: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="paid">Оплачен</SelectItem>
                  <SelectItem value="failed">Ошибка</SelectItem>
                  <SelectItem value="refunded">Возврат</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="method">Метод оплаты</Label>
              <Select
                value={filters.method || ""}
                onValueChange={(value) => setFilters({ ...filters, method: value || undefined })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Все методы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все методы</SelectItem>
                  <SelectItem value="card">Карта</SelectItem>
                  <SelectItem value="cash">Наличные</SelectItem>
                  <SelectItem value="bank_transfer">Банковский перевод</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="orderId">ID заказа</Label>
              <Input
                id="orderId"
                placeholder="Введите ID заказа"
                value={filters.orderId || ""}
                onChange={(e) => setFilters({ ...filters, orderId: e.target.value || undefined })}
              />
            </div>
            <div>
              <Label htmlFor="userId">ID пользователя</Label>
              <Input
                id="userId"
                placeholder="Введите ID пользователя"
                value={filters.userId || ""}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value || undefined })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Таблица платежей */}
      <Card>
        <CardHeader>
          <CardTitle>Список платежей</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Заказ</TableHead>
                <TableHead>Пользователь</TableHead>
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
                    {payment.order?.orderNumber || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{payment.user?.name || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{payment.user?.email || "N/A"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        {formatAmount(payment.amount, payment.currency)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>{getMethodBadge(payment.method)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(payment.createdAt)}
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
                                <Label>Внешний ID</Label>
                                <p className="text-sm">{payment.externalId || "N/A"}</p>
                              </div>
                              <div>
                                <Label>Сумма</Label>
                                <p className="text-sm font-medium">
                                  {formatAmount(payment.amount, payment.currency)}
                                </p>
                              </div>
                              <div>
                                <Label>Статус</Label>
                                <div className="mt-1">{getStatusBadge(payment.status)}</div>
                              </div>
                              <div>
                                <Label>Метод оплаты</Label>
                                <div className="mt-1">{getMethodBadge(payment.method)}</div>
                              </div>
                              <div>
                                <Label>Дата создания</Label>
                                <p className="text-sm">{formatDate(payment.createdAt)}</p>
                              </div>
                            </div>
                            {payment.comment && (
                              <div>
                                <Label>Комментарий</Label>
                                <p className="text-sm mt-1">{payment.comment}</p>
                              </div>
                            )}
                            {payment.paymentUrl && (
                              <div>
                                <Label>URL для оплаты</Label>
                                <a 
                                  href={payment.paymentUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:underline block mt-1"
                                >
                                  {payment.paymentUrl}
                                </a>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setUpdateData({
                                status: payment.status,
                                comment: payment.comment || ""
                              });
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Изменить статус платежа</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="status">Статус</Label>
                              <Select
                                value={updateData.status}
                                onValueChange={(value) => setUpdateData({ ...updateData, status: value as any })}
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
                            <div>
                              <Label htmlFor="comment">Комментарий</Label>
                              <Textarea
                                id="comment"
                                value={updateData.comment}
                                onChange={(e) => setUpdateData({ ...updateData, comment: e.target.value })}
                                placeholder="Добавьте комментарий к изменению статуса..."
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
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
    </div>
  );
} 