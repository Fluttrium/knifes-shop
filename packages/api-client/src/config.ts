import axios from 'axios';

// Создаем базовый instance
const instance = axios.create({
    baseURL: 'http://localhost:1488/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'X-Client': 'web-app'
    }
});

// Добавляем interceptor для токена
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default instance;
