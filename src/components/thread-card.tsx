import React from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DrawingPreview } from '@/components/drawing-preview';
import { cardShadow, fonts, layout, palette } from '@/lib/theme';
import { MatchThread, DatingProfile } from '@/types/models';

type ThreadCardProps = {
  onPress: () => void;
  profile: DatingProfile;
  thread: MatchThread;
};

export function ThreadCard({ onPress, profile, thread }: ThreadCardProps) {
  const drawingMessage = [...thread.messages].reverse().find((message) => message.kind === 'drawing');
  const heroPhoto = profile.photos.find((photo) => photo.availability === 'public') ?? profile.photos[0];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.headerRow}>
        <View style={styles.identityRow}>
          <View style={styles.avatar}>
            <Image contentFit="cover" source={{ uri: heroPhoto.uri }} style={StyleSheet.absoluteFill} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.meta}>
              {thread.lastActivityLabel} · {thread.unreadCount ? `${thread.unreadCount} new` : 'caught up'}
            </Text>
          </View>
        </View>
        <View style={[styles.statusChip, thread.status === 'drawing-received' && styles.statusChipWarm]}>
          <Text style={styles.statusChipText}>{thread.status.replace('-', ' ')}</Text>
        </View>
      </View>

      {drawingMessage?.drawing ? (
        <View style={styles.drawingRow}>
          <DrawingPreview compact drawing={drawingMessage.drawing} height={108} />
          <View style={styles.drawingMeta}>
            <Text style={styles.drawingTitle}>{drawingMessage.drawing.title}</Text>
            <Text style={styles.drawingPrompt}>{drawingMessage.drawing.prompt}</Text>
            <Text style={styles.drawingSnippet}>{thread.latestSnippet}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.textOnlyBlock}>
          <Text style={styles.drawingSnippet}>{thread.latestSnippet}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 22,
    backgroundColor: palette.card,
    padding: 16,
    gap: 14,
    borderCurve: 'continuous',
    boxShadow: cardShadow,
    transform: [{ rotate: '-0.5deg' }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  identityRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderCurve: 'continuous',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 22,
    fontWeight: '800',
  },
  meta: {
    fontFamily: fonts.mono,
    color: palette.muted,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  statusChip: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: layout.pillRadius,
    backgroundColor: palette.butter,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  statusChipWarm: {
    backgroundColor: palette.blush,
  },
  statusChipText: {
    fontFamily: fonts.mono,
    color: palette.ink,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  drawingRow: {
    flexDirection: 'row',
    gap: 14,
  },
  drawingMeta: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  drawingTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  drawingPrompt: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  drawingSnippet: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  textOnlyBlock: {
    borderRadius: 16,
    backgroundColor: palette.mint,
    padding: 16,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '0px 0px 0px 0px rgba(28, 28, 25, 0)',
  },
});
