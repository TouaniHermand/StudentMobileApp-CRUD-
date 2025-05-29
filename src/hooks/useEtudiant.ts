import { useState, useEffect, useCallback } from 'react';
import { StudentService } from '../services/StudentService';
import { Etudiant } from '../types/index';

export function useEtudiant(etudiantId: number | null) {
  const [etudiant, setEtudiant] = useState<Etudiant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const studentService = new StudentService();

  const chargerEtudiant = useCallback(async () => {
    if (!etudiantId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const etudiantData = await studentService.getStudentById(etudiantId);
      setEtudiant(etudiantData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [etudiantId]);

  useEffect(() => {
    chargerEtudiant();
  }, [chargerEtudiant]);

  const recharger = useCallback(() => {
    chargerEtudiant();
  }, [chargerEtudiant]);

  return {
    etudiant,
    loading,
    error,
    recharger,
  };
}