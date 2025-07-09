import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from '../interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';
import { CookieService } from '../cookie/cookie.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly cookieService: CookieService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const cookieName = cookieService.getCookieName();
          return request?.cookies?.[cookieName];
        },
      ]),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
