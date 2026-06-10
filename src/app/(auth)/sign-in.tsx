import { router, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PaperBackdrop } from '@/components/paper-backdrop';
import { describeGoogleAuthSetup, getGoogleAuthSetupState } from '@/lib/auth';
import { cardShadow, fonts, layout, palette } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

function AuthButton({
  icon,
  label,
  onPress,
  tone = 'card',
}: {
  icon: string;
  label: string;
  onPress: () => void;
  tone?: 'card' | 'lime';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.authButton,
        tone === 'lime' && styles.authButtonLime,
        pressed && styles.pressed,
      ]}>
      <Text style={styles.authIcon}>{icon}</Text>
      <Text style={styles.authLabel}>{label}</Text>
    </Pressable>
  );
}

export default function SignInScreen() {
  const { connectDemoGoogle, viewer } = useAppState();
  const authState = getGoogleAuthSetupState();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}>
      <PaperBackdrop />

      <View style={styles.titleSticker}>
        <View style={styles.titleIconWrap}>
          <SymbolView
            fallback={<Text style={styles.titleIconFallback}>♡</Text>}
            name={{ ios: 'heart', android: 'favorite', web: 'favorite' }}
            size={34}
            tintColor={palette.cobalt}
          />
        </View>
        <Text style={styles.title}>Draw to flirt</Text>
      </View>

      <Text style={styles.subtitle}>Less typing. More doodling.</Text>

      <View style={styles.sketchBoard}>
        <View style={styles.sketchCanvas}>
          <SymbolView
            fallback={<Text style={styles.heroFallback}>♡</Text>}
            name={{ ios: 'heart.fill', android: 'favorite', web: 'favorite' }}
            size={86}
            tintColor="#d7d4cf"
          />

          <View style={styles.loginGhostCard}>
            <View style={styles.loginGhostInput} />
            <View style={styles.loginGhostButton}>
              <Text style={styles.loginGhostText}>Login</Text>
            </View>
          </View>

          <View style={styles.sketchTopDoodle}>
            <Text style={styles.doodleText}>🖌</Text>
          </View>
          <View style={styles.sketchBottomDoodle}>
            <Text style={styles.doodleText}>✎</Text>
          </View>
        </View>
      </View>

      <View style={styles.buttonStack}>
        <AuthButton
          icon="G"
          label={viewer.connectedEmail ? 'Refresh demo Google' : 'Sign in with Google'}
          onPress={connectDemoGoogle}
          tone="lime"
        />
        <AuthButton
          icon=""
          label="Sign in with Apple"
          onPress={() => router.replace('/onboarding/about' as Href)}
        />
      </View>

      <Text style={styles.meta}>{describeGoogleAuthSetup()}</Text>
      <Text style={styles.meta}>
        Mode: {authState.mode} · Connected: {viewer.connectedEmail ?? 'none yet'}
      </Text>

      <Pressable
        onPress={() => router.replace('/onboarding/about' as Href)}
        style={({ pressed }) => [styles.newHereButton, pressed && styles.pressed]}>
        <Text style={styles.newHereText}>New here? Draw your first profile</Text>
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
    paddingTop: 28,
    paddingBottom: 44,
    gap: 20,
    position: 'relative',
  },
  titleSticker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 28,
    backgroundColor: palette.card,
    paddingHorizontal: 18,
    paddingVertical: 18,
    transform: [{ rotate: '-1.2deg' }],
    boxShadow: cardShadow,
  },
  titleIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(181, 240, 156, 0.2)',
  },
  titleIconFallback: {
    color: palette.cobalt,
    fontSize: 34,
  },
  title: {
    flex: 1,
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    fontFamily: fonts.mono,
    color: palette.muted,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  sketchBoard: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 28,
    backgroundColor: palette.card,
    padding: 14,
    boxShadow: cardShadow,
    transform: [{ rotate: '-0.7deg' }],
  },
  sketchCanvas: {
    height: 430,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 22,
    backgroundColor: '#d8d6d1',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    overflow: 'hidden',
  },
  heroFallback: {
    color: '#d7d4cf',
    fontSize: 86,
  },
  loginGhostCard: {
    width: 210,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 22,
    paddingVertical: 18,
    gap: 16,
    alignItems: 'center',
  },
  loginGhostInput: {
    width: '100%',
    height: 24,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#d6d0c6',
    backgroundColor: palette.card,
  },
  loginGhostButton: {
    borderRadius: 12,
    backgroundColor: '#b6b1a9',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  loginGhostText: {
    fontFamily: fonts.display,
    color: palette.card,
    fontSize: 18,
    fontWeight: '700',
  },
  sketchTopDoodle: {
    position: 'absolute',
    right: 20,
    top: 24,
  },
  sketchBottomDoodle: {
    position: 'absolute',
    left: 20,
    bottom: 24,
  },
  doodleText: {
    fontSize: 28,
    color: palette.berry,
  },
  buttonStack: {
    gap: 14,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 20,
    backgroundColor: palette.card,
    paddingHorizontal: 18,
    paddingVertical: 18,
    boxShadow: cardShadow,
  },
  authButtonLime: {
    backgroundColor: palette.lime,
  },
  authIcon: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  authLabel: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  meta: {
    fontFamily: fonts.mono,
    color: palette.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  newHereButton: {
    paddingVertical: 10,
  },
  newHereText: {
    fontFamily: fonts.display,
    color: palette.berry,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '0px 0px 0px 0px rgba(28, 28, 25, 0)',
  },
});
