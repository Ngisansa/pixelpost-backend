import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from './context/AppContext';
import { COLORS, SIZES, SHADOWS } from './constants/theme';
import { SOCIAL_PLATFORMS } from './constants/data';
import { 
  authenticateWithPlatform, 
  disconnectPlatform,
  isPlatformConnected,
} from './services/oauth/OAuthService';
import { 
  getConnectedAccounts, 
  ConnectedAccount,
} from './services/secureStorage';
import Button from './components/Button';

export default function ConnectAccountsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { connectedAccounts: contextAccounts, connectAccount, disconnectAccount } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [storedAccounts, setStoredAccounts] = useState<ConnectedAccount[]>([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedPlatformInfo, setSelectedPlatformInfo] = useState<string | null>(null);

  // Load stored accounts on mount
  useEffect(() => {
    loadStoredAccounts();
  }, []);

  const loadStoredAccounts = async () => {
    try {
      const accounts = await getConnectedAccounts();
      setStoredAccounts(accounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadStoredAccounts();
    setRefreshing(false);
  }, []);

  const isConnected = (platformId: string) => {
    return storedAccounts.some(acc => acc.platform === platformId) ||
           contextAccounts.some(acc => acc.platform === platformId);
  };

  const getConnectedAccount = (platformId: string) => {
    return storedAccounts.find(acc => acc.platform === platformId) ||
           contextAccounts.find(acc => acc.platform === platformId);
  };

  const handleConnect = async (platformId: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    
    if (!platform?.supported) {
      Alert.alert(
        'Coming Soon',
        `${platform?.name} integration is coming soon! We're working hard to bring you this feature.`,
        [{ text: 'OK' }]
      );
      return;
    }

    setConnectingPlatform(platformId);
    setIsLoading(true);

    try {
      // Use real OAuth authentication
      const result = await authenticateWithPlatform(platformId as any);

      if (result.success && result.account) {
        // Also update context for immediate UI update
        await connectAccount(platformId, result.account.username);
        
        // Reload stored accounts
        await loadStoredAccounts();

        Alert.alert(
          'Success!',
          `Your ${platform?.name} account (@${result.account.username}) has been connected successfully.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Connection Failed',
          result.error || 'Failed to connect your account. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = (platformId: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    const account = getConnectedAccount(platformId);

    Alert.alert(
      'Disconnect Account',
      `Are you sure you want to disconnect @${account?.username} from ${platform?.name}?\n\nThis will revoke access and remove all stored tokens.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            setConnectingPlatform(platformId);

            try {
              // Use real OAuth disconnection
              const result = await disconnectPlatform(platformId as any);

              if (result.success) {
                // Also update context
                if (account) {
                  disconnectAccount(account.id);
                }
                
                // Reload stored accounts
                await loadStoredAccounts();

                Alert.alert(
                  'Disconnected',
                  `Your ${platform?.name} account has been disconnected.`,
                  [{ text: 'OK' }]
                );
              } else {
                Alert.alert('Error', result.error || 'Failed to disconnect account');
              }
            } catch (error) {
              console.error('Disconnect error:', error);
              Alert.alert('Error', 'Failed to disconnect account');
            } finally {
              setIsLoading(false);
              setConnectingPlatform(null);
            }
          },
        },
      ]
    );
  };

  const showPlatformInfo = (platformId: string) => {
    setSelectedPlatformInfo(platformId);
    setShowInfoModal(true);
  };

  const getPlatformInfo = (platformId: string) => {
    const infos: Record<string, { title: string; description: string; permissions: string[] }> = {
      instagram: {
        title: 'Instagram Connection',
        description: 'Connect your Instagram Business or Creator account to publish posts, stories, and reels directly from PixelPost.',
        permissions: [
          'View your profile information',
          'Publish content on your behalf',
          'View insights and analytics',
          'Manage comments',
        ],
      },
      facebook: {
        title: 'Facebook Connection',
        description: 'Connect your Facebook Page to publish posts, manage engagement, and track performance.',
        permissions: [
          'View your Pages',
          'Publish posts to your Pages',
          'View Page insights',
          'Manage Page comments',
        ],
      },
      twitter: {
        title: 'X (Twitter) Connection',
        description: 'Connect your X account to post tweets, threads, and engage with your audience.',
        permissions: [
          'View your profile',
          'Post tweets on your behalf',
          'Read your tweets',
          'Offline access for scheduling',
        ],
      },
      linkedin: {
        title: 'LinkedIn Connection',
        description: 'Connect your LinkedIn profile to share professional content and grow your network.',
        permissions: [
          'View your basic profile',
          'View your email address',
          'Post content on your behalf',
        ],
      },
      pinterest: {
        title: 'Pinterest Connection',
        description: 'Connect your Pinterest account to create pins and manage your boards.',
        permissions: [
          'View your profile',
          'Create and manage pins',
          'Access your boards',
        ],
      },
    };
    return infos[platformId] || { title: 'Platform Connection', description: '', permissions: [] };
  };

  const formatExpiryDate = (timestamp?: number) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Connect Your Accounts</Text>
          <Text style={styles.subtitle}>
            Link your social media accounts using secure OAuth 2.0 authentication
          </Text>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>Secure OAuth 2.0</Text>
            <Text style={styles.securityText}>
              We use industry-standard OAuth 2.0 with PKCE. Your passwords are never stored.
            </Text>
          </View>
        </View>

        {/* Connected Count */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{storedAccounts.length}</Text>
            <Text style={styles.statLabel}>Connected</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {SOCIAL_PLATFORMS.filter(p => p.supported).length - storedAccounts.length}
            </Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>

        {/* Platform List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Platforms</Text>
          
          {SOCIAL_PLATFORMS.map((platform) => {
            const connected = isConnected(platform.id);
            const account = getConnectedAccount(platform.id);
            const isCurrentlyConnecting = connectingPlatform === platform.id;

            return (
              <View key={platform.id} style={styles.platformCard}>
                <View style={styles.platformHeader}>
                  <View style={[styles.platformIcon, { backgroundColor: platform.color + '20' }]}>
                    <Ionicons
                      name={platform.icon as keyof typeof Ionicons.glyphMap}
                      size={28}
                      color={platform.color}
                    />
                  </View>
                  <View style={styles.platformInfo}>
                    <View style={styles.platformNameRow}>
                      <Text style={styles.platformName}>{platform.name}</Text>
                      {!platform.supported && (
                        <View style={styles.comingSoonBadge}>
                          <Text style={styles.comingSoonText}>Coming Soon</Text>
                        </View>
                      )}
                    </View>
                    {connected && account ? (
                      <View style={styles.connectedInfo}>
                        <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
                        <Text style={styles.connectedUsername}>@{account.username}</Text>
                      </View>
                    ) : (
                      <Text style={styles.platformStatus}>
                        {platform.supported ? 'Not connected' : 'Integration in development'}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => showPlatformInfo(platform.id)}
                  >
                    <Ionicons name="information-circle-outline" size={22} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                {connected && account && (
                  <View style={styles.accountDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Connected:</Text>
                      <Text style={styles.detailValue}>
                        {new Date(account.connectedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Token Expires:</Text>
                      <Text style={styles.detailValue}>
                        {formatExpiryDate(account.expiresAt)}
                      </Text>
                    </View>
                  </View>
                )}

                <View style={styles.platformActions}>
                  {platform.supported ? (
                    connected ? (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.disconnectButton]}
                        onPress={() => handleDisconnect(platform.id)}
                        disabled={isLoading}
                      >
                        {isCurrentlyConnecting ? (
                          <ActivityIndicator size="small" color={COLORS.error} />
                        ) : (
                          <>
                            <Ionicons name="unlink" size={18} color={COLORS.error} />
                            <Text style={styles.disconnectText}>Disconnect</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.connectButton]}
                        onPress={() => handleConnect(platform.id)}
                        disabled={isLoading}
                      >
                        {isCurrentlyConnecting ? (
                          <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                          <>
                            <Ionicons name="link" size={18} color={COLORS.white} />
                            <Text style={styles.connectText}>Connect with OAuth</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    )
                  ) : (
                    <View style={[styles.actionButton, styles.disabledButton]}>
                      <Ionicons name="time" size={18} color={COLORS.textMuted} />
                      <Text style={styles.disabledText}>Coming Soon</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Token Security Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>How We Keep Your Data Safe</Text>
          
          <View style={styles.infoCard}>
            <Ionicons name="lock-closed" size={24} color={COLORS.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Encrypted Token Storage</Text>
              <Text style={styles.infoText}>
                All access tokens are encrypted using platform-specific secure storage (Keychain on iOS, Keystore on Android).
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="refresh" size={24} color={COLORS.accent} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Automatic Token Refresh</Text>
              <Text style={styles.infoText}>
                Tokens are automatically refreshed before expiry to ensure uninterrupted service.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="trash" size={24} color={COLORS.error} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Instant Revocation</Text>
              <Text style={styles.infoText}>
                Disconnecting an account immediately revokes access and deletes all stored tokens.
              </Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Ionicons name="server" size={24} color={COLORS.success} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Server-Side Secrets</Text>
              <Text style={styles.infoText}>
                OAuth client secrets are stored securely on our servers, never in the app.
              </Text>
            </View>
          </View>
        </View>

        {/* Help Link */}
        <TouchableOpacity style={styles.helpLink}>
          <Ionicons name="help-circle" size={20} color={COLORS.primary} />
          <Text style={styles.helpLinkText}>Need help connecting your accounts?</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Platform Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPlatformInfo && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {getPlatformInfo(selectedPlatformInfo).title}
                  </Text>
                  <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                    <Ionicons name="close" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.modalDescription}>
                  {getPlatformInfo(selectedPlatformInfo).description}
                </Text>

                <Text style={styles.permissionsTitle}>Permissions Requested:</Text>
                {getPlatformInfo(selectedPlatformInfo).permissions.map((permission, index) => (
                  <View key={index} style={styles.permissionRow}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
                    <Text style={styles.permissionText}>{permission}</Text>
                  </View>
                ))}

                <Button
                  title="Got it"
                  onPress={() => setShowInfoModal(false)}
                  fullWidth
                  style={{ marginTop: 20 }}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
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
    lineHeight: 24,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.success + '30',
  },
  securityContent: {
    flex: 1,
    marginLeft: 12,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  securityText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 24,
    ...SHADOWS.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
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
  platformCard: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformInfo: {
    flex: 1,
    marginLeft: 12,
  },
  platformNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformName: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.text,
  },
  comingSoonBadge: {
    backgroundColor: COLORS.warning + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  comingSoonText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.warning,
  },
  connectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  connectedUsername: {
    fontSize: 14,
    color: COLORS.success,
    marginLeft: 4,
  },
  platformStatus: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  infoButton: {
    padding: 8,
  },
  accountDetails: {
    backgroundColor: COLORS.backgroundInput,
    borderRadius: SIZES.radiusSmall,
    padding: 12,
    marginTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  platformActions: {
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: SIZES.radiusSmall,
  },
  connectButton: {
    backgroundColor: COLORS.primary,
  },
  connectText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
  disconnectButton: {
    backgroundColor: COLORS.error + '15',
    borderWidth: 1,
    borderColor: COLORS.error + '30',
  },
  disconnectText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: COLORS.backgroundInput,
  },
  disabledText: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  infoSection: {
    marginBottom: 24,
  },
  infoSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  helpLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  helpLinkText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radiusLarge,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalDescription: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  permissionsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 10,
  },
});
