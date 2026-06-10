import React from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { getAiSetupState } from '@/lib/ai';
import { fonts, layout, palette } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function LabScreen() {
  const { selectViewerVariant, toggleOriginalReveal, viewer } = useAppState();
  const aiState = getAiSetupState();

  return (
    <ScreenShell
      badge="grok lab"
      subtitle="Use AI remixes as a soft opening. Save the version that feels fun, then reveal the originals only when the match feels right."
      title="Photo remix studio">
      <View style={styles.heroPhotoFrame}>
        <Image
          contentFit="cover"
          source={{
            uri:
              viewer.photos.find((photo) => photo.id === viewer.activePhotoVariantId)?.uri ??
              viewer.photos[0]?.uri,
          }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroPhotoLabel}>
          <Text style={styles.heroPhotoLabelText}>active profile photo</Text>
        </View>
      </View>

      <View style={styles.variantList}>
        {viewer.photos.map((photo) => {
          const selected = viewer.activePhotoVariantId === photo.id;

          return (
            <Pressable
              key={photo.id}
              onPress={() => selectViewerVariant(photo.id)}
              style={({ pressed }) => [
                styles.variantCard,
                selected && styles.variantCardActive,
                pressed && styles.pressed,
              ]}>
              <View style={styles.variantThumb}>
                <Image contentFit="cover" source={{ uri: photo.uri }} style={StyleSheet.absoluteFill} />
              </View>
              <View style={styles.variantMeta}>
                <Text style={styles.variantTitle}>{photo.label}</Text>
                <Text style={styles.variantBody}>
                  {photo.origin === 'camera'
                    ? 'Private until you decide to reveal it.'
                    : 'Visible on your profile right now.'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={toggleOriginalReveal}
        style={({ pressed }) => [styles.revealCard, pressed && styles.pressed]}>
        <Text style={styles.revealTitle}>
          {viewer.revealOriginalPhotos ? 'Originals are visible to matches' : 'Originals stay hidden for now'}
        </Text>
        <Text style={styles.revealBody}>
          {viewer.revealOriginalPhotos
            ? 'People you already matched with can now see your camera originals.'
            : 'Keep your original camera roll private until the connection feels comfortable.'}
        </Text>
      </Pressable>

      <View style={styles.backendCard}>
        <Text style={styles.backendTitle}>AI backend</Text>
        <Text style={styles.backendBody}>{aiState.description}</Text>
        <Text style={styles.backendMode}>Mode: {aiState.mode}</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  heroPhotoFrame: {
    height: 360,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    backgroundColor: palette.wash,
    borderCurve: 'continuous',
  },
  heroPhotoLabel: {
    position: 'absolute',
    top: 16,
    left: 16,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: layout.pillRadius,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  heroPhotoLabelText: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  variantList: {
    gap: 12,
  },
  variantCard: {
    flexDirection: 'row',
    gap: 14,
    borderWidth: layout.outlineWidth,
    borderColor: '#d6cfbf',
    borderRadius: 24,
    backgroundColor: palette.card,
    padding: 14,
  },
  variantCardActive: {
    borderColor: palette.border,
    backgroundColor: palette.mint,
  },
  variantThumb: {
    width: 84,
    height: 84,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
  },
  variantMeta: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  variantTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  variantBody: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  revealCard: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 24,
    backgroundColor: palette.blush,
    padding: 18,
    gap: 6,
  },
  revealTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 21,
    fontWeight: '700',
  },
  revealBody: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  backendCard: {
    borderRadius: 24,
    backgroundColor: palette.wash,
    padding: 18,
    gap: 6,
  },
  backendTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  backendBody: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  backendMode: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pressed: {
    opacity: 0.74,
  },
});

