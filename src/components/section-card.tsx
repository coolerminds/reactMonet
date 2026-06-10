import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cardShadow, fonts, layout, palette } from '@/lib/theme';

type SectionCardProps = React.PropsWithChildren<{
  accent?: 'blush' | 'card' | 'lime' | 'mint' | 'sky' | 'wash';
  description?: string;
  title?: string;
}>;

export function SectionCard({
  accent = 'card',
  children,
  description,
  title,
}: SectionCardProps) {
  return (
    <View style={[styles.card, { backgroundColor: palette[accent] }]}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 22,
    padding: 18,
    gap: 14,
    borderCurve: 'continuous',
    boxShadow: cardShadow,
    transform: [{ rotate: '-0.6deg' }],
  },
  header: {
    gap: 6,
  },
  title: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 24,
    fontWeight: '800',
  },
  description: {
    fontFamily: fonts.mono,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
});
