import { DatingProfile, DrawingPost, DrawingStroke, MatchThread, ViewerProfile } from '@/types/models';

const point = (x: number, y: number) => ({ x, y });

const stroke = (id: string, color: string, width: number, points: { x: number; y: number }[]) =>
  ({
    id,
    color,
    width,
    points,
  }) satisfies DrawingStroke;

const portrait = (url: string) => `${url}?auto=format&fit=crop&crop=faces&w=900&h=1200&q=80`;

const planetDrawing: DrawingPost = {
  id: 'drawing-planet',
  title: 'ur out of this world',
  prompt: 'Draw me a planet you would live on.',
  artistName: 'Jo',
  note: 'received two hours ago',
  backgroundColor: '#050505',
  strokes: [
    stroke('planet-core', '#ff7d2c', 0.06, [
      point(0.42, 0.33),
      point(0.56, 0.35),
      point(0.62, 0.46),
      point(0.56, 0.6),
      point(0.41, 0.56),
      point(0.35, 0.43),
      point(0.42, 0.33),
    ]),
    stroke('planet-ribbon', '#ffffff', 0.022, [
      point(0.24, 0.5),
      point(0.38, 0.42),
      point(0.55, 0.41),
      point(0.72, 0.48),
      point(0.8, 0.55),
    ]),
    stroke('planet-ring-back', '#ffffff', 0.018, [
      point(0.25, 0.57),
      point(0.42, 0.63),
      point(0.62, 0.63),
      point(0.76, 0.56),
    ]),
    stroke('planet-smile', '#ff8a3d', 0.03, [
      point(0.52, 0.78),
      point(0.58, 0.82),
      point(0.65, 0.82),
      point(0.72, 0.77),
    ]),
    stroke('planet-star-1', '#fff7a6', 0.015, [
      point(0.78, 0.3),
      point(0.8, 0.35),
      point(0.85, 0.37),
      point(0.8, 0.39),
      point(0.78, 0.45),
    ]),
    stroke('planet-star-2', '#3550ff', 0.015, [
      point(0.63, 0.12),
      point(0.66, 0.18),
      point(0.7, 0.2),
      point(0.66, 0.22),
      point(0.63, 0.3),
    ]),
  ],
};

const catDrawing: DrawingPost = {
  id: 'drawing-cat',
  title: 'wrong kitty',
  prompt: 'Draw my chaotic alter ego.',
  artistName: 'Cindy',
  note: 'arrived this morning',
  backgroundColor: '#f8f8f8',
  strokes: [
    stroke('cat-outline', '#f28f2f', 0.018, [
      point(0.18, 0.78),
      point(0.18, 0.45),
      point(0.26, 0.35),
      point(0.34, 0.43),
      point(0.48, 0.4),
      point(0.57, 0.32),
      point(0.69, 0.44),
      point(0.72, 0.72),
    ]),
    stroke('cat-body', '#f28f2f', 0.018, [
      point(0.28, 0.76),
      point(0.34, 0.58),
      point(0.48, 0.53),
      point(0.58, 0.59),
      point(0.62, 0.79),
    ]),
    stroke('cat-face', '#3650ff', 0.013, [
      point(0.38, 0.64),
      point(0.45, 0.67),
      point(0.52, 0.64),
      point(0.48, 0.71),
      point(0.41, 0.74),
      point(0.52, 0.75),
    ]),
    stroke('cat-scribble', '#000000', 0.014, [
      point(0.3, 0.83),
      point(0.42, 0.8),
      point(0.53, 0.82),
      point(0.64, 0.79),
    ]),
  ],
};

export const seedProfiles: DatingProfile[] = [
  {
    id: 'nia',
    name: 'Nia',
    age: 24,
    gender: 'Woman',
    pronouns: 'she/her',
    location: 'Los Angeles, CA',
    tagline: 'ceramics teacher with a loud laugh',
    bio: 'I collect thrifted postcards, bad sci-fi paperbacks, and tiny reasons to stay out too late.',
    vibe: 'playful, tactile, a little cinematic',
    photos: [
      {
        id: 'nia-remix-film',
        uri: portrait('https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
        label: 'AI remix: indie film still',
        availability: 'public',
        origin: 'ai-remix',
      },
      {
        id: 'nia-remix-soft',
        uri: portrait('https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
        label: 'AI remix: soft daylight',
        availability: 'public',
        origin: 'ai-remix',
      },
      {
        id: 'nia-original',
        uri: portrait('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
        label: 'Original photo',
        availability: 'private-original',
        origin: 'camera',
      },
    ],
    prompts: [
      {
        emoji: '🦋',
        title: 'Draw me a butterfly',
        body: 'I keep a list of all the strange butterflies I’ve seen on hikes.',
      },
      {
        emoji: '🍓',
        title: 'My perfect reset day',
        body: 'Farmer’s market, frozen strawberries, and a movie nobody asked to watch.',
      },
    ],
  },
  {
    id: 'daniel',
    name: 'Daniel',
    age: 19,
    gender: 'Man',
    pronouns: 'he/him',
    location: 'Portland, OR',
    tagline: 'egg enthusiast with excellent playlists',
    bio: 'If you can make me laugh while I am making breakfast, your odds are unreal.',
    vibe: 'warm, goofy, social',
    photos: [
      {
        id: 'daniel-remix-polaroid',
        uri: portrait('https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
        label: 'AI remix: crisp polaroid',
        availability: 'public',
        origin: 'ai-remix',
      },
      {
        id: 'daniel-remix-party',
        uri: portrait('https://images.unsplash.com/photo-1500648767791-00dcc994a43e'),
        label: 'AI remix: rooftop night',
        availability: 'public',
        origin: 'ai-remix',
      },
      {
        id: 'daniel-original',
        uri: portrait('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'),
        label: 'Original photo',
        availability: 'private-original',
        origin: 'camera',
      },
    ],
    prompts: [
      {
        emoji: '🍳',
        title: 'Draw... your favorite meal',
        body: 'If it involves a runny yolk, I am already paying attention.',
      },
      {
        emoji: '🚫',
        title: 'It’s a dealbreaker if you...',
        body: 'hate eggs. I am trying not to take that personally.',
      },
    ],
  },
  {
    id: 'jules',
    name: 'Jules',
    age: 27,
    gender: 'Non-binary',
    pronouns: 'they/them',
    location: 'Seattle, WA',
    tagline: 'tattoo apprentice, soup defender',
    bio: 'I want tiny rituals, deadpan humor, and someone who can romanticize a rainy grocery run.',
    vibe: 'soft-spoken, artsy, observant',
    photos: [
      {
        id: 'jules-remix-neon',
        uri: portrait('https://images.unsplash.com/photo-1504593811423-6dd665756598'),
        label: 'AI remix: neon noir',
        availability: 'public',
        origin: 'ai-remix',
      },
      {
        id: 'jules-remix-museum',
        uri: portrait('https://images.unsplash.com/photo-1504593811423-6dd665756598'),
        label: 'AI remix: museum poster',
        availability: 'public',
        origin: 'ai-remix',
      },
      {
        id: 'jules-original',
        uri: portrait('https://images.unsplash.com/photo-1504593811423-6dd665756598'),
        label: 'Original photo',
        availability: 'private-original',
        origin: 'camera',
      },
    ],
    prompts: [
      {
        emoji: '🦖',
        title: 'Draw your favorite dinosaur',
        body: 'Mine changes weekly. Current answer: ankylosaurus.',
      },
      {
        emoji: '🕯️',
        title: 'A tiny green flag',
        body: 'You can sit in silence without making it weird.',
      },
    ],
  },
];

export const seedViewer: ViewerProfile = {
  id: 'viewer',
  name: 'Ari',
  age: 25,
  gender: 'Non-binary',
  pronouns: 'they/them',
  location: 'San Francisco, CA',
  occupation: 'product designer',
  tagline: 'makes playlists for first dates and sketches in the margins',
  bio: 'I like strange museums, street noodles, and people who can make a tiny bit feel important.',
  vibe: 'gentle chaos with good taste',
  connectedEmail: null,
  activePhotoVariantId: 'viewer-remix-golden',
  revealOriginalPhotos: false,
  interests: ['Drawing', 'Night walks', 'Museums', 'Cooking', 'Live music'],
  prompts: [
    {
      emoji: '🦋',
      title: 'Draw me a butterfly',
      body: 'Anything weird, overdramatic, or unexpectedly sweet wins.',
    },
    {
      emoji: '🎧',
      title: 'My easiest way to flirt',
      body: 'Trade me a song and tell me where I should hear it first.',
    },
  ],
  discovery: {
    ageRangeLabel: '22-30',
    distanceLabel: 'Within 25 miles',
    showMe: ['Woman', 'Man'],
    lookingFor: ['Relationship', 'Creative chemistry'],
  },
  notifications: {
    drawings: true,
    messages: true,
    remixReady: true,
    weeklyDigest: false,
  },
  safety: {
    blurOriginalsUntilMatch: true,
    requireDrawingBeforeChat: true,
    hideDistance: false,
    allowPhotoRemix: true,
  },
  onboarding: {
    about: true,
    photos: true,
    prompts: true,
  },
  photos: [
    {
      id: 'viewer-remix-golden',
      uri: portrait('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
      label: 'AI remix: golden-hour portrait',
      availability: 'public',
      origin: 'ai-remix',
    },
    {
      id: 'viewer-remix-studio',
      uri: portrait('https://images.unsplash.com/photo-1524504388940-b1c1722653e1'),
      label: 'AI remix: moody studio',
      availability: 'public',
      origin: 'ai-remix',
    },
    {
      id: 'viewer-original',
      uri: portrait('https://images.unsplash.com/photo-1494790108377-be9c29b29330'),
      label: 'Original photo',
      availability: 'private-original',
      origin: 'camera',
    },
  ],
};

export const seedThreads: MatchThread[] = [
  {
    id: 'thread-cindy',
    profileId: 'nia',
    unreadCount: 3,
    latestSnippet: '“this is so morbid”',
    lastActivityLabel: '11m ago',
    status: 'chatting',
    replySuggestions: [
      'That means it landed exactly how I hoped.',
      'Okay fair. Give me a less morbid prompt and I’ll redeem myself.',
      'Your turn. Draw me the most dramatic butterfly possible.',
    ],
    messages: [
      {
        id: 'message-cindy-drawing',
        author: 'them',
        kind: 'drawing',
        drawing: catDrawing,
        createdAt: 'Today, 11:27 AM',
      },
      {
        id: 'message-cindy-1',
        author: 'me',
        kind: 'text',
        text: 'this is so morbid',
        createdAt: 'Today, 11:30 AM',
      },
      {
        id: 'message-cindy-2',
        author: 'them',
        kind: 'text',
        text: 'you say morbid, I say emotionally committed',
        createdAt: 'Today, 11:31 AM',
      },
    ],
  },
  {
    id: 'thread-jo',
    profileId: 'jules',
    unreadCount: 1,
    latestSnippet: 'ur out of this world',
    lastActivityLabel: '2h ago',
    status: 'drawing-received',
    replySuggestions: [
      'That one deserves fridge space immediately.',
      'I owe you a galaxy-tier comeback drawing.',
      'Okay now I need to know your weirdest planet fact.',
    ],
    messages: [
      {
        id: 'message-jo-drawing',
        author: 'them',
        kind: 'drawing',
        drawing: planetDrawing,
        createdAt: 'Today, 1:08 PM',
      },
    ],
  },
];

export const interestOptions = [
  'Drawing',
  'Ceramics',
  'Live music',
  'Museums',
  'Cooking',
  'Night walks',
  'Photography',
  'Bookstores',
  'Road trips',
  'Coffee dates',
];

export const genderOptions = ['Woman', 'Man', 'Non-binary'] as const;

export const discoveryOptions = {
  ageRanges: ['21-27', '22-30', '24-34', '26-38'],
  distances: ['Within 10 miles', 'Within 25 miles', 'Within 50 miles', 'Anywhere'],
  showMe: [...genderOptions],
  lookingFor: ['Relationship', 'Casual', 'Creative chemistry', 'Friends first'],
};
