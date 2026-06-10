import React from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, layout, palette } from '@/lib/theme';
import { PhotoVariant } from '@/types/models';

type PhotoVariantCardProps = {
  onPress?: () => void;
  photo: PhotoVariant;
  selected?: boolean;
};

export function PhotoVariantCard({
  onPress,
  photo,
  selected = false,
}: PhotoVariantCardProps) {
  const content = (
    <View style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.thumbnail}>
        <Image contentFit="cover" source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} />
      </View>
      <View style={styles.meta}>
        <Text style={styles.title}>{photo.label}</Text>
        <Text style={styles.body}>
          {photo.origin === 'ai-remix'
            ? 'AI remix variant for your public profile.'
            : 'Original camera photo kept behind your reveal controls.'}
        </Text>
      </View>
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    borderWidth: layout.outlineWidth,
    borderColor: '#d6cfbf',
    borderRadius: 24,
    backgroundColor: palette.card,
    padding: 14,
    borderCurve: 'continuous',
  },
  cardSelected: {
    borderColor: palette.border,
    backgroundColor: palette.mint,
  },
  thumbnail: {
    width: 88,
    height: 88,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderCurve: 'continuous',
  },
  meta: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  title: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  pressed: {
    opacity: 0.72,
  },
});

