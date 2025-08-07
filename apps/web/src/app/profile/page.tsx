"use client";

import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { api } from "@repo/api-client";
import { User, Mail, Phone, MapPin, Clock, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    totalAddresses: 0,
    lastOrderDate: null as string | null,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await api.users.updateUser(user.id, formData);
      setIsEditing(false);
      // Обновляем данные пользователя
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;
      
      try {
        setStatsLoading(true);
        const stats = await api.users.getCurrentUserStats();
        setUserStats({
          ...stats,
          lastOrderDate: stats.lastOrderDate || null,
        });
      } catch (error) {
        console.error("Ошибка при загрузке статистики:", error);
        // Используем моковые данные если API недоступен
        setUserStats({
          totalOrders: 0,
          totalSpent: 0,
          totalAddresses: 0,
          lastOrderDate: null,
        });
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(amount);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Профиль</h1>
        <p className="text-gray-600 mt-2">Управление личными данными</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Личная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Введите имя"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md">
                  {user.name || "Не указано"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Введите email"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Введите телефон"
                />
              ) : (
                <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user.phone || "Не указано"}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Роль</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                {user.role === "admin" ? "Администратор" : "Пользователь"}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? "Сохранение..." : "Сохранить"}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Отмена
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                Редактировать
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Статистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="text-center p-4 bg-muted rounded-lg animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{userStats.totalOrders}</div>
                <div className="text-sm text-muted-foreground">Заказов</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{userStats.totalAddresses}</div>
                <div className="text-sm text-muted-foreground">Адресов</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{formatCurrency(userStats.totalSpent)}</div>
                <div className="text-sm text-muted-foreground">Потрачено</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Функции в разработке */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-muted/50 backdrop-blur-sm z-10"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            Дополнительные функции
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-20">
          <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Эти функции находятся в разработке и будут доступны в ближайшее время
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg text-center">
              <div className="text-lg font-medium text-muted-foreground mb-2">Избранные товары</div>
              <div className="text-sm text-muted-foreground">Список избранных товаров</div>
            </div>
            
            <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg text-center">
              <div className="text-lg font-medium text-muted-foreground mb-2">История просмотров</div>
              <div className="text-sm text-muted-foreground">Недавно просмотренные товары</div>
            </div>
            
            <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg text-center">
              <div className="text-lg font-medium text-muted-foreground mb-2">Отзывы</div>
              <div className="text-sm text-muted-foreground">Ваши отзывы о товарах</div>
            </div>
            
            <div className="p-4 border border-dashed border-muted-foreground/30 rounded-lg text-center">
              <div className="text-lg font-medium text-muted-foreground mb-2">Бонусная программа</div>
              <div className="text-sm text-muted-foreground">Бонусные баллы и скидки</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 