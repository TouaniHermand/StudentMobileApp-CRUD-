import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UniversityScreen() {
  const handleContactPress = (type: "phone" | "email" | "website") => {
    switch (type) {
      case "phone":
        Linking.openURL("tel:(+237) 697 54 22 40");
        break;
      case "email":
        Linking.openURL("contact@enspd-udo.cm");
        break;
      case "website":
        Linking.openURL("https://enspd-udo.cm/");
        break;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../../assets/polytech.jpg")}
          style={styles.logo}
        />
        <Text style={styles.universityName}>
          Université Polytechnique de Douala
        </Text>
        <Text style={styles.universitySubtitle}>
          Excellence • Innovation • Leadership
        </Text>
      </View>

      {/* Section À propos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>À Propos de l'UPD</Text>
        <Text style={styles.description}>
          L'Université Polytechnique de Douala (UPD) est un établissement
          d'enseignement supérieur privé créé en 2007. Elle forme des ingénieurs
          et techniciens supérieurs dans diverses spécialités pour répondre aux
          besoins du marché de l'emploi camerounais et de la sous-région Afrique
          Centrale.
        </Text>
      </View>

      {/* Filières */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nos Filières</Text>
        <View style={styles.filiereContainer}>
          {[
            { nom: "Génie Informatique", icon: "laptop-outline" },
            { nom: "Génie Civil", icon: "construct-outline" },
            { nom: "Génie Électrique", icon: "flash-outline" },
            { nom: "Génie Mécanique", icon: "settings-outline" },
            { nom: "Génie Industriel", icon: "business-outline" },
            { nom: "Architecture", icon: "home-outline" },
          ].map((filiere, index) => (
            <View key={index} style={styles.filiereItem}>
              <Ionicons
                name={filiere.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color="#1e40af"
              />
              <Text style={styles.filiereText}>{filiere.nom}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Statistiques */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>En Chiffres</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2000+</Text>
            <Text style={styles.statLabel}>Étudiants</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>120+</Text>
            <Text style={styles.statLabel}>Enseignants</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15+</Text>
            <Text style={styles.statLabel}>Années d'expérience</Text>
          </View>
        </View>
      </View>

      {/* Contact */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nous Contacter</Text>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress("phone")}
        >
          <Ionicons name="call-outline" size={24} color="#1e40af" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Téléphone</Text>
            <Text style={styles.contactValue}>(+237) 697 54 22 40</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress("email")}
        >
          <Ionicons name="mail-outline" size={24} color="#1e40af" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactValue}>contact@enspd-udo.cm</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress("website")}
        >
          <Ionicons name="globe-outline" size={24} color="#1e40af" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Site Web</Text>
            <Text style={styles.contactValue}>https://enspd-udo.cm/</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.contactItem}>
          <Ionicons name="location-outline" size={24} color="#1e40af" />
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Adresse</Text>
            <Text style={styles.contactValue}>
              Campus PK17 Logbessou Douala,{"\n"}
              Cameroun BP 3132 Douala,
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 Université Polytechnique de Douala
        </Text>
        <Text style={styles.footerSubtext}>Tous droits réservés</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#1e40af",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  universityName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  universitySubtitle: {
    fontSize: 16,
    color: "#bfdbfe",
    textAlign: "center",
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4b5563",
    textAlign: "justify",
  },
  filiereContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  filiereItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
  },
  filiereText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1e40af",
  },
  statLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 8,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  contactValue: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  footer: {
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  footerSubtext: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
});
