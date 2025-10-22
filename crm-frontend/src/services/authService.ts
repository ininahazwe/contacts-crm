import api, { setToken, removeToken } from './api';
import type { User, LoginCredentials, AuthResponse } from '../types';

export const authService = {
  // Connexion
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 Tentative de connexion avec:', credentials.email);
      
      const response = await api.post<AuthResponse>('/users/login', credentials);
      
      console.log('✅ Réponse de connexion:', response.data);
      
      if (response.data.token) {
        setToken(response.data.token);
        console.log('✅ Token enregistré');
      } else {
        console.error('❌ Pas de token dans la réponse');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erreur de connexion complète:', error);
      console.error('❌ Réponse d\'erreur:', error.response?.data);
      console.error('❌ Status:', error.response?.status);
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.errors?.[0]?.message ||
        'Erreur de connexion. Vérifiez vos identifiants.'
      );
    }
  },

  // Vérifier si l'utilisateur est connecté
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await api.get<{ user: User }>('/users/me');
      console.log('✅ Utilisateur actuel:', response.data.user);
      return response.data.user;
    } catch (error) {
      console.log('❌ Pas d\'utilisateur connecté');
      return null;
    }
  },

  // Déconnexion
  logout(): void {
    removeToken();
    console.log('✅ Déconnexion effectuée');
  },

  // Rafraîchir le token (si supporté par Payload)
  async refreshToken(): Promise<string | null> {
    try {
      const response = await api.post<AuthResponse>('/users/refresh-token');
      if (response.data.token) {
        setToken(response.data.token);
        return response.data.token;
      }
      return null;
    } catch (error) {
      return null;
    }
  },
};