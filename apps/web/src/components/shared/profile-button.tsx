"use client";

import React from "react";
import { Button } from "../ui/button";
import { CircleUser, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

interface Props {
  onClickSignIn?: () => void;
  className?: string;
  // Новые пропсы для состояния
  isAuthenticated?: boolean;
  isLoading?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
  } | null;
}

export const ProfileButton: React.FC<Props> = ({
  className,
  onClickSignIn,
  isAuthenticated = false,
  isLoading = false,
  user,
}) => {
  const { isAdmin } = useAuth();

  // Показываем кнопку "Загрузка" если состояние загружается
  if (isLoading) {
    return (
      <div className={className}>
        <Button variant="outline" className="flex items-center gap-1" disabled>
          <User size={16} />
          Загрузка...
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {!isAuthenticated ? (
        <Button
          onClick={onClickSignIn}
          variant="outline"
          className="flex items-center gap-1"
        >
          <User size={16} />
          Войти
        </Button>
      ) : (
        <Link href={isAdmin ? "/dashboard" : "/profile"}>
          <Button variant="secondary" className="flex items-center gap-2">
            <CircleUser size={18} />
            {user?.name || "Профиль"}
          </Button>
        </Link>
      )}
    </div>
  );
};
