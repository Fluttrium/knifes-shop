"use client";

import { useAuth } from "@/hooks/use-auth";
import { redirect, usePathname } from "next/navigation";
import { User, MapPin, ShoppingBag, Settings } from "lucide-react";
import Link from "next/link";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/signin");
  }

  const menuItems = [
    {
      title: "Профиль",
      href: "/profile",
      icon: User,
    },
    {
      title: "Адреса",
      href: "/profile/addresses",
      icon: MapPin,
    },
    {
      title: "Заказы",
      href: "/orders",
      icon: ShoppingBag,
    },
    {
      title: "Настройки",
      href: "/profile/settings",
      icon: Settings,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Боковая панель */}
        <div className="lg:w-64">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Навигация</h2>
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground border-l-4 border-primary"
                        : "hover:bg-accent"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
