import React from 'react';
import { router, type Href } from 'expo-router';

import { ActionButton } from '@/components/action-button';
import { ChipGroup } from '@/components/chip-group';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { genderOptions } from '@/data/mock-data';
import { TextField } from '@/components/text-field';
import { useAppState } from '@/state/app-state';

export default function OnboardingAboutScreen() {
  const { completeOnboardingStep, updateViewerProfile, viewer } = useAppState();
  const [name, setName] = React.useState(viewer.name);
  const [age, setAge] = React.useState(String(viewer.age));
  const [gender, setGender] = React.useState(viewer.gender);
  const [pronouns, setPronouns] = React.useState(viewer.pronouns);
  const [location, setLocation] = React.useState(viewer.location);
  const [occupation, setOccupation] = React.useState(viewer.occupation);
  const [tagline, setTagline] = React.useState(viewer.tagline);
  const [bio, setBio] = React.useState(viewer.bio);
  const [vibe, setVibe] = React.useState(viewer.vibe);

  return (
    <ScreenShell
      badge="onboarding"
      subtitle="Basic profile setup screen. Keep the structure, restyle it later."
      title="Tell people who you are">
      <SectionCard accent="card">
        <TextField label="Name" onChangeText={setName} value={name} />
        <TextField keyboardType="number-pad" label="Age" onChangeText={setAge} value={age} />
        <ChipGroup
          label="I am"
          multiple={false}
          onChange={(selected) => setGender((selected[0] as typeof viewer.gender | undefined) ?? gender)}
          options={[...genderOptions]}
          selected={[gender]}
        />
        <TextField label="Pronouns" onChangeText={setPronouns} value={pronouns} />
        <TextField label="Location" onChangeText={setLocation} value={location} />
        <TextField label="Occupation" onChangeText={setOccupation} value={occupation} />
        <TextField label="Tagline" onChangeText={setTagline} value={tagline} />
        <TextField label="Vibe" onChangeText={setVibe} value={vibe} />
        <TextField label="Bio" multiline onChangeText={setBio} value={bio} />
        <ActionButton
          label="Save and continue"
          onPress={() => {
            updateViewerProfile({
              age: Number(age) || viewer.age,
              bio,
              gender,
              location,
              name,
              occupation,
              pronouns,
              tagline,
              vibe,
            });
            completeOnboardingStep('about');
            router.push('/onboarding/photos' as Href);
          }}
        />
      </SectionCard>
    </ScreenShell>
  );
}
