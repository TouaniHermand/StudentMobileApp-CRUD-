export interface Etudiant {
  id: number;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance: string;
  filiere: string;
  niveau: string;
  adresse?: string;
  statut: string;
  photo?: string;
  dateInscription: string;
}

export interface EtudiantCreate {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  dateNaissance: string;
  filiere: string;
  niveau: string;
  adresse?: string;
  statut: string;
}

export interface EtudiantUpdate {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  dateNaissance?: string;
  filiere?: string;
  niveau?: string;
  adresse?: string;
  statut?: string;
}

export interface ApiResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
