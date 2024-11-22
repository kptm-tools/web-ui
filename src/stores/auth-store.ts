import { UserInfo } from '@fusionauth/vue-sdk';
import { defineStore } from 'pinia';

type AuthStore = {
  userInfo: UserInfo | undefined;
};

export const useCounterStore = defineStore('auth', {
  state: () =>
    ({
      userInfo: undefined,
    } as AuthStore),

  getters: {
    isAuthenticated(state): boolean {
      return !!state.userInfo;
    },
  },

  actions: {
    setUserInfo(userInfo: UserInfo | undefined): void {
      this.userInfo = userInfo;
    },
  },
});
