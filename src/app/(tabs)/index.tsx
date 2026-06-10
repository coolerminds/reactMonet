import React from 'react';
import { router, type Href } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ActionButton } from '@/components/action-button';
import { ProfileCard } from '@/components/profile-card';
import { ScreenShell } from '@/components/screen-shell';
import { cardShadow, fonts, layout, palette } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function DiscoverScreen() {
  const { currentProfile, passCurrentProfile, viewer } = useAppState();

  if (!currentProfile) {
    return (
      <ScreenShell
        badge="discover"
        subtitle="No profiles match your current discovery preferences."
        title="No matches right now">
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Adjust your filters and try again.</Text>
          <Text style={styles.emptyBody}>
            Current filter: {viewer.discovery.showMe.join(', ')} · {viewer.discovery.ageRangeLabel}
          </Text>
          <ActionButton label="Edit preferences" onPress={() => router.push('/profile/prompts' as Href)} />
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      badge="discover"
      subtitle="Swipe culture gets replaced with tiny art projects. If someone catches your eye, send them a drawing instead of a lazy like."
      title="Draw to flirt">
      <View style={styles.filterCard}>
        <Text style={styles.filterLabel}>Showing</Text>
        <Text style={styles.filterValue}>
          {viewer.discovery.showMe.join(', ')} · {viewer.discovery.ageRangeLabel}
        </Text>
      </View>
      <ProfileCard
        onDrawPress={() => {
          router.push({
            pathname: '/compose/[profileId]',
            params: { profileId: currentProfile.id },
          });
        }}
        onPassPress={passCurrentProfile}
        profile={currentProfile}
      />

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>How Monet works</Text>
        <Text style={styles.noteBody}>
          Profiles ask for a doodle. Your sketch lands in their inbox. They can reply with a
          message, a drawing back, or reveal more of themselves later.
        </Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 22,
    backgroundColor: palette.card,
    padding: 20,
    gap: 8,
    boxShadow: cardShadow,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 24,
    fontWeight: '800',
  },
  emptyBody: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  noteCard: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 22,
    backgroundColor: palette.card,
    padding: 18,
    gap: 6,
    boxShadow: cardShadow,
    transform: [{ rotate: '0.5deg' }],
  },
  filterCard: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 20,
    backgroundColor: 'rgba(181, 240, 156, 0.2)',
    padding: 14,
    gap: 4,
    boxShadow: cardShadow,
  },
  filterLabel: {
    fontFamily: fonts.mono,
    color: palette.cobalt,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterValue: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  noteTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  noteBody: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
