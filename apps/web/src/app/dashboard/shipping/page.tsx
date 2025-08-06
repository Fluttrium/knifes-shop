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
  Truck,
  Package,
  Calendar,
  User,
  MapPin,
  Phone
} from "lucide-react";

import { Parcel, ParcelQueryDto, UpdateParcelDto } from "@repo/api-client";

interface ParcelDisplay extends Parcel {
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

export default function ShippingPage() {
  const [parcels, setParcels] = useState<ParcelDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ParcelQueryDto>({});
  const [selectedParcel, setSelectedParcel] = useState<ParcelDisplay | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState<UpdateParcelDto>({
    status: "pending",
    trackingNumber: "",
    comment: ""
  });

  useEffect(() => {
    fetchParcels();
  }, [filters]);

  const fetchParcels = async () => {
    try {
      console.log("📦 Fetching parcels...");
      const response = await api.orders.getParcels(filters);
      console.log("✅ Parcels fetched:", response);
      setParcels(response.data || []);
    } catch (err) {
      console.error("❌ Error fetching parcels:", err);
      setError("Ошибка при загрузке доставок");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedParcel) return;
    
    try {
      await api.orders.updateParcel(selectedParcel.id, updateData);
      setUpdateDialogOpen(false);
      fetchParcels(); // Обновляем список
    } catch (err) {
      console.error("❌ Error updating parcel status:", err);
      setError("Ошибка при обновлении статуса доставки");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "Ожидает отправки", variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" },
      shipped: { label: "Отправлено", variant: "default" as const, color: "bg-blue-100 text-blue-800" },
      in_transit: { label: "В пути", variant: "default" as const, color: "bg-purple-100 text-purple-800" },
      delivered: { label: "Доставлено", variant: "default" as const, color: "bg-green-100 text-green-800" },
      failed: { label: "Ошибка доставки", variant: "destructive" as const, color: "bg-red-100 text-red-800" },
      returned: { label: "Возвращено", variant: "outline" as const, color: "bg-gray-100 text-gray-800" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      variant: "secondary" as const,
      color: "bg-gray-100 text-gray-800"
    };

    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Доставки</h1>
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
          <h1 className="text-3xl font-bold">Доставки</h1>
          <p className="text-muted-foreground">
            Управление доставками и отслеживанием посылок
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <SelectItem value="pending">Ожидает отправки</SelectItem>
                  <SelectItem value="shipped">Отправлено</SelectItem>
                  <SelectItem value="in_transit">В пути</SelectItem>
                  <SelectItem value="delivered">Доставлено</SelectItem>
                  <SelectItem value="failed">Ошибка доставки</SelectItem>
                  <SelectItem value="returned">Возвращено</SelectItem>
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
              <Label htmlFor="trackingNumber">Трек-номер</Label>
              <Input
                id="trackingNumber"
                placeholder="Введите трек-номер"
                value={filters.trackingNumber || ""}
                onChange={(e) => setFilters({ ...filters, trackingNumber: e.target.value || undefined })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Таблица доставок */}
      <Card>
        <CardHeader>
          <CardTitle>Список доставок</CardTitle>
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
                <TableHead>Получатель</TableHead>
                <TableHead>Адрес доставки</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Трек-номер</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parcels.map((parcel) => (
                <TableRow key={parcel.id}>
                  <TableCell className="font-mono text-sm">
                    {parcel.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    {parcel.order?.orderNumber || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{parcel.recipientName || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{parcel.recipientPhone || "N/A"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div className="max-w-xs">
                        <p className="text-sm truncate">{parcel.deliveryAddress || "N/A"}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(parcel.status)}</TableCell>
                  <TableCell>
                    {parcel.trackingNumber ? (
                      <span className="font-mono text-sm">{parcel.trackingNumber}</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">Не указан</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(parcel.createdAt)}
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
                            <DialogTitle>Детали доставки</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>ID доставки</Label>
                                <p className="text-sm font-mono">{parcel.id}</p>
                              </div>
                              <div>
                                <Label>Номер заказа</Label>
                                <p className="text-sm">{parcel.order?.orderNumber || "N/A"}</p>
                              </div>
                              <div>
                                <Label>Получатель</Label>
                                <p className="text-sm font-medium">{parcel.recipientName || "N/A"}</p>
                              </div>
                              <div>
                                <Label>Телефон</Label>
                                <p className="text-sm">{parcel.recipientPhone || "N/A"}</p>
                              </div>
                              <div>
                                <Label>Статус</Label>
                                <div className="mt-1">{getStatusBadge(parcel.status)}</div>
                              </div>
                              <div>
                                <Label>Трек-номер</Label>
                                <p className="text-sm font-mono">{parcel.trackingNumber || "Не указан"}</p>
                              </div>
                              <div className="col-span-2">
                                <Label>Адрес доставки</Label>
                                <p className="text-sm mt-1">{parcel.deliveryAddress || "N/A"}</p>
                              </div>
                              <div>
                                <Label>Дата создания</Label>
                                <p className="text-sm">{formatDate(parcel.createdAt)}</p>
                              </div>
                              <div>
                                <Label>Дата обновления</Label>
                                <p className="text-sm">{formatDate(parcel.updatedAt)}</p>
                              </div>
                            </div>
                            {parcel.comment && (
                              <div>
                                <Label>Комментарий</Label>
                                <p className="text-sm mt-1">{parcel.comment}</p>
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
                              setSelectedParcel(parcel);
                              setUpdateData({
                                status: parcel.status,
                                trackingNumber: parcel.trackingNumber || "",
                                comment: parcel.comment || ""
                              });
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Изменить статус доставки</DialogTitle>
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
                                  <SelectItem value="pending">Ожидает отправки</SelectItem>
                                  <SelectItem value="shipped">Отправлено</SelectItem>
                                  <SelectItem value="in_transit">В пути</SelectItem>
                                  <SelectItem value="delivered">Доставлено</SelectItem>
                                  <SelectItem value="failed">Ошибка доставки</SelectItem>
                                  <SelectItem value="returned">Возвращено</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="trackingNumber">Трек-номер</Label>
                              <Input
                                id="trackingNumber"
                                value={updateData.trackingNumber}
                                onChange={(e) => setUpdateData({ ...updateData, trackingNumber: e.target.value })}
                                placeholder="Введите трек-номер..."
                              />
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
          
          {parcels.length === 0 && !loading && (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Доставки не найдены</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 