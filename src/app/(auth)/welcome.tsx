import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PaperBackdrop } from '@/components/paper-backdrop';
import { cardShadow, fonts, layout, palette } from '@/lib/theme';

export default function WelcomeScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}>
      <PaperBackdrop />

      <View style={styles.heroSticker}>
        <Text style={styles.heroTitle}>Draw to flirt</Text>
      </View>

      <Text style={styles.heroSubtitle}>Pass notes. Send sketches. Start softer conversations.</Text>

      <View style={styles.noteCard}>
        <Text style={styles.noteLabel}>How this feels</Text>
        <Text style={styles.noteBody}>
          Less swiping, more tiny art projects. Profiles ask for a doodle, drawings land in the
          inbox, and the chat starts when the energy is real.
        </Text>
      </View>

      <Pressable
        onPress={() => router.push('/sign-in' as Href)}
        style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
        <Text style={styles.primaryButtonText}>Continue to sign-in</Text>
      </Pressable>

      <Pressable
        onPress={() => router.replace('/' as Href)}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
        <Text style={styles.secondaryButtonText}>Jump into the demo app</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 44,
    gap: 20,
    position: 'relative',
  },
  heroSticker: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 28,
    backgroundColor: palette.card,
    paddingHorizontal: 22,
    paddingVertical: 24,
    transform: [{ rotate: '-1deg' }],
    boxShadow: cardShadow,
  },
  heroTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 38,
    lineHeight: 40,
    fontWeight: '800',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: fonts.mono,
    color: palette.berry,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
    letterSpacing: 1.3,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  noteCard: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 22,
    backgroundColor: 'rgba(181, 240, 156, 0.24)',
    padding: 18,
    gap: 8,
    boxShadow: cardShadow,
  },
  noteLabel: {
    fontFamily: fonts.mono,
    color: palette.cobalt,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  noteBody: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 20,
    backgroundColor: palette.lime,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: cardShadow,
  },
  primaryButtonText: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 20,
    backgroundColor: palette.card,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: cardShadow,
  },
  secondaryButtonText: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '0px 0px 0px 0px rgba(28, 28, 25, 0)',
  },
});
