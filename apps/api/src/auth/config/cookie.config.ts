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
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  },
});

export const getCookieConfigRef = (isProduction: boolean): CookieConfig => ({
  name: 'refresh-token',
  options: {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  },
});
