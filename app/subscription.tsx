import React, { useState } from 'react';
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
  const { user, updateUser } = useAuth();
  const [showNGN, setShowNGN] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;

    if (plan.price === 0) {
      // Free plan - just update
      updateUser({ subscription: 'free' });
      Alert.alert('Success', 'You are now on the Free plan');
      return;
    }

    // Navigate to payment with plan details
    router.push({
      pathname: '/payment',
      params: {
        type: 'subscription',
        planId: plan.id,
        planName: plan.name,
        amount: showNGN && plan.priceNGN ? plan.priceNGN.toString() : plan.price.toString(),
        currency: showNGN && plan.priceNGN ? 'NGN' : 'USD',
      },
    });
  };

  const handleBuyCredits = (packageId: string) => {
    const creditPackage = CREDIT_PACKAGES.find(p => p.id === packageId);
    if (!creditPackage) return;

    router.push({
      pathname: '/payment',
      params: {
        type: 'credits',
        packageId: creditPackage.id,
        credits: creditPackage.credits.toString(),
        amount: showNGN ? creditPackage.priceNGN.toString() : creditPackage.price.toString(),
        currency: showNGN ? 'NGN' : 'USD',
      },
    });
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock powerful features to grow your social presence
          </Text>
        </View>

        {/* Currency Toggle */}
        <View style={styles.currencyToggle}>
          <TouchableOpacity
            style={[styles.currencyButton, !showNGN && styles.currencyButtonActive]}
            onPress={() => setShowNGN(false)}
          >
            <Text style={[styles.currencyText, !showNGN && styles.currencyTextActive]}>
              USD ($)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.currencyButton, showNGN && styles.currencyButtonActive]}
            onPress={() => setShowNGN(true)}
          >
            <Text style={[styles.currencyText, showNGN && styles.currencyTextActive]}>
              NGN (₦)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Subscription Plans */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Plans</Text>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={user?.subscription === plan.id.split('_')[0]}
              onSelect={() => handleSelectPlan(plan.id)}
              showNGN={showNGN}
            />
          ))}
        </View>

        {/* Credit Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Credit Packages</Text>
          <Text style={styles.sectionSubtitle}>
            Pay as you go - 1 credit = 1 post
          </Text>
          <View style={styles.creditsGrid}>
            {CREDIT_PACKAGES.map((pkg) => (
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
                  {showNGN ? `₦${pkg.priceNGN.toLocaleString()}` : `$${pkg.price}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <View style={styles.paymentMethods}>
            <View style={styles.paymentMethod}>
              <View style={[styles.paymentIcon, { backgroundColor: COLORS.paystack + '20' }]}>
                <Ionicons name="card" size={24} color={COLORS.paystack} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Paystack</Text>
                <Text style={styles.paymentDesc}>Cards, Bank Transfer, USSD</Text>
              </View>
              <View style={styles.paymentBadge}>
                <Text style={styles.paymentBadgeText}>Primary</Text>
              </View>
            </View>
            <View style={styles.paymentMethod}>
              <View style={[styles.paymentIcon, { backgroundColor: COLORS.paypal + '20' }]}>
                <Ionicons name="logo-paypal" size={24} color={COLORS.paypal} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>PayPal</Text>
                <Text style={styles.paymentDesc}>International payments</Text>
              </View>
            </View>
            <View style={styles.paymentMethod}>
              <View style={[styles.paymentIcon, { backgroundColor: COLORS.flutterwave + '20' }]}>
                <Ionicons name="wallet" size={24} color={COLORS.flutterwave} />
              </View>
              <View style={styles.paymentInfo}>
                <Text style={styles.paymentName}>Flutterwave</Text>
                <Text style={styles.paymentDesc}>African payments</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I cancel anytime?</Text>
            <Text style={styles.faqAnswer}>
              Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What happens to my credits?</Text>
            <Text style={styles.faqAnswer}>
              Credits never expire and can be used even after your subscription ends.
            </Text>
          </View>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Can I upgrade or downgrade?</Text>
            <Text style={styles.faqAnswer}>
              Yes, you can change your plan at any time. Changes take effect immediately.
            </Text>
          </View>
        </View>

        {/* Support */}
        <View style={styles.supportSection}>
          <Ionicons name="help-circle" size={32} color={COLORS.primary} />
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            Contact our support team for any questions
          </Text>
          <Button
            title="Contact Support"
            onPress={() => {}}
            variant="outline"
            icon="mail"
          />
        </View>
      </ScrollView>
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  currencyToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 4,
    marginBottom: 24,
  },
  currencyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: SIZES.radiusSmall,
  },
  currencyButtonActive: {
    backgroundColor: COLORS.primary,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  currencyTextActive: {
    color: COLORS.white,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  creditsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  creditCard: {
    width: '48%',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.small,
  },
  creditIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.warning + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  creditAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
  },
  creditLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  creditPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  paymentMethods: {},
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
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
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  paymentBadge: {
    backgroundColor: COLORS.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.success,
  },
  faqItem: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  supportSection: {
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 24,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 8,
  },
  supportText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 16,
    textAlign: 'center',
  },
});
