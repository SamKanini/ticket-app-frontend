import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

//GET API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //IMPORTING EVERYTHING IN OUR ENV FILE
});

//CONNECT INTERCEPTORS TO API
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default api;
