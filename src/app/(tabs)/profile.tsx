import React from 'react';
import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { RouteRow } from '@/components/route-row';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { describeGoogleAuthSetup, getGoogleAuthSetupState } from '@/lib/auth';
import { getAiSetupState } from '@/lib/ai';
import { fonts, layout, palette } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function ProfileScreen() {
  const { connectDemoGoogle, viewer } = useAppState();
  const authState = getGoogleAuthSetupState();
  const aiState = getAiSetupState();

  return (
    <ScreenShell
      badge="profile"
      subtitle="Your account settings, safety controls, and launch checklist live here."
      title={`${viewer.name}'s control room`}>
      <View style={styles.identityCard}>
        <Text style={styles.identityName}>{viewer.name}</Text>
        <Text style={styles.identityMeta}>
          {viewer.age} · {viewer.gender} · {viewer.location}
        </Text>
        <Text style={styles.identityTagline}>{viewer.tagline}</Text>
      </View>

      <SectionCard
        accent="card"
        description="These are the main app surfaces you will probably style next."
        title="Pages">
        <RouteRow
          description="Basics, bio, vibe, and intro copy."
          onPress={() => router.push('/profile/edit' as Href)}
          title="Edit profile"
        />
        <RouteRow
          description="Manage remix photos, originals, and active profile shots."
          onPress={() => router.push('/profile/photos' as Href)}
          title="Manage photos"
        />
        <RouteRow
          description="Edit prompts, interests, and discovery settings."
          onPress={() => router.push('/profile/prompts' as Href)}
          title="Edit prompts"
        />
        <RouteRow
          description="Privacy, notifications, and account settings."
          onPress={() => router.push('/settings' as Href)}
          title="Settings"
        />
      </SectionCard>

      <SectionCard accent="wash" title="Google sign-in">
        <Text style={styles.cardBody}>{describeGoogleAuthSetup()}</Text>
        <Text style={styles.cardMode}>
          Status: {viewer.connectedEmail ?? (authState.ready ? 'ready to connect' : 'demo session')}
        </Text>
        <ActionButton
          label={viewer.connectedEmail ? 'Refresh demo session' : 'Use demo Google account'}
          onPress={connectDemoGoogle}
        />
        <ActionButton label="Open sign-in page" onPress={() => router.push('/sign-in' as Href)} tone="secondary" />
      </SectionCard>

      <SectionCard accent="wash" title="Backend stack">
        <Text style={styles.cardTitle}>Backend stack</Text>
        <Text style={styles.cardBody}>
          Firebase handles auth and storage. A secure server endpoint should proxy xAI requests for
          photo remixes and chat suggestions.
        </Text>
        <Text style={styles.cardMode}>Firebase: {authState.firebaseReady ? 'configured' : 'not configured'}</Text>
        <Text style={styles.cardMode}>AI proxy: {aiState.ready ? 'configured' : 'demo only'}</Text>
      </SectionCard>

      <SectionCard accent="mint" title="Onboarding status">
        <Text style={styles.cardBody}>
          About: {viewer.onboarding.about ? 'done' : 'todo'} · Photos:{' '}
          {viewer.onboarding.photos ? 'done' : 'todo'} · Prompts:{' '}
          {viewer.onboarding.prompts ? 'done' : 'todo'}
        </Text>
        <ActionButton
          label="Open onboarding flow"
          onPress={() => router.push('/onboarding/about' as Href)}
          tone="secondary"
        />
      </SectionCard>

      <View style={styles.safetyCard}>
        <Text style={styles.cardTitle}>Safety defaults</Text>
        <Text style={styles.cardBody}>
          Originals stay private until you reveal them. Drawings act as soft consent before the
          chat opens up.
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  identityCard: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 28,
    backgroundColor: palette.card,
    padding: 20,
    gap: 4,
  },
  identityName: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 28,
    fontWeight: '800',
  },
  identityMeta: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 14,
  },
  identityTagline: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  safetyCard: {
    borderRadius: 28,
    backgroundColor: palette.mint,
    padding: 18,
    gap: 8,
  },
  cardTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  cardBody: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  cardMode: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
