import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from './context/AuthContext';
import { COLORS, SIZES, SHADOWS, IMAGES } from './constants/theme';
import Button from './components/Button';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading]);

  const features = [
    {
      icon: 'cloud-upload',
      title: 'Multi-Platform Upload',
      description: 'Post to Instagram, Facebook, Twitter, LinkedIn & more simultaneously',
    },
    {
      icon: 'calendar',
      title: 'Smart Scheduling',
      description: 'Schedule posts for optimal engagement times with timezone support',
    },
    {
      icon: 'analytics',
      title: 'Deep Analytics',
      description: 'Track performance, engagement, and growth across all platforms',
    },
    {
      icon: 'images',
      title: 'Media Editor',
      description: 'Edit photos & videos with filters, cropping, and text overlays',
    },
    {
      icon: 'pricetag',
      title: 'Hashtag AI',
      description: 'Get smart hashtag suggestions to maximize your reach',
    },
    {
      icon: 'people',
      title: 'Team Collaboration',
      description: 'Work together with your team on content creation',
    },
  ];

  const platforms = [
    { name: 'Instagram', icon: 'logo-instagram', color: COLORS.instagram },
    { name: 'Facebook', icon: 'logo-facebook', color: COLORS.facebook },
    { name: 'Twitter', icon: 'logo-twitter', color: COLORS.twitter },
    { name: 'LinkedIn', icon: 'logo-linkedin', color: COLORS.linkedin },
    { name: 'Pinterest', icon: 'logo-pinterest', color: COLORS.pinterest },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="aperture" size={32} color={COLORS.primary} />
          <Text style={styles.logoText}>PixelPost</Text>
        </View>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image
            source={{ uri: IMAGES.hero }}
            style={styles.heroImage}
            contentFit="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Schedule & Share{'\n'}Across All Platforms
            </Text>
            <Text style={styles.heroSubtitle}>
              The ultimate social media management tool for creators, businesses, and agencies
            </Text>
            <View style={styles.heroButtons}>
              <Button
                title="Get Started Free"
                onPress={() => router.push('/(auth)/register')}
                variant="primary"
                size="large"
                icon="rocket"
              />
              <Button
                title="Watch Demo"
                onPress={() => {}}
                variant="outline"
                size="large"
                icon="play-circle"
                style={{ marginTop: 12 }}
              />
            </View>
          </View>
        </View>

        {/* Platforms Section */}
        <View style={styles.platformsSection}>
          <Text style={styles.platformsTitle}>Connect Your Favorite Platforms</Text>
          <View style={styles.platformsGrid}>
            {platforms.map((platform, index) => (
              <View key={index} style={styles.platformItem}>
                <View style={[styles.platformIcon, { backgroundColor: platform.color + '20' }]}>
                  <Ionicons
                    name={platform.icon as keyof typeof Ionicons.glyphMap}
                    size={28}
                    color={platform.color}
                  />
                </View>
                <Text style={styles.platformName}>{platform.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Powerful Features</Text>
          <Text style={styles.sectionSubtitle}>
            Everything you need to manage your social media presence
          </Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons
                    name={feature.icon as keyof typeof Ionicons.glyphMap}
                    size={28}
                    color={COLORS.primary}
                  />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pricing Preview */}
        <View style={styles.pricingSection}>
          <Text style={styles.sectionTitle}>Simple Pricing</Text>
          <Text style={styles.sectionSubtitle}>
            Start free, upgrade when you need more
          </Text>
          <View style={styles.pricingCards}>
            <View style={styles.pricingCard}>
              <Text style={styles.pricingName}>Free</Text>
              <Text style={styles.pricingPrice}>$0</Text>
              <Text style={styles.pricingPeriod}>forever</Text>
              <View style={styles.pricingFeatures}>
                <Text style={styles.pricingFeature}>5 posts/month</Text>
                <Text style={styles.pricingFeature}>2 social accounts</Text>
                <Text style={styles.pricingFeature}>Basic scheduling</Text>
              </View>
            </View>
            <View style={[styles.pricingCard, styles.pricingCardPro]}>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>Popular</Text>
              </View>
              <Text style={styles.pricingName}>Pro</Text>
              <Text style={styles.pricingPrice}>$9.99</Text>
              <Text style={styles.pricingPeriod}>/month</Text>
              <View style={styles.pricingFeatures}>
                <Text style={styles.pricingFeature}>Unlimited posts</Text>
                <Text style={styles.pricingFeature}>10 social accounts</Text>
                <Text style={styles.pricingFeature}>Full analytics</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewPlansButton}
            onPress={() => router.push('/subscription')}
          >
            <Text style={styles.viewPlansText}>View All Plans</Text>
            <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
          <Text style={styles.ctaSubtitle}>
            Join thousands of creators managing their social media with PixelPost
          </Text>
          <Button
            title="Create Free Account"
            onPress={() => router.push('/(auth)/register')}
            variant="secondary"
            size="large"
            fullWidth
            icon="person-add"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLogo}>
            <Ionicons name="aperture" size={24} color={COLORS.primary} />
            <Text style={styles.footerLogoText}>PixelPost Social</Text>
          </View>
          <Text style={styles.footerText}>
            The ultimate social media management platform
          </Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Contact Us</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.copyright}>
            © 2025 PixelPost Social. All rights reserved.
          </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 8,
  },
  signInButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    height: 450,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 15, 26, 0.75)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 44,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  heroButtons: {
    width: '100%',
  },
  platformsSection: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.backgroundLight,
  },
  platformsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 24,
  },
  platformsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  platformItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  platformIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  platformName: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  featuresSection: {
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 16,
    ...SHADOWS.small,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  pricingSection: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    backgroundColor: COLORS.backgroundLight,
  },
  pricingCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pricingCard: {
    width: (width - 52) / 2,
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pricingCardPro: {
    borderColor: COLORS.primary,
    position: 'relative',
  },
  proBadge: {
    position: 'absolute',
    top: -10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  pricingName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
  },
  pricingPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 8,
  },
  pricingPeriod: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  pricingFeatures: {
    marginTop: 16,
    alignItems: 'center',
  },
  pricingFeature: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  viewPlansButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  viewPlansText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 8,
  },
  ctaSection: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  footer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
  },
  footerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerLogoText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  footerLinks: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  footerLink: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginHorizontal: 12,
  },
  copyright: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
