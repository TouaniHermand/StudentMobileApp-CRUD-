import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useEtudiants } from "../../context/EtudiantContext";
import type { Etudiant } from "../../types";
import LoadingScreen from "../../components/common/LoadingOverlay";
import EmptyScreen from "../../components/common/EmptyScreen";

export default function ListeEtudiants() {
  const navigation = useNavigation();
  const {
    etudiants,
    loading,
    error,
    supprimerEtudiant,
    chargerEtudiants,
    rechercherEtudiants,
  } = useEtudiants();

  const [recherche, setRecherche] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await chargerEtudiants();
    setRefreshing(false);
  };

  const handleRecherche = async (terme: string) => {
    setRecherche(terme);
    await rechercherEtudiants(terme);
  };

  const handleSuppression = (etudiant: Etudiant) => {
    Alert.alert(
      "Confirmer la suppression",
      `Êtes-vous sûr de vouloir supprimer ${etudiant.prenom} ${etudiant.nom} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => supprimerEtudiant(etudiant.id),
        },
      ]
    );
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "actif":
        return "#10b981";
      case "inactif":
        return "#f59e0b";
      case "diplome":
        return "#6366f1";
      default:
        return "#6b7280";
    }
  };

  const renderEtudiant = ({ item }: { item: Etudiant }) => (
    <TouchableOpacity
      style={styles.etudiantCard}
      onPress={() =>
        navigation.navigate("DetailsEtudiant", { etudiantId: item.id })
      }
    >
      <Image source={{ uri: item.photo }} style={styles.photo} />

      <View style={styles.infoContainer}>
        <Text style={styles.nom}>
          {item.prenom} {item.nom}
        </Text>
        <Text style={styles.matricule}>{item.matricule}</Text>
        <Text style={styles.filiere}>{item.filiere}</Text>
        <Text style={styles.niveau}>{item.niveau}</Text>

        <View style={styles.statutContainer}>
          <View
            style={[
              styles.statutBadge,
              { backgroundColor: getStatutColor(item.statut) },
            ]}
          >
            <Text style={styles.statutText}>{item.statut.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("ModifierEtudiant", { etudiantId: item.id })
          }
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleSuppression(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (loading && etudiants.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un étudiant..."
          value={recherche}
          onChangeText={handleRecherche}
        />
        {recherche.length > 0 && (
          <TouchableOpacity onPress={() => handleRecherche("")}>
            <Ionicons name="close-circle-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        )}
      </View>

      {/* Message d'erreur */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={16} color="#f59e0b" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Liste des étudiants */}
      {etudiants.length === 0 ? (
        <EmptyScreen
          message="Aucun étudiant trouvé"
          subMessage="Appuyez sur + pour ajouter un étudiant"
        />
      ) : (
        <FlatList
          data={etudiants}
          renderItem={renderEtudiant}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#1e40af"]}
            />
          }
        />
      )}

      {/* Bouton flottant d'ajout */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("AjouterEtudiant")}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#374151",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#92400e",
  },
  listContainer: {
    padding: 16,
  },
  etudiantCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nom: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  matricule: {
    fontSize: 14,
    color: "#1e40af",
    fontWeight: "600",
    marginTop: 2,
  },
  filiere: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  niveau: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  statutContainer: {
    marginTop: 8,
  },
  statutBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statutText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  actionsContainer: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#1e40af",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#dc2626",
    padding: 8,
    borderRadius: 8,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#1e40af",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});
