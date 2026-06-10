import React from 'react';

import { ActionButton } from '@/components/action-button';
import { ChipGroup } from '@/components/chip-group';
import { PromptEditorCard } from '@/components/prompt-editor-card';
import { ScreenShell } from '@/components/screen-shell';
import { SectionCard } from '@/components/section-card';
import { discoveryOptions, interestOptions } from '@/data/mock-data';
import { useAppState } from '@/state/app-state';

export default function ProfilePromptsScreen() {
  const {
    toggleViewerInterest,
    updateDiscoveryPreferences,
    updateViewerPrompt,
    viewer,
  } = useAppState();
  const [prompts, setPrompts] = React.useState(viewer.prompts);
  const [interests, setInterests] = React.useState(viewer.interests);
  const [lookingFor, setLookingFor] = React.useState(viewer.discovery.lookingFor);
  const [showMe, setShowMe] = React.useState(viewer.discovery.showMe);
  const [ageRange, setAgeRange] = React.useState(viewer.discovery.ageRangeLabel);
  const [distance, setDistance] = React.useState(viewer.discovery.distanceLabel);

  return (
    <ScreenShell
      badge="profile"
      subtitle="Prompt, interests, and discovery-preference editing surface."
      title="Edit prompts">
      <SectionCard accent="card">
        {prompts.map((prompt, index) => (
          <PromptEditorCard
            key={`${prompt.title}-${index}`}
            onChange={(nextPrompt) =>
              setPrompts((currentPrompts) =>
                currentPrompts.map((item, itemIndex) => (itemIndex === index ? nextPrompt : item)),
              )
            }
            prompt={prompt}
          />
        ))}
      </SectionCard>

      <SectionCard accent="wash">
        <ChipGroup
          label="Interests"
          onChange={setInterests}
          options={interestOptions}
          selected={interests}
        />
        <ChipGroup
          label="Looking for"
          onChange={setLookingFor}
          options={discoveryOptions.lookingFor}
          selected={lookingFor}
        />
        <ChipGroup
          label="Show me"
          onChange={(selected) => setShowMe(selected as typeof viewer.discovery.showMe)}
          options={discoveryOptions.showMe}
          selected={showMe}
        />
        <ChipGroup
          label="Age range"
          multiple={false}
          onChange={(selected) => setAgeRange(selected[0] ?? ageRange)}
          options={discoveryOptions.ageRanges}
          selected={[ageRange]}
        />
        <ChipGroup
          label="Distance"
          multiple={false}
          onChange={(selected) => setDistance(selected[0] ?? distance)}
          options={discoveryOptions.distances}
          selected={[distance]}
        />
        <ActionButton
          label="Save prompts"
          onPress={() => {
            prompts.forEach((prompt, index) => updateViewerPrompt(index, prompt));
            viewer.interests
              .filter((interest) => !interests.includes(interest))
              .forEach((interest) => toggleViewerInterest(interest));
            interests
              .filter((interest) => !viewer.interests.includes(interest))
              .forEach((interest) => toggleViewerInterest(interest));
            updateDiscoveryPreferences({
              ageRangeLabel: ageRange,
              distanceLabel: distance,
              lookingFor,
              showMe,
            });
          }}
        />
      </SectionCard>
    </ScreenShell>
  );
}
