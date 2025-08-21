import axios from "axios";

const api = axios.create({
  baseURL:  import.meta.env.VITE_BASE_URL
});

api.interceptors.request.use(
  (config) => {
    // Récupère le token du sessionStorage
    const token = sessionStorage.getItem("token");

    // Si le token existe, l'ajouter aux en-têtes
    if (token && !config.url.startsWith('/auth')) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
