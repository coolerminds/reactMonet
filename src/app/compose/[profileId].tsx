import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { DrawingCanvas } from '@/components/drawing-canvas';
import { PaperBackdrop } from '@/components/paper-backdrop';
import { cardShadow, fonts, layout, palette } from '@/lib/theme';
import { useAppState } from '@/state/app-state';
import { DrawingStroke } from '@/types/models';

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function HeaderCircleButton({
  active = false,
  fallback,
  name,
  onPress,
}: {
  active?: boolean;
  fallback: string;
  name: Parameters<typeof SymbolView>[0]['name'];
  onPress?: () => void;
}) {
  const body = (
    <View style={[styles.headerCircle, active && styles.headerCircleActive]}>
      <SymbolView
        fallback={<Text style={styles.headerCircleFallback}>{fallback}</Text>}
        name={name}
        size={18}
        tintColor={palette.ink}
      />
    </View>
  );

  if (!onPress) {
    return body;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
      {body}
    </Pressable>
  );
}

export default function ComposeScreen() {
  const { profileId } = useLocalSearchParams<{ profileId: string }>();
  const { getProfileById, sendDrawingToProfile } = useAppState();
  const profile = getProfileById(readParam(profileId) ?? '');
  const [title, setTitle] = React.useState('');
  const [canvasState, setCanvasState] = React.useState<{ backgroundColor: string; strokes: DrawingStroke[] }>({
    backgroundColor: palette.card,
    strokes: [],
  });

  const closeCompose = React.useEffectEvent(() => {
    router.replace('/');
  });

  if (!profile) {
    return (
      <View style={styles.overlay}>
        <PaperBackdrop />
        <Pressable onPress={closeCompose} style={styles.scrim} />
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <HeaderCircleButton
              fallback="←"
              name={{ ios: 'arrow.uturn.backward', android: 'undo', web: 'undo' }}
              onPress={closeCompose}
            />
            <Text style={styles.sheetTitle}>Draw to flirt</Text>
            <View style={styles.headerActionRow}>
              <HeaderCircleButton
                fallback="✉"
                name={{ ios: 'message', android: 'chat_bubble', web: 'chat_bubble' }}
              />
              <HeaderCircleButton
                active
                fallback="✎"
                name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
              />
            </View>
          </View>

          <View style={styles.missingCard}>
            <Text style={styles.missingTitle}>Missing canvas</Text>
            <Text style={styles.missingText}>Go back to discover and pick a fresh profile.</Text>
          </View>
        </View>
      </View>
    );
  }

  const prompt = profile.prompts[0];
  const canSend = canvasState.strokes.length > 0;

  return (
    <View style={styles.overlay}>
      <PaperBackdrop />
      <Pressable onPress={closeCompose} style={styles.scrim} />

      <View style={styles.sheet}>
        <View style={styles.sheetHeader}>
          <HeaderCircleButton
            fallback="←"
            name={{ ios: 'arrow.uturn.backward', android: 'undo', web: 'undo' }}
            onPress={closeCompose}
          />
          <Text style={styles.sheetTitle}>Draw to flirt</Text>
          <View style={styles.headerActionRow}>
            <HeaderCircleButton
              fallback="✉"
              name={{ ios: 'message', android: 'chat_bubble', web: 'chat_bubble' }}
            />
            <HeaderCircleButton
              active
              fallback="✎"
              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.sheetContent}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}>
          <DrawingCanvas backgroundColor={palette.card} onChange={setCanvasState} prompt={prompt.body} />

          <View style={styles.metaCard}>
            <Text style={styles.inputLabel}>Title your doodle</Text>
            <TextInput
              onChangeText={setTitle}
              placeholder="butterfly with opinions"
              placeholderTextColor="#8c867b"
              style={styles.input}
              value={title}
            />
            <Text style={styles.promptLabel}>
              {prompt.emoji} {prompt.title}
            </Text>
            <Text style={styles.promptBody}>{prompt.body}</Text>
          </View>

          <Pressable
            disabled={!canSend}
            onPress={() => {
              const threadId = sendDrawingToProfile(profile.id, {
                backgroundColor: canvasState.backgroundColor,
                prompt: prompt.title,
                strokes: canvasState.strokes,
                title,
              });

              router.replace({
                pathname: '/chat/[threadId]',
                params: { threadId },
              });
            }}
            style={({ pressed }) => [
              styles.sendButton,
              !canSend && styles.sendButtonDisabled,
              pressed && canSend && styles.pressed,
            ]}>
            <SymbolView
              fallback={<Text style={styles.sendGlyphFallback}>▷</Text>}
              name={{ ios: 'paperplane.fill', android: 'send', web: 'send' }}
              size={16}
              tintColor={palette.cobalt}
            />
            <Text style={styles.sendButtonText}>{canSend ? 'Send Doodle' : 'Add a drawing first'}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(252, 249, 244, 0.62)',
    paddingHorizontal: 10,
    paddingTop: 54,
    paddingBottom: 96,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  sheet: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    backgroundColor: palette.canvas,
    boxShadow: cardShadow,
    overflow: 'hidden',
    maxHeight: '100%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#cbc4b9',
    backgroundColor: 'rgba(255,255,255,0.94)',
  },
  sheetTitle: {
    flex: 1,
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
  },
  headerActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  headerCircle: {
    width: 34,
    height: 34,
    borderWidth: 1.5,
    borderColor: palette.border,
    borderRadius: 10,
    backgroundColor: palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '2px 2px 0px 0px rgba(28, 28, 25, 1)',
  },
  headerCircleActive: {
    backgroundColor: palette.butter,
  },
  headerCircleFallback: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  sheetContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 16,
  },
  metaCard: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 22,
    backgroundColor: palette.card,
    padding: 16,
    gap: 10,
    boxShadow: cardShadow,
  },
  inputLabel: {
    fontFamily: fonts.mono,
    color: palette.cobalt,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 16,
    backgroundColor: palette.canvas,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 20,
    fontWeight: '700',
  },
  promptLabel: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  promptBody: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 18,
    backgroundColor: palette.lime,
    paddingVertical: 16,
    boxShadow: cardShadow,
  },
  sendButtonDisabled: {
    backgroundColor: palette.sky,
  },
  sendGlyphFallback: {
    color: palette.cobalt,
    fontSize: 16,
  },
  sendButtonText: {
    fontFamily: fonts.display,
    color: palette.cobalt,
    fontSize: 18,
    fontWeight: '700',
  },
  missingCard: {
    margin: 16,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 22,
    backgroundColor: palette.card,
    padding: 18,
    gap: 8,
    boxShadow: cardShadow,
  },
  missingTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 24,
    fontWeight: '800',
  },
  missingText: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 15,
    lineHeight: 20,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    boxShadow: '0px 0px 0px 0px rgba(28, 28, 25, 0)',
  },
});
