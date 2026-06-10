import React from 'react';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { DrawingPreview } from '@/components/drawing-preview';
import { ScreenShell } from '@/components/screen-shell';
import { fonts, layout, palette } from '@/lib/theme';
import { useAppState } from '@/state/app-state';

function readParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default function ChatScreen() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const {
    aiRefreshingThreadId,
    getProfileById,
    getThreadById,
    markThreadRead,
    refreshReplySuggestions,
    sendTextMessage,
  } = useAppState();
  const [message, setMessage] = React.useState('');

  const thread = getThreadById(readParam(threadId) ?? '');

  React.useEffect(() => {
    if (!thread) {
      return;
    }

    markThreadRead(thread.id);
  }, [markThreadRead, thread]);

  if (!thread) {
    return (
      <ScreenShell badge="chat" subtitle="That thread could not be loaded." title="Conversation missing">
        <View style={styles.fallbackCard}>
          <Text style={styles.fallbackText}>Head back to the inbox and open another drawing thread.</Text>
        </View>
      </ScreenShell>
    );
  }

  const profile = getProfileById(thread.profileId);
  const heroPhoto = profile?.photos.find((photo) => photo.availability === 'public') ?? profile?.photos[0];
  const loadingSuggestions = aiRefreshingThreadId === thread.id;

  return (
    <ScreenShell
      badge="chat"
      subtitle="Reply with words, another drawing, or let the AI suggest an opener that still sounds human."
      title={profile ? `Talking with ${profile.name}` : 'Conversation'}>
      {profile && heroPhoto ? (
        <View style={styles.profileStrip}>
          <View style={styles.avatar}>
            <Image contentFit="cover" source={{ uri: heroPhoto.uri }} style={StyleSheet.absoluteFill} />
          </View>
          <View style={styles.profileMeta}>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileVibe}>{profile.vibe}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.timeline}>
        {thread.messages.map((item) => {
          if (item.kind === 'drawing' && item.drawing) {
            return (
              <View key={item.id} style={styles.drawingMessage}>
                <DrawingPreview drawing={item.drawing} height={220} />
                <Text style={styles.drawingTitle}>{item.drawing.title}</Text>
                <Text style={styles.drawingNote}>
                  {item.drawing.artistName} · {item.createdAt}
                </Text>
              </View>
            );
          }

          return (
            <View
              key={item.id}
              style={[
                styles.textBubble,
                item.author === 'me' ? styles.meBubble : styles.themBubble,
              ]}>
              <Text
                style={[
                  styles.bubbleText,
                  item.author === 'me' ? styles.meBubbleText : styles.themBubbleText,
                ]}>
                {item.text}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.suggestionsCard}>
        <View style={styles.suggestionsHeader}>
          <Text style={styles.suggestionsTitle}>Grok reply suggestions</Text>
          <Pressable
            onPress={() => {
              void refreshReplySuggestions(thread.id);
            }}
            style={({ pressed }) => [styles.refreshButton, pressed && styles.pressed]}>
            <Text style={styles.refreshButtonText}>{loadingSuggestions ? 'Thinking…' : 'Refresh'}</Text>
          </Pressable>
        </View>

        <View style={styles.suggestionsWrap}>
          {thread.replySuggestions.map((suggestion) => (
            <Pressable
              key={suggestion}
              onPress={() => setMessage(suggestion)}
              style={({ pressed }) => [styles.suggestionChip, pressed && styles.pressed]}>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.composer}>
        <TextInput
          onChangeText={setMessage}
          placeholder="Write a message..."
          placeholderTextColor="#847d70"
          style={styles.composerInput}
          value={message}
        />
        <Pressable
          onPress={() => {
            sendTextMessage(thread.id, message);
            setMessage('');
          }}
          style={({ pressed }) => [styles.sendChip, pressed && styles.pressed]}>
          <Text style={styles.sendChipText}>Send</Text>
        </Pressable>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  fallbackCard: {
    borderRadius: 28,
    backgroundColor: palette.card,
    padding: 20,
  },
  fallbackText: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 15,
  },
  profileStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 24,
    backgroundColor: palette.card,
    padding: 14,
  },
  avatar: {
    width: 66,
    height: 66,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
  },
  profileMeta: {
    flex: 1,
    gap: 3,
  },
  profileName: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 24,
    fontWeight: '800',
  },
  profileVibe: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  timeline: {
    gap: 14,
  },
  drawingMessage: {
    alignItems: 'center',
    gap: 8,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 30,
    backgroundColor: palette.card,
    padding: 16,
  },
  drawingTitle: {
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  drawingNote: {
    fontFamily: fonts.body,
    color: palette.muted,
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  textBubble: {
    maxWidth: '84%',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
  },
  meBubble: {
    alignSelf: 'flex-end',
    backgroundColor: palette.lime,
  },
  themBubble: {
    alignSelf: 'flex-start',
    backgroundColor: palette.card,
  },
  bubbleText: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  meBubbleText: {
    color: palette.ink,
  },
  themBubbleText: {
    color: palette.ink,
  },
  suggestionsCard: {
    borderRadius: 28,
    backgroundColor: palette.blush,
    padding: 16,
    gap: 12,
  },
  suggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  suggestionsTitle: {
    flex: 1,
    fontFamily: fonts.display,
    color: palette.ink,
    fontSize: 22,
    fontWeight: '700',
  },
  refreshButton: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: layout.pillRadius,
    backgroundColor: palette.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  refreshButtonText: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  suggestionChip: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 20,
    backgroundColor: palette.card,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  suggestionText: {
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 13,
    lineHeight: 18,
  },
  composer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  composerInput: {
    flex: 1,
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 20,
    backgroundColor: palette.card,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: fonts.body,
    color: palette.ink,
    fontSize: 14,
  },
  sendChip: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 20,
    backgroundColor: palette.cobalt,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  sendChipText: {
    fontFamily: fonts.body,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
});
