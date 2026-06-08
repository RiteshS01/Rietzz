/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

let app;
let db: any = null;
let auth: any = null;
let isFirebaseSupported = false;

// Attempt to initialize Firebase safely
try {
  if (firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "") {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    auth = getAuth(app);
    isFirebaseSupported = true;
    console.log("Firebase initialized successfully with config:", firebaseConfig.projectId);
  } else {
    console.warn("Firebase config has empty API key. Falling back to local simulated database mode.");
  }
} catch (error) {
  console.error("Firebase failed to initialize, running in mock/offline mode instead:", error);
}

export { db, auth, isFirebaseSupported };

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  // If we have an active auth instance, fetch profile properties safely
  const currentAuthUser = auth ? auth.currentUser : null;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuthUser?.uid || "local-user",
      email: currentAuthUser?.email || "local@rietzz.com",
      emailVerified: currentAuthUser?.emailVerified || false,
      isAnonymous: currentAuthUser?.isAnonymous || false,
      tenantId: currentAuthUser?.tenantId || null,
      providerInfo: currentAuthUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Captured: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
