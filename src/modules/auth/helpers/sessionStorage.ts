import { AUTH_TOKEN_NAMES } from 'src/constants/fusion-auth.constants';
import type { sessionStorageKeys } from 'auth/models/sessionStorage';

/**
 * @function getSessionStorageValues
 * @description
 * Retrieves authentication-related values from the browser's `sessionStorage`.
 * It attempts to fetch the access token, one-time password (OTP), token expiration
 * instant, and tenant ID. If any value is not found in session storage, it defaults
 * to an empty string for string values or `0` for the token expiration instant.
 *
 * @returns {SessionStorageKeys} An object containing the retrieved session storage values.
 */
export function getSessionStorageValues(): sessionStorageKeys {
  return {
    accessToken: sessionStorage.getItem(AUTH_TOKEN_NAMES.ACCESS_TOKEN) || '',
    otp: sessionStorage.getItem(AUTH_TOKEN_NAMES.OTP) || '',
    tokenExpirationInstant:
      Number(sessionStorage.getItem(AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT)) || 0,
    tenantId: sessionStorage.getItem(AUTH_TOKEN_NAMES.TENANT_ID) || '',
    audits: sessionStorage.getItem(AUTH_TOKEN_NAMES.AUDITS) || 'false'
  };
}

/**
 * @function clearSessionStorageValues
 * @description
 * Clears all stored authentication values from `sessionStorage`.
 * This effectively removes the access token, OTP, token expiration instant,
 * and tenant ID, ensuring no residual authentication data.
 *
 * @returns {void}
 */
export function clearSessionStorageValues(): void {
  sessionStorage.removeItem(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
  sessionStorage.removeItem(AUTH_TOKEN_NAMES.OTP);
  sessionStorage.removeItem(AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT);
  sessionStorage.removeItem(AUTH_TOKEN_NAMES.TENANT_ID);
  sessionStorage.removeItem(AUTH_TOKEN_NAMES.AUDITS);
}

/**
 * @function setSessionStorageValues
 * @description
 * Stores authentication-related values into `sessionStorage`. This includes
 * the access token, token expiration instant, OTP, and tenant ID.
 * The `tokenExpirationInstant` is converted to a string before storage.
 * After setting the values, it immediately retrieves and returns them from
 * session storage to confirm successful storage.
 *
 * @param {sessionStorageKeys} data - An object containing the authentication
 * data to be stored.
 * - `accessToken`: The JWT access token.
 * - `otp`: The one-time password.
 * - `tokenExpirationInstant`: The timestamp when the token expires (number).
 * - `tenantId`: The identifier for the tenant.
 *
 * @returns {sessionStorageKeys} An object containing the values as they are
 * currently stored in `sessionStorage` after the set operation.
 */
export function setSessionStorageValues(data: sessionStorageKeys): sessionStorageKeys {
  sessionStorage.setItem(AUTH_TOKEN_NAMES.ACCESS_TOKEN, data.accessToken);
  sessionStorage.setItem(
    AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT,
    data.tokenExpirationInstant.toString()
  );
  sessionStorage.setItem(AUTH_TOKEN_NAMES.OTP, data.otp);
  sessionStorage.setItem(AUTH_TOKEN_NAMES.TENANT_ID, data.tenantId);
  sessionStorage.setItem(AUTH_TOKEN_NAMES.AUDITS, data.audits);

  return getSessionStorageValues();
}
