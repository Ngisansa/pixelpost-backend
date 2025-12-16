import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { COLORS, SIZES, SHADOWS, IMAGES } from '../constants/theme';
import Button from '../components/Button';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const {
  notifications,
  markNotificationRead,
  clearNotifications,
  connectedAccounts,
  credits,
  isPro,
} = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/');
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'person-circle',
      label: 'Edit Profile',
      onPress: () => {},
    },
    {
      icon: 'link',
      label: 'Connected Accounts',
      badge: connectedAccounts.length.toString(),
      onPress: () => router.push('/connect-accounts'),
    },
    {
      icon: 'card',
      label: 'Subscription',
      badge: user?.subscription?.toUpperCase() || 'FREE',
      onPress: () => router.push('/subscription'),
    },
    {
      icon: 'flash',
      label: 'Credits',
      badge: credits.toString(),
      onPress: () => router.push('/subscription'),
    },
    {
      icon: 'notifications',
      label: 'Notifications',
      badge: notifications.filter(n => !n.read).length > 0 
        ? notifications.filter(n => !n.read).length.toString() 
        : undefined,
      onPress: () => setShowNotifications(!showNotifications),
    },
    {
      icon: 'settings',
      label: 'Settings',
      onPress: () => {},
    },
    {
      icon: 'help-circle',
      label: 'Help & Support',
      onPress: () => {},
    },
    {
      icon: 'document-text',
      label: 'Terms & Privacy',
      onPress: () => {},
    },
  ];

  const getNotificationIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'post_success':
        return 'checkmark-circle';
      case 'post_failed':
        return 'alert-circle';
      case 'engagement_alert':
        return 'trending-up';
      case 'payment_success':
        return 'card';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'post_success':
      case 'payment_success':
        return COLORS.success;
      case 'post_failed':
        return COLORS.error;
      case 'engagement_alert':
        return COLORS.info;
      default:
        return COLORS.primary;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar || IMAGES.avatars[0] }}
              style={styles.avatar}
              contentFit="cover"
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          
          {/* Subscription Badge */}
          <View style={styles.subscriptionBadge}>
            <Ionicons
  name={isPro ? 'star' : 'star-outline'}
  size={16}
  color={isPro ? COLORS.warning : COLORS.textMuted}
/>
<Text style={styles.subscriptionText}>
  {isPro ? 'PRO' : 'FREE'} Plan
</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{connectedAccounts.length}</Text>
            <Text style={styles.statLabel}>Accounts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{credits}</Text>
            <Text style={styles.statLabel}>Credits</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>

        {/* Notifications Section */}
        {showNotifications && (
          <View style={styles.notificationsSection}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.notificationsTitle}>Notifications</Text>
              {notifications.length > 0 && (
                <TouchableOpacity onPress={clearNotifications}>
                  <Text style={styles.clearAllText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    !notification.read && styles.notificationUnread,
                  ]}
                  onPress={() => markNotificationRead(notification.id)}
                >
                  <View
                    style={[
                      styles.notificationIcon,
                      { backgroundColor: getNotificationColor(notification.type) + '20' },
                    ]}
                  >
                    <Ionicons
                      name={getNotificationIcon(notification.type)}
                      size={20}
                      color={getNotificationColor(notification.type)}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>
                      {formatTime(notification.timestamp)}
                    </Text>
                  </View>
                  {!notification.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyNotifications}>
                <Ionicons name="notifications-off" size={32} color={COLORS.textMuted} />
                <Text style={styles.emptyNotificationsText}>No notifications</Text>
              </View>
            )}
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon as keyof typeof Ionicons.glyphMap}
                  size={22}
                  color={COLORS.text}
                />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.badge && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upgrade Banner */}
        {!isPro && (
          <TouchableOpacity
            style={styles.upgradeBanner}
            onPress={() => router.push('/subscription')}
          >
            <View style={styles.upgradeIcon}>
              <Ionicons name="rocket" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.upgradeContent}>
              <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
              <Text style={styles.upgradeSubtitle}>
                Get unlimited posts and advanced features
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          icon="log-out"
          fullWidth
          style={{ marginTop: 24 }}
        />

        {/* App Version */}
        <Text style={styles.versionText}>PixelPost Social v1.0.0</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 12,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subscriptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 6,
  },
  statsContainer: {
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
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  notificationsSection: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 24,
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  clearAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  notificationUnread: {
    backgroundColor: COLORS.primary + '10',
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: SIZES.radiusSmall,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  notificationMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  notificationTime: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 4,
  },
  emptyNotifications: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyNotificationsText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  menuContainer: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemLabel: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBadge: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  menuBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    borderRadius: SIZES.radius,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  upgradeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeContent: {
    flex: 1,
    marginLeft: 12,
  },
  upgradeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  upgradeSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 24,
  },
});
