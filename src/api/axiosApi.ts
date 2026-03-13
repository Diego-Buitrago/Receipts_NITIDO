import axios from "axios";
import Cookies from "js-cookie";

const axiosApi = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? 'http://localhost:5000' : 'https://nitido-back.vercel.app',
    // headers: {
    //     Authorization: `Bearer ${token}`
    // }
});

// Interceptor para añadir el token antes de cada solicitud
axiosApi.interceptors.request.use((config) => {
    const token = Cookies.get("tokenNITIDO");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export { axiosApi };