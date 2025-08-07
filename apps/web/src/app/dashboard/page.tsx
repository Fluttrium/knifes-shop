"use client";

import { useEffect, useState } from "react";
import { api } from "@repo/api-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Truck,
  CreditCard,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  orders: {
    totalOrders: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
    pendingOrders: number;
    confirmedOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
  };
  products: {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    lowStockProducts: number;
    totalCategories: number;
    totalBrands: number;
  };
  users: {
    totalUsers: number;
    adminUsers: number;
    regularUsers: number;
    todayUsers: number;
    thisWeekUsers: number;
    thisMonthUsers: number;
    usersWithOrders: number;
    averageOrdersPerUser: number;
  };
  payments: {
    totalPayments: number;
    totalAmount: number;
    pendingPayments: number;
    completedPayments: number;
    failedPayments: number;
  };
  shipping: {
    totalParcels: number;
    pendingParcels: number;
    shippedParcels: number;
    deliveredParcels: number;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      console.log("📊 Fetching dashboard stats...");
      const [orderStats, productStats, userStats] = await Promise.all([
        api.orders.getOrderStatistics(),
        api.products.getProductStatistics(),
        api.users.getUserStatistics(),
      ]);

      // Моковые данные для платежей и доставок (пока API не готов)
      const paymentStats = {
        totalPayments: 150,
        totalAmount: 250000,
        pendingPayments: 12,
        completedPayments: 135,
        failedPayments: 3,
      };

      const shippingStats = {
        totalParcels: 89,
        pendingParcels: 15,
        shippedParcels: 45,
        deliveredParcels: 29,
      };

      setStats({
        orders: orderStats,
        products: productStats,
        users: userStats,
        payments: paymentStats,
        shipping: shippingStats,
      });
    } catch (err) {
      console.error("❌ Error fetching dashboard stats:", err);
      setError("Ошибка при загрузке статистики");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Обзор</h1>
            <p className="text-muted-foreground">
              Статистика и аналитика магазина
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Обзор</h1>
            <p className="text-muted-foreground">
              Статистика и аналитика магазина
            </p>
          </div>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Обзор</h1>
          <p className="text-muted-foreground">
            Статистика и аналитика магазина
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats?.orders.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                {formatCurrency(stats?.orders.todayRevenue || 0)}
              </span>
              сегодня
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказы</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orders.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +{stats?.orders.todayOrders || 0}
              </span>
              сегодня
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товары</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.products.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="mr-1 h-3 w-3" />
                {stats?.products.outOfStockProducts || 0} нет в наличии
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +{stats?.users.todayUsers || 0}
              </span>
              сегодня
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Платежи</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.payments.totalPayments || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                {formatCurrency(stats?.payments.totalAmount || 0)}
              </span>
              общая сумма
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Доставки</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.shipping.totalParcels || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                {stats?.shipping.pendingParcels || 0} ожидают
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Статистика заказов</CardTitle>
            <CardDescription>
              Общая статистика по заказам и доходам
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Всего заказов</p>
                  <p className="text-2xl font-bold">{stats?.orders.totalOrders || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Заказов сегодня</p>
                  <p className="text-2xl font-bold text-primary">{stats?.orders.todayOrders || 0}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Общий доход</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats?.orders.totalRevenue || 0)}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Доход сегодня</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(stats?.orders.todayRevenue || 0)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Статистика товаров</CardTitle>
            <CardDescription>
              Информация о товарах и их наличии
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Всего товаров</p>
                <p className="text-2xl font-bold">{stats?.products.totalProducts || 0}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Активных товаров</p>
                <p className="text-2xl font-bold text-primary">{stats?.products.activeProducts || 0}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Нет в наличии</p>
                <p className="text-2xl font-bold text-destructive">{stats?.products.outOfStockProducts || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
