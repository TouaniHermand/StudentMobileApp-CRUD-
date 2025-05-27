import { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface EnhancedLoadingScreenProps {
  message?: string;
  showLogo?: boolean;
}

export default function EnhancedLoadingScreen({
  message = "Chargement des données...",
  showLogo = true,
}: EnhancedLoadingScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de rotation continue
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    );

    // Animation de vague
    const waveAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    rotateAnimation.start();
    waveAnimation.start();

    return () => {
      rotateAnimation.stop();
      waveAnimation.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const wave1 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const wave2 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1.3],
  });

  const wave3 = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1.6],
  });

  return (
    <View style={styles.container}>
      {/* Vagues d'arrière-plan */}
      <View style={styles.wavesContainer}>
        <Animated.View
          style={[
            styles.wave,
            styles.wave1,
            {
              opacity: wave1,
              transform: [{ scale: wave1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.wave,
            styles.wave2,
            {
              opacity: wave2.interpolate({
                inputRange: [0.3, 1.3],
                outputRange: [0.3, 0],
                extrapolate: "clamp",
              }),
              transform: [{ scale: wave2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.wave,
            styles.wave3,
            {
              opacity: wave3.interpolate({
                inputRange: [0.6, 1.6],
                outputRange: [0.2, 0],
                extrapolate: "clamp",
              }),
              transform: [{ scale: wave3 }],
            },
          ]}
        />
      </View>

      {/* Contenu principal */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {showLogo && (
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ rotate: spin }],
              },
            ]}
          >
            <View style={styles.logoBackground}>
              <Ionicons name="school" size={48} color="#1e40af" />
            </View>
          </Animated.View>
        )}

        <View style={styles.loadingIndicator}>
          <View style={styles.spinnerContainer}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
              <Animated.View
                key={index}
                style={[
                  styles.spinnerDot,
                  {
                    transform: [
                      { rotate: `${index * 45}deg` },
                      { translateY: -20 },
                    ],
                    opacity: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        index === 0 ? 1 : 0.2,
                        index === 7 ? 1 : 0.2,
                      ],
                    }),
                  },
                ]}
              >
                <View style={styles.dot} />
              </Animated.View>
            ))}
          </View>
        </View>

        <Text style={styles.message}>{message}</Text>

        {/* Barre de progression stylisée */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  transform: [
                    {
                      translateX: rotateAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-width * 0.4, width * 0.4],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  wavesContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  wave: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
  },
  wave1: {
    borderColor: "rgba(30, 64, 175, 0.1)",
  },
  wave2: {
    borderColor: "rgba(30, 64, 175, 0.05)",
  },
  wave3: {
    borderColor: "rgba(30, 64, 175, 0.03)",
  },
  content: {
    alignItems: "center",
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 2,
    borderColor: "rgba(30, 64, 175, 0.1)",
  },
  loadingIndicator: {
    marginBottom: 24,
  },
  spinnerContainer: {
    width: 40,
    height: 40,
    position: "relative",
  },
  spinnerDot: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -2,
    marginTop: -2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1e40af",
  },
  message: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
    marginBottom: 24,
  },
  progressContainer: {
    width: width * 0.6,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(30, 64, 175, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    width: "30%",
    backgroundColor: "#1e40af",
    borderRadius: 2,
  },
});
