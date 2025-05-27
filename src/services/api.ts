import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Etudiant, ApiResponse } from "../types";

const API_BASE_URL = "http://192.168.1.100:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


export const etudiantService = {
  // Récupérer tous les étudiants
  async getAll(): Promise<Etudiant[]> {
    try {
      const response = await api.get<ApiResponse<Etudiant[]>>("/etudiants");
      return response.data.data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des étudiants:", error);
      throw new Error("Impossible de récupérer les étudiants");
    }
  },

  // Récupérer un étudiant par ID
  async getById(id: string): Promise<Etudiant> {
    try {
      const response = await api.get<ApiResponse<Etudiant>>(`/etudiants/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'étudiant:", error);
      throw new Error("Étudiant non trouvé");
    }
  },

  // Créer un nouvel étudiant
  async create(etudiant: Omit<Etudiant, "id">): Promise<Etudiant> {
    try {
      const response = await api.post<ApiResponse<Etudiant>>(
        "/etudiants",
        etudiant
      );
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'étudiant:", error);
      throw new Error("Impossible de créer l'étudiant");
    }
  },

  // Mettre à jour un étudiant
  async update(id: string, etudiant: Partial<Etudiant>): Promise<Etudiant> {
    try {
      const response = await api.put<ApiResponse<Etudiant>>(
        `/etudiants/${id}`,
        etudiant
      );
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'étudiant:", error);
      throw new Error("Impossible de mettre à jour l'étudiant");
    }
  },

  // Supprimer un étudiant
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/etudiants/${id}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étudiant:", error);
      throw new Error("Impossible de supprimer l'étudiant");
    }
  },

  // Rechercher des étudiants
  async search(terme: string): Promise<Etudiant[]> {
    try {
      const response = await api.get<ApiResponse<Etudiant[]>>(
        `/etudiants/search?q=${encodeURIComponent(terme)}`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      throw new Error("Erreur lors de la recherche");
    }
  },
};

export default api;
