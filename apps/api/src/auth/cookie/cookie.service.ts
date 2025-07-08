import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import {getCookieConfig} from "../config/cookie.config";


@Injectable()
export class CookieService {
    private cookieConfig;

    constructor(private configService: ConfigService) {
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        this.cookieConfig = getCookieConfig(isProduction);
    }


    setAuthCookie(res: Response, token: string): void {
        res.cookie(
            this.cookieConfig.name,
            token,
            this.cookieConfig.options
        );
    }


    clearAuthCookie(res: Response): void {
        res.clearCookie(this.cookieConfig.name);
    }

    getCookieName(): string {
        return this.cookieConfig.name;
    }
}
