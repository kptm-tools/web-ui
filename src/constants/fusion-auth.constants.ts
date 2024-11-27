export const AUTH_STATUS_CODES = {
  LOGIN: {
    SUCCESS_CODES: [200, 202, 212, 213],
    CHANGE_PASSWORD_CODE: 203,
    TWO_FACTOR_CODE: 242,
    PREVENT_LOGIN_CODE: 409,
    MALFORMED_CODE: 400,
  },
};

export const UNPROTECTED_PATHS = ['/api/login'];

export enum AUTH_TOKEN_NAMES {
  ACCESS_TOKEN = 'access_token',
  TOKEN_EXPIRATION_INSTANT = 'token_expiration_instant',
}
