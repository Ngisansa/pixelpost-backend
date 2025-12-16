import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { initPaystack, verifyPaystack } from "@/api/payments";
import { useApp } from "../context/AppContext";

WebBrowser.maybeCompleteAuthSession();

export default function PaystackScreen() {
  const { activatePro } = useApp();
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function startPayment() {
    if (!email.trim()) return Alert.alert("Email required");
    if (!amount.trim()) return Alert.alert("Amount required");

    setLoading(true);
    try {
      const init = await initPaystack(email.trim(), Number(amount));

      // Open checkout in browser
      const result = await WebBrowser.openBrowserAsync(init.url);

if (result.type !== "dismiss") {
  const verify = await verifyPaystack(init.reference);

  if (verify.status === "success") {
    Alert.alert("Payment Successful", "You are now subscribed to the Pro Plan.");
  } else {
    Alert.alert("Payment Failed", "Payment was not completed.");
  }
} else {
  Alert.alert("Payment Cancelled", "You cancelled the payment.");
}
if (verify.status === "success") {
  await activatePro();

  Alert.alert(
    "Payment Successful 🎉",
    "You are now subscribed to the Pro plan.",
  );
}
  Alert.alert(
    "Payment Successful 🎉",
    "You are now subscribed to the Pro plan.",
  );
}
      } else {
        Alert.alert("Payment Failed", "Payment was not completed.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay with Paystack</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Amount (KES)</Text>
      <TextInput
        style={styles.input}
        placeholder="1000"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.button} onPress={startPayment}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f7f9fc",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#0A66FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
