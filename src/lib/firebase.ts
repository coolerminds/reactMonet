import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';

import { appConfig, hasFirebaseConfig } from '@/lib/env';

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebaseConfig()) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(appConfig.firebase);
}

