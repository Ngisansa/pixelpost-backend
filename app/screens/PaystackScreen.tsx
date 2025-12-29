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
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { initPaystack, verifyPaystack } from "../api/paystack";
import { useApp } from "../context/AppContext";

export default function PaystackScreen() {
  const router = useRouter();
  const { addCredits } = useApp();

  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("125");
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  const handlePaystack = async () => {
    if (!email.trim()) {
      Alert.alert("Validation", "Enter your email");
      return;
    }

    setLoading(true);

    try {
      const init = await initPaystack(email.trim(), Number(amount));

      setReference(init.reference);

      await WebBrowser.openBrowserAsync(init.checkoutUrl);

      Alert.alert(
        "Complete Payment",
        "After payment, tap 'Verify Payment' below"
      );
    } catch (err: any) {
      Alert.alert("Payment Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!reference) return;

    try {
      const result = await verifyPaystack(reference);

      if (result.status === "success") {
        addCredits(10); // ✅ real unlock
        Alert.alert("Success", "10 credits added");
        router.replace("/(tabs)/profile");
      } else {
        Alert.alert("Payment incomplete");
      }
    } catch {
      Alert.alert("Verification failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buy Credits</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount (KES)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handlePaystack}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay with Paystack</Text>
        )}
      </TouchableOpacity>

      {reference && (
        <TouchableOpacity
          style={[styles.button, styles.verify]}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Verify Payment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  input: { borderWidth: 1, padding: 12, marginVertical: 10 },
  button: { backgroundColor: "#0066ff", padding: 16, marginTop: 12 },
  verify: { backgroundColor: "#00aa55" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "700" },
});
