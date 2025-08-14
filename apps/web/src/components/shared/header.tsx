"use client";

import React from "react";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ProfileButton } from "./profile-button";
import { useAuth } from "@/hooks/use-auth";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaFolderOpen } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { CartButton } from "./cart-button";

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

export const Header: React.FC<Props> = ({
  hasSearch = true,
  hasCart = true,
  className,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const searchParams = useSearchParams();

  React.useEffect(() => {
    let toastMessage = "";

    if (searchParams.has("paid")) {
      toastMessage = "Заказ успешно оплачен! Информация отправлена на почту.";
    }

    if (searchParams.has("verified")) {
      toastMessage = "Почта успешно подтверждена!";
    }

    if (toastMessage) {
      const timeoutId = setTimeout(() => {
        router.replace("/");
        toast.success(toastMessage, {
          duration: 3000,
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [searchParams, router]);

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const handleMenuToggle = React.useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = React.useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleSignIn = React.useCallback(() => {
    router.push("/signin");
  }, [router]);

  return (
    <>
      {/* Мобильный хедер */}
      <header className={cn("border-b md:hidden", className)}>
        <Container className="flex items-center justify-between py-4">
          {/* Левая часть: Бургер-меню для мобильных устройств */}
          <div className="flex items-center ml-2">
            <button
              className="text-2xl hover:text-red-500 transition-colors duration-200"
              onClick={handleMenuToggle}
              aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <IoClose /> : <FiMenu />}
            </button>
          </div>

          {/* Центр: Лого */}
          <Link href="/" className="mx-auto" aria-label="Главная страница">
            <div className="flex items-center gap-4">
              <Image
                src="/logo1.png"
                alt="Логотип Ножи СПБ"
                width={35}
                height={35}
                priority
              />
            </div>
          </Link>

          {/* Правая часть: Корзина и Профиль */}
          <div className="flex items-center gap-3">
            {hasCart && <CartButton />}
            <ProfileButton
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              user={user}
              onClickSignIn={handleSignIn}
            />
          </div>
        </Container>

        {/* Бургер-меню */}
        {isMenuOpen && (
          <div className="fixed top-0 left-0 w-full h-screen bg-white z-50 flex flex-col items-center justify-center space-y-6">
            {/* Крестик для закрытия бургер-меню */}
            <button
              className="absolute top-4 right-4 text-2xl hover:text-red-500 transition-colors duration-200"
              onClick={handleMenuClose}
              aria-label="Закрыть меню"
            >
              <IoClose />
            </button>
            {/* Ссылки бургер-меню */}
            <nav role="navigation" aria-label="Основное меню">
              <ul className="flex flex-col items-center space-y-4 text-lg">
                <li className="flex items-center space-x-2 font-bold">
                  <FaFolderOpen />
                  <p>
                    Каталог
                  </p>
                </li>
                <li>
                  <Link href="/company" onClick={handleMenuClose}>
                    О компании
                  </Link>
                </li>
                <li>
                  <Link href="/paycard" onClick={handleMenuClose}>
                    Оплата
                  </Link>
                </li>
                <li>
                  <Link href="/delivery" onClick={handleMenuClose}>
                    Доставка
                  </Link>
                </li>
                <li>
                  <Link href="/garanty" onClick={handleMenuClose}>
                    Гарантия
                  </Link>
                </li>
                <li>
                  <Link href="/return" onClick={handleMenuClose}>
                    Возврат и Обмен
                  </Link>
                </li>
                <li>
                  <Link href="/discounts" onClick={handleMenuClose}>
                    Скидки
                  </Link>
                </li>
                <li>
                  <Link href="/contacts" onClick={handleMenuClose}>
                    Контакты
                  </Link>
                </li>
                <li>
                  <Link href="/blogers" onClick={handleMenuClose}>
                    Для Блогеров
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </header>

      {/* Десктопный хедер */}
      <header className={cn("border-b hidden md:block", className)}>
        <Container className="flex items-center justify-between py-8">
          {/* Левая часть */}
          <Link href="/" aria-label="Главная страница">
            <div className="flex items-center gap-4">
              <Image
                src="/logo1.png"
                alt="Логотип Ножи СПБ"
                width={35}
                height={35}
                priority
              />
              <div>
                <h1 className="text-2xl uppercase font-black">Ножи СПБ</h1>
                <p className="text-sm text-gray-400 leading-3">
                  Доставка по РФ
                </p>
              </div>
            </div>
          </Link>

          {hasSearch && (
            <div className="mx-10 flex-1">
              <SearchInput />
            </div>
          )}

          {/* Правая часть */}
          <div className="flex items-center gap-3">
            <ProfileButton
              isAuthenticated={isAuthenticated}
              isLoading={isLoading}
              user={user}
              onClickSignIn={handleSignIn}
            />
            {hasCart && <CartButton />}
          </div>
        </Container>
      </header>

      {/* Разделы под хедером для десктопа */}
      <nav
        className="border-b py-4 bg-gray-50 hidden md:block"
        role="navigation"
        aria-label="Дополнительная навигация"
      >
        <Container>
          <ul className="flex flex-wrap gap-4 justify-center text-xs font-medium text-gray-700 uppercase">
            {/* Ваши разделы */}
            <li className="hover:text-red-500 transition duration-200 ease-in-out">
              <Link href="/company">О компании</Link>
            </li>
            <li className="hover:text-red-500 transition duration-200 ease-in-out">
              <Link href="/paycard">Оплата</Link>
            </li>
            <li className="hover:text-red-500 transition duration-200 ease-in-out">
              <Link href="/delivery">Доставка</Link>
            </li>
            <li className="hover:text-red-500 transition duration-200 ease-in-out">
              <Link href="/garanty">Гарантия и Сервис</Link>
            </li>
            <li className="hover:text-red-500 transition duration-200 ease-in-out">
              <Link href="/return">Возврат и Обмен</Link>
            </li>
            <li className="hover:text-red-500 transition duration-200 ease-in-out">
              <Link href="/discounts">Скидки</Link>
            </li>
            <li className="hover:text-red-500 transition duration-200 ease-in-out">
              <Link href="/contacts">Контакты</Link>
            </li>
            <li className="hover:text-red-500 transition duration-200 ease-in-out">
              <Link href="/blogers">Для Блогеров</Link>
            </li>
          </ul>
        </Container>
      </nav>
    </>
  );
};
