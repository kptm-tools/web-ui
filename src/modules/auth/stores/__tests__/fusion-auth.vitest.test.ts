import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../auth-store'; // Adjust the import path as needed
import { authenticateUser, changePassword, forgotPassword } from 'auth/services/auth';
import { UserService } from 'shared/services/user';
import * as sessionStorageHelpers from 'auth/helpers/sessionStorage';
import * as dateHelpers from 'shared/helpers/date';

// Mock the external dependencies
vi.mock('auth/services/auth', () => ({
  authenticateUser: vi.fn(),
  changePassword: vi.fn(),
  forgotPassword: vi.fn()
}));
vi.mock('shared/services/user', () => ({
  UserService: {
    createUser: vi.fn()
  }
}));
vi.mock('auth/helpers/sessionStorage', () => ({
  setSessionStorageValues: vi.fn(),
  clearSessionStorageValues: vi.fn()
}));
vi.mock('shared/helpers/date', () => ({
  isTimestampExpired: vi.fn()
}));
vi.mock('src/utils', () => ({
  errorQuasarNotify: vi.fn()
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    // Creates a new Pinia instance and makes it the active one
    setActivePinia(createPinia());
  });

  // Test suite for getters
  describe('getters', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let authStore: any;

    beforeEach(() => {
      setActivePinia(createPinia());
      authStore = useAuthStore();
    });

    it('isAuthenticated returns true if the token is not expired', () => {
      vi.mocked(dateHelpers.isTimestampExpired).mockReturnValue(false);
      authStore.userKeys = { tokenExpirationInstant: 1234567890 };
      expect(authStore.isAuthenticated).toBe(true);
    });

    it('isAuthenticated returns false if the token is expired', () => {
      vi.mocked(dateHelpers.isTimestampExpired).mockReturnValue(true);
      authStore.userKeys = { tokenExpirationInstant: 1234567890 };
      expect(authStore.isAuthenticated).toBe(false);
    });

    it('isSuperAdmin returns true if user has "super-admin" role', () => {
      authStore.userInfo = {
        registrations: [{ roles: ['user', 'super-admin'] }]
      };
      expect(authStore.isSuperAdmin).toBe(true);
    });

    it('isSuperAdmin returns false if user does not have "super-admin" role', () => {
      authStore.userInfo = {
        registrations: [{ roles: ['user'] }]
      };
      expect(authStore.isSuperAdmin).toBe(false);
    });

    it('getUserInfo returns the userInfo object', () => {
      const userInfo = { fullName: 'John Doe' };
      authStore.userInfo = userInfo;
      expect(authStore.getUserInfo).toEqual(userInfo);
    });

    it('getUserInfo returns a default object if userInfo is undefined', () => {
      authStore.userInfo = undefined;
      expect(authStore.getUserInfo).toEqual({ fullName: '' });
    });

    it('userFullName returns the full name', () => {
      authStore.userInfo = { fullName: 'Jane Doe' };
      expect(authStore.userFullName).toBe('Jane Doe');
    });

    it('userFullName returns an empty string if userInfo is undefined', () => {
      authStore.userInfo = undefined;
      expect(authStore.userFullName).toBe('');
    });

    it('userRole returns the first role', () => {
      authStore.userInfo = { registrations: [{ roles: ['admin', 'user'] }] };
      expect(authStore.userRole).toBe('admin');
    });

    it('userRole returns an empty string if roles are not available', () => {
      authStore.userInfo = { registrations: [] };
      expect(authStore.userRole).toBe('');
    });

    it('userRoleFormatted returns a capitalized role', () => {
      authStore.userInfo = { registrations: [{ roles: ['user-role'] }] };
      expect(authStore.userRoleFormatted).toBe('User-role');
    });

    it('userEmail returns the user email', () => {
      authStore.userInfo = { email: 'test@example.com' };
      expect(authStore.userEmail).toBe('test@example.com');
    });

    it('tenantId returns the user tenant ID', () => {
      authStore.userInfo = { tenantId: 'some-tenant-id' };
      expect(authStore.tenantId).toBe('some-tenant-id');
    });

    it('hasUserData returns true if userInfo and id exist', () => {
      authStore.userInfo = { id: 'some-id' };
      expect(authStore.hasUserData).toBe(true);
    });

    it('hasUserData returns false if userInfo is undefined', () => {
      authStore.userInfo = undefined;
      expect(authStore.hasUserData).toBe(false);
    });

    it('accessToken returns the access token', () => {
      authStore.userKeys = { accessToken: 'some-token' };
      expect(authStore.accessToken).toBe('some-token');
    });

    it('accessToken returns an empty string if userKeys is undefined', () => {
      authStore.userKeys = undefined;
      expect(authStore.accessToken).toBe('');
    });
  });

  // Test suite for actions
  describe('actions', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let authStore: any;

    beforeEach(() => {
      setActivePinia(createPinia());
      authStore = useAuthStore();
      vi.clearAllMocks();
    });

    describe('loginUser', () => {
      const mockRouter = { push: vi.fn() };
      const mockLoginBody = { username: 'testuser', password: 'password' };

      it('handles login API errors', async () => {
        const mockError = 'Network Error';
        vi.mocked(authenticateUser).mockRejectedValue(mockError);

        await authStore.loginUser(mockLoginBody, mockRouter);

        expect(authenticateUser).toHaveBeenCalledWith(mockLoginBody);
        expect(authStore.userKeys).toBeUndefined();
        expect(authStore.userInfo).toBeUndefined();
        expect(sessionStorageHelpers.setSessionStorageValues).not.toHaveBeenCalled();
        expect(mockRouter.push).not.toHaveBeenCalled();
      });
    });

    describe('registerUser', () => {
      it('calls UserService.createUser on success', async () => {
        const mockBody = { email: 'newuser@example.com' };
        // eslint-disable-next-line @typescript-eslint/unbound-method
        vi.mocked(UserService.createUser).mockResolvedValue({});

        await authStore.registerUser(mockBody);

        // eslint-disable-next-line @typescript-eslint/unbound-method
        expect(UserService.createUser).toHaveBeenCalledWith(mockBody);
      });

      it('handles registration API errors', async () => {
        const mockError = 'Registration failed';
        // eslint-disable-next-line @typescript-eslint/unbound-method
        vi.mocked(UserService.createUser).mockRejectedValue(mockError);
        const consoleErrorSpy = vi.spyOn(console, 'error');

        await authStore.registerUser({});

        expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
      });
    });

    describe('recoverPassword', () => {
      it('calls forgotPassword on success', async () => {
        const mockBody = { email: 'user@example.com' };
        vi.mocked(forgotPassword).mockResolvedValue({});

        await authStore.recoverPassword(mockBody);

        expect(forgotPassword).toHaveBeenCalledWith(mockBody);
      });

      it('handles password recovery API errors', async () => {
        const mockError = 'Recovery failed';
        vi.mocked(forgotPassword).mockRejectedValue(mockError);
        const consoleErrorSpy = vi.spyOn(console, 'error');

        await authStore.recoverPassword({});

        expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
      });
    });

    describe('changePassword', () => {
      it('calls changePassword on success', async () => {
        const mockBody = { newPassword: 'new-password' };
        vi.mocked(changePassword).mockResolvedValue({});

        await authStore.changePassword(mockBody);

        expect(changePassword).toHaveBeenCalledWith(mockBody);
      });

      it('handles change password API errors', async () => {
        const mockError = 'Change failed';
        vi.mocked(changePassword).mockRejectedValue(mockError);
        const consoleErrorSpy = vi.spyOn(console, 'error');

        await authStore.changePassword({});

        expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
      });
    });

    it('setUserInfo correctly updates state and session storage', () => {
      const mockKeys = { accessToken: 'token', tokenExpirationInstant: 123 };
      const mockInfo = { id: 'user-id', fullName: 'Test User' };

      authStore.setUserInfo(mockKeys, mockInfo);

      expect(authStore.userKeys).toEqual(mockKeys);
      expect(authStore.userInfo).toEqual(mockInfo);
      expect(sessionStorageHelpers.setSessionStorageValues).toHaveBeenCalledWith(mockKeys);
    });

    it('setTokenInfo correctly updates userKeys state', () => {
      const mockKeys = { accessToken: 'new-token' };

      authStore.setTokenInfo(mockKeys);

      expect(authStore.userKeys).toEqual(mockKeys);
    });

    it('logoutUser clears session storage and resets state', () => {
      authStore.userKeys = { accessToken: 'some-token' };
      authStore.userInfo = { id: 'some-id' };

      authStore.logoutUser();

      expect(sessionStorageHelpers.clearSessionStorageValues).toHaveBeenCalled();
      expect(authStore.userInfo).toBeUndefined();
    });

    it('logout calls logoutUser', () => {
      const logoutUserSpy = vi.spyOn(authStore, 'logoutUser');

      authStore.logout();

      expect(logoutUserSpy).toHaveBeenCalled();
    });
  });
});
