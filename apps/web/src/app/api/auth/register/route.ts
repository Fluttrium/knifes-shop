import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, passwordconf, image } = body;

    // Валидация
    if (!name || !email || !password || !passwordconf) {
      return NextResponse.json(
        { message: "Все поля обязательны для заполнения" },
        { status: 400 },
      );
    }

    if (password !== passwordconf) {
      return NextResponse.json(
        { message: "Пароли не совпадают" },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Пароль должен быть минимум 6 символов" },
        { status: 400 },
      );
    }

    // Отправляем запрос на API сервер
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:1488/api/v1";
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        passwordconf,
        image: image || "",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Ошибка регистрации" },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
