import axios from 'axios';

import { getToken, logout } from './auth';

const api = axios.create({
    baseURL: process.env.REACT_APP_HOST,
});

api.interceptors.request.use(async config => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(async config => {
    if(config.status === 401) {
        logout();
        window.location.assign('/');
    }
    return config;
});

export default api;