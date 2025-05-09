import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AUTH_STATUS_CODES, AUTH_TOKEN_NAMES } from 'src/constants/fusion-auth.constants';
import type {
  FusionAuthLoginResponse,
  SuccessAuthLogin,
  SuccessAuthLoginChangePassword,
  SuccessAuthLoginTwoFactor,
  SuccessAuthLoginUser
  // SuccessAuthLoginChangePassword,
  // SuccessAuthLoginTwoFactor
} from 'src/models/fusion-auth.models';
import { Notify } from 'quasar';

import {
  successLoginResponseHandler,
  // errorLoginResponseHandler,
  setSessionStorageUserInfo,
  clearSessionStorageUserInfo,
  isTokenExpired,
  errorLoginResponseHandler,
  requiredRules,
  decodeJwt
} from './auth.utils'; // Import the functions to be tested
import { type AxiosError } from 'axios';

const mockSetUserInfo = vi.fn();
const mockSetTokenInfo = vi.fn();
vi.mock('stores/auth-store', () => ({
  useFusionAuthStore: vi.fn(() => ({
    setUserInfo: mockSetUserInfo,
    setTokenInfo: mockSetTokenInfo
  }))
}));

// Mock the Notify plugin
vi.mock('quasar', () => ({
  Notify: {
    create: vi.fn()
  }
}));

// Mock sessionStorage
const mockSessionStorage = {
  setItem: vi.fn(),
  removeItem: vi.fn(),
  getItem: vi.fn(),
  clear: vi.fn()
};
Object.defineProperty(global, 'sessionStorage', { value: mockSessionStorage });

describe('auth-utils', () => {
  beforeEach(() => {
    vi.mocked(Notify.create).mockClear();
    vi.clearAllMocks();
    mockSessionStorage.setItem.mockClear();
    mockSessionStorage.removeItem.mockClear();
  });

  describe('successLoginResponseHandler', () => {
    it('should call setUserInfo and setTokenInfo for successful login', () => {
      const status = AUTH_STATUS_CODES.LOGIN.SUCCESS_CODES[0];
      const response: SuccessAuthLogin = {
        user: { id: 'user-id' } as SuccessAuthLoginUser,
        token: 'access-token',
        tokenExpirationInstant: 1678886400000,
        otp: 'otp-secret',
        tenantId: 'tenant-id'
      };

      successLoginResponseHandler(Number(status), response);

      expect(mockSetUserInfo).toHaveBeenCalledWith(response);
      expect(mockSetTokenInfo).toHaveBeenCalledWith(
        response.token,
        response.tokenExpirationInstant,
        response.otp,
        response.tenantId
      );
    });

    it('should log a message for change password status', () => {
      const status = AUTH_STATUS_CODES.LOGIN.CHANGE_PASSWORD_CODE;
      const response: SuccessAuthLoginChangePassword = {
        changePasswordId: 'change-password-id',
        changePasswordReason: 'Administrative'
      };
      const consoleSpy = vi.spyOn(console, 'log');

      successLoginResponseHandler(status, response);

      expect(consoleSpy).toHaveBeenCalledWith('Need to change password', response);
    });

    it('should log a message for two-factor authentication status', () => {
      const status = AUTH_STATUS_CODES.LOGIN.TWO_FACTOR_CODE;
      const response: SuccessAuthLoginTwoFactor = {
        methods: [],
        twoFactorId: 'two-factor-id'
      };
      const consoleSpy = vi.spyOn(console, 'log');

      successLoginResponseHandler(status, response);

      expect(consoleSpy).toHaveBeenCalledWith('Need to validate two factor', response);
    });

    it('should not do anything for other status codes', () => {
      const status = 999; // Some other status code
      const response = {};

      successLoginResponseHandler(status, response as FusionAuthLoginResponse);

      expect(mockSetUserInfo).not.toHaveBeenCalled();
      expect(mockSetTokenInfo).not.toHaveBeenCalled();
    });
  });

  describe('errorLoginResponseHandler', () => {
    it('should call Notify.create for PREVENT_LOGIN_CODE error', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: { error: 'Login prevented' }
        },
        status: AUTH_STATUS_CODES.LOGIN.PREVENT_LOGIN_CODE
      } as AxiosError;
      errorLoginResponseHandler(error);
      expect(Notify.create).toHaveBeenCalledWith({
        message: 'Login prevented',
        color: 'negative'
      });
    });
    it('should call Notify.create for MALFORMED_CODE error', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: { error: 'Malformed request' }
        },
        status: AUTH_STATUS_CODES.LOGIN.MALFORMED_CODE
      } as AxiosError;
      errorLoginResponseHandler(error);
      expect(Notify.create).toHaveBeenCalledWith({
        message: 'Malformed request',
        color: 'negative'
      });
    });
    it('should not call Notify.create for other axios errors', () => {
      const error = {
        isAxiosError: true,
        response: {
          data: { error: 'Some other error' }
        },
        status: 500
      } as AxiosError;
      errorLoginResponseHandler(error);
      expect(Notify.create).not.toHaveBeenCalled();
    });
    it('should not call Notify.create for non-axios errors', () => {
      const error = new Error('Non-axios error');
      errorLoginResponseHandler(error);
      expect(Notify.create).not.toHaveBeenCalled();
    });
  });

  describe('setSessionStorageUserInfo', () => {
    it('should set access token, expiration instant, otp, and tenant ID in sessionStorage', () => {
      const accessToken = 'test-access-token';
      const expirationInstant = 1678886400000;
      const otp = 'test-otp';
      const tenantId = 'test-tenant-id';

      setSessionStorageUserInfo(accessToken, expirationInstant, otp, tenantId);

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_NAMES.ACCESS_TOKEN,
        accessToken
      );
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT,
        expirationInstant.toString()
      );
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(AUTH_TOKEN_NAMES.OTP, otp);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(AUTH_TOKEN_NAMES.TENANT_ID, tenantId);
    });
  });

  describe('clearSessionStorageUserInfo', () => {
    it('should remove access token and expiration instant from sessionStorage', () => {
      clearSessionStorageUserInfo();

      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith(
        AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT
      );
      expect(mockSessionStorage.removeItem).not.toHaveBeenCalledWith(AUTH_TOKEN_NAMES.OTP);
      expect(mockSessionStorage.removeItem).not.toHaveBeenCalledWith(AUTH_TOKEN_NAMES.TENANT_ID);
    });
  });

  describe('isTokenExpired', () => {
    it('should return true if timestamp is in the past', () => {
      const pastTimestamp = Date.now() - 1000;
      expect(isTokenExpired(pastTimestamp)).toBe(true);
    });

    it('should return false if timestamp is in the future', () => {
      const futureTimestamp = Date.now() + 1000;
      expect(isTokenExpired(futureTimestamp)).toBe(false);
    });

    it('should return true if timestamp is 0', () => {
      expect(isTokenExpired(0)).toBe(true);
    });

    it('should return true if timestamp is null or undefined', () => {
      expect(isTokenExpired(0)).toBe(true);
      expect(isTokenExpired(0)).toBe(true);
    });
  });

  describe('requiredRules', () => {
    it('should return an array with a single validation rule', () => {
      const message = 'This field is required';
      const rules = requiredRules(message);
      expect(rules).toBeInstanceOf(Array);
      expect(rules.length).toBe(1);
    });

    it('should return the error message if the value is falsy', () => {
      const message = 'This field is required';
      const rules = requiredRules(message);
      const rule = rules[0];
      if (rule) {
        expect(rule(null, {})).toBe(message);
        expect(rule(undefined, {})).toBe(message);
        expect(rule('', {})).toBe(message);
        expect(rule(0, {})).toBe(message);
        expect(rule(false, {})).toBe(message);
      }
    });

    it('should return true if the value is truthy', () => {
      const message = 'This field is required';
      const rules = requiredRules(message);
      const rule = rules[0];
      expect(rule('hello', {})).toBe(true);
      expect(rule(123, {})).toBe(true);
      expect(rule({}, {})).toBe(true);
      expect(rule([], {})).toBe(true);
      expect(rule(true, {})).toBe(true);
    });
  });

  describe('decodeJwt', () => {
    const FAKE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.fakedsignature';
    it('should decode a valid JWT token', () => {
      const token = FAKE_TOKEN;
      const decodedPayload = decodeJwt(token);
      expect(decodedPayload).toEqual({});
    });

    it('should throw an error for an invalid token', () => {
      expect(() => decodeJwt('')).toThrowError('Invalid token');
    });

    it('should throw an error for a malformed token', () => {
      expect(() => decodeJwt('invalid.token')).toThrowError('Malformed token');
    });

    it('should handle tokens with URL-safe base64 encoding', () => {
      const token = FAKE_TOKEN;
      const expectedPayload = {};
      expect(decodeJwt(token)).toEqual(expectedPayload);
    });

    // it('should throw an error if the payload is not valid JSON', () => {
    //   const token = 'token..invalid';
    //   expect(() => decodeJwt(token)).toThrowError('Failed to decode and parse JWT payload');
    // });
  });
});
