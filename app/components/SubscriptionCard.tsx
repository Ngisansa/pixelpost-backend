import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

interface SubscriptionPlan {
  id: string;
  name: string;
  priceUSD?: number;
  priceKES?: number;
  period?: string;
  features?: string[];
}

interface Props {
  plan: SubscriptionPlan;
  disabled?: boolean;
  isCurrentPlan?: boolean;
  onSelect: () => void;
}

export default function SubscriptionCard({
  plan,
  disabled = false,
  isCurrentPlan = false,
  onSelect,
}: Props) {
  const priceUSD = Number(plan.priceUSD ?? 0);
  const priceKES = Number(plan.priceKES ?? 0);

  const isFree = priceUSD === 0;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        disabled && styles.disabled,
        isCurrentPlan && styles.current,
      ]}
      activeOpacity={0.8}
      onPress={onSelect}
      disabled={disabled}
    >
      {isCurrentPlan && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Current</Text>
        </View>
      )}

      <Text style={styles.name}>{plan.name}</Text>

      <Text style={styles.price}>
        {isFree
          ? 'Free'
          : `$${priceUSD.toLocaleString()} / KES ${priceKES.toLocaleString()}`}
      </Text>

      {plan.period && (
        <Text style={styles.period}>{plan.period}</Text>
      )}

      <View style={styles.features}>
        {plan.features?.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={COLORS.success}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {disabled && (
        <Text style={styles.disabledText}>
          Coming Soon
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  disabled: {
    opacity: 0.6,
  },
  current: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  period: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 8,
  },
  features: {
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureText: {
    marginLeft: 6,
    fontSize: 13,
    color: COLORS.dark,
  },
  disabledText: {
    marginTop: 10,
    fontSize: 12,
    color: COLORS.warning,
    fontWeight: '600',
  },
});
