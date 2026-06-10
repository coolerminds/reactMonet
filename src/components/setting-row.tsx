import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { fonts, palette } from '@/lib/theme';

type SettingRowProps = {
  description: string;
  onValueChange: (value: boolean) => void;
  title: string;
  value: boolean;
};

export function SettingRow({
  description,
  onValueChange,
  title,
  value,
}: SettingRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Switch onValueChange={onValueChange} trackColor={{ true: palette.cobalt }} value={value} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
});

