import axios from "axios";

export const BASE_URL = "/api";

const api = axios.create({
    baseURL: BASE_URL,
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            
            // Notify the app to redirect to login
            window.dispatchEvent(new Event("auth-expired"));
        }
        return Promise.reject(error);
    }
);

export default api;
