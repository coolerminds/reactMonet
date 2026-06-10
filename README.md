# Monet

Monet is an Expo React Native dating app prototype where attention starts with a drawing instead of a swipe.

Core flows in this build:

- Discover profiles and respond to a prompt with a sketch.
- Send drawings into an inbox instead of sending a plain like.
- Open chats with AI-powered reply suggestions.
- Preview the "Grok Lab" photo-remix flow and control when original photos are revealed.

## Stack

- Expo Router
- React Native + TypeScript
- `react-native-svg` for the drawing surface
- Firebase-ready config for auth and storage
- Secure AI backend seam for xAI / Grok features

## Run

```bash
npm install
npx expo start
```

To open the web build:

```bash
npm run web
```

## Demo Mode

The app works without backend keys using local mock data.

- Google sign-in stays in demo mode until Firebase and Google OAuth env vars are added.
- AI reply suggestions fall back to local suggestions until `EXPO_PUBLIC_AI_BASE_URL` is configured.
- Photo remixes are represented as saved mock variants until a server-side AI proxy is added.

## Environment

Copy `.env.example` and fill in the values you want to activate:

- Firebase config
- Google OAuth client IDs
- `EXPO_PUBLIC_AI_BASE_URL` for your secure AI backend

## Notes

- Keep xAI keys off-device. The mobile app should call your backend, and the backend should call xAI.
- The current build is optimized as a polished product prototype, not a production-ready dating backend.
