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
import { useApp } from '../context/AppContext';
import { COLORS, SIZES } from '../constants/theme';
import PostCard from '../components/PostCard';

type FilterType = 'all' | 'scheduled' | 'published' | 'draft' | 'failed';

export default function ScheduleScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { posts, deletePost, updatePost } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { key: FilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'scheduled', label: 'Scheduled', icon: 'time' },
    { key: 'published', label: 'Published', icon: 'checkmark-circle' },
    { key: 'draft', label: 'Drafts', icon: 'document-text' },
    { key: 'failed', label: 'Failed', icon: 'alert-circle' },
  ];

  const filteredPosts = posts.filter(post => {
    if (activeFilter === 'all') return true;
    return post.status === activeFilter;
  });

  const getFilterCount = (filter: FilterType) => {
    if (filter === 'all') return posts.length;
    return posts.filter(p => p.status === filter).length;
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePost(postId),
        },
      ]
    );
  };

  const handleEditPost = (postId: string) => {
    // Navigate to edit post screen
    router.push('/create-post');
  };

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterTab,
                activeFilter === filter.key && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(filter.key)}
            >
              <Ionicons
                name={filter.icon}
                size={16}
                color={activeFilter === filter.key ? COLORS.white : COLORS.textMuted}
              />
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter.key && styles.filterTabTextActive,
                ]}
              >
                {filter.label}
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  activeFilter === filter.key && styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    activeFilter === filter.key && styles.filterBadgeTextActive,
                  ]}
                >
                  {getFilterCount(filter.key)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.length > 0 ? (
          <>
            <Text style={styles.resultsText}>
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </Text>
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPress={() => {}}
                onEdit={() => handleEditPost(post.id)}
                onDelete={() => handleDeletePost(post.id)}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name={
                  activeFilter === 'scheduled'
                    ? 'calendar-outline'
                    : activeFilter === 'draft'
                    ? 'document-text-outline'
                    : 'images-outline'
                }
                size={64}
                color={COLORS.textMuted}
              />
            </View>
            <Text style={styles.emptyTitle}>
              No {activeFilter === 'all' ? '' : activeFilter} posts
            </Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'scheduled'
                ? 'Schedule your first post to see it here'
                : activeFilter === 'draft'
                ? 'Save a draft to continue editing later'
                : 'Create your first post to get started'}
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => router.push('/create-post')}
            >
              <Ionicons name="add" size={20} color={COLORS.white} />
              <Text style={styles.createButtonText}>Create Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 100 }]}
        onPress={() => router.push('/create-post')}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  filterContainer: {
    backgroundColor: COLORS.backgroundLight,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundCard,
    marginRight: 10,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginLeft: 6,
  },
  filterTabTextActive: {
    color: COLORS.white,
  },
  filterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  filterBadgeActive: {
    backgroundColor: COLORS.white + '30',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterBadgeTextActive: {
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  resultsText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: SIZES.radius,
    marginTop: 24,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
