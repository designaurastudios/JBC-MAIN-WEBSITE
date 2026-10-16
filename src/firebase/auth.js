import { auth, isFirebaseConfigured } from './config';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

/**
 * Friendly error mapper for Firebase Auth error codes (Email & Password)
 */
export function getAuthErrorMessage(error) {
  if (!error) return 'An unknown authentication error occurred.';
  const code = error.code || '';
  
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This admin account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to multiple failed login attempts. Please reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection and try again.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in your Firebase Console. Please enable Email/Password under Authentication > Sign-in method.';
    default:
      return error.message || 'Authentication failed. Please try again.';
  }
}

import { 
  saveSecureSessionJwt, 
  clearSecureSessionJwt, 
  getSecureSessionJwt,
  generateFallbackJwt, 
  parseJwt, 
  isJwtExpired, 
  getLoginRateLimitStatus, 
  recordFailedLoginAttempt, 
  resetLoginRateLimit,
  touchSessionActivity
} from '../utils/jwtSecurity';

/**
 * Admin Authentication - Email & Password Sign In
 * Uses real Firebase Auth SDK (signInWithEmailAndPassword) and issues signed RFC 7519 JWT
 */
export async function loginUser(email, password) {
  const trimmedEmail = email?.trim() || '';
  
  if (!trimmedEmail || !password) {
    throw new Error('Please enter both email and password.');
  }

  // 1. Enforce Brute-Force Rate Limiting Lockout Guard
  const rateLimit = getLoginRateLimitStatus();
  if (rateLimit.isLocked) {
    const error = new Error(`Security lockout active due to multiple failed login attempts. Please wait ${rateLimit.remainingSeconds} seconds before retrying.`);
    error.code = 'auth/too-many-requests';
    error.remainingSeconds = rateLimit.remainingSeconds;
    throw error;
  }

  if (isFirebaseConfigured && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      
      // 2. Retrieve the RS256 cryptographically signed JWT ID Token from Google Firebase
      const jwtToken = await userCredential.user.getIdToken();
      
      // 3. Store in secure session vault & record activity
      saveSecureSessionJwt(jwtToken);
      resetLoginRateLimit();
      
      return {
        ...userCredential,
        jwtToken
      };
    } catch (error) {
      recordFailedLoginAttempt();
      const friendlyMsg = getAuthErrorMessage(error);
      const customErr = new Error(friendlyMsg);
      customErr.code = error.code;
      throw customErr;
    }
  } else {
    // 4. Demo Fallback Mode: Generate real RFC 7519 HMAC-SHA256 JWT Token
    if (password.length >= 6) {
      const mockUser = {
        uid: 'jbc_admin_' + Date.now(),
        email: trimmedEmail,
        displayName: 'JBC Admin',
        isLocalMock: true
      };
      
      const jwtToken = generateFallbackJwt(mockUser);
      saveSecureSessionJwt(jwtToken);
      resetLoginRateLimit();
      localStorage.setItem('jbc_admin_auth', JSON.stringify(mockUser));
      
      return { 
        user: mockUser,
        jwtToken
      };
    } else {
      recordFailedLoginAttempt();
      throw new Error('Please enter a valid email and password (minimum 6 characters).');
    }
  }
}

/**
 * Admin Authentication - Sign Out (Wipes JWT Session Vault)
 */
export async function logoutUser() {
  clearSecureSessionJwt();
  if (isFirebaseConfigured && auth) {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error('Firebase signout error:', error);
      throw error;
    }
  } else {
    localStorage.removeItem('jbc_admin_auth');
    return Promise.resolve();
  }
}

/**
 * Send Password Reset Email for Admin
 */
export async function resetAdminPassword(email) {
  const trimmedEmail = email?.trim() || '';
  if (!trimmedEmail) {
    throw new Error('Please enter your admin email address to receive the password reset link.');
  }

  if (isFirebaseConfigured && auth) {
    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      return { success: true, message: `Password reset link sent to ${trimmedEmail}. Please check your inbox.` };
    } catch (error) {
      const friendlyMsg = getAuthErrorMessage(error);
      throw new Error(friendlyMsg);
    }
  } else {
    return { success: true, message: `[Demo Mode] Password reset simulation triggered for ${trimmedEmail}.` };
  }
}

/**
 * Real-time Auth State Listener
 */
export function subscribeToAuthChanges(callback) {
  if (isFirebaseConfigured && auth) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          saveSecureSessionJwt(token);
        } catch (e) {
          console.warn('Failed to cache JWT on auth state change:', e);
        }
      } else {
        clearSecureSessionJwt();
      }
      callback(user);
    });
  } else {
    const local = localStorage.getItem('jbc_admin_auth');
    const token = getSecureSessionJwt();
    if (local && token) {
      try {
        const parsedUser = JSON.parse(local);
        callback(parsedUser);
      } catch {
        clearSecureSessionJwt();
        callback(null);
      }
    } else {
      clearSecureSessionJwt();
      callback(null);
    }
    return () => {};
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentAdminUser() {
  if (isFirebaseConfigured && auth) {
    return auth.currentUser;
  }
  const token = getSecureSessionJwt();
  const local = localStorage.getItem('jbc_admin_auth');
  if (token && local) {
    try {
      return JSON.parse(local);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Retrieve the current admin user's cryptographically signed JWT ID Token
 * (Standard RFC 7519 JSON Web Token issued and signed with RS256 by Google Firebase or HS256 Vault)
 * 
 * @param {boolean} forceRefresh - If true, forces a network refresh to issue a new JWT
 * @returns {Promise<string|null>} Signed JWT Token string
 */
export async function getAdminJwtToken(forceRefresh = false) {
  if (isFirebaseConfigured && auth && auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken(forceRefresh);
      if (token) {
        saveSecureSessionJwt(token);
      }
      return token;
    } catch (err) {
      console.error('Failed to get JWT token:', err);
      return getSecureSessionJwt();
    }
  }
  return getSecureSessionJwt();
}

/**
 * Retrieve detailed JWT Token Result including decoded claims, issuance & expiration time
 * @returns {Promise<import('firebase/auth').IdTokenResult|null>}
 */
export async function getAdminJwtTokenResult(forceRefresh = false) {
  if (isFirebaseConfigured && auth && auth.currentUser) {
    try {
      const result = await auth.currentUser.getIdTokenResult(forceRefresh);
      if (result?.token) {
        saveSecureSessionJwt(result.token);
      }
      return result;
    } catch (err) {
      console.error('Failed to get JWT token result:', err);
      return null;
    }
  }

  // Fallback JWT claims
  const token = getSecureSessionJwt();
  if (token) {
    const parsed = parseJwt(token);
    if (parsed.isValid && parsed.payload) {
      return {
        token,
        claims: parsed.payload,
        authTime: new Date((parsed.payload.auth_time || parsed.payload.iat) * 1000).toISOString(),
        issuedAtTime: new Date(parsed.payload.iat * 1000).toISOString(),
        expirationTime: new Date(parsed.payload.exp * 1000).toISOString(),
        signInProvider: 'jbc_secure_vault'
      };
    }
  }
  return null;
}


