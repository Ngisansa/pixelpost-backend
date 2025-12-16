import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { SOCIAL_PLATFORMS } from '../constants/data';

interface PostCardProps {
  post: {
    id: string;
    image: string;
    caption: string;
    platforms: string[];
    scheduledAt: string | null;
    status: 'draft' | 'scheduled' | 'published' | 'failed';
    likes: number;
    comments: number;
    shares: number;
  };
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function PostCard({ post, onPress, onEdit, onDelete }: PostCardProps) {
  const getStatusColor = () => {
    switch (post.status) {
      case 'published':
        return COLORS.success;
      case 'scheduled':
        return COLORS.info;
      case 'draft':
        return COLORS.warning;
      case 'failed':
        return COLORS.error;
      default:
        return COLORS.textMuted;
    }
  };

  const getStatusIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (post.status) {
      case 'published':
        return 'checkmark-circle';
      case 'scheduled':
        return 'time';
      case 'draft':
        return 'document-text';
      case 'failed':
        return 'alert-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPlatformIcon = (platformId: string): keyof typeof Ionicons.glyphMap => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    return (platform?.icon as keyof typeof Ionicons.glyphMap) || 'globe';
  };

  const getPlatformColor = (platformId: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
    return platform?.color || COLORS.textMuted;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: post.image }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Ionicons name={getStatusIcon()} size={12} color={COLORS.white} />
          <Text style={styles.statusText}>{post.status}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.caption} numberOfLines={2}>
          {post.caption}
        </Text>

        <View style={styles.platformsRow}>
          {post.platforms.map((platformId, index) => (
            <View
              key={index}
              style={[styles.platformBadge, { backgroundColor: getPlatformColor(platformId) + '20' }]}
            >
              <Ionicons
                name={getPlatformIcon(platformId)}
                size={14}
                color={getPlatformColor(platformId)}
              />
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.dateText}>{formatDate(post.scheduledAt)}</Text>
          </View>

          {post.status === 'published' && (
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Ionicons name="heart" size={14} color={COLORS.secondary} />
                <Text style={styles.statText}>{post.likes}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="chatbubble" size={14} color={COLORS.info} />
                <Text style={styles.statText}>{post.comments}</Text>
              </View>
              <View style={styles.stat}>
                <Ionicons name="share-social" size={14} color={COLORS.success} />
                <Text style={styles.statText}>{post.shares}</Text>
              </View>
            </View>
          )}
        </View>

        {(onEdit || onDelete) && (
          <View style={styles.actions}>
            {onEdit && (
              <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                <Ionicons name="pencil" size={18} color={COLORS.primary} />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
                <Ionicons name="trash" size={18} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 180,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  content: {
    padding: 16,
  },
  caption: {
    fontSize: SIZES.bodySmall,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  platformsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  platformBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  statText: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});
