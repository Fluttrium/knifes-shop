import { Controller, Post, Body, Res, UseGuards, Get } from '@nestjs/common';
import { Response } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { LoginResponse } from './interfaces';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { CookieService } from './cookie/cookie.service';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { GetUser } from './decorators';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'REGISTER',
    description: 'Публичный endpoint для регистрации с ролью "User".',
  })
  @ApiResponse({ status: 201, description: 'Ok', type: LoginResponse })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async register(
    @Body() createUserDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.registerUser(createUserDto);

    const token = result.token;
    const refreshToken = result.refreshToken;

    this.cookieService.setAuthCookie(res, token);
    this.cookieService.setRefreshCookie(res, refreshToken);

    return {
      user: result.user,
      message: 'Регистрация успешна',
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'LOGIN',
    description: 'Публичный endpoint для логина и получения токена',
  })
  @ApiResponse({ status: 200, description: 'Ok', type: LoginResponse })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.loginUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    this.cookieService.setAuthCookie(res, result.token);

    return result;
  }

  @Post('logout')
  @ApiOperation({
    summary: 'LOGOUT',
    description: 'Выход из системы - удаление токена из куки',
  })
  @ApiResponse({ status: 200, description: 'Ok' })
  logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.clearAuthCookie(res);
    return { message: 'Выход выполнен успешно' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'GET CURRENT USER',
    description: 'Получение информации о текущем пользователе',
  })
  @ApiResponse({ status: 200, description: 'Ok', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCurrentUser(@GetUser() user: User) {
    return user;
  }

  @Post('refresh')
  @UseGuards(RefreshJwtGuard) // Используем refresh guard
  async refresh(
    @GetUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshTokens(user);

    this.cookieService.setAuthCookie(res, tokens.token);
    this.cookieService.setRefreshCookie(res, tokens.refToken);

    return {
      message: 'Tokens refreshed successfully',
      user: tokens.user,
    };
  }
}
