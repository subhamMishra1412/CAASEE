import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");

export default function App() {
  const handleGetStarted = () => {
    console.log("Get Started pressed");
    // Navigation will go here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.box}>
          {/* Decorative symbol */}
          <Text style={styles.symbol}>✦</Text>

          {/* Title */}
          <Text style={styles.title}>AI Calendar</Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>Norma,Your E&E Assistant</Text>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={handleGetStarted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  box: {
    width: "100%",
    maxWidth: 300,
    paddingVertical: 50,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    alignItems: "center",
    gap: 16,
  },
  symbol: {
    fontSize: 28,
    marginBottom: 10,
    color: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: "#000",
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
