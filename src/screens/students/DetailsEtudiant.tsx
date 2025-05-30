import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useEtudiants } from "../../context/EtudiantContext";
import { useEtudiant } from "../../hooks/useEtudiant"; // Nouveau hook optionnel
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import LoadingOverlay from "../../components/common/LoadingOverlay";

export default function DetailsEtudiant() {
  const navigation = useNavigation();
  const route = useRoute();
  const { etudiantId } = route.params;
  
  // Option 1: Utiliser le nouveau hook dédié
  const { etudiant, loading, error, recharger } = useEtudiant(etudiantId);
  


  const { supprimerEtudiant } = useEtudiants();

  useEffect(() => {
    if (error) {
      Alert.alert("Erreur", error, [
        { text: "Réessayer", onPress: recharger },
        { text: "Retour", onPress: () => navigation.goBack() }
      ]);
    }
  }, [error]);

  if (loading) {
    return <LoadingOverlay visible={true} message="Chargement des détails..." />;
  }

  if (!etudiant) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#dc2626" />
          <Text style={styles.errorText}>Étudiant non trouvé</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleSuppression = () => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer ${etudiant.prenom} ${etudiant.nom} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await supprimerEtudiant(etudiant.id);
              Alert.alert("Succès", "Étudiant supprimé avec succès", [
                { text: "OK", onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer l'étudiant");
            }
          },
        },
      ]
    );
  };

  const handleContact = (type: "phone" | "email") => {
    if (type === "phone" && etudiant.telephone) {
      Linking.openURL(`tel:${etudiant.telephone}`);
    } else if (type === "email") {
      Linking.openURL(`mailto:${etudiant.email}`);
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut.toLowerCase()) {
      case "actif":
        return "#10b981";
      case "suspendu":
      case "inactif":
        return "#f59e0b";
      case "diplome":
        return "#6366f1";
      case "abandonne":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMMM yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header avec photo et infos principales */}
      <View style={styles.header}>
        <Image 
          source={{ 
            uri: etudiant.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(etudiant.prenom + ' ' + etudiant.nom)}&background=1e40af&color=fff&size=240` 
          }} 
          style={styles.photo} 
          defaultSource={require('../../../assets/polytech.jpg')}
        />
        <Text style={styles.nom}>
          {etudiant.prenom} {etudiant.nom}
        </Text>
        <Text style={styles.matricule}>{etudiant.matricule}</Text>

        <View
          style={[
            styles.statutBadge,
            { backgroundColor: getStatutColor(etudiant.statut) },
          ]}
        >
          <Text style={styles.statutText}>{etudiant.statut.toUpperCase()}</Text>
        </View>
      </View>

      {/* Informations académiques */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations Académiques</Text>

        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={20} color="#1e40af" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Filière</Text>
            <Text style={styles.value}>{etudiant.filiere}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="library-outline" size={20} color="#1e40af" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Niveau</Text>
            <Text style={styles.value}>{etudiant.niveau}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#1e40af" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Date d'inscription</Text>
            <Text style={styles.value}>
              {formatDate(etudiant.dateInscription )}
            </Text>
          </View>
        </View>
      </View>

      {/* Informations personnelles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations Personnelles</Text>

        <TouchableOpacity
          style={styles.infoRow}
          onPress={() => handleContact("email")}
        >
          <Ionicons name="mail-outline" size={20} color="#1e40af" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Email</Text>
            <Text style={[styles.value, styles.linkText]}>
              {etudiant.email}
            </Text>
          </View>
          <Ionicons name="open-outline" size={16} color="#6b7280" />
        </TouchableOpacity>

        {etudiant.telephone && (
          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handleContact("phone")}
          >
            <Ionicons name="call-outline" size={20} color="#1e40af" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Téléphone</Text>
              <Text style={[styles.value, styles.linkText]}>
                {etudiant.telephone}
              </Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#6b7280" />
          </TouchableOpacity>
        )}

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#1e40af" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Date de naissance</Text>
            <Text style={styles.value}>
              {formatDate(etudiant.dateNaissance)}
            </Text>
          </View>
        </View>

        {etudiant.adresse && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color="#1e40af" />
            <View style={styles.infoContent}>
              <Text style={styles.label}>Adresse</Text>
              <Text style={styles.value}>{etudiant.adresse}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Métadonnées */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations Système</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color="#1e40af" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Créé le</Text>
            <Text style={styles.value}>
              {formatDate(etudiant.dateInscription)}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="refresh-outline" size={20} color="#1e40af" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Dernière modification</Text>
            <Text style={styles.value}>
              {formatDate(etudiant.dateInscription)}
            </Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("ModifierEtudiant", { etudiantId: etudiant.id })
          }
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Modifier</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleSuppression}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton de rechargement */}
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={recharger}
      >
        <Ionicons name="refresh-outline" size={16} color="#1e40af" />
        <Text style={styles.refreshButtonText}>Actualiser</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles mis à jour
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  nom: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  matricule: {
    fontSize: 16,
    color: "#1e40af",
    fontWeight: "600",
    marginBottom: 12,
  },
  statutBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statutText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },
  value: {
    fontSize: 16,
    color: "#1f2937",
    marginTop: 2,
  },
  linkText: {
    color: "#1e40af",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#1e40af",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.45,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 0.45,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    textAlign: "center",
    flex: 1,
  },
  refreshButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  refreshButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: "#dc2626",
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#1e40af",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
