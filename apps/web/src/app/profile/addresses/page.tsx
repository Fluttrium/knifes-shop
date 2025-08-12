"use client";

import { Container } from "@/components/shared/container";
import { AddressForm } from "@/components/shared/address-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";

export default function AddressesPage() {
  const { isAuthenticated } = useAuth();

  const handleAddressUpdated = () => {
    // Можно добавить дополнительную логику при обновлении адресов
    console.log("Адреса обновлены");
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <MapPin className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-semibold">Доступ запрещен</h2>
          <p className="text-muted-foreground text-center">
            Для управления адресами необходимо войти в систему
          </p>
          <Link href="/signin">
            <Button>Войти в систему</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Мои адреса</h1>
          <p className="text-muted-foreground">Управление адресами доставки</p>
        </div>

        <AddressForm onAddressUpdated={handleAddressUpdated} />
      </div>
    </Container>
  );
}
