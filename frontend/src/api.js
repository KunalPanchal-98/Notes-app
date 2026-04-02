import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://notes-app-zs45.onrender.com",
  timeout: 8000,
});

export default api;
