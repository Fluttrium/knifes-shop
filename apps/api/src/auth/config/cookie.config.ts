export interface CookieConfig {
  name: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
  };
}

export const getCookieConfig = (isProduction: boolean): CookieConfig => ({
  name: 'auth-token',
  options: {
    httpOnly: true,
    secure: false, // Изменено на false для HTTP
    sameSite: 'lax', // Изменено на lax для лучшей совместимости
    maxAge: 60 * 60 * 1000, // 1 час
  },
});

export const getCookieConfigRef = (isProduction: boolean): CookieConfig => ({
  name: 'refresh-token',
  options: {
    httpOnly: true,
    secure: false, // Изменено на false для HTTP
    sameSite: 'lax', // Изменено на lax для лучшей совместимости
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
  },
});
