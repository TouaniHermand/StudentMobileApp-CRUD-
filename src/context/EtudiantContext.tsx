import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Etudiant, EtudiantContextType } from "../types";
import { etudiantService } from "../services/api";

const EtudiantContext = createContext<EtudiantContextType | undefined>(
  undefined
);

// Données mockées pour le développement (à supprimer quand l'API est prête)
const etudiantsMock: Etudiant[] = [
  {
    id: "1",
    matricule: "UPD2024001",
    nom: "Mballa",
    prenom: "Jean Pierre",
    email: "jean.mballa@upd.cm",
    telephone: "+237690123456",
    dateNaissance: "2000-05-15",
    filiere: "Génie Informatique",
    niveau: "Licence 3",
    adresse: "Douala, Cameroun",
    photo: "/placeholder.svg?height=100&width=100",
    dateInscription: "2022-09-01",
    statut: "actif",
  },
  {
    id: "2",
    matricule: "UPD2024002",
    nom: "Nguema",
    prenom: "Marie Claire",
    email: "marie.nguema@upd.cm",
    telephone: "+237677654321",
    dateNaissance: "1999-12-03",
    filiere: "Génie Civil",
    niveau: "Master 1",
    adresse: "Yaoundé, Cameroun",
    photo: "/placeholder.svg?height=100&width=100",
    dateInscription: "2021-09-01",
    statut: "actif",
  },
  {
    id: "3",
    matricule: "UPD2024003",
    nom: "Fouda",
    prenom: "Alain",
    email: "alain.fouda@upd.cm",
    telephone: "+237698765432",
    dateNaissance: "2001-03-10",
    filiere: "Génie Électrique",
    niveau: "Licence 2",
    adresse: "Bafoussam, Cameroun",
    photo: "/placeholder.svg?height=100&width=100",
    dateInscription: "2023-09-01",
    statut: "actif",
  },
];

export function EtudiantProvider({ children }: { children: ReactNode }) {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les étudiants depuis l'API ou le cache local
  const chargerEtudiants = async () => {
    if (initialLoading) {
      setInitialLoading(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      // Simuler un délai pour voir l'animation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Essayer de charger depuis l'API
      const etudiantsAPI = await etudiantService.getAll();
      setEtudiants(etudiantsAPI);

      // Sauvegarder en cache local
      await AsyncStorage.setItem("etudiants", JSON.stringify(etudiantsAPI));
    } catch (error) {
      console.warn("Erreur API, utilisation des données mockées:", error);

      // En cas d'erreur, utiliser les données mockées ou le cache
      try {
        const etudiantsCache = await AsyncStorage.getItem("etudiants");
        if (etudiantsCache) {
          setEtudiants(JSON.parse(etudiantsCache));
        } else {
          setEtudiants(etudiantsMock);
        }
      } catch (cacheError) {
        setEtudiants(etudiantsMock);
      }

      setError("Mode hors ligne - Données locales utilisées");
    } finally {
      if (initialLoading) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Ajouter un étudiant
  const ajouterEtudiant = async (nouvelEtudiant: Omit<Etudiant, "id">) => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai pour voir l'animation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const etudiantCree = await etudiantService.create(nouvelEtudiant);
      setEtudiants((prev) => [...prev, etudiantCree]);
    } catch (error) {
      // Mode hors ligne - ajouter localement
      const etudiantLocal: Etudiant = {
        ...nouvelEtudiant,
        id: Date.now().toString(),
      };
      setEtudiants((prev) => [...prev, etudiantLocal]);
      setError("Ajouté en mode hors ligne");
    } finally {
      setLoading(false);
    }
  };

  // Modifier un étudiant
  const modifierEtudiant = async (
    id: string,
    etudiantModifie: Partial<Etudiant>
  ) => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai pour voir l'animation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const etudiantMisAJour = await etudiantService.update(
        id,
        etudiantModifie
      );
      setEtudiants((prev) =>
        prev.map((etudiant) =>
          etudiant.id === id ? etudiantMisAJour : etudiant
        )
      );
    } catch (error) {
      // Mode hors ligne - modifier localement
      setEtudiants((prev) =>
        prev.map((etudiant) =>
          etudiant.id === id ? { ...etudiant, ...etudiantModifie } : etudiant
        )
      );
      setError("Modifié en mode hors ligne");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un étudiant
  const supprimerEtudiant = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      // Simuler un délai pour voir l'animation
      await new Promise((resolve) => setTimeout(resolve, 800));

      await etudiantService.delete(id);
      setEtudiants((prev) => prev.filter((etudiant) => etudiant.id !== id));
    } catch (error) {
      // Mode hors ligne - supprimer localement
      setEtudiants((prev) => prev.filter((etudiant) => etudiant.id !== id));
      setError("Supprimé en mode hors ligne");
    } finally {
      setLoading(false);
    }
  };

  // Obtenir un étudiant par ID
  const obtenirEtudiant = (id: string): Etudiant | undefined => {
    return etudiants.find((etudiant) => etudiant.id === id);
  };

  // Rechercher des étudiants
  const rechercherEtudiants = async (terme: string) => {
    if (!terme.trim()) {
      await chargerEtudiants();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const resultats = await etudiantService.search(terme);
      setEtudiants(resultats);
    } catch (error) {
      // Recherche locale en cas d'erreur
      const resultatsLocaux = etudiants.filter(
        (etudiant) =>
          etudiant.nom.toLowerCase().includes(terme.toLowerCase()) ||
          etudiant.prenom.toLowerCase().includes(terme.toLowerCase()) ||
          etudiant.matricule.toLowerCase().includes(terme.toLowerCase()) ||
          etudiant.filiere.toLowerCase().includes(terme.toLowerCase())
      );
      setEtudiants(resultatsLocaux);
      setError("Recherche locale uniquement");
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au démarrage
  useEffect(() => {
    chargerEtudiants();
  }, []);

  return (
    <EtudiantContext.Provider
      value={{
        etudiants,
        loading,
        initialLoading,
        error,
        ajouterEtudiant,
        modifierEtudiant,
        supprimerEtudiant,
        obtenirEtudiant,
        chargerEtudiants,
        rechercherEtudiants,
      }}
    >
      {children}
    </EtudiantContext.Provider>
  );
}

export function useEtudiants() {
  const context = useContext(EtudiantContext);
  if (context === undefined) {
    throw new Error("useEtudiants must be used within an EtudiantProvider");
  }
  return context;
}
