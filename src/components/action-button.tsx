import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { cardShadow, fonts, layout, palette } from '@/lib/theme';

type ActionButtonProps = {
  disabled?: boolean;
  label: string;
  onPress: () => void;
  tone?: 'primary' | 'secondary';
};

export function ActionButton({
  disabled = false,
  label,
  onPress,
  tone = 'primary',
}: ActionButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === 'primary' ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressed,
      ]}>
      <Text style={[styles.label, tone === 'primary' ? styles.primaryLabel : styles.secondaryLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderCurve: 'continuous',
    boxShadow: cardShadow,
  },
  primaryButton: {
    backgroundColor: palette.lime,
  },
  secondaryButton: {
    backgroundColor: palette.card,
  },
  disabledButton: {
    backgroundColor: palette.sky,
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: '700',
  },
  primaryLabel: {
    color: palette.ink,
  },
  secondaryLabel: {
    color: palette.ink,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '0px 0px 0px 0px rgba(28, 28, 25, 0)',
  },
});
