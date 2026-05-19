import axios from 'axios';

const api = axios.create({
    baseURL: '/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true, // PENTING: Untuk Sanctum SPA (Cookie-based auth)
});

export default api;
