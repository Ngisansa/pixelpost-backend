import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

interface SocialPlatformCardProps {
  platform: {
    id: string;
    name: string;
    icon: string;
    color: string;
    supported: boolean;
  };
  isConnected: boolean;
  username?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function SocialPlatformCard({
  platform,
  isConnected,
  username,
  onConnect,
  onDisconnect,
}: SocialPlatformCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: platform.color + '20' }]}>
          <Ionicons
            name={platform.icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color={platform.color}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{platform.name}</Text>
          {isConnected && username ? (
            <Text style={styles.username}>@{username}</Text>
          ) : (
            <Text style={styles.status}>
              {platform.supported ? 'Not connected' : 'Coming soon'}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.rightSection}>
        {platform.supported ? (
          isConnected ? (
            <TouchableOpacity
              style={[styles.button, styles.disconnectButton]}
              onPress={onDisconnect}
            >
              <Ionicons name="close-circle" size={16} color={COLORS.error} />
              <Text style={styles.disconnectText}>Disconnect</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.connectButton]}
              onPress={onConnect}
            >
              <Ionicons name="add-circle" size={16} color={COLORS.white} />
              <Text style={styles.connectText}>Connect</Text>
            </TouchableOpacity>
          )
        ) : (
          <View style={[styles.button, styles.comingSoonButton]}>
            <Ionicons name="time" size={16} color={COLORS.textMuted} />
            <Text style={styles.comingSoonText}>Soon</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: SIZES.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  username: {
    fontSize: SIZES.caption,
    color: COLORS.success,
    marginTop: 2,
  },
  status: {
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  rightSection: {
    marginLeft: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  connectButton: {
    backgroundColor: COLORS.primary,
  },
  connectText: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
  },
  disconnectButton: {
    backgroundColor: COLORS.error + '20',
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  disconnectText: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: 4,
  },
  comingSoonButton: {
    backgroundColor: COLORS.backgroundInput,
  },
  comingSoonText: {
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    marginLeft: 4,
  },
});
