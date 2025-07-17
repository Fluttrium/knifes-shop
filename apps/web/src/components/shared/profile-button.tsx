'use client';

import React from 'react';
import { Button } from '../ui/button';
import { CircleUser, User } from 'lucide-react';
import Link from 'next/link';

interface Props {
  onClickSignIn?: () => void;
  className?: string;
  // Новые пропсы для состояния
  isAuthenticated?: boolean;
  isLoading?: boolean;
  userInfo?: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export const ProfileButton: React.FC<Props> = ({
                                                 className,
                                                 onClickSignIn,
                                                 isAuthenticated = false,
                                                 isLoading = false,
                                                 userInfo
                                               }) => {
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
            <Button onClick={onClickSignIn} variant="outline" className="flex items-center gap-1">
              <User size={16} />
              Войти
            </Button>
        ) : (
            <Link href="/profile">
              <Button variant="secondary" className="flex items-center gap-2">
                <CircleUser size={18} />
                {userInfo?.name || 'Профиль'}
              </Button>
            </Link>
        )}
      </div>
  );
};