import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

import { palette } from '@/lib/theme';

export function PaperBackdrop() {
  const { height } = useWindowDimensions();
  const backdropHeight = Math.max(height * 2, 1400);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Svg height={backdropHeight} style={StyleSheet.absoluteFill} width="100%">
        <Defs>
          <Pattern height={36} id="paperDots" patternUnits="userSpaceOnUse" width={36}>
            <Circle cx={18} cy={18} fill={palette.dot} r={1.35} />
          </Pattern>
        </Defs>
        <Rect fill={palette.canvas} height={backdropHeight} width="100%" x={0} y={0} />
        <Rect fill="url(#paperDots)" height={backdropHeight} width="100%" x={0} y={0} />
      </Svg>

      <View style={[styles.glow, styles.topGlow]} />
      <View style={[styles.glow, styles.bottomGlow]} />
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 999,
    opacity: 0.18,
  },
  topGlow: {
    top: 40,
    right: -72,
    backgroundColor: palette.lime,
  },
  bottomGlow: {
    left: -84,
    bottom: 120,
    backgroundColor: palette.blush,
  },
});
