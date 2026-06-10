import React from 'react';
import { SymbolView } from 'expo-symbols';
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { fonts, layout, palette } from '@/lib/theme';
import { DrawingPoint, DrawingStroke } from '@/types/models';

type DrawingCanvasProps = {
  backgroundColor?: string;
  onChange: (payload: { backgroundColor: string; strokes: DrawingStroke[] }) => void;
  prompt: string;
};

const brushColors = ['#111111', '#ffffff', '#f7e836', '#ff8c29', '#f25f2b', '#394dff', '#4f9527'];
const backgroundColors = [palette.butter, '#f7ffd6', '#dff1ff', '#ffe4ef', '#f4eee4', '#ece7ff'];
const brushSizes = [
  { id: 'small', dotSize: 8, label: 'S', width: 0.012 },
  { id: 'medium', dotSize: 12, label: 'M', width: 0.018 },
  { id: 'large', dotSize: 16, label: 'L', width: 0.026 },
  { id: 'xlarge', dotSize: 20, label: 'XL', width: 0.036 },
] as const;

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

function getSwatchLabel(color: string) {
  switch (color.toLowerCase()) {
    case '#111111':
      return 'black';
    case '#ffffff':
      return 'white';
    case '#f7e836':
      return 'yellow';
    case '#ff8c29':
      return 'orange';
    case '#f25f2b':
      return 'sunset orange';
    case '#394dff':
      return 'blue';
    case '#4f9527':
      return 'green';
    case '#f7ffd6':
      return 'mint';
    case '#dff1ff':
      return 'sky';
    case '#ffe4ef':
      return 'blush';
    case '#f4eee4':
      return 'sand';
    case '#ece7ff':
      return 'lavender';
    default:
      return 'butter';
  }
}

function toPath(stroke: DrawingStroke, width: number, height: number) {
  return stroke.points
    .map((point, index) => {
      const x = point.x * width;
      const y = point.y * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

export function DrawingCanvas({
  backgroundColor = palette.butter,
  onChange,
  prompt,
}: DrawingCanvasProps) {
  const [strokes, setStrokes] = React.useState<DrawingStroke[]>([]);
  const [currentStroke, setCurrentStroke] = React.useState<DrawingStroke | null>(null);
  const [activeColor, setActiveColor] = React.useState('#111111');
  const [activeBrushWidth, setActiveBrushWidth] = React.useState(0.018);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = React.useState(backgroundColor);
  const [canvasSize, setCanvasSize] = React.useState({ width: 0, height: 0 });

  const sizeRef = React.useRef(canvasSize);
  const colorRef = React.useRef(activeColor);
  const brushWidthRef = React.useRef(activeBrushWidth);
  const currentStrokeRef = React.useRef<DrawingStroke | null>(null);

  const emitChange = React.useEffectEvent(onChange);

  React.useEffect(() => {
    sizeRef.current = canvasSize;
  }, [canvasSize]);

  React.useEffect(() => {
    colorRef.current = activeColor;
  }, [activeColor]);

  React.useEffect(() => {
    brushWidthRef.current = activeBrushWidth;
  }, [activeBrushWidth]);

  React.useEffect(() => {
    emitChange({
      backgroundColor: canvasBackgroundColor,
      strokes,
    });
  }, [canvasBackgroundColor, strokes]);

  const beginStroke = React.useEffectEvent((point: DrawingPoint) => {
    const nextStroke = {
      id: createId('stroke'),
      color: colorRef.current,
      width: brushWidthRef.current,
      points: [point],
    } satisfies DrawingStroke;

    currentStrokeRef.current = nextStroke;
    setCurrentStroke(nextStroke);
  });

  const extendStroke = React.useEffectEvent((point: DrawingPoint) => {
    const stroke = currentStrokeRef.current;

    if (!stroke) {
      return;
    }

    const nextStroke = {
      ...stroke,
      points: [...stroke.points, point],
    };

    currentStrokeRef.current = nextStroke;
    setCurrentStroke(nextStroke);
  });

  const finishStroke = React.useEffectEvent(() => {
    const stroke = currentStrokeRef.current;

    if (!stroke) {
      return;
    }

    currentStrokeRef.current = null;
    setCurrentStroke(null);
    setStrokes((current) => [...current, stroke]);
  });

  const toPoint = React.useEffectEvent((x: number, y: number) => {
    const width = sizeRef.current.width || 1;
    const height = sizeRef.current.height || 1;

    return {
      x: Math.min(1, Math.max(0, x / width)),
      y: Math.min(1, Math.max(0, y / height)),
    };
  });

  const [panResponder] = React.useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        beginStroke(toPoint(event.nativeEvent.locationX, event.nativeEvent.locationY));
      },
      onPanResponderMove: (event) => {
        extendStroke(toPoint(event.nativeEvent.locationX, event.nativeEvent.locationY));
      },
      onPanResponderRelease: finishStroke,
      onPanResponderTerminate: finishStroke,
    }),
  );

  const handleLayout = React.useEffectEvent((event: LayoutChangeEvent) => {
    setCanvasSize({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.toolbar}>
        <Text style={styles.toolbarLabel}>Sketch the opener</Text>
        <View style={styles.toolbarButtons}>
          <Pressable
            onPress={() => {
              setStrokes((current) => current.slice(0, -1));
            }}
            style={({ pressed }) => [styles.toolButton, pressed && styles.pressed]}>
            <Text style={styles.toolButtonText}>Undo</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setStrokes([]);
              setCurrentStroke(null);
              currentStrokeRef.current = null;
            }}
            style={({ pressed }) => [styles.toolButton, pressed && styles.pressed]}>
            <Text style={styles.toolButtonText}>Clear</Text>
          </Pressable>
        </View>
      </View>

      <View
        onLayout={handleLayout}
        style={[styles.canvasSurface, { backgroundColor: canvasBackgroundColor }]}
        {...panResponder.panHandlers}>
        {!strokes.length && !currentStroke ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Draw something fast and personal.</Text>
            <Text style={styles.emptyBody}>{prompt}</Text>
          </View>
        ) : null}

        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          {strokes.map((stroke) => (
            <Path
              d={toPath(stroke, canvasSize.width, canvasSize.height)}
              fill="none"
              key={stroke.id}
              stroke={stroke.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={Math.max(2, stroke.width * Math.min(canvasSize.width, canvasSize.height))}
            />
          ))}
          {currentStroke ? (
            <Path
              d={toPath(currentStroke, canvasSize.width, canvasSize.height)}
              fill="none"
              stroke={currentStroke.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={Math.max(2, currentStroke.width * Math.min(canvasSize.width, canvasSize.height))}
            />
          ) : null}
        </Svg>
      </View>

      <View style={styles.controlsStack}>
        <View style={styles.controlRow}>
          <View style={styles.controlLabelRow}>
            <SymbolView
              fallback={<Text style={styles.controlEmoji}>✎</Text>}
              name={{ ios: 'paintbrush.fill', android: 'brush', web: 'brush' }}
              size={16}
              tintColor={palette.ink}
            />
            <Text style={styles.controlLabel}>Brush</Text>
          </View>
          <View style={styles.paletteRow}>
            {brushColors.map((color) => (
              <Pressable
                accessibilityLabel={`Brush color ${getSwatchLabel(color)}`}
                accessibilityRole="button"
                accessibilityState={{ selected: activeColor === color }}
                key={color}
                onPress={() => setActiveColor(color)}
                style={({ pressed }) => [
                  styles.swatch,
                  { backgroundColor: color, borderColor: color === '#ffffff' ? palette.border : color },
                  activeColor === color && styles.swatchActive,
                  pressed && styles.pressed,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.controlRow}>
          <View style={styles.controlLabelRow}>
            <SymbolView
              fallback={<Text style={styles.controlEmoji}>🪣</Text>}
              name={{ ios: 'paintpalette.fill', android: 'format_color_fill', web: 'format_color_fill' }}
              size={16}
              tintColor={palette.ink}
            />
            <Text style={styles.controlLabel}>Background</Text>
          </View>
          <View style={styles.paletteRow}>
            {backgroundColors.map((color) => (
              <Pressable
                accessibilityLabel={`Canvas background ${getSwatchLabel(color)}`}
                accessibilityRole="button"
                accessibilityState={{ selected: canvasBackgroundColor === color }}
                key={color}
                onPress={() => setCanvasBackgroundColor(color)}
                style={({ pressed }) => [
                  styles.swatch,
                  { backgroundColor: color, borderColor: palette.border },
                  canvasBackgroundColor === color && styles.swatchActive,
                  pressed && styles.pressed,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.controlRow}>
          <View style={styles.controlLabelRow}>
            <SymbolView
              fallback={<Text style={styles.controlEmoji}>🖌</Text>}
              name={{ ios: 'scribble.variable', android: 'edit', web: 'edit' }}
              size={16}
              tintColor={palette.ink}
            />
            <Text style={styles.controlLabel}>Size</Text>
          </View>
          <View style={styles.sizeRow}>
            {brushSizes.map((brushSize) => (
              <Pressable
                accessibilityLabel={`Brush size ${brushSize.id}`}
                accessibilityRole="button"
                accessibilityState={{ selected: activeBrushWidth === brushSize.width }}
                key={brushSize.id}
                onPress={() => setActiveBrushWidth(brushSize.width)}
                style={({ pressed }) => [
                  styles.sizeChip,
                  activeBrushWidth === brushSize.width && styles.sizeChipActive,
                  pressed && styles.pressed,
                ]}>
                <View
                  style={[
                    styles.sizeDot,
                    {
                      width: brushSize.dotSize,
                      height: brushSize.dotSize,
                    },
                  ]}
                />
                <Text style={styles.sizeLabel}>{brushSize.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 14,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  toolbarLabel: {
    flex: 1,
    fontFamily: fonts.display,
    fontSize: 18,
    fontWeight: '700',
    color: palette.ink,
  },
  toolbarButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  toolButton: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: layout.pillRadius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: palette.card,
    borderCurve: 'continuous',
  },
  toolButtonText: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 13,
    fontWeight: '700',
  },
  canvasSurface: {
    height: 360,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 30,
    overflow: 'hidden',
    borderCurve: 'continuous',
  },
  emptyState: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  emptyBody: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  paletteRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  controlsStack: {
    gap: 12,
  },
  controlRow: {
    gap: 10,
  },
  controlLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  controlEmoji: {
    color: palette.ink,
    fontSize: 16,
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: layout.outlineWidth,
  },
  swatchActive: {
    transform: [{ scale: 1.1 }],
  },
  sizeRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  sizeChip: {
    minWidth: 58,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: layout.pillRadius,
    backgroundColor: palette.card,
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderCurve: 'continuous',
  },
  sizeChipActive: {
    backgroundColor: palette.lime,
  },
  sizeDot: {
    borderRadius: 999,
    backgroundColor: palette.ink,
  },
  sizeLabel: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
});
