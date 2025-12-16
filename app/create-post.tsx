import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from './context/AppContext';
import { COLORS, SIZES, SHADOWS, IMAGES } from './constants/theme';
import { SOCIAL_PLATFORMS, HASHTAG_SUGGESTIONS } from './constants/data';
import Input from './components/Input';
import Button from './components/Button';

export default function CreatePostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addPost, connectedAccounts, credits, useCredit } = useApp();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const connectedPlatformIds = connectedAccounts.map(acc => acc.platform);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const togglePlatform = (platformId: string) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(id => id !== platformId));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
    }
  };

  const addHashtag = (hashtag: string) => {
    if (!caption.includes(hashtag)) {
      setCaption(caption + (caption ? ' ' : '') + hashtag);
    }
  };

  const handlePost = async () => {
    if (!selectedImage) {
      Alert.alert('Missing Image', 'Please select an image or video to post');
      return;
    }

    if (!caption.trim()) {
      Alert.alert('Missing Caption', 'Please add a caption for your post');
      return;
    }

    if (selectedPlatforms.length === 0) {
      Alert.alert('No Platforms Selected', 'Please select at least one platform to post to');
      return;
    }

    if (credits <= 0) {
      Alert.alert(
        'No Credits',
        'You need credits to post. Would you like to upgrade?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Upgrade', onPress: () => router.push('/subscription') },
        ]
      );
      return;
    }

    setIsPosting(true);

    // Simulate posting delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    useCredit();

    addPost({
      image: selectedImage,
      caption: caption.trim(),
      platforms: selectedPlatforms,
      scheduledAt: isScheduling ? new Date(Date.now() + 3600000).toISOString() : null,
      status: isScheduling ? 'scheduled' : 'published',
      likes: 0,
      comments: 0,
      shares: 0,
    });

    setIsPosting(false);

    Alert.alert(
      'Success!',
      isScheduling ? 'Your post has been scheduled!' : 'Your post has been published!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const handleSaveDraft = () => {
    if (!selectedImage && !caption.trim()) {
      Alert.alert('Empty Draft', 'Please add content before saving as draft');
      return;
    }

    addPost({
      image: selectedImage || IMAGES.samplePosts[0],
      caption: caption.trim() || 'Draft post',
      platforms: selectedPlatforms,
      scheduledAt: null,
      status: 'draft',
      likes: 0,
      comments: 0,
      shares: 0,
    });

    Alert.alert('Draft Saved', 'Your draft has been saved successfully', [
      { text: 'OK', onPress: () => router.back() },
    ]);
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
      >
        {/* Media Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Media</Text>
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
                contentFit="cover"
              />
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.imageActionButton}
                  onPress={pickImage}
                >
                  <Ionicons name="swap-horizontal" size={20} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.imageActionButton, styles.deleteButton]}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="trash" size={20} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                <View style={[styles.mediaButtonIcon, { backgroundColor: COLORS.primary + '20' }]}>
                  <Ionicons name="images" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.mediaButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
                <View style={[styles.mediaButtonIcon, { backgroundColor: COLORS.secondary + '20' }]}>
                  <Ionicons name="camera" size={32} color={COLORS.secondary} />
                </View>
                <Text style={styles.mediaButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Caption */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caption</Text>
          <Input
            placeholder="Write an engaging caption for your post..."
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={5}
            maxLength={2200}
          />
          
          {/* Quick Hashtags */}
          <View style={styles.quickHashtags}>
            <Text style={styles.quickHashtagsTitle}>Quick Add:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {Object.values(HASHTAG_SUGGESTIONS).flat().slice(0, 8).map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.hashtagChip}
                  onPress={() => addHashtag(tag)}
                >
                  <Text style={styles.hashtagChipText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Platform Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Platforms</Text>
          {connectedPlatformIds.length > 0 ? (
            <View style={styles.platformsGrid}>
              {SOCIAL_PLATFORMS.filter(p => connectedPlatformIds.includes(p.id)).map((platform) => (
                <TouchableOpacity
                  key={platform.id}
                  style={[
                    styles.platformCard,
                    selectedPlatforms.includes(platform.id) && styles.platformCardSelected,
                  ]}
                  onPress={() => togglePlatform(platform.id)}
                >
                  <Ionicons
                    name={platform.icon as keyof typeof Ionicons.glyphMap}
                    size={28}
                    color={selectedPlatforms.includes(platform.id) ? COLORS.white : platform.color}
                  />
                  <Text
                    style={[
                      styles.platformName,
                      selectedPlatforms.includes(platform.id) && styles.platformNameSelected,
                    ]}
                  >
                    {platform.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.connectPrompt}
              onPress={() => router.push('/connect-accounts')}
            >
              <Ionicons name="link" size={24} color={COLORS.primary} />
              <View style={styles.connectPromptText}>
                <Text style={styles.connectPromptTitle}>No accounts connected</Text>
                <Text style={styles.connectPromptSubtitle}>Tap to connect your social accounts</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Schedule Option */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.scheduleOption}
            onPress={() => setIsScheduling(!isScheduling)}
          >
            <View style={styles.scheduleOptionLeft}>
              <Ionicons
                name="calendar"
                size={24}
                color={isScheduling ? COLORS.primary : COLORS.textMuted}
              />
              <View style={styles.scheduleOptionText}>
                <Text style={styles.scheduleOptionTitle}>Schedule for later</Text>
                <Text style={styles.scheduleOptionSubtitle}>
                  {isScheduling ? 'Post will be scheduled' : 'Post immediately'}
                </Text>
              </View>
            </View>
            <View style={[styles.toggle, isScheduling && styles.toggleActive]}>
              <View style={[styles.toggleKnob, isScheduling && styles.toggleKnobActive]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Preview Button */}
        {selectedImage && caption && (
          <TouchableOpacity
            style={styles.previewButton}
            onPress={() => setShowPreview(true)}
          >
            <Ionicons name="eye" size={20} color={COLORS.primary} />
            <Text style={styles.previewButtonText}>Preview Post</Text>
          </TouchableOpacity>
        )}

        {/* Credits Info */}
        <View style={styles.creditsInfo}>
          <Ionicons name="flash" size={18} color={COLORS.warning} />
          <Text style={styles.creditsText}>
            {credits} credit{credits !== 1 ? 's' : ''} available
          </Text>
          <TouchableOpacity onPress={() => router.push('/subscription')}>
            <Text style={styles.getMoreText}>Get more</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button
            title="Save Draft"
            onPress={handleSaveDraft}
            variant="outline"
            icon="document-text"
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button
            title={isScheduling ? 'Schedule' : 'Post Now'}
            onPress={handlePost}
            variant="primary"
            icon={isScheduling ? 'calendar' : 'send'}
            loading={isPosting}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </ScrollView>

      {/* Preview Modal */}
      <Modal
        visible={showPreview}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPreview(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.previewModal}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewTitle}>Post Preview</Text>
              <TouchableOpacity onPress={() => setShowPreview(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.previewContent}>
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                  contentFit="cover"
                />
              )}
              <Text style={styles.previewCaption}>{caption}</Text>
              <View style={styles.previewPlatforms}>
                {selectedPlatforms.map((platformId) => {
                  const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
                  return (
                    <View key={platformId} style={styles.previewPlatformBadge}>
                      <Ionicons
                        name={platform?.icon as keyof typeof Ionicons.glyphMap}
                        size={16}
                        color={platform?.color}
                      />
                      <Text style={styles.previewPlatformName}>{platform?.name}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mediaButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 24,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
  },
  mediaButtonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mediaButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedImageContainer: {
    position: 'relative',
    borderRadius: SIZES.radius,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: 300,
  },
  imageActions: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
  },
  imageActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  quickHashtags: {
    marginTop: 12,
  },
  quickHashtagsTitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  hashtagChip: {
    backgroundColor: COLORS.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  hashtagChipText: {
    fontSize: 13,
    color: COLORS.primary,
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  platformCard: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 16,
    marginRight: '5%',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  platformCardSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  platformName: {
    fontSize: 12,
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  platformNameSelected: {
    color: COLORS.white,
  },
  connectPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  connectPromptText: {
    flex: 1,
    marginLeft: 16,
  },
  connectPromptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  connectPromptSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  scheduleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.backgroundCard,
    borderRadius: SIZES.radius,
    padding: 16,
  },
  scheduleOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleOptionText: {
    marginLeft: 12,
  },
  scheduleOptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  scheduleOptionSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.backgroundInput,
    padding: 2,
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  toggleKnobActive: {
    transform: [{ translateX: 22 }],
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primary,
    marginLeft: 8,
  },
  creditsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: 16,
  },
  creditsText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  getMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  previewModal: {
    backgroundColor: COLORS.backgroundCard,
    borderTopLeftRadius: SIZES.radiusLarge,
    borderTopRightRadius: SIZES.radiusLarge,
    maxHeight: '80%',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  previewContent: {
    padding: 20,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: SIZES.radius,
    marginBottom: 16,
  },
  previewCaption: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  previewPlatforms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  previewPlatformBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundInput,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  previewPlatformName: {
    fontSize: 13,
    color: COLORS.text,
    marginLeft: 6,
  },
});
