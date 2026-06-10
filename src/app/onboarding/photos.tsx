import { router, type Href } from 'expo-router';

import { ActionButton } from '@/components/action-button';
import { PhotoVariantCard } from '@/components/photo-variant-card';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { useAppState } from '@/state/app-state';

export default function OnboardingPhotosScreen() {
  const { completeOnboardingStep, selectViewerVariant, toggleOriginalReveal, viewer } = useAppState();

  return (
    <ScreenShell
      badge="onboarding"
      subtitle="Photo setup screen for selecting active remixes and deciding when originals should appear."
      title="Choose what people see first">
      <SectionCard accent="card" title="Photo variants">
        {viewer.photos.map((photo) => (
          <PhotoVariantCard
            key={photo.id}
            onPress={() => selectViewerVariant(photo.id)}
            photo={photo}
            selected={viewer.activePhotoVariantId === photo.id}
          />
        ))}
        <ActionButton
          label={viewer.revealOriginalPhotos ? 'Hide originals for now' : 'Allow original reveal later'}
          onPress={toggleOriginalReveal}
          tone="secondary"
        />
        <ActionButton
          label="Save and continue"
          onPress={() => {
            completeOnboardingStep('photos');
            router.push('/onboarding/prompts' as Href);
          }}
        />
      </SectionCard>
    </ScreenShell>
  );
}
