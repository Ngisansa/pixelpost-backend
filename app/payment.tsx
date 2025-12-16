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
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import { COLORS, SIZES, SHADOWS } from './constants/theme';
import Input from './components/Input';
import Button from './components/Button';

type PaymentMethod = 'paystack' | 'paypal' | 'flutterwave';

export default function PaymentScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { updateUser } = useAuth();
  const { addCredits } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paystack');
  const [isProcessing, setIsProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const { type, planId, planName, packageId, credits, amount, currency } = params;

  const paymentMethods: { id: PaymentMethod; name: string; icon: string; color: string; description: string }[] = [
    {
      id: 'paystack',
      name: 'Paystack',
      icon: 'card',
      color: COLORS.paystack,
      description: 'Cards, Bank Transfer, USSD (Nigeria & Africa)',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: 'logo-paypal',
      color: COLORS.paypal,
      description: 'International payments',
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      icon: 'wallet',
      color: COLORS.flutterwave,
      description: 'Multiple African payment options',
    },
  ];

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handlePayment = async () => {
    // Validate inputs
    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (selectedMethod === 'paystack' || selectedMethod === 'flutterwave') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('Invalid Card', 'Please enter a valid card number');
        return;
      }
      if (!expiryDate || expiryDate.length < 5) {
        Alert.alert('Invalid Expiry', 'Please enter a valid expiry date');
        return;
      }
      if (!cvv || cvv.length < 3) {
        Alert.alert('Invalid CVV', 'Please enter a valid CVV');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success
    setIsProcessing(false);

    if (type === 'subscription') {
      // Update subscription
      const subscriptionType = planId?.toString().split('_')[0] as 'free' | 'pro' | 'business';
      await updateUser({ subscription: subscriptionType });
      
      Alert.alert(
        'Payment Successful!',
        `You are now subscribed to the ${planName} plan.`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } else if (type === 'credits') {
      // Add credits
      const creditAmount = parseInt(credits?.toString() || '0', 10);
      addCredits(creditAmount);
      
      Alert.alert(
        'Payment Successful!',
        `${creditAmount} credits have been added to your account.`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    }
  };

  const getPaymentInstructions = () => {
    switch (selectedMethod) {
      case 'paystack':
        return 'Enter your card details below. Paystack supports Nigerian cards, international cards, bank transfers, and USSD payments.';
      case 'paypal':
        return 'You will be redirected to PayPal to complete your payment securely.';
      case 'flutterwave':
        return 'Enter your card details below. Flutterwave supports cards, mobile money, and bank transfers across Africa.';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
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
              {type === 'subscription' ? planName : `${credits} Credits`}
            </Text>
            <Text style={styles.orderPrice}>
              {currency === 'NGN' ? '₦' : '$'}
              {parseFloat(amount?.toString() || '0').toLocaleString()}
            </Text>
          </View>
          <View style={styles.orderDivider} />
          <View style={styles.orderItem}>
            <Text style={styles.orderTotalLabel}>Total</Text>
            <Text style={styles.orderTotalPrice}>
              {currency === 'NGN' ? '₦' : '$'}
              {parseFloat(amount?.toString() || '0').toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id && styles.paymentMethodSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={[styles.paymentIcon, { backgroundColor: method.color + '20' }]}>
                <Ionicons
                  name={method.icon as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={method.color}
                />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>{method.name}</Text>
                <Text style={styles.paymentDesc}>{method.description}</Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  selectedMethod === method.id && styles.radioButtonSelected,
                ]}
              >
                {selectedMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Instructions */}
        <View style={styles.instructionsBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.info} />
          <Text style={styles.instructionsText}>{getPaymentInstructions()}</Text>
        </View>

        {/* Payment Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail"
          />

          {selectedMethod !== 'paypal' && (
            <>
              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="numeric"
                maxLength={19}
                icon="card"
              />

              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Input
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="CVV"
                    placeholder="123"
                    value={cvv}
                    onChangeText={setCvv}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
            </>
          )}
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
          <Text style={styles.securityText}>
            Your payment is secured with 256-bit SSL encryption
          </Text>
        </View>

        {/* Pay Button */}
        <Button
          title={
            isProcessing
              ? 'Processing...'
              : `Pay ${currency === 'NGN' ? '₦' : '$'}${parseFloat(amount?.toString() || '0').toLocaleString()}`
          }
          onPress={handlePayment}
          loading={isProcessing}
          disabled={isProcessing}
          fullWidth
          size="large"
          icon={selectedMethod === 'paypal' ? 'logo-paypal' : 'card'}
        />

        {/* Cancel Link */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
          disabled={isProcessing}
        >
          <Text style={styles.cancelText}>Cancel Payment</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Processing Overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.processingText}>Processing Payment...</Text>
            <Text style={styles.processingSubtext}>Please do not close this screen</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  orderSummary: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  orderPrice: {
    fontSize: 16,
    color: COLORS.text,
  },
  orderDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  orderTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderTotalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
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
  paymentMethodSelected: {
    borderColor: COLORS.primary,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  paymentDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.info + '15',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 24,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  securityText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
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
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 20,
  },
  processingSubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});
