import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts, layout, palette } from '@/lib/theme';

type ChipGroupProps = {
  label: string;
  multiple?: boolean;
  onChange: (selected: string[]) => void;
  options: string[];
  selected: string[];
};

export function ChipGroup({
  label,
  multiple = true,
  onChange,
  options,
  selected,
}: ChipGroupProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <Pressable
              key={option}
              onPress={() => {
                if (multiple) {
                  onChange(
                    active
                      ? selected.filter((item) => item !== option)
                      : [...selected, option],
                  );
                  return;
                }

                onChange(active ? [] : [option]);
              }}
              style={({ pressed }) => [
                styles.chip,
                active && styles.chipActive,
                pressed && styles.pressed,
              ]}>
              <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 10,
  },
  label: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: layout.pillRadius,
    backgroundColor: palette.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chipActive: {
    backgroundColor: palette.lime,
  },
  chipLabel: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  chipLabelActive: {
    color: palette.ink,
  },
  pressed: {
    opacity: 0.72,
  },
});
