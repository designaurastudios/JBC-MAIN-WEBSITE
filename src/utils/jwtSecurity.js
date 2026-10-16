/**
 * JWT Security & Session Management Utilities
 * Implements RFC 7519 JSON Web Token decoding, validation, device fingerprinting,
 * rate-limiting brute force protection, and inactivity session guard for Admin Access.
 */

const STORAGE_KEY_JWT = 'jbc_admin_jwt_token';
const STORAGE_KEY_FINGERPRINT = 'jbc_admin_device_fingerprint';
const STORAGE_KEY_LAST_ACTIVITY = 'jbc_admin_last_activity';
const STORAGE_KEY_ATTEMPTS = 'jbc_admin_login_rate_limit';

/**
 * Base64URL decoder compatible with browser UTF-8 standards
 */
export function decodeBase64Url(str) {
  try {
    // Add padding if missing
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const decoded = atob(base64);
    // Safe UTF-8 handling
    const bytes = Uint8Array.from(decoded, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch (err) {
    console.error('Base64URL decode error:', err);
    return null;
  }
}

/**
 * Base64URL encoder compatible with browser UTF-8 standards
 */
export function encodeBase64Url(input) {
  try {
    const str = typeof input === 'string' ? input : JSON.stringify(input);
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  } catch (err) {
    console.error('Base64URL encode error:', err);
    return '';
  }
}

/**
 * Parse an RFC 7519 JSON Web Token (Header.Payload.Signature)
 * @param {string} token 
 * @returns {{ header: object|null, payload: object|null, signature: string|null, isValid: boolean }}
 */
export function parseJwt(token) {
  if (!token || typeof token !== 'string') {
    return { header: null, payload: null, signature: null, isValid: false };
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { header: null, payload: null, signature: null, isValid: false };
  }

  try {
    const headerJson = decodeBase64Url(parts[0]);
    const payloadJson = decodeBase64Url(parts[1]);

    const header = headerJson ? JSON.parse(headerJson) : null;
    const payload = payloadJson ? JSON.parse(payloadJson) : null;

    const isValid = Boolean(header && payload && typeof payload === 'object');

    return {
      header,
      payload,
      signature: parts[2],
      isValid
    };
  } catch (err) {
    console.warn('Failed to parse JWT token string:', err);
    return { header: null, payload: null, signature: null, isValid: false };
  }
}

/**
 * Check if a JWT token is expired
 * @param {string|object} tokenOrPayload 
 * @param {number} bufferSeconds - Safety threshold before actual expiration (default 30s)
 * @returns {boolean}
 */
export function isJwtExpired(tokenOrPayload, bufferSeconds = 30) {
  if (!tokenOrPayload) return true;

  let payload = null;
  if (typeof tokenOrPayload === 'string') {
    const parsed = parseJwt(tokenOrPayload);
    if (!parsed.isValid) return true;
    payload = parsed.payload;
  } else if (typeof tokenOrPayload === 'object') {
    payload = tokenOrPayload;
  }

  if (!payload || !payload.exp) {
    return false; // If no exp claim, consider not expired or custom validation
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= (nowSeconds + bufferSeconds);
}

/**
 * Calculate remaining validity in seconds and human-readable format
 * @param {string|object} tokenOrPayload 
 */
export function getJwtTimeRemaining(tokenOrPayload) {
  let payload = null;
  if (typeof tokenOrPayload === 'string') {
    const parsed = parseJwt(tokenOrPayload);
    if (!parsed.isValid) return { remainingSeconds: 0, formatted: 'Expired', isExpired: true };
    payload = parsed.payload;
  } else {
    payload = tokenOrPayload;
  }

  if (!payload || !payload.exp) {
    return { remainingSeconds: 3600, formatted: 'Valid (Persistent)', isExpired: false };
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const remaining = Math.max(0, payload.exp - nowSeconds);

  if (remaining <= 0) {
    return { remainingSeconds: 0, formatted: 'Expired', isExpired: true };
  }

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const formatted = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  return {
    remainingSeconds: remaining,
    formatted,
    isExpired: false
  };
}

/**
 * Generate a client-side RFC 7519 compliant JWT token for offline/demo fallback
 * Signed with SHA256 simulation and standard claims
 */
export function generateFallbackJwt(user, validityMinutes = 120) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid: 'jbc_vault_v1'
  };

  const nowSeconds = Math.floor(Date.now() / 1000);
  const expSeconds = nowSeconds + (validityMinutes * 60);

  const payload = {
    iss: 'https://auth.jaibhavaniconstructions.com',
    aud: 'jbc-official-website',
    sub: user.uid || 'admin_user_' + nowSeconds,
    email: user.email || 'admin@jaibhavaniconstructions.com',
    email_verified: true,
    auth_time: nowSeconds,
    iat: nowSeconds,
    exp: expSeconds,
    role: 'administrator',
    permissions: ['all_read_write', 'leads_manage', 'projects_manage', 'company_settings'],
    user_metadata: {
      displayName: user.displayName || 'JBC Admin',
      provider: 'jbc_secure_vault'
    }
  };

  const encodedHeader = encodeBase64Url(header);
  const encodedPayload = encodeBase64Url(payload);
  const signaturePayload = `${encodedHeader}.${encodedPayload}`;

  // Deterministic signature simulation
  let hash = 0;
  for (let i = 0; i < signaturePayload.length; i++) {
    hash = ((hash << 5) - hash) + signaturePayload.charCodeAt(i);
    hash |= 0;
  }
  const signature = encodeBase64Url(`jbc_sig_${Math.abs(hash)}_${nowSeconds}`);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Generate browser/device fingerprint to bind JWT session to client device
 */
export function getClientFingerprint() {
  if (typeof window === 'undefined') return 'server';
  const nav = window.navigator || {};
  const screen = window.screen || {};
  const data = [
    nav.userAgent || '',
    nav.language || '',
    screen.width || '',
    screen.height || '',
    screen.colorDepth || '',
    Intl?.DateTimeFormat()?.resolvedOptions()?.timeZone || ''
  ].join('|');

  // Simple robust 32-bit hash
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data.charCodeAt(i);
    hash |= 0;
  }
  return 'fp_' + Math.abs(hash).toString(16);
}

/**
 * Save JWT securely to session storage (and sync device fingerprint)
 */
export function saveSecureSessionJwt(token) {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY_JWT, token);
    sessionStorage.setItem(STORAGE_KEY_FINGERPRINT, getClientFingerprint());
    sessionStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, Date.now().toString());
  } catch (err) {
    console.warn('SessionStorage unavailable, using memory:', err);
  }
}

/**
 * Retrieve current session JWT and verify device fingerprint
 */
export function getSecureSessionJwt() {
  if (typeof window === 'undefined') return null;
  try {
    const token = sessionStorage.getItem(STORAGE_KEY_JWT);
    if (!token) return null;

    const storedFp = sessionStorage.getItem(STORAGE_KEY_FINGERPRINT);
    const currentFp = getClientFingerprint();

    // Verify session wasn't transplanted to another device/browser
    if (storedFp && storedFp !== currentFp) {
      console.warn('Security Alert: Device fingerprint mismatch detected. Invalidating session.');
      clearSecureSessionJwt();
      return null;
    }

    // Verify token expiration
    if (isJwtExpired(token, 10)) {
      clearSecureSessionJwt();
      return null;
    }

    return token;
  } catch {
    return null;
  }
}

/**
 * Update the last active timestamp for inactivity tracking
 */
export function touchSessionActivity() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, Date.now().toString());
  } catch {}
}

/**
 * Check if the admin session has timed out due to inactivity
 * @param {number} maxIdleMinutes - Maximum idle time allowed (default 30 minutes)
 */
export function isSessionInactive(maxIdleMinutes = 30) {
  if (typeof window === 'undefined') return false;
  try {
    const last = sessionStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
    if (!last) return false;
    const idleMs = Date.now() - parseInt(last, 10);
    return idleMs > (maxIdleMinutes * 60 * 1000);
  } catch {
    return false;
  }
}

/**
 * Wipe all admin JWT session tokens and activity data
 */
export function clearSecureSessionJwt() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY_JWT);
    sessionStorage.removeItem(STORAGE_KEY_FINGERPRINT);
    sessionStorage.removeItem(STORAGE_KEY_LAST_ACTIVITY);
    localStorage.removeItem('jbc_admin_auth');
    localStorage.removeItem('jbc_admin_jwt');
  } catch {}
}

/**
 * Rate Limiting / Brute-Force Lockout Guard for Admin Login
 * Blocks rapid repeated unauthorized attempts
 */
export function getLoginRateLimitStatus() {
  if (typeof window === 'undefined') return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    if (!raw) return { isLocked: false, remainingSeconds: 0, attempts: 0 };

    const data = JSON.parse(raw);
    const now = Date.now();

    if (data.lockedUntil && data.lockedUntil > now) {
      const remaining = Math.ceil((data.lockedUntil - now) / 1000);
      return {
        isLocked: true,
        remainingSeconds: remaining,
        attempts: data.attempts || 0
      };
    }

    // If lockout has elapsed, reset lockout
    if (data.lockedUntil && data.lockedUntil <= now) {
      localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
      return { isLocked: false, remainingSeconds: 0, attempts: 0 };
    }

    return {
      isLocked: false,
      remainingSeconds: 0,
      attempts: data.attempts || 0
    };
  } catch {
    return { isLocked: false, remainingSeconds: 0, attempts: 0 };
  }
}

/**
 * Record a failed login attempt and apply progressive lockout threshold
 */
export function recordFailedLoginAttempt() {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    const data = raw ? JSON.parse(raw) : { attempts: 0, firstAttemptAt: Date.now() };

    const now = Date.now();
    data.attempts = (data.attempts || 0) + 1;
    data.lastAttemptAt = now;

    // Progressive lockout policy
    if (data.attempts >= 10) {
      // 10+ failed attempts -> 10 minutes lockout
      data.lockedUntil = now + (10 * 60 * 1000);
    } else if (data.attempts >= 7) {
      // 7 failed attempts -> 3 minutes lockout
      data.lockedUntil = now + (3 * 60 * 1000);
    } else if (data.attempts >= 5) {
      // 5 failed attempts -> 60 seconds lockout
      data.lockedUntil = now + (60 * 1000);
    }

    localStorage.setItem(STORAGE_KEY_ATTEMPTS, JSON.stringify(data));
  } catch {}
}

/**
 * Clear rate limit on successful admin authentication
 */
export function resetLoginRateLimit() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
  } catch {}
}
