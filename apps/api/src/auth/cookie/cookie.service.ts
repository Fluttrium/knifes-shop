import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { getCookieConfig, getCookieConfigRef } from '../config/cookie.config';

@Injectable()
export class CookieService {
  private cookieConfig;
  private cookieRefreshConfig;

  constructor(private configService: ConfigService) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    this.cookieConfig = getCookieConfig(isProduction);
    this.cookieRefreshConfig = getCookieConfigRef(isProduction);
  }

  setAuthCookie(res: Response, token: string): void {
    res.cookie(this.cookieConfig.name, token, this.cookieConfig.options);
  }

  setRefreshCookie(res: Response, token: string): void {
    res.cookie(
      this.cookieRefreshConfig.name,
      token,
      this.cookieRefreshConfig.options,
    );
  }

  clearAuthCookie(res: Response): void {
    res.clearCookie(this.cookieConfig.name);
  }

  getCookieName(): string {
    return this.cookieConfig.name;
  }

  getRefreshCookieName(): string {
    return this.cookieRefreshConfig.name;
  }
}
