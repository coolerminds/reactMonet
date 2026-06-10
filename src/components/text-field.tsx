import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { fonts, layout, palette } from '@/lib/theme';

type TextFieldProps = TextInputProps & {
  label: string;
  multiline?: boolean;
};

export function TextField({ label, multiline = false, style, ...props }: TextFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        multiline={multiline}
        placeholderTextColor="#8a8377"
        style={[styles.input, multiline && styles.multilineInput, style]}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 18,
    backgroundColor: palette.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 108,
  },
});

