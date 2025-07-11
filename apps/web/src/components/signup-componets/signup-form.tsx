"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@repo/api-client";
import { notify } from "@/components/ui/toats/basic-toats";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (error) setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Введите имя");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Введите email");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен быть минимум 6 символов");
      return false;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Пароли не совпадают");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.auth.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordconf: formData.passwordConfirm,
        image: "",
      });

      console.log("Регистрация успешна:", response);
      notify("Регистрация прошла успешно!", "success");
      setSuccess(true);
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);
      const errorMessage = err.message || "Произошла ошибка при регистрации";
      notify(errorMessage, "error");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-green-600 text-lg font-semibold mb-2">
                Регистрация успешна!
              </div>
              <p className="text-sm text-gray-600">Перенаправляем вас...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Создайте свой аккаунт</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Иван"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ivan@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Пароль</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="passwordConfirm">Подтвердите пароль</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  placeholder="Повторите пароль"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-sm">
              Уже есть аккаунт?{" "}
              <a href="/signin" className="underline underline-offset-4">
                Войти
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
