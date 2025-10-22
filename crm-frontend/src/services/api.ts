import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Gestion du token en mémoire (pas de localStorage)
let authToken: string | null = null;

export const setToken = (token: string) => {
  authToken = token;
};

export const getToken = (): string | null => {
  return authToken;
};

export const removeToken = () => {
  authToken = null;
};

export default api;