import instance from './config';

export const auth = {
    async login(email: string, password: string) {
        const response = await instance.post('/auth/login', { email, password });

        // Сохраняем токен
        localStorage.setItem('token', response.data.token);

        return response.data;
    },

    async register(userData: {
        name: string;
        email: string;
        password: string;
        passwordconf: string;
        image?: string;
    }) {
        const response = await instance.post('/auth/register', userData);

        return response.data;
    },

    async logout() {
        await instance.post('/auth/logout');
        localStorage.removeItem('token');
    },

    async me() {
        const response = await instance.get('/auth/me');
        return response.data;
    }
};