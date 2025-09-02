import { AUTH_TOKEN_NAMES } from 'src/constants/fusion-auth.constants';
import type { sessionStorageKeys } from 'auth/models/sessionStorage';
import {
  getSessionStorageValues,
  setSessionStorageValues,
  clearSessionStorageValues
} from 'auth/helpers/sessionStorage';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Auth/helpers:sessionStorage', () => {
  let sessionStorageMock: Record<string, string>;

  beforeEach(() => {
    sessionStorageMock = {};

    vi.spyOn(sessionStorage, 'getItem').mockImplementation((key: string) => {
      return sessionStorageMock[key] === undefined ? null : sessionStorageMock[key];
    });
    vi.spyOn(sessionStorage, 'setItem').mockImplementation((key: string, value: string) => {
      sessionStorageMock[key] = value;
    });
    vi.spyOn(sessionStorage, 'removeItem').mockImplementation((key: string) => {
      delete sessionStorageMock[key];
    });
    vi.spyOn(sessionStorage, 'clear').mockImplementation(() => {
      sessionStorageMock = {};
    });
  });

  describe('getSessionStorageValues', () => {
    it('should return default empty values when session storage is empty', () => {
      const result = getSessionStorageValues();
      expect(result).toEqual({
        accessToken: '',
        tokenExpirationInstant: 0,
        tenantId: '',
        audits: ''
      });
    });

    it('should return stored values when all items are present', () => {
      sessionStorageMock[AUTH_TOKEN_NAMES.ACCESS_TOKEN] = 'test_access_token';
      sessionStorageMock[AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT] = '1678886400000';
      sessionStorageMock[AUTH_TOKEN_NAMES.TENANT_ID] = 'test_tenant';

      const result = getSessionStorageValues();
      expect(result).toEqual({
        accessToken: 'test_access_token',
        tokenExpirationInstant: 1678886400000,
        tenantId: 'test_tenant',
        audits: ''
      });
    });

    it('should return default values for missing items', () => {
      sessionStorageMock[AUTH_TOKEN_NAMES.ACCESS_TOKEN] = 'partial_token';

      const result = getSessionStorageValues();
      expect(result).toEqual({
        accessToken: 'partial_token',
        otp: '',
        tokenExpirationInstant: 0,
        tenantId: '',
        audits: ''
      });
    });

    it('should correctly handle tokenExpirationInstant when it is a non-numeric string', () => {
      sessionStorageMock[AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT] = 'not-a-number';
      const result = getSessionStorageValues();
      expect(result.tokenExpirationInstant).toBe(0);
    });

    it('should correctly handle tokenExpirationInstant when it is "0"', () => {
      sessionStorageMock[AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT] = '0';
      const result = getSessionStorageValues();
      expect(result.tokenExpirationInstant).toBe(0);
    });
  });

  describe('setSessionStorageValues', () => {
    it('should set all provided values into session storage and return them', () => {
      const dataToSet: sessionStorageKeys = {
        accessToken: 'new_access_token',
        tokenExpirationInstant: 1678900000000,
        tenantId: 'new_tenant',
        audits: ''
      };

      const result = setSessionStorageValues(dataToSet);

      expect(sessionStorageMock[AUTH_TOKEN_NAMES.ACCESS_TOKEN]).toBe(dataToSet.accessToken);
      expect(sessionStorageMock[AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT]).toBe(
        dataToSet.tokenExpirationInstant.toString()
      );
      expect(sessionStorageMock[AUTH_TOKEN_NAMES.TENANT_ID]).toBe(dataToSet.tenantId);
      expect(result).toEqual(dataToSet);
    });

    it('should handle empty string inputs for string fields', () => {
      const dataToSet: sessionStorageKeys = {
        accessToken: '',
        tokenExpirationInstant: 12345,
        tenantId: '',
        audits: ''
      };

      setSessionStorageValues(dataToSet);
      expect(sessionStorageMock[AUTH_TOKEN_NAMES.ACCESS_TOKEN]).toBe('');
      expect(sessionStorageMock[AUTH_TOKEN_NAMES.TENANT_ID]).toBe('');
    });

    it('should handle zero for tokenExpirationInstant', () => {
      const dataToSet: sessionStorageKeys = {
        accessToken: 'some_token',
        tokenExpirationInstant: 0,
        tenantId: 'some_tenant',
        audits: ''
      };

      setSessionStorageValues(dataToSet);
      expect(sessionStorageMock[AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT]).toBe('0');
      const result = getSessionStorageValues();
      expect(result.tokenExpirationInstant).toBe(0);
    });
  });

  describe('clearSessionStorageValues', () => {
    it('should remove all authentication-related items from session storage', () => {
      sessionStorageMock[AUTH_TOKEN_NAMES.ACCESS_TOKEN] = 'token_to_clear';
      sessionStorageMock[AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT] = '123';
      sessionStorageMock[AUTH_TOKEN_NAMES.TENANT_ID] = 'tenant_to_clear';

      expect(sessionStorageMock).toHaveProperty(AUTH_TOKEN_NAMES.ACCESS_TOKEN);

      clearSessionStorageValues();

      expect(sessionStorageMock).not.toHaveProperty(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
      expect(sessionStorageMock).not.toHaveProperty(AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT);
      expect(sessionStorageMock).not.toHaveProperty(AUTH_TOKEN_NAMES.TENANT_ID);

      const result = getSessionStorageValues();
      expect(result).toEqual({
        accessToken: '',
        tokenExpirationInstant: 0,
        tenantId: '',
        audits: ''
      });
    });

    it('should do nothing if session storage is already empty', () => {
      clearSessionStorageValues();
      const result = getSessionStorageValues();
      expect(result).toEqual({
        accessToken: '',
        tokenExpirationInstant: 0,
        tenantId: '',
        audits: ''
      });
    });
  });
});
