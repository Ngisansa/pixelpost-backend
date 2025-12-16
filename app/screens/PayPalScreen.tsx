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
import * as Linking from "expo-linking";
import { createPayPalOrder, capturePayPalOrder } from "@/api/paypal";

WebBrowser.maybeCompleteAuthSession();

export default function PayPalScreen() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function startPayPalPayment() {
    if (!amount.trim()) {
      Alert.alert("Amount required");
      return;
    }

    setLoading(true);

    try {
      const returnUrl = Linking.createURL("paypal-success");
      const cancelUrl = Linking.createURL("paypal-cancel");

      const order = await createPayPalOrder(
        Number(amount),
        returnUrl,
        cancelUrl
      );

      const approvalLink = order.links?.find(
        (l: any) => l.rel === "approve"
      )?.href;

      if (!approvalLink) {
        throw new Error("No PayPal approval link returned");
      }

      const result = await WebBrowser.openBrowserAsync(approvalLink);

      if (result.type === "dismiss") {
        Alert.alert("Payment cancelled");
        return;
      }

      const capture = await capturePayPalOrder(order.id);

      if (capture.status === "COMPLETED") {
        setIsPro(true);
        Alert.alert(
          "Payment Successful",
          "You are now subscribed to the Pro Plan."
        );
      } else {
        Alert.alert("Payment Failed", "PayPal payment not completed");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pay with PayPal</Text>

      <Text style={styles.label}>Amount (USD)</Text>
      <TextInput
        style={styles.input}
        placeholder="10"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={startPayPalPayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Pay with PayPal</Text>
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
    backgroundColor: "#003087", // PayPal blue
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
