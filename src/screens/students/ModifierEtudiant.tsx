import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useEtudiants } from "../../context/EtudiantContext";
import LoadingOverlay from "../../components/common/LoadingOverlay";

interface FormData {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  filiere: string;
  niveau: string;
  adresse: string;
  statut: "actif" | "inactif" | "diplome";
}

export default function ModifierEtudiant() {
  const navigation = useNavigation();
  const route = useRoute();
  const { etudiantId } = route.params;
  const { obtenirEtudiant, modifierEtudiant, loading } = useEtudiants();

  const [formData, setFormData] = useState<FormData>({
    matricule: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    filiere: "",
    niveau: "",
    adresse: "",
    statut: "actif",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const filieres = [
    "Génie Informatique",
    "Génie Civil",
    "Génie Électrique",
    "Génie Mécanique",
    "Génie Industriel",
    "Architecture",
  ];

  const niveaux = [
    "Licence 1",
    "Licence 2",
    "Licence 3",
    "Master 1",
    "Master 2",
  ];

  useEffect(() => {
    const etudiant = obtenirEtudiant(etudiantId);
    if (etudiant) {
      setFormData({
        matricule: etudiant.matricule,
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        email: etudiant.email,
        telephone: etudiant.telephone,
        dateNaissance: etudiant.dateNaissance,
        filiere: etudiant.filiere,
        niveau: etudiant.niveau,
        adresse: etudiant.adresse,
        statut: etudiant.statut,
      });
    }
  }, [etudiantId, obtenirEtudiant]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.matricule.trim()) {
      newErrors.matricule = "Le matricule est requis";
    }
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }
    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le téléphone est requis";
    }
    if (!formData.dateNaissance.trim()) {
      newErrors.dateNaissance = "La date de naissance est requise";
    }
    if (!formData.filiere.trim()) {
      newErrors.filiere = "La filière est requise";
    }
    if (!formData.niveau.trim()) {
      newErrors.niveau = "Le niveau est requis";
    }
    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Erreur", "Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    try {
      await modifierEtudiant(etudiantId, formData);

      Alert.alert("Succès", "Étudiant modifié avec succès", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de modifier l'étudiant");
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderInput = (
    field: keyof FormData,
    label: string,
    placeholder: string,
    options?: {
      keyboardType?: "default" | "email-address" | "phone-pad";
      multiline?: boolean;
      numberOfLines?: number;
    }
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label} *</Text>
      <TextInput
        style={[
          styles.input,
          options?.multiline && styles.textArea,
          errors[field] && styles.inputError,
        ]}
        value={formData[field]}
        onChangeText={(value) => updateField(field, value)}
        placeholder={placeholder}
        keyboardType={options?.keyboardType || "default"}
        multiline={options?.multiline}
        numberOfLines={options?.numberOfLines}
        autoCapitalize={field === "email" ? "none" : "words"}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderPicker = (
    field: keyof FormData,
    label: string,
    options: string[]
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label} *</Text>
      <View style={styles.pickerContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.pickerOption,
              formData[field] === option && styles.pickerOptionSelected,
            ]}
            onPress={() => updateField(field, option)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                formData[field] === option && styles.pickerOptionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.title}>Modifier l'Étudiant</Text>

          {renderInput("matricule", "Matricule", "Ex: UPD2024001")}
          {renderInput("nom", "Nom", "Nom de famille")}
          {renderInput("prenom", "Prénom", "Prénom(s)")}
          {renderInput("email", "Email", "exemple@upd.cm", {
            keyboardType: "email-address",
          })}
          {renderInput("telephone", "Téléphone", "+237690123456", {
            keyboardType: "phone-pad",
          })}
          {renderInput("dateNaissance", "Date de naissance", "YYYY-MM-DD")}

          {renderPicker("filiere", "Filière", filieres)}
          {renderPicker("niveau", "Niveau", niveaux)}

          {renderInput("adresse", "Adresse", "Adresse complète", {
            multiline: true,
            numberOfLines: 3,
          })}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Statut</Text>
            <View style={styles.statutContainer}>
              {(["actif", "inactif", "diplome"] as const).map((statut) => (
                <TouchableOpacity
                  key={statut}
                  style={[
                    styles.statutOption,
                    formData.statut === statut && styles.statutOptionSelected,
                  ]}
                  onPress={() => updateField("statut", statut)}
                >
                  <Text
                    style={[
                      styles.statutOptionText,
                      formData.statut === statut &&
                        styles.statutOptionTextSelected,
                    ]}
                  >
                    {statut.charAt(0).toUpperCase() + statut.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close-outline" size={20} color="#6b7280" />
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                loading && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Ionicons name="checkmark-outline" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>
                {loading ? "Modification..." : "Modifier"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <LoadingOverlay
        visible={loading}
        message="Modification de l'étudiant en cours..."
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1f2937",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pickerOption: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  pickerOptionSelected: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  pickerOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  statutContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statutOption: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  statutOptionSelected: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  statutOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  statutOptionTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    gap: 12,
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: "#1e40af",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
