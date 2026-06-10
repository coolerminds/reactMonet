import React from 'react';
import { router, usePathname, type Href } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View, type ColorValue } from 'react-native';

import { cardShadow, fonts, layout, palette } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

function TopNavIcon({
  color,
  fallback,
  name,
}: {
  color: ColorValue;
  fallback: string;
  name: Parameters<typeof SymbolView>[0]['name'];
}) {
  return (
    <SymbolView
      fallback={<Text style={[styles.iconFallback, { color }]}>{fallback}</Text>}
      name={name}
      size={20}
      tintColor={color}
    />
  );
}

export function AppTopNav() {
  const pathname = usePathname();
  const { threads } = useAppState();

  const unreadCount = threads.reduce((total, thread) => total + thread.unreadCount, 0);
  const activeThread =
    threads.find((thread) => thread.status === 'chatting') ??
    threads.find((thread) => thread.status === 'drawing-received') ??
    threads[0];

  const inMingleSpace = pathname === '/' || pathname.startsWith('/compose');
  const inInboxSpace = pathname.startsWith('/inbox');
  const inProfileSpace =
    pathname.startsWith('/profile') || pathname.startsWith('/settings') || pathname.startsWith('/onboarding');
  const inChatSpace = pathname.startsWith('/chat');

  const dmBadge = unreadCount > 9 ? '9+' : `${unreadCount}`;

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel="Open your account"
        onPress={() => router.push('/profile' as Href)}
        style={({ pressed }) => [
          styles.edgeButton,
          inProfileSpace && styles.edgeButtonActive,
          pressed && styles.pressed,
        ]}>
        <TopNavIcon
          color={palette.ink}
          fallback=":)"
          name={{ ios: 'face.smiling.fill', android: 'sentiment_satisfied', web: 'mood' }}
        />
      </Pressable>

      <View style={styles.segmentedRail}>
        <Pressable
          accessibilityLabel="Open mingle"
          onPress={() => router.push('/' as Href)}
          style={({ pressed }) => [
            styles.segmentButton,
            styles.segmentDivider,
            inMingleSpace && styles.segmentButtonActive,
            pressed && styles.pressed,
          ]}>
          <Text style={[styles.segmentMark, inMingleSpace && styles.segmentMarkActive]}>m</Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Open received mail"
          onPress={() => router.push('/inbox' as Href)}
          style={({ pressed }) => [
            styles.segmentButton,
            styles.mailSegment,
            inInboxSpace && styles.segmentButtonActive,
            inInboxSpace && styles.mailSegmentActive,
            pressed && styles.pressed,
          ]}>
          <TopNavIcon
            color={palette.ink}
            fallback="[]"
            name={{ ios: 'envelope.fill', android: 'mail', web: 'mail' }}
          />
        </Pressable>
      </View>

      <Pressable
        accessibilityLabel="Open direct messages"
        onPress={() => {
          if (activeThread) {
            router.push({
              pathname: '/chat/[threadId]',
              params: { threadId: activeThread.id },
            });
            return;
          }

          router.push('/inbox' as Href);
        }}
        style={({ pressed }) => [
          styles.edgeButton,
          inChatSpace && styles.chatButtonActive,
          pressed && styles.pressed,
        ]}>
        <TopNavIcon
          color={palette.ink}
          fallback="()"
          name={{ ios: 'text.bubble.fill', android: 'chat_bubble', web: 'chat_bubble' }}
        />
        {unreadCount > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{dmBadge}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  edgeButton: {
    width: 52,
    height: 52,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 26,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
    boxShadow: cardShadow,
  },
  edgeButtonActive: {
    backgroundColor: palette.lime,
  },
  chatButtonActive: {
    backgroundColor: palette.blush,
  },
  segmentedRail: {
    flex: 1,
    maxWidth: 176,
    flexDirection: 'row',
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: layout.pillRadius,
    backgroundColor: palette.ink,
    padding: 4,
    overflow: 'hidden',
    borderCurve: 'continuous',
    boxShadow: cardShadow,
  },
  segmentButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.pillRadius,
  },
  segmentDivider: {
    marginRight: 4,
  },
  segmentButtonActive: {
    backgroundColor: palette.ink,
  },
  mailSegment: {
    backgroundColor: palette.card,
  },
  mailSegmentActive: {
    backgroundColor: palette.butter,
  },
  segmentMark: {
    fontFamily: fonts.display,
    color: palette.card,
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '800',
  },
  segmentMarkActive: {
    color: palette.card,
  },
  iconFallback: {
    fontFamily: fonts.body,
    fontSize: 18,
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -2,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 5,
    borderWidth: layout.outlineWidth,
    borderColor: palette.card,
    borderRadius: 12,
    backgroundColor: '#ff2d2d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: fonts.body,
    color: palette.card,
    fontSize: 11,
    fontWeight: '800',
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '0px 0px 0px 0px rgba(28, 28, 25, 0)',
  },
});
