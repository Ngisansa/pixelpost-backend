import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, SIZES, SHADOWS } from './constants/theme';
import Button from './components/Button';
import { apiRequest } from './lib/api';

type PaymentMethod = 'paystack' | 'paypal';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethod>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);

  const { type, planName, packageId, credits, amount, currency } = params;

  const paymentMethods = [
    {
      id: 'paystack' as PaymentMethod,
      name: 'Paystack',
      icon: 'card',
      color: COLORS.paystack,
      description: 'Cards, M-Pesa, Bank Transfer (KES)',
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      icon: 'logo-paypal',
      color: COLORS.paypal,
      description: 'International payments (USD)',
    },
  ];

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      /**
       * 🔐 REAL PAYMENT INITIATION
       * Backend decides:
       * - currency (KES for Paystack, USD for PayPal)
       * - amount
       * - gateway
       */
      const response = await apiRequest('/payments/initiate', {
        method: 'POST',
        body: JSON.stringify({
          type,
          packageId,
          paymentMethod: selectedMethod,
        }),
      });

      if (!response?.authorization_url) {
        throw new Error('Payment initialization failed');
      }

      /**
       * 🚀 Redirect to Paystack / PayPal
       * Credits will be added by webhook, NOT here
       */
      window.location.href = response.authorization_url;
    } catch (err: any) {
      Alert.alert('Payment Error', err.message || 'Unable to start payment');
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.orderTitle}>Order Summary</Text>

          <View style={styles.orderItem}>
            <Text style={styles.orderLabel}>
              {type === 'subscription'
                ? planName
                : `${credits} Credits`}
            </Text>
            <Text style={styles.orderPrice}>
              {currency === 'KES' ? 'KES ' : '$'}
              {Number(amount || 0).toLocaleString()}
            </Text>
          </View>

          <View style={styles.orderDivider} />

          <View style={styles.orderItem}>
            <Text style={styles.orderTotalLabel}>Total</Text>
            <Text style={styles.orderTotalPrice}>
              {currency === 'KES' ? 'KES ' : '$'}
              {Number(amount || 0).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id &&
                  styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View
                style={[
                  styles.paymentIcon,
                  { backgroundColor: method.color + '20' },
                ]}
              >
                <Ionicons
                  name={method.icon as any}
                  size={24}
                  color={method.color}
                />
              </View>

              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Text style={styles.paymentDesc}>
                  {method.description}
                </Text>
              </View>

              <View
                style={[
                  styles.radioButton,
                  selectedMethod === method.id &&
                    styles.radioButtonSelected,
                ]}
              >
                {selectedMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pay Button */}
        <Button
          title={
            isProcessing
              ? 'Redirecting...'
              : `Pay ${
                  currency === 'KES' ? 'KES ' : '$'
                }${Number(amount || 0).toLocaleString()}`
          }
          onPress={handlePayment}
          loading={isProcessing}
          disabled={isProcessing}
          fullWidth
          size="large"
          icon={
            selectedMethod === 'paypal'
              ? 'logo-paypal'
              : 'card'
          }
        />

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isProcessing}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
            />
            <Text style={styles.processingText}>
              Redirecting to payment…
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

/* =========================
   Styles (unchanged)
   ========================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  orderSummary: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  orderTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderLabel: { fontSize: 16, color: COLORS.textSecondary },
  orderPrice: { fontSize: 16 },
  orderDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  orderTotalLabel: { fontSize: 18, fontWeight: '600' },
  orderTotalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  paymentMethodSelected: { borderColor: COLORS.primary },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: { flex: 1, marginLeft: 12 },
  paymentName: { fontSize: 16, fontWeight: '600' },
  paymentDesc: { fontSize: 12, color: COLORS.textMuted },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  radioButtonSelected: { borderColor: COLORS.primary },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  cancelButton: { alignItems: 'center', paddingVertical: 16 },
  cancelText: { fontSize: 16, color: COLORS.textMuted },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radiusLarge,
    padding: 32,
    alignItems: 'center',
    width: '80%',
  },
  processingText: { fontSize: 16, marginTop: 16 },
});
