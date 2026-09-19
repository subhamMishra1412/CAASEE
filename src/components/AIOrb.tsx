import { Colors } from "@/constants/theme";
import { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface AIorbProps {
  onPress?: () => void;
  size?: "default" | "large";
  colors: (typeof Colors)["light"];
  disabled?: boolean;
}

export function AIOrb({
  onPress,
  size = "default",
  colors,
  disabled = false,
}: AIorbProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const orbSize = size === "large" ? 120 : 80;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
      accessibilityHint={disabled ? "AI chat is planned for Task 003" : undefined}
      activeOpacity={disabled ? 1 : 0.7}
    >
      {/* Outer pulse ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: orbSize + 30,
            height: orbSize + 30,
            borderRadius: (orbSize + 30) / 2,
            transform: [{ scale }],
            opacity,
            borderColor: colors.text,
          },
        ]}
      />

      {/* Main orb */}
      <View
        style={[
          styles.orb,
          {
            width: orbSize,
            height: orbSize,
            borderRadius: orbSize / 2,
            backgroundColor: colors.text,
          },
        ]}
      >
        <Text style={styles.orbText}>✨</Text>
      </View>

      {/* Subtle glow effect */}
      <View
        style={[
          styles.glow,
          {
            width: orbSize + 20,
            height: orbSize + 20,
            borderRadius: (orbSize + 20) / 2,
            backgroundColor: colors.text,
          },
        ]}
      />

      {/* Label */}
      <Text style={[styles.label, { color: colors.text }]}> 
        {disabled ? "AI chat coming in Task 003" : "Ask CAASEE"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  pulseRing: {
    position: "absolute",
    borderWidth: 2,
    opacity: 0.1,
  },
  orb: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  orbText: {
    fontSize: 40,
  },
  glow: {
    position: "absolute",
    opacity: 0.04,
    zIndex: 1,
  },
  label: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
