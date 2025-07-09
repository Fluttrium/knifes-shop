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
    secure: isProduction, // HTTPS только в продакшене
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 часа
  },
});
