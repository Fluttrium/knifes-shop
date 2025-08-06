import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  ShoppingCart,
  Truck,
  CreditCard,
  Settings,
  BarChart3,
  FolderOpen,
} from "lucide-react";

const adminNavItems = [
  {
    title: "Обзор",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Пользователи",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    title: "Товары",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Категории",
    href: "/dashboard/categories",
    icon: FolderOpen,
  },
  {
    title: "Заказы",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Доставки",
    href: "/dashboard/shipping",
    icon: Truck,
  },
  {
    title: "Платежи",
    href: "/dashboard/payments",
    icon: CreditCard,
  },
  {
    title: "Настройки",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === item.href && "bg-muted",
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        );
      })}
    </nav>
  );
}
