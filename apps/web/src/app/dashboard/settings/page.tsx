"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CreditCard, 
  Truck, 
  Shield,
  Save,
  Settings as SettingsIcon,
  ShoppingCart
} from "lucide-react";

interface StoreSettings {
  // Основная информация
  storeName: string;
  storeDescription: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeWebsite: string;
  
  // Настройки заказов
  allowGuestCheckout: boolean;
  requireEmailConfirmation: boolean;
  autoConfirmOrders: boolean;
  
  // Настройки платежей
  defaultCurrency: string;
  taxRate: number;
  freeShippingThreshold: number;
  
  // Настройки доставки
  defaultShippingMethod: string;
  allowPickup: boolean;
  
  // Настройки безопасности
  requireStrongPasswords: boolean;
  enableTwoFactorAuth: boolean;
  sessionTimeout: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "Мой магазин ножей",
    storeDescription: "Качественные ножи для профессионалов и любителей",
    storeEmail: "info@knifeshop.ru",
    storePhone: "+7 (999) 123-45-67",
    storeAddress: "г. Москва, ул. Примерная, д. 1",
    storeWebsite: "https://knifeshop.ru",
    allowGuestCheckout: true,
    requireEmailConfirmation: false,
    autoConfirmOrders: false,
    defaultCurrency: "RUB",
    taxRate: 20,
    freeShippingThreshold: 5000,
    defaultShippingMethod: "courier",
    allowPickup: true,
    requireStrongPasswords: true,
    enableTwoFactorAuth: false,
    sessionTimeout: 30
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Здесь будет API вызов для сохранения настроек
      console.log("💾 Saving settings:", settings);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация API
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("❌ Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Настройки магазина</h1>
          <p className="text-muted-foreground">
            Управление основными настройками магазина
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>

      {saved && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Настройки успешно сохранены!</p>
        </div>
      )}

      <div className="grid gap-6">
        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Основная информация
            </CardTitle>
            <CardDescription>
              Основные данные о вашем магазине
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="storeName">Название магазина</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  placeholder="Введите название магазина"
                />
              </div>
              <div>
                <Label htmlFor="storeEmail">Email магазина</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  placeholder="info@example.com"
                />
              </div>
              <div>
                <Label htmlFor="storePhone">Телефон</Label>
                <Input
                  id="storePhone"
                  value={settings.storePhone}
                  onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
              <div>
                <Label htmlFor="storeWebsite">Веб-сайт</Label>
                <Input
                  id="storeWebsite"
                  value={settings.storeWebsite}
                  onChange={(e) => setSettings({ ...settings, storeWebsite: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="storeDescription">Описание магазина</Label>
              <Textarea
                id="storeDescription"
                value={settings.storeDescription}
                onChange={(e) => setSettings({ ...settings, storeDescription: e.target.value })}
                placeholder="Краткое описание вашего магазина"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="storeAddress">Адрес</Label>
              <Input
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                placeholder="Полный адрес магазина"
              />
            </div>
          </CardContent>
        </Card>

        {/* Настройки заказов */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Настройки заказов
            </CardTitle>
            <CardDescription>
              Управление процессом оформления заказов
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="guestCheckout">Разрешить гостевые заказы</Label>
                <p className="text-sm text-muted-foreground">
                  Позволить покупателям оформлять заказы без регистрации
                </p>
              </div>
              <Switch
                id="guestCheckout"
                checked={settings.allowGuestCheckout}
                onCheckedChange={(checked) => setSettings({ ...settings, allowGuestCheckout: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailConfirmation">Требовать подтверждение email</Label>
                <p className="text-sm text-muted-foreground">
                  Отправлять подтверждение на email после заказа
                </p>
              </div>
              <Switch
                id="emailConfirmation"
                checked={settings.requireEmailConfirmation}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailConfirmation: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoConfirm">Автоподтверждение заказов</Label>
                <p className="text-sm text-muted-foreground">
                  Автоматически подтверждать новые заказы
                </p>
              </div>
              <Switch
                id="autoConfirm"
                checked={settings.autoConfirmOrders}
                onCheckedChange={(checked) => setSettings({ ...settings, autoConfirmOrders: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Настройки платежей */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Настройки платежей
            </CardTitle>
            <CardDescription>
              Управление платежными настройками
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="currency">Валюта по умолчанию</Label>
                <select
                  id="currency"
                  value={settings.defaultCurrency}
                  onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="RUB">Рубль (RUB)</option>
                  <option value="USD">Доллар (USD)</option>
                  <option value="EUR">Евро (EUR)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="taxRate">Налоговая ставка (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                  placeholder="20"
                />
              </div>
              <div>
                <Label htmlFor="freeShipping">Бесплатная доставка от (₽)</Label>
                <Input
                  id="freeShipping"
                  type="number"
                  value={settings.freeShippingThreshold}
                  onChange={(e) => setSettings({ ...settings, freeShippingThreshold: parseFloat(e.target.value) || 0 })}
                  placeholder="5000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Настройки доставки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Настройки доставки
            </CardTitle>
            <CardDescription>
              Управление методами доставки
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shippingMethod">Метод доставки по умолчанию</Label>
                <select
                  id="shippingMethod"
                  value={settings.defaultShippingMethod}
                  onChange={(e) => setSettings({ ...settings, defaultShippingMethod: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="courier">Курьерская доставка</option>
                  <option value="pickup">Самовывоз</option>
                  <option value="post">Почта России</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allowPickup">Разрешить самовывоз</Label>
                  <p className="text-sm text-muted-foreground">
                    Позволить покупателям забирать заказы самостоятельно
                  </p>
                </div>
                <Switch
                  id="allowPickup"
                  checked={settings.allowPickup}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowPickup: checked })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Настройки безопасности */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность
            </CardTitle>
            <CardDescription>
              Настройки безопасности и прав доступа
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="strongPasswords">Требовать сложные пароли</Label>
                <p className="text-sm text-muted-foreground">
                  Пароли должны содержать буквы, цифры и символы
                </p>
              </div>
              <Switch
                id="strongPasswords"
                checked={settings.requireStrongPasswords}
                onCheckedChange={(checked) => setSettings({ ...settings, requireStrongPasswords: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="twoFactor">Двухфакторная аутентификация</Label>
                <p className="text-sm text-muted-foreground">
                  Требовать дополнительную проверку для входа
                </p>
              </div>
              <Switch
                id="twoFactor"
                checked={settings.enableTwoFactorAuth}
                onCheckedChange={(checked) => setSettings({ ...settings, enableTwoFactorAuth: checked })}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Таймаут сессии (минуты)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) || 30 })}
                placeholder="30"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 