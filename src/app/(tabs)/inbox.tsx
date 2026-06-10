import React from 'react';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenShell } from '@/components/screen-shell';
import { ThreadCard } from '@/components/thread-card';
import { fonts, layout, palette } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function InboxScreen() {
  const { getProfileById, threads } = useAppState();

  return (
    <ScreenShell
      badge="inbox"
      subtitle="Drawings wait here until you’re ready. Open one to chat, send something back, or let the AI help with the first reply."
      title="Sketches in orbit">
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{threads.length}</Text>
          <Text style={styles.summaryLabel}>active threads</Text>
        </View>
        <View style={[styles.summaryCard, styles.summaryCardWarm]}>
          <Text style={styles.summaryNumber}>
            {threads.reduce((total, thread) => total + thread.unreadCount, 0)}
          </Text>
          <Text style={styles.summaryLabel}>new notes</Text>
        </View>
      </View>

      {threads.map((thread) => {
        const profile = getProfileById(thread.profileId);

        if (!profile) {
          return null;
        }

        return (
          <ThreadCard
            key={thread.id}
            onPress={() => {
              router.push({
                pathname: '/chat/[threadId]',
                params: { threadId: thread.id },
              });
            }}
            profile={profile}
            thread={thread}
          />
        );
      })}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 24,
    backgroundColor: palette.sky,
    padding: 18,
    gap: 6,
  },
  summaryCardWarm: {
    backgroundColor: palette.blush,
  },
  summaryNumber: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 30,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  summaryLabel: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

