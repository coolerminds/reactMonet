import { appConfig, hasAiBackend } from '@/lib/env';
import { DatingProfile, MatchThread } from '@/types/models';

type ReplySuggestionInput = {
  profile: DatingProfile;
  thread: MatchThread;
};

function buildFallbackReplies({ profile, thread }: ReplySuggestionInput) {
  const latestText = [...thread.messages]
    .reverse()
    .find((message) => message.kind === 'text' && message.text)?.text;

  return [
    `That seriously made me smile. What should I draw for you next, ${profile.name}?`,
    latestText
      ? `I’m into that. Tell me more about “${latestText.slice(0, 28)}${latestText.length > 28 ? '…' : ''}”.`
      : `Your prompt was elite. Want a second sketch with a wilder vibe?`,
    `Trade me one tiny chaotic fact about you and I’ll send another doodle.`,
  ];
}

export async function requestReplySuggestions(input: ReplySuggestionInput) {
  if (!hasAiBackend()) {
    return buildFallbackReplies(input);
  }

  const response = await fetch(`${appConfig.aiBaseUrl}/ai/reply-suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      profile: {
        name: input.profile.name,
        vibe: input.profile.vibe,
        prompts: input.profile.prompts,
      },
      messages: input.thread.messages,
    }),
  });

  if (!response.ok) {
    return buildFallbackReplies(input);
  }

  const payload = (await response.json()) as { suggestions?: string[] };
  return payload.suggestions?.slice(0, 3) ?? buildFallbackReplies(input);
}

export function getAiSetupState() {
  return {
    ready: hasAiBackend(),
    mode: hasAiBackend() ? 'server' : 'demo',
    description: hasAiBackend()
      ? 'Photo remixes and reply helpers will call your secure AI backend.'
      : 'AI is in demo mode. Add EXPO_PUBLIC_AI_BASE_URL and proxy xAI from the server side.',
  };
}

