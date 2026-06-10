import { router } from 'expo-router';

import { ActionButton } from '@/components/action-button';
import { PhotoVariantCard } from '@/components/photo-variant-card';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useAppState } from '@/state/app-state';

export default function ProfilePhotosScreen() {
  const { selectViewerVariant, toggleOriginalReveal, viewer } = useAppState();

  return (
    <ScreenShell
      badge="profile"
      subtitle="Photo management surface for your public remixes and private originals."
      title="Manage photos">
      <SectionCard accent="card">
        {viewer.photos.map((photo) => (
          <PhotoVariantCard
            key={photo.id}
            onPress={() => selectViewerVariant(photo.id)}
            photo={photo}
            selected={viewer.activePhotoVariantId === photo.id}
          />
        ))}
        <ActionButton
          label={viewer.revealOriginalPhotos ? 'Hide original photos' : 'Allow original reveal'}
          onPress={toggleOriginalReveal}
          tone="secondary"
        />
      </SectionCard>

      <SectionCard accent="wash" title="Related page">
        <ActionButton label="Open Grok Lab" onPress={() => router.push('/lab')} tone="secondary" />
      </SectionCard>
    </ScreenShell>
  );
}
