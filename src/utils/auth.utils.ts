import { AUTH_STATUS_CODES, AUTH_TOKEN_NAMES } from 'src/constants/fusion-auth.constants';
import { isAxiosError } from 'axios';
import type { ValidationRule } from 'quasar';
import { Notify } from 'quasar';

export function errorLoginResponseHandler(error: unknown): void {
  if (isAxiosError(error)) {
    if (
      [AUTH_STATUS_CODES.LOGIN.PREVENT_LOGIN_CODE, AUTH_STATUS_CODES.LOGIN.MALFORMED_CODE].includes(
        error.status!
      )
    ) {
      Notify.create({
        message: error.response?.data.error,
        color: 'negative'
      });
    }
  }
}

export function setSessionStorageUserInfo(
  accessToken: string,
  expirationInstant: number,
  otp: string,
  tenantId: string
): void {
  sessionStorage.setItem(AUTH_TOKEN_NAMES.ACCESS_TOKEN, accessToken);
  sessionStorage.setItem(AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT, expirationInstant.toString());
  sessionStorage.setItem(AUTH_TOKEN_NAMES.OTP, otp);
  sessionStorage.setItem(AUTH_TOKEN_NAMES.TENANT_ID, tenantId);
}

export function clearSessionStorageUserInfo(): void {
  sessionStorage.removeItem(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
  sessionStorage.removeItem(AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT);
}

export function isTokenExpired(timeStamp: number): boolean {
  const expirationInstantDate = new Date(timeStamp || 0);
  const now = new Date();
  return now.getTime() > expirationInstantDate.getTime();
}

export function requiredRules(message: string): ValidationRule[] {
  return [(val: ValidationRule) => !!val || message];
}

export function decodeJwt(token: string) {
  if (!token) {
    throw new Error('Invalid token');
  }

  // Split the JWT into parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed token');
  }

  const payload = parts[1];

  // Base64Url decoding helper
  function base64UrlDecode(str: string) {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
  }

  try {
    // Decode and parse the payload
    const decodedPayload = base64UrlDecode(String(payload));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Failed to decode and parse JWT payload:', error);
    throw new Error('Failed to decode and parse JWT payload');
  }
}
