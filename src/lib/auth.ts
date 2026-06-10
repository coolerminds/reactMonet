import { hasFirebaseConfig, hasGoogleClientIds } from '@/lib/env';

export function getGoogleAuthSetupState() {
  const firebaseReady = hasFirebaseConfig();
  const googleReady = hasGoogleClientIds();

  return {
    ready: firebaseReady && googleReady,
    firebaseReady,
    googleReady,
    mode: firebaseReady && googleReady ? 'live-ready' : 'demo',
  };
}

export function describeGoogleAuthSetup() {
  const state = getGoogleAuthSetupState();

  if (state.ready) {
    return 'Google sign-in can be wired to Firebase Auth once you add the Expo client IDs.';
  }

  if (!hasFirebaseConfig()) {
    return 'Add Firebase keys to move authentication out of demo mode.';
  }

  return 'Firebase is configured. Add Google OAuth client IDs to complete sign-in.';
}
