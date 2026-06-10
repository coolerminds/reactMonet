import { SettingRow } from '@/components/setting-row';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useAppState } from '@/state/app-state';

export default function NotificationSettingsScreen() {
  const { toggleNotificationPreference, viewer } = useAppState();

  return (
    <ScreenShell
      badge="settings"
      subtitle="Notification controls for the full app surface."
      title="Notifications">
      <SectionCard accent="card" title="Push preferences">
        <SettingRow
          description="Notify me when someone sends a drawing."
          onValueChange={() => toggleNotificationPreference('drawings')}
          title="Drawings"
          value={viewer.notifications.drawings}
        />
        <SettingRow
          description="Notify me when a match sends a message."
          onValueChange={() => toggleNotificationPreference('messages')}
          title="Messages"
          value={viewer.notifications.messages}
        />
        <SettingRow
          description="Notify me when AI photo remixes are ready."
          onValueChange={() => toggleNotificationPreference('remixReady')}
          title="AI remix updates"
          value={viewer.notifications.remixReady}
        />
        <SettingRow
          description="Send a weekly summary of activity."
          onValueChange={() => toggleNotificationPreference('weeklyDigest')}
          title="Weekly digest"
          value={viewer.notifications.weeklyDigest}
        />
      </SectionCard>
    </ScreenShell>
  );
}
