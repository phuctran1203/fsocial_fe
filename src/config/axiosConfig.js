import axios from "axios";
import { DOMAIN } from "../api";

export const axiosJWT = axios.create({
    baseURL: `${DOMAIN}`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Interceptor để thêm token vào header của yêu cầu
axiosJWT.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt');
        if (token)
            config.headers.Authorization = `Bearer ${token}`;
        else
            return Promise.reject("Không có JWT để thêm vào header");
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);