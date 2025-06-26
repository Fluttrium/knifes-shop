import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Введите корректный email адрес'),
    name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
    password: z.string()
        .min(8, 'Пароль должен содержать минимум 8 символов')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Пароль должен содержать заглавную букву, строчную букву, цифру и специальный символ'
        ),
});

export type RegisterDto = z.infer<typeof registerSchema>;