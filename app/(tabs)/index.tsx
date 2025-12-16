// app/(tabs)/index.tsx
import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, Text, StyleSheet } from "react-native";
import PostCard from "../components/PostCard";
import { getPosts } from "../api/posts";

export default function FeedScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getPosts();
      setPosts(res.data || []);
    } catch (err) {
      console.warn("Failed to load posts", err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(i) => i._id}
        renderItem={({ item }) => (
          <PostCard post={{
            id: item._id,
            image: item.image,
            caption: item.caption,
            platforms: item.platforms || [],
            scheduledAt: item.scheduledAt,
            status: item.status,
            likes: item.likes || 0,
            comments: item.comments || 0,
            shares: item.shares || 0
          }} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No posts yet — create one.</Text>}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f9fb" },
  empty: { textAlign: "center", marginTop: 40, color: "#666" }
});
