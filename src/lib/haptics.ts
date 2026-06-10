import * as Haptics from 'expo-haptics';

export async function tapLight() {
  if (process.env.EXPO_OS !== 'ios') {
    return;
  }

  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
}

export async function tapSuccess() {
  if (process.env.EXPO_OS !== 'ios') {
    return;
  }

  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
}

