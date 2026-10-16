import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  loginUser, 
  logoutUser, 
  subscribeToAuthChanges, 
  resetAdminPassword,
  getAdminJwtToken,
  getAdminJwtTokenResult
} from '../firebase/auth';
import { isFirebaseConfigured } from '../firebase/config';
import { 
  parseJwt, 
  isJwtExpired, 
  getJwtTimeRemaining, 
  getSecureSessionJwt, 
  touchSessionActivity, 
  isSessionInactive, 
  clearSecureSessionJwt,
  getClientFingerprint 
} from '../utils/jwtSecurity';
import toast from 'react-hot-toast';

const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: false,
  isFirebaseConfigured: false,
  jwtToken: null,
  jwtClaims: null,
  jwtExpiresAt: null,
  timeRemainingFormatted: '',
  securityInfo: null,
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  getJwtToken: async () => {},
  getJwtTokenResult: async () => {},
  refreshJwt: async () => {},
  loading: true,
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [jwtClaims, setJwtClaims] = useState(null);
  const [timeRemainingFormatted, setTimeRemainingFormatted] = useState('');
  const [loading, setLoading] = useState(true);

  // Inactivity timeout limit: 30 minutes
  const MAX_INACTIVITY_MINUTES = 30;

  // Sync token state and parse claims
  const syncJwtState = useCallback(async (tokenString) => {
    const token = tokenString || getSecureSessionJwt();
    if (!token) {
      setJwtToken(null);
      setJwtClaims(null);
      setTimeRemainingFormatted('');
      return null;
    }

    const parsed = parseJwt(token);
    if (parsed.isValid && parsed.payload) {
      setJwtToken(token);
      setJwtClaims(parsed.payload);
      const remaining = getJwtTimeRemaining(parsed.payload);
      setTimeRemainingFormatted(remaining.formatted);
      return parsed.payload;
    } else {
      setJwtToken(null);
      setJwtClaims(null);
      setTimeRemainingFormatted('');
      return null;
    }
  }, []);

  // Listen to Auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const token = await getAdminJwtToken();
          await syncJwtState(token);
        } catch (e) {
          console.warn('Error syncing JWT token on auth change:', e);
        }
      } else {
        setJwtToken(null);
        setJwtClaims(null);
        setTimeRemainingFormatted('');
      }
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [syncJwtState]);

  // Session Inactivity & JWT Expiration Guard
  useEffect(() => {
    if (!currentUser) return;

    // Record user activity events
    const handleUserActivity = () => {
      touchSessionActivity();
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('scroll', handleUserActivity, { passive: true });

    // Periodic heartbeat: check inactivity and token expiration every 15 seconds
    const interval = setInterval(async () => {
      // 1. Check inactivity timeout
      if (isSessionInactive(MAX_INACTIVITY_MINUTES)) {
        toast.error('Session closed due to 30 minutes of inactivity. Please sign in again.', { id: 'inactivity-toast' });
        await logoutUser();
        setCurrentUser(null);
        setJwtToken(null);
        setJwtClaims(null);
        return;
      }

      // 2. Check JWT expiration & update countdown
      const token = getSecureSessionJwt();
      if (!token || isJwtExpired(token, 0)) {
        // Try background token refresh first if user is active
        try {
          const refreshedToken = await getAdminJwtToken(true);
          if (refreshedToken && !isJwtExpired(refreshedToken, 10)) {
            await syncJwtState(refreshedToken);
            return;
          }
        } catch {}

        toast.error('Admin security token has expired. Please sign in again.', { id: 'token-expired-toast' });
        await logoutUser();
        setCurrentUser(null);
        setJwtToken(null);
        setJwtClaims(null);
      } else {
        // Update countdown
        const remaining = getJwtTimeRemaining(token);
        setTimeRemainingFormatted(remaining.formatted);
      }
    }, 15000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      clearInterval(interval);
    };
  }, [currentUser, syncJwtState]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await loginUser(email, password);
      if (res && res.user) {
        setCurrentUser(res.user);
        if (res.jwtToken) {
          await syncJwtState(res.jwtToken);
        }
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      clearSecureSessionJwt();
      setCurrentUser(null);
      setJwtToken(null);
      setJwtClaims(null);
      setTimeRemainingFormatted('');
    } finally {
      setLoading(false);
    }
  };

  const refreshJwt = async () => {
    try {
      const newToken = await getAdminJwtToken(true);
      if (newToken) {
        await syncJwtState(newToken);
        toast.success('Admin JWT security token rotated & refreshed!');
        return newToken;
      }
    } catch (err) {
      console.error('Failed to refresh JWT token:', err);
      toast.error('Failed to rotate JWT token.');
    }
    return null;
  };

  const resetPassword = async (email) => {
    return await resetAdminPassword(email);
  };

  const getJwtToken = async (forceRefresh = false) => {
    return await getAdminJwtToken(forceRefresh);
  };

  const getJwtTokenResult = async (forceRefresh = false) => {
    return await getAdminJwtTokenResult(forceRefresh);
  };

  const securityInfo = {
    algorithm: isFirebaseConfigured ? 'RS256 (Google Cloud Identity OIDC)' : 'HS256 (RFC 7519 Compliant)',
    fingerprint: getClientFingerprint(),
    inactivityTimeoutMinutes: MAX_INACTIVITY_MINUTES,
    expiresAt: jwtClaims?.exp ? new Date(jwtClaims.exp * 1000).toLocaleTimeString() : null,
    issuedAt: jwtClaims?.iat ? new Date(jwtClaims.iat * 1000).toLocaleTimeString() : null,
    issuer: jwtClaims?.iss || 'https://auth.jaibhavaniconstructions.com',
    subject: jwtClaims?.sub || currentUser?.uid || 'admin'
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: Boolean(currentUser && jwtToken && !isJwtExpired(jwtToken, 0)),
      isFirebaseConfigured,
      jwtToken,
      jwtClaims,
      jwtExpiresAt: jwtClaims?.exp ? new Date(jwtClaims.exp * 1000) : null,
      timeRemainingFormatted,
      securityInfo,
      login,
      logout,
      resetPassword,
      getJwtToken,
      getJwtTokenResult,
      refreshJwt,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

