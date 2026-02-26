import axios from "axios";

const axiosApi = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? 'http://localhost:5000' : '',
    headers: {
        Authorization: `Bearer ${localStorage.getItem('tokenGastos')}`
    }
})

export { axiosApi };