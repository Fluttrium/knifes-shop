"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function DashboardPage() {
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
            <div className="text-2xl font-bold">45,231.89 ₽</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +20.1%
              </span>
              с прошлого месяца
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Заказы</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +180.1%
              </span>
              с прошлого месяца
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Товары</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="mr-1 h-3 w-3" />
                -19%
              </span>
              с прошлого месяца
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +201
              </span>
              с прошлого месяца
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>
              Вы получили 265 заказов в этом месяце.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">{i}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Заказ #{1000 + i}</p>
                    <p className="text-xs text-muted-foreground">
                      Пользователь {i} • {(5000 + i * 100).toLocaleString()} ₽
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(Date.now() - i * 86400000).toLocaleDateString("ru-RU")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Популярные товары</CardTitle>
            <CardDescription>
              Товары с наибольшим количеством продаж.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">{i}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Нож {i}</p>
                    <p className="text-xs text-muted-foreground">
                      {100 + i * 10} продаж
                    </p>
                  </div>
                  <div className="text-xs font-medium">
                    {(5000 + i * 500).toLocaleString()} ₽
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
