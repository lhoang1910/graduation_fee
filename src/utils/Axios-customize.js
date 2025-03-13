import axios from "axios";

// const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:1910";
const baseUrl = "http://localhost:1910";

const instance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
});

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('access_token');
    if (token && !config.url.includes('/api/auth/')) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});


// Add a response interceptor
instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default instance;
