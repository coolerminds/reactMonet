import { router, type Href } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { RouteRow } from '@/components/route-row';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { fonts, palette } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

export default function SettingsIndexScreen() {
  const { viewer } = useAppState();

  return (
    <ScreenShell
      badge="settings"
      subtitle="Settings index page for routing into privacy, notifications, and account surfaces."
      title="Settings">
      <SectionCard accent="card" title="Account">
        <Text style={styles.meta}>Connected email: {viewer.connectedEmail ?? 'demo only'}</Text>
        <RouteRow
          description="Auth and Google-account connection flow."
          onPress={() => router.push('/sign-in' as Href)}
          title="Sign-in"
        />
      </SectionCard>

      <SectionCard accent="wash" title="Preferences">
        <RouteRow
          description="Visibility, originals, and drawing-first safety defaults."
          onPress={() => router.push('/settings/privacy' as Href)}
          title="Privacy and safety"
        />
        <RouteRow
          description="Control drawing, message, and AI remix notifications."
          onPress={() => router.push('/settings/notifications' as Href)}
          title="Notifications"
        />
      </SectionCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  meta: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 14,
  },
});
