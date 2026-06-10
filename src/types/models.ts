export type DrawingPoint = {
  x: number;
  y: number;
};

export type DrawingStroke = {
  id: string;
  color: string;
  width: number;
  points: DrawingPoint[];
};

export type DrawingPost = {
  id: string;
  title: string;
  prompt: string;
  artistName: string;
  note: string;
  backgroundColor: string;
  strokes: DrawingStroke[];
};

export type PromptCard = {
  emoji: string;
  title: string;
  body: string;
};

export type GenderIdentity = 'Woman' | 'Man' | 'Non-binary';

export type DiscoveryPreferences = {
  ageRangeLabel: string;
  distanceLabel: string;
  showMe: GenderIdentity[];
  lookingFor: string[];
};

export type NotificationPreferences = {
  drawings: boolean;
  messages: boolean;
  remixReady: boolean;
  weeklyDigest: boolean;
};

export type SafetyPreferences = {
  blurOriginalsUntilMatch: boolean;
  requireDrawingBeforeChat: boolean;
  hideDistance: boolean;
  allowPhotoRemix: boolean;
};

export type OnboardingChecklist = {
  about: boolean;
  photos: boolean;
  prompts: boolean;
};

export type PhotoVariant = {
  id: string;
  uri: string;
  label: string;
  availability: 'public' | 'private-original';
  origin: 'ai-remix' | 'camera';
};

export type DatingProfile = {
  id: string;
  name: string;
  age: number;
  gender: GenderIdentity;
  pronouns: string;
  location: string;
  tagline: string;
  bio: string;
  vibe: string;
  photos: PhotoVariant[];
  prompts: PromptCard[];
};

export type ChatMessage = {
  id: string;
  author: 'me' | 'them' | 'system';
  kind: 'text' | 'drawing' | 'system';
  text?: string;
  drawing?: DrawingPost;
  createdAt: string;
};

export type MatchThread = {
  id: string;
  profileId: string;
  unreadCount: number;
  latestSnippet: string;
  lastActivityLabel: string;
  status: 'drawing-sent' | 'drawing-received' | 'chatting';
  replySuggestions: string[];
  messages: ChatMessage[];
};

export type ViewerProfile = {
  id: string;
  name: string;
  age: number;
  gender: GenderIdentity;
  pronouns: string;
  location: string;
  occupation: string;
  tagline: string;
  bio: string;
  vibe: string;
  connectedEmail: string | null;
  activePhotoVariantId: string;
  revealOriginalPhotos: boolean;
  interests: string[];
  prompts: PromptCard[];
  discovery: DiscoveryPreferences;
  notifications: NotificationPreferences;
  safety: SafetyPreferences;
  onboarding: OnboardingChecklist;
  photos: PhotoVariant[];
};
