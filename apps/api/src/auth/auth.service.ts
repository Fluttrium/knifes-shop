import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from './interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterUserDto): Promise<any> {
    this.logger.log(`POST: user/register: Register user started`);

    if (dto.password !== dto.passwordconf) {
      throw new BadRequestException('Passwords do not match');
    }

    dto.email = dto.email.toLowerCase().trim();

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordconf, ...newUserData } = dto;
      newUserData.password = hashedPassword;

      const newuser = await this.prisma.user.create({
        data: newUserData,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          createdAt: true,
        },
      });

      const token = this.getJwtToken({
        id: newuser.id,
      });

      const refToken = this.getRefreshToken({
        id: newuser.id,
      });

      return {
        user: newuser,
        token: token,
        refreshToken: refToken,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        this.logger.warn(
          `POST: auth/register: User already exists: ${dto.email}`,
        );
        throw new BadRequestException('User already exists');
      }
      this.logger.error(`POST: auth/register: error: ${error}`);
      throw new InternalServerErrorException('Server error');
    }
  }

  async loginUser(email: string, password: string): Promise<any> {
    this.logger.log(`POST: auth/login: Login iniciado: ${email}`);
    let user;
    try {
      user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          image: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      this.logger.error(`POST: auth/login: error: ${error}`);
      throw new BadRequestException('Wrong credentials');
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Wrong credentials');
    }

    delete user.password;

    this.logger.log(`POST: auth/login: Usuario aceptado: ${user.email}`);
    return {
      user,
      token: this.getJwtToken({
        id: user.id,
      }),
    };
  }

  async refreshTokens(user: User) {
    const payload = { id: user.id, email: user.email };

    const token = this.getJwtToken(payload);

    const refToken = this.getRefreshToken(payload);
    return {
      token,
      refToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  private getRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
