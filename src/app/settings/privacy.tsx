import { SettingRow } from '@/components/setting-row';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useAppState } from '@/state/app-state';

export default function PrivacySettingsScreen() {
  const { toggleOriginalReveal, toggleSafetyPreference, viewer } = useAppState();

  return (
    <ScreenShell
      badge="settings"
      subtitle="Safety and privacy controls that shape how the dating flow opens up."
      title="Privacy and safety">
      <SectionCard accent="card" title="Safety controls">
        <SettingRow
          description="Keep original photos out of view until there is a match."
          onValueChange={() => toggleSafetyPreference('blurOriginalsUntilMatch')}
          title="Blur originals until match"
          value={viewer.safety.blurOriginalsUntilMatch}
        />
        <SettingRow
          description="Require a drawing before the chat opens."
          onValueChange={() => toggleSafetyPreference('requireDrawingBeforeChat')}
          title="Require drawing before chat"
          value={viewer.safety.requireDrawingBeforeChat}
        />
        <SettingRow
          description="Hide distance details from the public profile."
          onValueChange={() => toggleSafetyPreference('hideDistance')}
          title="Hide distance"
          value={viewer.safety.hideDistance}
        />
        <SettingRow
          description="Allow AI remix tools on your uploaded photos."
          onValueChange={() => toggleSafetyPreference('allowPhotoRemix')}
          title="Allow photo remix"
          value={viewer.safety.allowPhotoRemix}
        />
        <SettingRow
          description="Let matched people see your original photos."
          onValueChange={toggleOriginalReveal}
          title="Reveal originals to matches"
          value={viewer.revealOriginalPhotos}
        />
      </SectionCard>
    </ScreenShell>
  );
}

