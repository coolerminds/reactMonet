import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { palette } from '@/lib/theme';
import { AppStateProvider } from '@/state/app-state';

export default function RootLayout() {
  return (
    <AppStateProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: palette.canvas },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: palette.canvas },
          headerTintColor: palette.ink,
          headerBackTitle: 'Back',
        }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen
          name="compose/[profileId]"
          options={{
            animation: 'slide_from_bottom',
            contentStyle: { backgroundColor: 'transparent' },
            headerShown: false,
            presentation: 'transparentModal',
          }}
        />
        <Stack.Screen
          name="chat/[threadId]"
          options={{
            title: 'Conversation',
          }}
        />
      </Stack>
    </AppStateProvider>
  );
}
