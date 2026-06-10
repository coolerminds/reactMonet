import React, { startTransition } from 'react';

import { seedProfiles, seedThreads, seedViewer } from '@/data/mock-data';
import { requestReplySuggestions } from '@/lib/ai';
import { tapLight, tapSuccess } from '@/lib/haptics';
import {
  DatingProfile,
  DiscoveryPreferences,
  DrawingStroke,
  MatchThread,
  NotificationPreferences,
  PromptCard,
  SafetyPreferences,
  ViewerProfile,
} from '@/types/models';

type SendDrawingInput = {
  backgroundColor: string;
  prompt: string;
  strokes: DrawingStroke[];
  title: string;
};

type AppStateValue = {
  profiles: DatingProfile[];
  viewer: ViewerProfile;
  threads: MatchThread[];
  currentProfile: DatingProfile | null;
  aiRefreshingThreadId: string | null;
  passCurrentProfile: () => void;
  sendDrawingToProfile: (profileId: string, input: SendDrawingInput) => string;
  sendTextMessage: (threadId: string, text: string) => void;
  markThreadRead: (threadId: string) => void;
  refreshReplySuggestions: (threadId: string) => Promise<string[]>;
  connectDemoGoogle: () => void;
  selectViewerVariant: (variantId: string) => void;
  toggleOriginalReveal: () => void;
  updateViewerProfile: (
    patch: Partial<
      Pick<
        ViewerProfile,
        'age' | 'bio' | 'gender' | 'location' | 'name' | 'occupation' | 'pronouns' | 'tagline' | 'vibe'
      >
    >,
  ) => void;
  updateViewerPrompt: (index: number, prompt: PromptCard) => void;
  toggleViewerInterest: (interest: string) => void;
  updateDiscoveryPreferences: (patch: Partial<DiscoveryPreferences>) => void;
  toggleNotificationPreference: (key: keyof NotificationPreferences) => void;
  toggleSafetyPreference: (key: keyof SafetyPreferences) => void;
  completeOnboardingStep: (step: keyof ViewerProfile['onboarding']) => void;
  getProfileById: (profileId: string) => DatingProfile | undefined;
  getThreadById: (threadId: string) => MatchThread | undefined;
};

const AppStateContext = React.createContext<AppStateValue | null>(null);

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const createId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

function parseAgeRangeLabel(label: string) {
  const match = label.match(/(\d+)\s*-\s*(\d+)/);

  if (!match) {
    return { min: 18, max: 99 };
  }

  return {
    min: Number(match[1]),
    max: Number(match[2]),
  };
}

export function AppStateProvider({ children }: React.PropsWithChildren) {
  const [profiles] = React.useState(() => deepClone(seedProfiles));
  const [viewer, setViewer] = React.useState(() => deepClone(seedViewer));
  const [threads, setThreads] = React.useState(() => deepClone(seedThreads));
  const [activeProfileIndex, setActiveProfileIndex] = React.useState(0);
  const [aiRefreshingThreadId, setAiRefreshingThreadId] = React.useState<string | null>(null);

  const filteredProfiles = React.useMemo(() => {
    const { max, min } = parseAgeRangeLabel(viewer.discovery.ageRangeLabel);
    const showMe = viewer.discovery.showMe;

    return profiles.filter((profile) => {
      const genderMatch = showMe.length === 0 || showMe.includes(profile.gender);
      const ageMatch = profile.age >= min && profile.age <= max;

      return genderMatch && ageMatch;
    });
  }, [profiles, viewer.discovery.ageRangeLabel, viewer.discovery.showMe]);

  const currentProfile =
    filteredProfiles.length > 0 ? filteredProfiles[activeProfileIndex % filteredProfiles.length] : null;

  const getProfileById = (profileId: string) => profiles.find((profile) => profile.id === profileId);

  const getThreadById = (threadId: string) => threads.find((thread) => thread.id === threadId);

  const passCurrentProfile = React.useEffectEvent(() => {
    void tapLight();
    setActiveProfileIndex((current) => current + 1);
  });

  const sendDrawingToProfile = React.useEffectEvent((profileId: string, input: SendDrawingInput) => {
    const profile = getProfileById(profileId);
    const drawingId = createId('drawing');
    const threadId = threads.find((thread) => thread.profileId === profileId)?.id ?? createId('thread');

    if (!profile) {
      return threadId;
    }

    setThreads((currentThreads) => {
      const outgoingMessage = {
        id: createId('message'),
        author: 'me' as const,
        kind: 'drawing' as const,
        createdAt: 'Just now',
        drawing: {
          id: drawingId,
          title: input.title.trim() || 'Untitled sketch',
          prompt: input.prompt,
          artistName: viewer.name,
          note: `sent to ${profile.name}`,
          backgroundColor: input.backgroundColor,
          strokes: input.strokes,
        },
      };

      const existing = currentThreads.find((thread) => thread.profileId === profileId);

      if (existing) {
        return currentThreads.map((thread) =>
          thread.id === existing.id
            ? {
                ...thread,
                status: 'chatting',
                unreadCount: 0,
                lastActivityLabel: 'now',
                latestSnippet: `You drew ${profile.name} something new`,
                messages: [...thread.messages, outgoingMessage],
              }
            : thread,
        );
      }

      return [
        {
          id: threadId,
          profileId,
          unreadCount: 0,
          latestSnippet: `You sent ${profile.name} a drawing`,
          lastActivityLabel: 'now',
          status: 'drawing-sent',
          replySuggestions: [
            `I made this with you in mind. Too much?`,
            `If you send one back, I’ll judge it lovingly.`,
            `No pressure, but I’m very proud of this masterpiece.`,
          ],
          messages: [outgoingMessage],
        },
        ...currentThreads,
      ];
    });

    setActiveProfileIndex((current) => current + 1);
    void tapSuccess();
    return threadId;
  });

  const sendTextMessage = React.useEffectEvent((threadId: string, text: string) => {
    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    void tapLight();
    setThreads((currentThreads) =>
      currentThreads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              status: 'chatting',
              unreadCount: 0,
              latestSnippet: trimmed,
              lastActivityLabel: 'now',
              messages: [
                ...thread.messages,
                {
                  id: createId('message'),
                  author: 'me',
                  kind: 'text',
                  text: trimmed,
                  createdAt: 'Just now',
                },
              ],
            }
          : thread,
      ),
    );
  });

  const markThreadRead = React.useEffectEvent((threadId: string) => {
    setThreads((currentThreads) => {
      if (!currentThreads.some((thread) => thread.id === threadId && thread.unreadCount > 0)) {
        return currentThreads;
      }

      return currentThreads.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              unreadCount: 0,
            }
          : thread,
      );
    });
  });

  const refreshReplySuggestions = React.useEffectEvent(async (threadId: string) => {
    const thread = getThreadById(threadId);

    if (!thread) {
      return [];
    }

    const profile = getProfileById(thread.profileId);

    if (!profile) {
      return [];
    }

    setAiRefreshingThreadId(threadId);
    const suggestions = await requestReplySuggestions({ profile, thread });

    startTransition(() => {
      setThreads((currentThreads) =>
        currentThreads.map((currentThread) =>
          currentThread.id === threadId
            ? {
                ...currentThread,
                replySuggestions: suggestions,
              }
            : currentThread,
        ),
      );
    });
    setAiRefreshingThreadId(null);

    return suggestions;
  });

  const connectDemoGoogle = React.useEffectEvent(() => {
    void tapSuccess();
    setViewer((currentViewer) => ({
      ...currentViewer,
      connectedEmail: 'demo.user@monet.app',
    }));
  });

  const selectViewerVariant = React.useEffectEvent((variantId: string) => {
    void tapLight();
    setViewer((currentViewer) => ({
      ...currentViewer,
      activePhotoVariantId: variantId,
    }));
  });

  const toggleOriginalReveal = React.useEffectEvent(() => {
    void tapLight();
    setViewer((currentViewer) => ({
      ...currentViewer,
      revealOriginalPhotos: !currentViewer.revealOriginalPhotos,
    }));
  });

  const updateViewerProfile = React.useEffectEvent(
    (
      patch: Partial<
        Pick<
          ViewerProfile,
          'age' | 'bio' | 'gender' | 'location' | 'name' | 'occupation' | 'pronouns' | 'tagline' | 'vibe'
        >
      >,
    ) => {
      void tapLight();
      setViewer((currentViewer) => ({
        ...currentViewer,
        ...patch,
      }));
    },
  );

  const updateViewerPrompt = React.useEffectEvent((index: number, prompt: PromptCard) => {
    void tapLight();
    setViewer((currentViewer) => ({
      ...currentViewer,
      prompts: currentViewer.prompts.map((item, itemIndex) => (itemIndex === index ? prompt : item)),
    }));
  });

  const toggleViewerInterest = React.useEffectEvent((interest: string) => {
    void tapLight();
    setViewer((currentViewer) => {
      const exists = currentViewer.interests.includes(interest);

      return {
        ...currentViewer,
        interests: exists
          ? currentViewer.interests.filter((item) => item !== interest)
          : [...currentViewer.interests, interest],
      };
    });
  });

  const updateDiscoveryPreferences = React.useEffectEvent((patch: Partial<DiscoveryPreferences>) => {
    void tapLight();
    setViewer((currentViewer) => ({
      ...currentViewer,
      discovery: {
        ...currentViewer.discovery,
        ...patch,
      },
    }));
  });

  const toggleNotificationPreference = React.useEffectEvent(
    (key: keyof NotificationPreferences) => {
      void tapLight();
      setViewer((currentViewer) => ({
        ...currentViewer,
        notifications: {
          ...currentViewer.notifications,
          [key]: !currentViewer.notifications[key],
        },
      }));
    },
  );

  const toggleSafetyPreference = React.useEffectEvent((key: keyof SafetyPreferences) => {
    void tapLight();
    setViewer((currentViewer) => ({
      ...currentViewer,
      safety: {
        ...currentViewer.safety,
        [key]: !currentViewer.safety[key],
      },
    }));
  });

  const completeOnboardingStep = React.useEffectEvent((step: keyof ViewerProfile['onboarding']) => {
    setViewer((currentViewer) => ({
      ...currentViewer,
      onboarding: {
        ...currentViewer.onboarding,
        [step]: true,
      },
    }));
  });

  return (
    <AppStateContext
      value={{
        profiles,
        viewer,
        threads,
        currentProfile,
        aiRefreshingThreadId,
        passCurrentProfile,
        sendDrawingToProfile,
        sendTextMessage,
        markThreadRead,
        refreshReplySuggestions,
        connectDemoGoogle,
        selectViewerVariant,
        toggleOriginalReveal,
        updateViewerProfile,
        updateViewerPrompt,
        toggleViewerInterest,
        updateDiscoveryPreferences,
        toggleNotificationPreference,
        toggleSafetyPreference,
        completeOnboardingStep,
        getProfileById,
        getThreadById,
      }}>
      {children}
    </AppStateContext>
  );
}

export function useAppState() {
  const value = React.use(AppStateContext);

  if (!value) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }

  return value;
}
