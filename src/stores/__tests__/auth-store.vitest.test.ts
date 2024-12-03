import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useFusionAuthStore } from '../auth-store';
import { authenticateUser } from 'src/services/fusion-auth.service';
import {
  AUTH_STATUS_CODES,
  AUTH_TOKEN_NAMES
} from 'src/constants/fusion-auth.constants';
import {
  FusionAuthLoginBody,
  SuccessAuthLoginUser
} from 'src/models/fusion-auth.models';

vi.mock('src/services/fusion-auth.service', () => ({
  authenticateUser: vi.fn() as Mock
}));

describe('FusionAuth Store', () => {
  let store: ReturnType<typeof useFusionAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useFusionAuthStore();
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  const authLoginPayload = { loginId: 'test', password: 'password' };
  const logMessages = {
    changePasswordMsg: 'Need to change password',
    twoFactorMsg: 'Need to validate two factor',
    loginPreventedMsg: 'Login was prevented',
    loginMalformedMsg: 'Login was malformed'
  };

  function mockAuthResponse(statusCode: number, responseData: object) {
    (authenticateUser as Mock).mockResolvedValueOnce({
      status: statusCode,
      data: responseData
    });
    return vi.spyOn(console, 'log');
  }

  it('should return false when userInfo is undefined', () => {
    store.userInfo = undefined; // Simulate no user logged in
    expect(store.isAuthenticated).toBe(false); // Check the getter value
  });

  it('should return true when userInfo is set', () => {
    store.userInfo = {
      token: 'mock-token',
      tokenExpirationInstant: Date.now(),
      user: {} as SuccessAuthLoginUser
    }; // Simulate a logged-in user
    expect(store.isAuthenticated).toBe(true); // Check the getter value
  });

  it('should login successfully and set userInfo', async () => {
    const mockUser = {
      token: 'mock-token',
      tokenExpirationInstant: Date.now() + 3600 * 1000
    };
    mockAuthResponse(AUTH_STATUS_CODES.LOGIN.SUCCESS_CODES[0], mockUser);
    await store.loginUser(authLoginPayload);

    expect(store.userInfo).toEqual(mockUser);
    expect(sessionStorage.getItem(AUTH_TOKEN_NAMES.ACCESS_TOKEN)).toBe(
      JSON.stringify(mockUser.token)
    );
    expect(
      sessionStorage.getItem(AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT)
    ).toBe(JSON.stringify(mockUser.tokenExpirationInstant));
  });

  it('should handle password change response', async () => {
    const consoleSpy = mockAuthResponse(
      AUTH_STATUS_CODES.LOGIN.CHANGE_PASSWORD_CODE,
      { message: 'Change your password' }
    );
    await store.loginUser(authLoginPayload);

    expect(consoleSpy).toHaveBeenCalledWith(logMessages.changePasswordMsg, {
      message: 'Change your password'
    });
    expect(store.userInfo).toBeUndefined();
  });

  it('should handle two-factor authentication response', async () => {
    const consoleSpy = mockAuthResponse(
      AUTH_STATUS_CODES.LOGIN.TWO_FACTOR_CODE,
      { message: 'Two-factor required' }
    );
    await store.loginUser(authLoginPayload);

    expect(consoleSpy).toHaveBeenCalledWith(logMessages.twoFactorMsg, {
      message: 'Two-factor required'
    });
    expect(store.userInfo).toBeUndefined();
  });

  it('should handle login prevention response', async () => {
    const consoleSpy = mockAuthResponse(
      AUTH_STATUS_CODES.LOGIN.PREVENT_LOGIN_CODE,
      { message: 'Login prevented' }
    );
    await store.loginUser(authLoginPayload);

    expect(consoleSpy).toHaveBeenCalledWith(logMessages.loginPreventedMsg, {
      message: 'Login prevented'
    });
    expect(store.userInfo).toBeUndefined();
  });

  it('should handle malformed login response', async () => {
    const consoleSpy = mockAuthResponse(
      AUTH_STATUS_CODES.LOGIN.MALFORMED_CODE,
      { message: 'Malformed login' }
    );
    await store.loginUser({} as FusionAuthLoginBody);

    expect(consoleSpy).toHaveBeenCalledWith(logMessages.loginMalformedMsg, {
      message: 'Malformed login'
    });
    expect(store.userInfo).toBeUndefined();
  });

  it('should handle other status code', async () => {
    mockAuthResponse(999, { message: 'Malformed login' });
    await store.loginUser({} as FusionAuthLoginBody);

    expect(store.userInfo).toBeUndefined();
  });

  it('should set userInfo and sessionStorage when userInfo is defined', () => {
    const mockUser = {
      token: 'mock-token',
      tokenExpirationInstant: Date.now() + 3600 * 1000,
      user: {} as SuccessAuthLoginUser
    };

    // Mock the sessionStorage methods to spy on them
    const setItemSpy = vi.spyOn(sessionStorage, 'setItem');

    // Call the setUserInfo method
    store.setUserInfo(mockUser);

    // Assert that the userInfo was set correctly
    expect(store.userInfo).toEqual(mockUser);

    // Assert that sessionStorage.setItem was called with the correct keys and values
    expect(setItemSpy).toHaveBeenCalledWith(
      AUTH_TOKEN_NAMES.ACCESS_TOKEN,
      JSON.stringify(mockUser.token)
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT,
      JSON.stringify(mockUser.tokenExpirationInstant)
    );
  });

  it('should not set sessionStorage when userInfo is undefined', () => {
    // Mock the sessionStorage methods
    const setItemSpy = vi.spyOn(sessionStorage, 'setItem');

    // Call setUserInfo with undefined
    store.setUserInfo(undefined);

    // Assert that sessionStorage.setItem was not called
    expect(setItemSpy).not.toHaveBeenCalled();
    expect(store.userInfo).toBeUndefined();
  });
});
