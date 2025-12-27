import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from './context/AuthContext';
import { COLORS, SIZES, SHADOWS } from './constants/theme';
import { SUBSCRIPTION_PLANS, CREDIT_PACKAGES } from './constants/data';

import SubscriptionCard from './components/SubscriptionCard';
import Button from './components/Button';

export default function SubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  /**
   * 🚧 Subscriptions disabled for launch
   */
  const handleSelectPlan = () => {
    Alert.alert(
      'Coming Soon 🚧',
      'Subscriptions will be available soon.\n\nYou can already purchase credits and start using PixelPost today.'
    );
  };

  /**
   * ✅ Credits are LIVE
   */
  const handleBuyCredits = (packageId: string) => {
    const creditPackage = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!creditPackage) return;

    router.push({
      pathname: '/payment',
      params: {
        type: 'credits',
        packageId: creditPackage.id,
        credits: creditPackage.credits.toString(),
        amount: creditPackage.priceUSD.toString(),
        currency: 'USD',
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingBottom: insets.bottom + 60,
      }}
      showsVerticalScrollIndicator
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Start free, buy credits, upgrade later
        </Text>
      </View>

      {/* Subscription Plans (VISIBLE, DISABLED) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription Plans</Text>

        {SUBSCRIPTION_PLANS.map(plan => (
          <SubscriptionCard
            key={plan.id}
            plan={plan}
            disabled={plan.id !== 'free'} // ✅ SAFE & INTENTIONAL
            isCurrentPlan={Boolean(user && user.subscription === plan.id)}
            onSelect={handleSelectPlan}
          />
        ))}

        <Text style={styles.comingSoonNote}>
          🚧 Subscriptions are launching soon. Credits are available now.
        </Text>
      </View>

      {/* Credit Packages (LIVE & BUYABLE) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buy Credits</Text>
        <Text style={styles.sectionSubtitle}>
          Pay as you go • 1 credit = 1 post
        </Text>

        <View style={styles.creditsGrid}>
          {CREDIT_PACKAGES.map(pkg => (
            <TouchableOpacity
              key={pkg.id}
              style={styles.creditCard}
              onPress={() => handleBuyCredits(pkg.id)}
            >
              <View style={styles.creditIcon}>
                <Ionicons name="flash" size={24} color={COLORS.warning} />
              </View>

              <Text style={styles.creditAmount}>{pkg.credits}</Text>
              <Text style={styles.creditLabel}>credits</Text>

              <Text style={styles.creditPrice}>
                ${pkg.priceUSD} / KES {pkg.priceKES}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>

        <View style={styles.paymentMethod}>
          <Ionicons name="card" size={24} color={COLORS.paystack} />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Paystack</Text>
            <Text style={styles.paymentDesc}>
              Cards & Mobile Money (M-Pesa)
            </Text>
          </View>
        </View>

        <View style={styles.paymentMethod}>
          <Ionicons name="logo-paypal" size={24} color={COLORS.paypal} />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>PayPal</Text>
            <Text style={styles.paymentDesc}>International payments</Text>
          </View>
        </View>
      </View>

      {/* Support */}
      <View style={styles.supportSection}>
        <Ionicons name="help-circle" size={32} color={COLORS.primary} />
        <Text style={styles.supportTitle}>Need Help?</Text>
        <Text style={styles.supportText}>
          Our support team is happy to assist you
        </Text>
        <Button title="Contact Support" onPress={() => {}} variant="outline" />
      </View>
    </ScrollView>
  );
}

/* ===========================
   Styles (unchanged)
   =========================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { padding: SIZES.padding, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700', color: COLORS.dark },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
  },
  section: { marginTop: 30, paddingHorizontal: SIZES.padding },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  comingSoonNote: {
    marginTop: 10,
    fontSize: 13,
    color: COLORS.warning,
  },
  creditsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  creditCard: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  creditIcon: { marginBottom: 10 },
  creditAmount: { fontSize: 26, fontWeight: '700' },
  creditLabel: { fontSize: 13, color: COLORS.gray },
  creditPrice: { marginTop: 8, fontSize: 14, fontWeight: '600' },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentInfo: { marginLeft: 12 },
  paymentName: { fontSize: 16, fontWeight: '600' },
  paymentDesc: { fontSize: 13, color: COLORS.gray },
  supportSection: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
  },
  supportTitle: { marginTop: 10, fontSize: 18, fontWeight: '700' },
  supportText: {
    marginVertical: 10,
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
});
