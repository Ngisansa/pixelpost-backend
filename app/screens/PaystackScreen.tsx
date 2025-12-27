import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { initPaystack, verifyPaystack } from "../api/paystack";
import { useApp } from "../context/AppContext";

export default function PaystackScreen() {
  const router = useRouter();
  const { addCredits } = useApp();

  const [email, setEmail] = useState("");
  const [amountKES, setAmountKES] = useState("125"); // Minimum = KES 125
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const handlePaystack = async () => {
    if (!email.trim()) {
      Alert.alert("Validation", "Please enter your email");
      return;
    }

    const amount = Number(amountKES);
    if (isNaN(amount) || amount < 125) {
      Alert.alert("Validation", "Minimum purchase is KES 125");
      return;
    }

    setLoading(true);

    try {
      const init = await initPaystack(email.trim(), amount);

      if (!init?.checkoutUrl || !init?.reference) {
        throw new Error("Invalid Paystack response");
      }

      setReference(init.reference);

      await WebBrowser.openBrowserAsync(init.checkoutUrl);

      Alert.alert(
        "Complete Payment",
        "After completing payment, tap 'Verify Payment' to unlock credits."
      );
    } catch (error: any) {
      console.error("Paystack init error:", error);
      Alert.alert("Payment Error", error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!reference) return;

    setLoading(true);

    try {
      const result = await verifyPaystack(reference);

      if (result.status === "success") {
        addCredits(10); // KES 125 = 10 credits

        Alert.alert(
          "Payment Successful",
          "10 credits have been added to your account"
        );

        router.replace("/(tabs)/profile");
      } else {
        Alert.alert("Payment Incomplete", "Payment was not completed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      Alert.alert("Verification Error", "Could not verify payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Credits</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Amount (KES)"
        value={amountKES}
        onChangeText={setAmountKES}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handlePaystack}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay with Paystack</Text>
        )}
      </TouchableOpacity>

      {reference && (
        <TouchableOpacity
          style={[styles.button, styles.verifyButton]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Verify Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#0066FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  verifyButton: {
    backgroundColor: "#00AA55",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
