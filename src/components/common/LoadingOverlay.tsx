import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  type?: "default" | "success" | "error";
}

export default function LoadingOverlay({
  visible,
  message = "Chargement...",
  type = "default",
}: LoadingOverlayProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Animation d'entrée
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Animation de rotation continue
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );

      // Animation de pulsation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      pulseAnimation.start();

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
      };
    } else {
      // Animation de sortie
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const getIconAndColor = () => {
    switch (type) {
      case "success":
        return { icon: "checkmark-circle", color: "#10b981" };
      case "error":
        return { icon: "alert-circle", color: "#ef4444" };
      default:
        return { icon: "sync", color: "#1e40af" };
    }
  };

  const { icon, color } = getIconAndColor();

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Cercles décoratifs */}
          <View style={styles.circlesContainer}>
            <Animated.View
              style={[
                styles.circle,
                styles.circle1,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.circle,
                styles.circle2,
                {
                  transform: [{ scale: pulseAnim }, { rotate: spin }],
                },
              ]}
            />
          </View>

          {/* Icône principale */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform:
                  type === "default"
                    ? [{ rotate: spin }]
                    : [{ scale: pulseAnim }],
              },
            ]}
          >
            <View style={[styles.iconBackground, { backgroundColor: color }]}>
              <Ionicons
                name={icon as keyof typeof Ionicons.glyphMap}
                size={32}
                color="#fff"
              />
            </View>
          </Animated.View>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Barre de progression animée */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: color,
                    transform: [
                      {
                        translateX: rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-width * 0.5, width * 0.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          </View>

          {/* Points décoratifs */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor: color,
                    opacity: rotateAnim.interpolate({
                      inputRange: [0, 0.33, 0.66, 1],
                      outputRange:
                        index === 0
                          ? [1, 0.3, 0.3, 1]
                          : index === 1
                          ? [0.3, 1, 0.3, 0.3]
                          : [0.3, 0.3, 1, 0.3],
                    }),
                    transform: [
                      {
                        scale: rotateAnim.interpolate({
                          inputRange: [0, 0.33, 0.66, 1],
                          outputRange:
                            index === 0
                              ? [1, 0.5, 0.5, 1]
                              : index === 1
                              ? [0.5, 1, 0.5, 0.5]
                              : [0.5, 0.5, 1, 0.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    minWidth: width * 0.7,
    maxWidth: width * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  circlesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "rgba(30, 64, 175, 0.1)",
  },
  circle1: {
    width: 120,
    height: 120,
    top: -10,
    left: -10,
  },
  circle2: {
    width: 80,
    height: 80,
    bottom: -10,
    right: -10,
    borderColor: "rgba(30, 64, 175, 0.05)",
  },
  iconContainer: {
    marginBottom: 20,
    zIndex: 1,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  message: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  progressContainer: {
    width: "100%",
    marginBottom: 16,
  },
  progressBar: {
    height: 3,
    backgroundColor: "#f3f4f6",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "30%",
    borderRadius: 2,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
