import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export class BaseApiService {
  protected baseURL: string;
  
  constructor() {
    // URL selon la plateforme
    if (__DEV__) {
      this.baseURL = 
      Platform.OS === 'android' 
        ? 'https://192.168.251.65:8443/api/v1'
        : 'https://localhost:8443/api/v1';
    } else {
      this.baseURL = 'https://votre-domaine.com/api/v1';
    }
  }

  // Obtenir les headers avec token
  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Ajouter le token d'auth si disponible
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Erreur récupération token:', error);
    }

    return headers;
  }

  // Méthode de requête principale
  protected async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    params?: Record<string, any>
  ): Promise<T> {
    // Créer un controller pour gérer le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      // Construire l'URL avec paramètres
      const url = new URL(`${this.baseURL}${endpoint}`);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      // Configuration de la requête
      const config: RequestInit = {
        method,
        headers: await this.getHeaders(),
        signal: controller.signal,
      };

      // Ajouter le body si nécessaire
      if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
        config.body = JSON.stringify(data);
      }

      console.log(`🚀 ${method} ${url.toString()}`);

      // Effectuer la requête
      const response = await fetch(url.toString(), config);
      
      // Annuler le timeout car la requête a réussi
      clearTimeout(timeoutId);

      // Vérifier le statut
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      // Retourner la réponse JSON
      const result = await response.json();
      console.log(`✅ Réponse reçue`);
      return result;

    } catch (error: any) {
      // Annuler le timeout en cas d'erreur
      clearTimeout(timeoutId);
      
      console.error(`❌ Erreur ${method} ${endpoint}:`, error.message);
      
      // Messages d'erreur user-friendly
      if (error.name === 'AbortError') {
        throw new Error('Délai d\'attente dépassé');
      }
      if (error.message?.includes('Network')) {
        throw new Error('Erreur de connexion. Vérifiez que le backend est démarré.');
      }
      
      throw new Error(error.message || 'Erreur inconnue');
    }
  }

  // Méthodes HTTP simplifiées
  protected get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, params);
  }

  protected post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  protected put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  protected delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }
}