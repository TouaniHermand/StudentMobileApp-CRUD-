export interface Etudiant {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  filiere: string;
  niveau: string;
  adresse: string;
  photo?: string;
  dateInscription: string;
  statut: "actif" | "inactif" | "diplome";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

export interface EtudiantContextType {
  etudiants: Etudiant[];
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  ajouterEtudiant: (etudiant: Omit<Etudiant, "id">) => Promise<void>;
  modifierEtudiant: (id: string, etudiant: Partial<Etudiant>) => Promise<void>;
  supprimerEtudiant: (id: string) => Promise<void>;
  obtenirEtudiant: (id: string) => Etudiant | undefined;
  chargerEtudiants: () => Promise<void>;
  rechercherEtudiants: (terme: string) => Promise<void>;
}
