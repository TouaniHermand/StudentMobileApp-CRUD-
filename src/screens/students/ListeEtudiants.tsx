import { useState, useEffect } from "react";
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
import { Etudiant } from "../../types";

export default function ListeEtudiants() {
  const navigation = useNavigation();
  const {
    etudiants,
    loading,
    error,
    total,
    chargerEtudiants,
    supprimerEtudiant,
    rechercherEtudiants,
  } = useEtudiants();

  const [recherche, setRecherche] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // Charger les étudiants au démarrage
  useEffect(() => {
    chargerEtudiants();
  }, []);

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
      `Supprimer ${etudiant.prenom} ${etudiant.nom} ?`,
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

  const renderEtudiant = ({ item }: { item: Etudiant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("DetailsEtudiant", { etudiantId: item.id })}
    >
      <Image source={{ uri: item.photo }} style={styles.photo} />
      
      <View style={styles.info}>
        <Text style={styles.nom}>{item.prenom} {item.nom}</Text>
        <Text style={styles.matricule}>{item.matricule}</Text>
        <Text style={styles.filiere}>{item.filiere} - {item.niveau}</Text>
        <Text style={[styles.statut, { color: getStatutColor(item.statut) }]}>
          {item.statut.toUpperCase()}
        </Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("ModifierEtudiant", { etudiantId: item.id })}
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

  const getStatutColor = (statut: string) => {
    switch (statut.toLowerCase()) {
      case 'actif': return '#10b981';
      case 'suspendu': return '#f59e0b';
      case 'diplome': return '#6366f1';
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          value={recherche}
          onChangeText={handleRecherche}
        />
      </View>

      {/* Erreur */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Compteur */}
      <Text style={styles.counter}>{total} étudiants</Text>

      {/* Liste */}
      <FlatList
        data={etudiants}
        renderItem={renderEtudiant}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.list}
      />

      {/* Bouton d'ajout */}
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
  container: { flex: 1, backgroundColor: "#f8fafc" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  errorContainer: { backgroundColor: "#fee2e2", margin: 16, padding: 12, borderRadius: 8 },
  errorText: { color: "#dc2626", textAlign: "center" },
  counter: { paddingHorizontal: 16, color: "#6b7280", fontSize: 14 },
  list: { padding: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  photo: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  info: { flex: 1 },
  nom: { fontSize: 16, fontWeight: "bold", color: "#1f2937" },
  matricule: { fontSize: 14, color: "#1e40af", marginTop: 2 },
  filiere: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  statut: { fontSize: 10, fontWeight: "bold", marginTop: 4 },
  actions: { flexDirection: "row" },
  editButton: { 
    backgroundColor: "#1e40af", 
    padding: 8, 
    borderRadius: 8, 
    marginRight: 8 
  },
  deleteButton: { backgroundColor: "#dc2626", padding: 8, borderRadius: 8 },
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
    elevation: 8,
  },
});