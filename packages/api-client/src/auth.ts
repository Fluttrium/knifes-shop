import instance from './config';

export const auth = {
    async login(email: string, password: string) {
        const response = await instance.post('/auth/login', { email, password });

        // Сохраняем токен
        localStorage.setItem('token', response.data.token);

        return response.data;
    },

    async register(email: string, password: string, name: string) {
        const response = await instance.post('/auth/register', { email, password, name });
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