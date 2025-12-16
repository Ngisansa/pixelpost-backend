import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { createPost } from "../api/posts";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useApp } from "../context/AppContext";
import { useRouter } from "expo-router";

export default function CreateScreen() {
  const { isPro } = useApp();
  const router = useRouter();

  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [platforms, setPlatforms] = useState("");
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "draft" | "scheduled" | "published" | "failed"
  >("draft");
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  async function handleCreate() {
    if (!caption.trim()) {
      return Alert.alert("Validation", "Caption is required.");
    }

    setLoading(true);
    try {
      const payload = {
        caption,
        image: image.trim(),
        platforms: platforms
          ? platforms.split(",").map((p) => p.trim())
          : [],
        scheduledAt,
        status,
      };

      await createPost(payload);

      setCaption("");
      setImage("");
      setPlatforms("");
      setScheduledAt(null);
      setStatus("draft");

      Alert.alert("Success", "Post created!");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to save post");
    } finally {
      setLoading(false);
    }
  }

  function handleConfirm(date: Date) {
    setScheduledAt(date.toISOString());
    setStatus("scheduled");
    setShowPicker(false);
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Create a New Post</Text>

      <Text style={styles.label}>Caption</Text>
      <TextInput
        style={styles.input}
        value={caption}
        onChangeText={setCaption}
        placeholder="Write your caption..."
        multiline
      />

      <Text style={styles.label}>Image URL</Text>
      <TextInput
        style={styles.input}
        value={image}
        onChangeText={setImage}
        placeholder="https://example.com/image.jpg"
      />

      <Text style={styles.label}>Platforms</Text>
      <TextInput
        style={styles.input}
        value={platforms}
        onChangeText={setPlatforms}
        placeholder="facebook, twitter, instagram"
      />

      {/* ======================
          SCHEDULE (PRO ONLY)
         ====================== */}
      <Text style={styles.label}>Schedule</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.buttonSmall}
          onPress={() => {
            if (!isPro) {
              Alert.alert(
                "Pro Feature",
                "Scheduling posts is available on the Pro plan.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Upgrade",
                    onPress: () => router.push("/subscription"),
                  },
                ]
              );
              return;
            }
            setShowPicker(true);
          }}
        >
          <Text style={styles.buttonSmallText}>
            {scheduledAt
              ? new Date(scheduledAt).toLocaleString()
              : "Pick Date/Time"}
          </Text>
        </TouchableOpacity>

        {scheduledAt && (
          <TouchableOpacity
            style={[styles.buttonSmall, { backgroundColor: "#aaa" }]}
            onPress={() => {
              setScheduledAt(null);
              setStatus("draft");
            }}
          >
            <Text style={styles.buttonSmallText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ======================
          STATUS (DRAFT ONLY)
         ====================== */}
      <Text style={styles.label}>Status</Text>
      <View style={styles.statusRow}>
        {["draft"].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setStatus(s as any)}
            style={[
              styles.statusBtn,
              status === s && styles.statusBtnActive,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                status === s && styles.statusTextActive,
              ]}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Post</Text>
        )}
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showPicker}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={() => setShowPicker(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f9fc",
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },
  label: {
    marginTop: 10,
    color: "#333",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  row: {
    flexDirection: "row",
    marginTop: 8,
  },
  buttonSmall: {
    backgroundColor: "#0066FF",
    padding: 10,
    borderRadius: 8,
  },
  buttonSmallText: {
    color: "#fff",
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
    marginRight: 6,
  },
  statusBtnActive: {
    backgroundColor: "#0066FF",
  },
  statusText: {
    color: "#333",
  },
  statusTextActive: {
    color: "white",
    fontWeight: "700",
  },
  button: {
    backgroundColor: "#0066FF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
