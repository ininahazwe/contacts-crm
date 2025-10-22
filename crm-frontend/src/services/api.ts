import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'auth_token';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token a chaque requete
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

// Intercepteur pour gerer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Gestion du token avec localStorage (persistant au refresh)
export const setToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    console.log('Token sauvegarde dans localStorage');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du token:', error);
  }
};

export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      console.log('Token recupere depuis localStorage');
    }
    return token;
  } catch (error) {
    console.error('Erreur lors de la recuperation du token:', error);
    return null;
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    console.log('Token supprime du localStorage');
  } catch (error) {
    console.error('Erreur lors de la suppression du token:', error);
  }
};

export default api;