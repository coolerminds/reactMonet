import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppTopNav } from '@/components/app-top-nav';
import { PaperBackdrop } from '@/components/paper-backdrop';
import { cardShadow, fonts, layout, palette } from '@/lib/theme';

type ScreenShellProps = React.PropsWithChildren<{
  badge: string;
  showTopNav?: boolean;
  subtitle: string;
  title: string;
}>;

export function ScreenShell({
  badge,
  children,
  showTopNav = true,
  subtitle,
  title,
}: ScreenShellProps) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contentContainer}
      style={styles.scrollView}>
      <PaperBackdrop />
      {showTopNav ? <AppTopNav /> : null}
      <View style={styles.heroBlock}>
        <View style={styles.titleSticker}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.badge}>{badge}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <View style={styles.stack}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: palette.canvas,
  },
  contentContainer: {
    padding: layout.screenPadding,
    paddingBottom: layout.tabBarInset,
    gap: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  heroBlock: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 2,
  },
  titleSticker: {
    alignSelf: 'stretch',
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 28,
    backgroundColor: palette.card,
    paddingHorizontal: 20,
    paddingVertical: 20,
    transform: [{ rotate: '-1deg' }],
    boxShadow: cardShadow,
  },
  stack: {
    gap: 16,
  },
  title: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '800',
    textAlign: 'center',
  },
  badge: {
    fontFamily: fonts.mono,
    color: palette.cobalt,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: fonts.mono,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
