import React from 'react';
import { StyleSheet, View } from 'react-native';

import { TextField } from '@/components/text-field';
import { fonts, layout, palette } from '@/lib/theme';
import { PromptCard } from '@/types/models';

type PromptEditorCardProps = {
  onChange: (prompt: PromptCard) => void;
  prompt: PromptCard;
};

export function PromptEditorCard({ onChange, prompt }: PromptEditorCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.emojiRow}>
        <TextField
          label="Emoji"
          maxLength={4}
          onChangeText={(emoji) => onChange({ ...prompt, emoji })}
          style={styles.emojiInput}
          value={prompt.emoji}
        />
      </View>
      <TextField
        label="Prompt title"
        onChangeText={(title) => onChange({ ...prompt, title })}
        value={prompt.title}
      />
      <TextField
        label="Prompt detail"
        multiline
        onChangeText={(body) => onChange({ ...prompt, body })}
        value={prompt.body}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: layout.outlineWidth,
    borderColor: palette.border,
    borderRadius: 24,
    backgroundColor: palette.card,
    padding: 16,
    gap: 12,
    borderCurve: 'continuous',
  },
  emojiRow: {
    maxWidth: 88,
  },
  emojiInput: {
    textAlign: 'center',
    fontFamily: fonts.display,
    fontSize: 24,
  },
});
