import {Test, TestingModule} from '@nestjs/testing';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {RegisterUserDto} from './dto/register-user.dto';
import {LoginUserDto} from './dto/login-user.dto';
import {HttpStatus, ExecutionContext} from '@nestjs/common';
import {User} from 'src/user/entities/user.entity';
import {Role} from '@repo/database';
import {GetUser} from './decorators'; // Import the GetUser decorator

describe('AuthController', () => {
    let controller: AuthController;
    let authService: jest.Mocked<AuthService>;

    const mockResponse = () => {
        const res: any = {};
        res.status = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        registerUser: jest.fn(),
                        loginUser: jest.fn(),
                        refreshToken: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        authService = module.get(AuthService);
    });

    describe('register', () => {
        it('should register a new user', async () => {
            const registerDto: RegisterUserDto = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'password123',
                passwordconf: 'password123',
                image: null,
            };

            const expectedResult = {
                user: {
                    id: 1,
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                },
                token: 'mock-token',
            };

            authService.registerUser.mockResolvedValue(expectedResult);

            const result = await controller.register(registerDto);

            expect(result).toEqual(expectedResult);
            expect(authService.registerUser).toHaveBeenCalledWith(registerDto);
        });
    });

    describe('login', () => {
        it('should login a user', async () => {
            const loginDto: LoginUserDto = {
                email: 'test@example.com',
                password: 'password123',
            };

            const expectedResult = {
                user: {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com',
                },
                token: 'mock-token',
            };

            const res = mockResponse();
            authService.loginUser.mockResolvedValue(expectedResult);

            await controller.login(res, loginDto);

            expect(authService.loginUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
            expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(res.send).toHaveBeenCalledWith(expectedResult);
        });
    });

    describe('AuthController', () => {
        let controller: AuthController;
        let authService: jest.Mocked<AuthService>;

        beforeEach(async () => {
            const mockAuthService = {
                registerUser: jest.fn(),
                refreshToken: jest.fn(),
                // другие методы...
            };

            const module: TestingModule = await Test.createTestingModule({
                controllers: [AuthController],
                providers: [
                    {
                        provide: AuthService,
                        useValue: mockAuthService,
                    },
                ],
            }).compile();

            controller = module.get<AuthController>(AuthController);
            authService = module.get(AuthService);
        });

        describe('refreshToken', () => {
            it('should refresh the token', () => {
                const mockUser = {
                    id: '2313w49-0db7-4v79-aacc-52624343bf2t',
                    firstName: 'Test',
                    lastName: 'User',
                    email: 'test@example.com',
                    emailVerified: new Date(),
                    password: 'hashedPassword',
                    avatar: null,
                    role: 'user' as Role,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                } as User;

                const expectedResult = {
                    user: mockUser,
                    token: 'new-mock-token',
                };

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                authService.refreshToken.mockResolvedValue(expectedResult);

                const result = controller.refreshToken(mockUser);

                expect(result).toEqual(expectedResult);
                expect(authService.refreshToken).toHaveBeenCalledWith(mockUser);
            });
        });
    });

});