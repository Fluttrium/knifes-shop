import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Введите корректный email адрес'),
    password: z.string().min(1, 'Пароль не может быть пустым'),
});

export type LoginDto = z.infer<typeof loginSchema>;