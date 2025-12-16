import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useApp } from "../context/AppContext";

export default function AnalyticsScreen() {
  console.log("ANALYTICS TAB LOADED — GATED VERSION");

  const { isPro } = useApp();
  const router = useRouter();

  // 🔒 HARD GATE — FREE USERS STOP HERE
  if (!isPro) {
    return (
      <View style={styles.lockedContainer}>
        <Ionicons name="lock-closed" size={48} color="#0066FF" />

        <Text style={styles.title}>Analytics is a Pro Feature</Text>

        <Text style={styles.subtitle}>
          Upgrade to Pro to unlock post performance, reach, and engagement
          insights.
        </Text>

        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={() => router.push("/subscription")}
        >
          <Text style={styles.upgradeText}>Upgrade to Pro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ✅ PRO USERS ONLY (placeholder for now)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>
        Analytics dashboard coming next.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f9fc",
  },
  lockedContainer: {
    flex: 1,
    backgroundColor: "#f7f9fc",
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: "#0066FF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  upgradeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
