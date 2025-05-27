import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { EtudiantProvider, useEtudiants } from "./src/context/EtudiantContext";
import SplashScreen from "./src/components/common/SplashScreen";
import UniversityScreen from "./src/screens/university/UniversityScreen";
import ListeEtudiants from "./src/screens/students/ListeEtudiants";
import DetailsEtudiant from "./src/screens/students/DetailsEtudiant";
import AjouterEtudiant from "./src/screens/students/AjouterEtudiant";
import ModifierEtudiant from "./src/screens/students/ModifierEtudiant";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator pour les étudiants
function StudentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#1e40af" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="ListeEtudiants"
        component={ListeEtudiants}
        options={{ title: "Étudiants ENSPD" }}
      />
      <Stack.Screen
        name="DetailsEtudiant"
        component={DetailsEtudiant}
        options={{ title: "Détails Étudiant" }}
      />
      <Stack.Screen
        name="AjouterEtudiant"
        component={AjouterEtudiant}
        options={{ title: "Ajouter Étudiant" }}
      />
      <Stack.Screen
        name="ModifierEtudiant"
        component={ModifierEtudiant}
        options={{ title: "Modifier Étudiant" }}
      />
    </Stack.Navigator>
  );
}

// Bottom Tab Navigator principal
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "University") {
            iconName = focused ? "school" : "school-outline";
          } else if (route.name === "Students") {
            iconName = focused ? "people" : "people-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1e40af",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="University"
        component={UniversityScreen}
        options={{ tabBarLabel: "ENSPD" }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsStack}
        options={{ tabBarLabel: "Étudiants" }}
      />
    </Tab.Navigator>
  );
}

// Composant principal de l'application
function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const { initialLoading } = useEtudiants();

  // Afficher le splash screen pendant le chargement initial
  if (showSplash || initialLoading) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#1e40af" />
      <MainTabs />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <EtudiantProvider>
      <AppContent />
    </EtudiantProvider>
  );
}
