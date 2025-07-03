import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Role } from '@repo/database';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt entirely
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Create a strongly typed mock for PrismaService
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUniqueOrThrow: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-token'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let prisma: typeof mockPrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prisma = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  describe('registerUser', () => {
    const registerDto: RegisterUserDto = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123',
      passwordconf: 'password123',
      image: null,
    };

    const mockUser = {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      avatar: null,
      role: 'user' as Role,
      createdAt: new Date(),
      emailVerified: new Date(),
      password: 'hashed-password',
      updatedAt: new Date(),
    };

    it('should successfully register a user', async () => {
      prisma.user.create.mockResolvedValue(mockUser);

      const result = await authService.registerUser(registerDto);

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('mock-token');
      expect(prisma.user.create).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const invalidDto = { ...registerDto, passwordconf: 'different' };

      await expect(authService.registerUser(invalidDto))
          .rejects
          .toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user already exists', async () => {
      prisma.user.create.mockRejectedValue({ code: 'P2002' });

      await expect(authService.registerUser(registerDto))
          .rejects
          .toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException for other errors', async () => {
      prisma.user.create.mockRejectedValue(new Error('Some error'));

      await expect(authService.registerUser(registerDto))
          .rejects
          .toThrow(InternalServerErrorException);
    });
  });

  describe('loginUser', () => {
    const email = 'test@example.com';
    const password = 'password123';

    const mockUser = {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'hashed-password',
      avatar: null,
      role: 'user' as Role,
      createdAt: new Date(),
      emailVerified: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully login a user', async () => {
      prisma.user.findUniqueOrThrow.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.loginUser(email, password);

      expect(result.user).toEqual({
        id: mockUser.id,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        email: mockUser.email,
        avatar: mockUser.avatar,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
      });
      expect(result.token).toBe('mock-token');
    });

    it('should throw BadRequestException if credentials are invalid', async () => {
      prisma.user.findUniqueOrThrow.mockRejectedValue(new Error());

      await expect(authService.loginUser(email, password))
          .rejects
          .toThrow(BadRequestException);
    });

    it('should throw BadRequestException if password is incorrect', async () => {
      prisma.user.findUniqueOrThrow.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.loginUser(email, password))
          .rejects
          .toThrow(BadRequestException);
    });
  });

  describe('refreshToken', () => {
    it('should return a new token for the user', () => {
      const mockUser: User = {
        id: '2313w49-0db7-4v79-aacc-52624343bf2t',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        avatar: null,
        role: 'user' as Role,
        createdAt: new Date(),
        emailVerified: new Date(),
        password: 'hashed-password',
        updatedAt: new Date(),
      };

      const result = authService.refreshToken(mockUser);

      expect(result.user).toEqual(mockUser);
      expect(result.token).toBe('mock-token');
    });
  });
});