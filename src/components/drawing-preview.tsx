import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { cardShadow, layout, palette } from '@/lib/theme';
import { DrawingPost, DrawingStroke } from '@/types/models';

type DrawingPreviewProps = {
  compact?: boolean;
  drawing: DrawingPost;
  height?: number;
};

function makePath(stroke: DrawingStroke, width: number, height: number) {
  return stroke.points
    .map((point, index) => {
      const x = point.x * width;
      const y = point.y * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export function DrawingPreview({ compact = false, drawing, height = 240 }: DrawingPreviewProps) {
  const width = compact ? height * 0.9 : height * 0.82;

  return (
    <View
      style={[
        styles.frame,
        {
          backgroundColor: drawing.backgroundColor,
          boxShadow: compact ? undefined : cardShadow,
          width,
          height,
        },
      ]}>
      <Svg width={width} height={height}>
        {drawing.strokes.map((stroke) => (
          <Path
            d={makePath(stroke, width, height)}
            fill="none"
            key={stroke.id}
            stroke={stroke.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={Math.max(2, stroke.width * Math.min(width, height))}
          />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: 24,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
});
