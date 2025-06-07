import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from 'auth/store/auth-store';
import type { SuccessAuthLoginUser } from 'src/models/fusion-auth.models';

vi.mock('src/services/fusion-auth.service', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  authenticateUser: vi.fn() as Mock
}));

describe('FusionAuth Store', () => {
  let store: ReturnType<typeof useAuthStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useAuthStore();
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('should return false when userInfo is undefined', () => {
    store.userInfo = undefined; // Simulate no user logged in
    expect(store.isAuthenticated).toBe(false); // Check the getter value
  });

  it('should return true when userInfo is set', () => {
    const now = new Date();
    now.setDate(now.getDate() + 14);
    store.setUserInfo({
      accessToken: 'mock-token',
      tokenExpirationInstant: now.getTime(),
      otp: 'otp',
      tenantId: ''
    });
    expect(store.isAuthenticated).toBe(false);
  });

  it('should set userInfo and sessionStorage when userInfo is defined', () => {
    const mockUser = {
      accessToken: 'mock-token',
      tokenExpirationInstant: Date.now() + 3600 * 1000,
      user: {} as SuccessAuthLoginUser,
      otp: 'otp',
      tenantId: ''
    };

    // Call the setUserInfo method
    store.setUserInfo(mockUser);

    // Assert that the userInfo was set correctly
    expect(store.userInfo).toEqual(mockUser);
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
