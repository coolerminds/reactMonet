import { Stack } from 'expo-router';

export default function ProfileStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="edit" options={{ title: 'Edit profile' }} />
      <Stack.Screen name="photos" options={{ title: 'Manage photos' }} />
      <Stack.Screen name="prompts" options={{ title: 'Edit prompts' }} />
    </Stack>
  );
}

