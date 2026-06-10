import React from 'react';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { cardShadow, fonts, layout, palette } from '@/lib/theme';
import { DatingProfile } from '@/types/models';

type ProfileCardProps = {
  onDrawPress: () => void;
  onPassPress: () => void;
  profile: DatingProfile;
};

function WavyDivider() {
  return (
    <Svg height={12} viewBox="0 0 100 12" width="100%">
      <Path
        d="M0 6 C 10 12, 10 0, 20 6 C 30 12, 30 0, 40 6 C 50 12, 50 0, 60 6 C 70 12, 70 0, 80 6 C 90 12, 90 0, 100 6"
        fill="none"
        stroke={palette.cobalt}
        strokeLinecap="round"
        strokeWidth={3}
      />
    </Svg>
  );
}

export function ProfileCard({ onDrawPress, onPassPress, profile }: ProfileCardProps) {
  const visiblePhotos = profile.photos.filter((photo) => photo.availability === 'public');
  const [photoState, setPhotoState] = React.useState({ index: 0, profileId: profile.id });
  const photoIndex = photoState.profileId === profile.id ? photoState.index : 0;
  const currentPhoto = visiblePhotos[photoIndex] ?? visiblePhotos[0];
  const promptCards = profile.prompts.slice(0, 2);
  const photoCountRef = React.useRef(visiblePhotos.length);

  React.useEffect(() => {
    photoCountRef.current = visiblePhotos.length;
  }, [visiblePhotos.length]);

  const setLocalPhotoIndex = React.useEffectEvent((index: number) => {
    setPhotoState({ index, profileId: profile.id });
  });

  const goToPreviousPhoto = React.useEffectEvent(() => {
    if (photoCountRef.current < 2) {
      return;
    }

    const nextIndex = photoIndex - 1;
    setLocalPhotoIndex(nextIndex < 0 ? photoCountRef.current - 1 : nextIndex);
  });

  const goToNextPhoto = React.useEffectEvent(() => {
    if (photoCountRef.current < 2) {
      return;
    }

    setLocalPhotoIndex((photoIndex + 1) % photoCountRef.current);
  });

  const [photoSwipeResponder] = React.useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 12,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx <= -24) {
          goToNextPhoto();
          return;
        }

        if (gesture.dx >= 24) {
          goToPreviousPhoto();
        }
      },
    }),
  );

  return (
    <View style={styles.card}>
      <View style={styles.polaroid}>
        <View style={styles.photoMat}>
          <View style={styles.photoFrame} {...photoSwipeResponder.panHandlers}>
            <Image contentFit="cover" source={{ uri: currentPhoto.uri }} style={StyleSheet.absoluteFill} />
            <Pressable onPress={goToPreviousPhoto} style={styles.leftTapZone} />
            <Pressable onPress={goToNextPhoto} style={styles.rightTapZone} />

            <View style={styles.photoOverlay}>
              <View style={styles.photoTag}>
                <Text style={styles.photoTagText}>{currentPhoto.label}</Text>
              </View>
              <View style={styles.photoCounter}>
                <Text style={styles.photoCounterText}>
                  {photoIndex + 1}/{visiblePhotos.length}
                </Text>
              </View>
            </View>

            <View style={styles.photoStamp}>
              <SymbolView
                fallback={<Text style={styles.photoStampFallback}>♥</Text>}
                name={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
                size={18}
                tintColor={palette.card}
              />
            </View>

            <View style={styles.photoProgressRow}>
              {visiblePhotos.map((photo, index) => (
                <View
                  key={photo.id}
                  style={[styles.photoProgressDot, index === photoIndex && styles.photoProgressDotActive]}
                />
              ))}
            </View>
          </View>
        </View>

        <View style={styles.contentBlock}>
          <Text style={styles.name}>
            {profile.name}, {profile.age}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Text style={styles.metaText}>{profile.pronouns}</Text>
            </View>
            <View style={styles.metaPill}>
              <SymbolView
                fallback={<Text style={styles.metaIconFallback}>•</Text>}
                name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
                size={12}
                tintColor={palette.muted}
              />
              <Text style={styles.metaText}>{profile.location}</Text>
            </View>
          </View>

          <Text style={styles.tagline}>{profile.tagline}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>

          <View style={styles.dividerWrap}>
            <WavyDivider />
          </View>

          <View style={styles.promptStack}>
            {promptCards.map((prompt) => (
              <View key={prompt.title} style={styles.promptRow}>
                <Text style={styles.promptEmoji}>{prompt.emoji}</Text>
                <View style={styles.promptCopy}>
                  <Text style={styles.promptTitle}>{prompt.title}</Text>
                  <Text style={styles.promptBody}>{prompt.body}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.remixNote}>
            <Text style={styles.remixLabel}>AI photo mode</Text>
            <Text style={styles.remixBody}>
              Remix shots first, originals later when the vibe feels safe.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.actionTray}>
        <Text style={styles.actionHint}>Tap to doodle a reply</Text>
        <View style={styles.ctaRow}>
          <Pressable
            accessibilityLabel="Skip profile"
            onPress={onPassPress}
            style={({ pressed }) => [styles.sideCta, pressed && styles.pressed]}>
            <SymbolView
              fallback={<Text style={styles.secondaryCtaText}>×</Text>}
              name={{ ios: 'xmark', android: 'close', web: 'close' }}
              size={28}
              tintColor={palette.ink}
            />
          </Pressable>
          <Pressable
            accessibilityLabel="Draw for profile"
            onPress={onDrawPress}
            style={({ pressed }) => [styles.primaryCta, pressed && styles.pressed]}>
            <View style={styles.primaryCtaContent}>
              <SymbolView
                fallback={<Text style={styles.primaryCtaText}>✎</Text>}
                name={{ ios: 'paintbrush.fill', android: 'brush', web: 'brush' }}
                size={26}
                tintColor={palette.ink}
              />
              <Text style={styles.primaryCtaText}>Draw</Text>
            </View>
          </Pressable>
          <Pressable
            accessibilityLabel="Like with a drawing"
            onPress={onDrawPress}
            style={({ pressed }) => [styles.sideCta, styles.heartCta, pressed && styles.pressed]}>
            <SymbolView
              fallback={<Text style={styles.heartFallback}>♥</Text>}
              name={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
              size={28}
              tintColor={palette.cobalt}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  polaroid: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 26,
    backgroundColor: palette.card,
    padding: 16,
    gap: 18,
    boxShadow: cardShadow,
    transform: [{ rotate: '-0.75deg' }],
  },
  photoMat: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 24,
    backgroundColor: palette.wash,
    padding: 10,
  },
  photoFrame: {
    height: 408,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    backgroundColor: palette.sky,
  },
  leftTapZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '34%',
    zIndex: 1,
  },
  rightTapZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '34%',
    zIndex: 1,
  },
  photoOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
    zIndex: 2,
  },
  photoTag: {
    maxWidth: '72%',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: layout.pillRadius,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  photoTagText: {
    fontFamily: fonts.mono,
    color: palette.berry,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  photoCounter: {
    minWidth: 54,
    backgroundColor: 'rgba(28, 28, 25, 0.92)',
    borderRadius: layout.pillRadius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  photoCounterText: {
    fontFamily: fonts.mono,
    color: palette.card,
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  photoStamp: {
    position: 'absolute',
    top: 64,
    right: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoStampFallback: {
    color: palette.card,
    fontSize: 18,
  },
  photoProgressRow: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    zIndex: 2,
  },
  photoProgressDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  photoProgressDotActive: {
    backgroundColor: palette.card,
  },
  contentBlock: {
    gap: 12,
  },
  name: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 30,
    fontWeight: '800',
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: '#c7c1b5',
    borderRadius: layout.pillRadius,
    backgroundColor: palette.mint,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  metaText: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  metaIconFallback: {
    color: palette.muted,
    fontSize: 12,
  },
  tagline: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  bio: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  dividerWrap: {
    paddingTop: 2,
  },
  promptStack: {
    gap: 16,
  },
  promptRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  promptEmoji: {
    fontSize: 20,
    lineHeight: 22,
  },
  promptCopy: {
    flex: 1,
    gap: 4,
  },
  promptTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  promptBody: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 15,
    lineHeight: 21,
  },
  remixNote: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c7c1b5',
    borderRadius: 18,
    backgroundColor: 'rgba(181, 240, 156, 0.22)',
    padding: 14,
    gap: 4,
  },
  remixLabel: {
    fontFamily: fonts.mono,
    color: palette.cobalt,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  remixBody: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 14,
    lineHeight: 19,
  },
  actionTray: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#c7c1b5',
    borderRadius: 22,
    backgroundColor: 'rgba(181, 240, 156, 0.18)',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
    gap: 12,
  },
  actionHint: {
    fontFamily: fonts.mono,
    color: palette.cobalt,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sideCta: {
    width: 64,
    height: 64,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.card,
    boxShadow: cardShadow,
  },
  heartCta: {
    backgroundColor: palette.card,
  },
  primaryCta: {
    width: 82,
    height: 82,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.butter,
    boxShadow: cardShadow,
  },
  primaryCtaContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  primaryCtaText: {
    fontFamily: fonts.mono,
    color: palette.ink,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  secondaryCtaText: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 24,
    fontWeight: '700',
  },
  heartFallback: {
    color: palette.cobalt,
    fontSize: 28,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '0px 0px 0px 0px rgba(28, 28, 25, 0)',
  },
});
