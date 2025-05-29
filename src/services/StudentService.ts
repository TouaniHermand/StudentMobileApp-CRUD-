import { BaseApiService } from './api';
import { Etudiant, EtudiantCreate, EtudiantUpdate, ApiResponse } from '../types';

export class StudentService extends BaseApiService {
  
  // Convertir les données backend vers frontend
  private mapToEtudiant(backendData: any): Etudiant {
    return {
      id: backendData.id,
      matricule: backendData.matricule,
      nom: backendData.nom,
      prenom: backendData.prenom,
      email: backendData.email,
      telephone: backendData.telephone,
      dateNaissance: backendData.dateNaissance,
      filiere: backendData.filiere,
      niveau: backendData.niveau,
      adresse: backendData.adresse,
      statut: backendData.statut?.toLowerCase() || 'actif',
      photo: backendData.photo || this.generateAvatar(backendData.prenom, backendData.nom),
      dateInscription: backendData.createdAt || backendData.dateInscription,
    };
  }

  // Convertir les données frontend vers backend
  private mapToBackend(frontendData: EtudiantCreate | EtudiantUpdate): any {
    const backendData = { ...frontendData };
    
    // Convertir le statut en majuscules pour le backend
    if (backendData.statut) {
      backendData.statut = backendData.statut.toUpperCase();
    }
    
    return backendData;
  }

  // Générer avatar par défaut
  private generateAvatar(prenom: string, nom: string): string {
    const name = encodeURIComponent(`${prenom} ${nom}`);
    return `https://ui-avatars.com/api/?name=${name}&background=1e40af&color=fff&size=200`;
  }

  // ====================================
  // MÉTHODES CRUD
  // ====================================

  // Récupérer tous les étudiants
  async getAllStudents(page = 0, size = 20): Promise<{ students: Etudiant[], total: number }> {
    const response: ApiResponse<any> = await this.get('/students', { page, size });
    
    return {
      students: response.content.map(item => this.mapToEtudiant(item)),
      total: response.totalElements
    };
  }

  // Récupérer un étudiant par ID
  async getStudentById(id: number): Promise<Etudiant> {
    const backendData = await this.get(`/students/${id}`);
    return this.mapToEtudiant(backendData);
  }

  // Créer un nouvel étudiant
  async createStudent(studentData: EtudiantCreate): Promise<Etudiant> {
    const backendData = this.mapToBackend(studentData);
    const response = await this.post('/students', backendData);
    return this.mapToEtudiant(response);
  }

  // Mettre à jour un étudiant
  async updateStudent(id: number, studentData: EtudiantUpdate): Promise<Etudiant> {
    const backendData = this.mapToBackend(studentData);
    const response = await this.put(`/students/${id}`, backendData);
    return this.mapToEtudiant(response);
  }

  // Supprimer un étudiant
  async deleteStudent(id: number): Promise<void> {
    await this.delete(`/students/${id}`);
  }

  // Rechercher des étudiants
  async searchStudents(query: string, page = 0, size = 20): Promise<{ students: Etudiant[], total: number }> {
    const response: ApiResponse<any> = await this.get('/students', { 
      search: query, 
      page, 
      size 
    });
    
    return {
      students: response.content.map(item => this.mapToEtudiant(item)),
      total: response.totalElements
    };
  }

  // Filtrer par filière
  async getStudentsByFiliere(filiere: string, page = 0, size = 20): Promise<{ students: Etudiant[], total: number }> {
    const response: ApiResponse<any> = await this.get('/students', { 
      filiere, 
      page, 
      size 
    });
    
    return {
      students: response.content.map(item => this.mapToEtudiant(item)),
      total: response.totalElements
    };
  }

  // Filtrer par statut
  async getStudentsByStatus(statut: string, page = 0, size = 20): Promise<{ students: Etudiant[], total: number }> {
    const response: ApiResponse<any> = await this.get('/students', { 
      statut: statut.toUpperCase(), 
      page, 
      size 
    });
    
    return {
      students: response.content.map(item => this.mapToEtudiant(item)),
      total: response.totalElements
    };
  }

  // Test de connexion
  async testConnection(): Promise<boolean> {
    try {
      await this.get('/actuator/health');
      return true;
    } catch {
      return false;
    }
  }
}