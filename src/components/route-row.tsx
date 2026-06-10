import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cardShadow, fonts, layout, palette } from '@/lib/theme';

type RouteRowProps = {
  description: string;
  onPress: () => void;
  title: string;
};

export function RouteRow({ description, onPress, title }: RouteRowProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Text style={styles.chevron}>Open</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 20,
    backgroundColor: palette.card,
    padding: 16,
    borderCurve: 'continuous',
    boxShadow: cardShadow,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  description: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontFamily: fonts.mono,
    color: palette.berry,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '0px 0px 0px 0px rgba(28, 28, 25, 0)',
  },
});
