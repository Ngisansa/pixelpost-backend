import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

interface SubscriptionCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    priceNGN?: number;
    currency: string;
    period: string;
    features: string[];
    limitations: string[];
    recommended: boolean;
  };
  isCurrentPlan: boolean;
  onSelect: () => void;
  showNGN?: boolean;
}

export default function SubscriptionCard({
  plan,
  isCurrentPlan,
  onSelect,
  showNGN = false,
}: SubscriptionCardProps) {
  const displayPrice = showNGN && plan.priceNGN ? plan.priceNGN : plan.price;
  const displayCurrency = showNGN && plan.priceNGN ? 'NGN' : plan.currency;

  return (
    <View
      style={[
        styles.container,
        plan.recommended && styles.recommended,
        isCurrentPlan && styles.currentPlan,
      ]}
    >
      {plan.recommended && (
        <View style={styles.recommendedBadge}>
          <Ionicons name="star" size={12} color={COLORS.white} />
          <Text style={styles.recommendedText}>Most Popular</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.name}>{plan.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.currency}>{displayCurrency}</Text>
          <Text style={styles.price}>
            {displayPrice === 0 ? 'Free' : displayPrice.toLocaleString()}
          </Text>
          {plan.period !== 'forever' && (
            <Text style={styles.period}>/{plan.period}</Text>
          )}
        </View>
      </View>

      <View style={styles.features}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
        {plan.limitations.map((limitation, index) => (
          <View key={`limit-${index}`} style={styles.featureRow}>
            <Ionicons name="close-circle" size={18} color={COLORS.error} />
            <Text style={[styles.featureText, styles.limitationText]}>{limitation}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          isCurrentPlan && styles.currentButton,
          plan.recommended && !isCurrentPlan && styles.recommendedButton,
        ]}
        onPress={onSelect}
        disabled={isCurrentPlan}
      >
        <Text
          style={[
            styles.buttonText,
            isCurrentPlan && styles.currentButtonText,
            plan.recommended && !isCurrentPlan && styles.recommendedButtonText,
          ]}
        >
          {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Get Started' : 'Subscribe'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radiusLarge,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    ...SHADOWS.medium,
  },
  recommended: {
    borderColor: COLORS.primary,
  },
  currentPlan: {
    borderColor: COLORS.success,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  name: {
    fontSize: SIZES.h3,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  price: {
    fontSize: SIZES.h1,
    fontWeight: '800',
    color: COLORS.text,
  },
  period: {
    fontSize: SIZES.body,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  features: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: SIZES.bodySmall,
    color: COLORS.text,
    marginLeft: 10,
    flex: 1,
  },
  limitationText: {
    color: COLORS.textMuted,
  },
  button: {
    backgroundColor: COLORS.backgroundInput,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recommendedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  currentButton: {
    backgroundColor: COLORS.success + '20',
    borderColor: COLORS.success,
  },
  buttonText: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  recommendedButtonText: {
    color: COLORS.white,
  },
  currentButtonText: {
    color: COLORS.success,
  },
});
