import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack>
      <Stack.Screen name="about" options={{ title: 'About you' }} />
      <Stack.Screen name="photos" options={{ title: 'Photos' }} />
      <Stack.Screen name="prompts" options={{ title: 'Prompts' }} />
    </Stack>
  );
}

