import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { StudentService } from '../services/StudentService';
import { Etudiant, EtudiantCreate, EtudiantUpdate } from '../types';

interface EtudiantState {
  etudiants: Etudiant[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
}

type EtudiantAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ETUDIANTS'; payload: { etudiants: Etudiant[]; total: number } }
  | { type: 'ADD_ETUDIANT'; payload: Etudiant }
  | { type: 'UPDATE_ETUDIANT'; payload: Etudiant }
  | { type: 'DELETE_ETUDIANT'; payload: number }
  | { type: 'SET_PAGE'; payload: number };

const initialState: EtudiantState = {
  etudiants: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 0,
};

function etudiantReducer(state: EtudiantState, action: EtudiantAction): EtudiantState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_ETUDIANTS':
      return {
        ...state,
        etudiants: action.payload.etudiants,
        total: action.payload.total,
        loading: false,
        error: null,
      };
    case 'ADD_ETUDIANT':
      return {
        ...state,
        etudiants: [action.payload, ...state.etudiants],
        total: state.total + 1,
        loading: false,
        error: null,
      };
    case 'UPDATE_ETUDIANT':
      return {
        ...state,
        etudiants: state.etudiants.map(e => 
          e.id === action.payload.id ? action.payload : e
        ),
        loading: false,
        error: null,
      };
    case 'DELETE_ETUDIANT':
      return {
        ...state,
        etudiants: state.etudiants.filter(e => e.id !== action.payload),
        total: state.total - 1,
        loading: false,
        error: null,
      };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    default:
      return state;
  }
}

interface EtudiantContextType {
  // State
  etudiants: Etudiant[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  
  // Actions
  chargerEtudiants: (page?: number) => Promise<void>;
  obtenirEtudiant: (id: number) => Etudiant | undefined;
  creerEtudiant: (data: EtudiantCreate) => Promise<void>;
  modifierEtudiant: (id: number, data: EtudiantUpdate) => Promise<void>;
  supprimerEtudiant: (id: number) => Promise<void>;
  rechercherEtudiants: (query: string) => Promise<void>;
}

const EtudiantContext = createContext<EtudiantContextType | undefined>(undefined);

export function EtudiantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(etudiantReducer, initialState);
  const studentService = new StudentService();

  const chargerEtudiants = useCallback(async (page = 0) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const result = await studentService.getAllStudents(page, 20);
      dispatch({ type: 'SET_ETUDIANTS', payload: { etudiants: result.students, total: result.total } });
      dispatch({ type: 'SET_PAGE', payload: page });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const obtenirEtudiant = useCallback((id: number) => {
    return state.etudiants.find(e => e.id === id);
  }, [state.etudiants]);

  const creerEtudiant = useCallback(async (data: EtudiantCreate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const nouvelEtudiant = await studentService.createStudent(data);
      dispatch({ type: 'ADD_ETUDIANT', payload: nouvelEtudiant });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const modifierEtudiant = useCallback(async (id: number, data: EtudiantUpdate) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const etudiantModifie = await studentService.updateStudent(id, data);
      dispatch({ type: 'UPDATE_ETUDIANT', payload: etudiantModifie });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const supprimerEtudiant = useCallback(async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      await studentService.deleteStudent(id);
      dispatch({ type: 'DELETE_ETUDIANT', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const rechercherEtudiants = useCallback(async (query: string) => {
    if (!query.trim()) {
      return chargerEtudiants(0);
    }
    
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const result = await studentService.searchStudents(query, 0, 20);
      dispatch({ type: 'SET_ETUDIANTS', payload: { etudiants: result.students, total: result.total } });
      dispatch({ type: 'SET_PAGE', payload: 0 });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [chargerEtudiants]);

  return (
    <EtudiantContext.Provider value={{
      etudiants: state.etudiants,
      loading: state.loading,
      error: state.error,
      total: state.total,
      currentPage: state.currentPage,
      chargerEtudiants,
      obtenirEtudiant,
      creerEtudiant,
      modifierEtudiant,
      supprimerEtudiant,
      rechercherEtudiants,
    }}>
      {children}
    </EtudiantContext.Provider>
  );
}

export function useEtudiants() {
  const context = useContext(EtudiantContext);
  if (!context) {
    throw new Error('useEtudiants doit être utilisé dans EtudiantProvider');
  }
  return context;
}
