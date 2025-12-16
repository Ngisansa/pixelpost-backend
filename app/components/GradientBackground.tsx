import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../constants/theme';

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'dark' | 'card';
}

// Simple gradient-like background using layered views
// This replaces expo-linear-gradient which may not be available
export default function GradientBackground({ 
  children, 
  style,
  variant = 'primary' 
}: GradientBackgroundProps) {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: COLORS.background };
      case 'secondary':
        return { backgroundColor: COLORS.backgroundLight };
      case 'dark':
        return { backgroundColor: COLORS.black };
      case 'card':
        return { backgroundColor: COLORS.backgroundCard };
      default:
        return { backgroundColor: COLORS.background };
    }
  };

  return (
    <View style={[styles.container, getBackgroundStyle(), style]}>
      {/* Top gradient overlay */}
      <View style={[styles.overlay, styles.topOverlay]} />
      {/* Content */}
      <View style={styles.content}>
        {children}
      </View>
      {/* Bottom gradient overlay */}
      <View style={[styles.overlay, styles.bottomOverlay]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 150,
    pointerEvents: 'none',
  },
  topOverlay: {
    top: 0,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
});
