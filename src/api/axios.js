import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090"
});

api.interceptors.request.use(
  (config) => {
    // Récupère le token du sessionStorage
    const token = sessionStorage.getItem("token");

    // Si le token existe, l'ajouter aux en-têtes
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
