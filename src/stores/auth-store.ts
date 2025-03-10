import {
  authenticateUser,
  changePassword,
  forgotPassword
} from 'src/services/auth.service';
import { UserService } from 'src/services';
import { defineStore } from 'pinia';
import {
  ChangePasswordBody,
  CreateUserBody,
  ForgotPasswordBody,
  FusionAuthLoginBody,
  SuccessAuthLogin
} from 'src/models/fusion-auth.models';
import {
  clearSessionStorageUserInfo,
  isTokenExpired,
  setSessionStorageUserInfo,
  successLoginResponseHandler
} from 'src/utils/auth.utils';

type AuthStore = {
  userInfo: SuccessAuthLogin | undefined;
  token: string;
  tokenExpirationInstant: number;
};

export const useFusionAuthStore = defineStore('fusion-auth', {
  state: () =>
    ({
      userInfo: undefined,
      token: '',
      tokenExpirationInstant: 0
    } as AuthStore),

  getters: {
    isAuthenticated(state): boolean {
      const isExpired = isTokenExpired(Number(state.tokenExpirationInstant));
      return !isExpired;
    },
    getUserInfo(state): SuccessAuthLogin | undefined {
      return state.userInfo;
    }
  },

  actions: {
    async loginUser(loginBody: FusionAuthLoginBody): Promise<void> {
      try {
        const response = await authenticateUser(loginBody);
        successLoginResponseHandler(response.status, response.data);
      } catch (error) {
        console.error(error);
      }
    },
    async registerUser(body: CreateUserBody): Promise<void> {
      try {
        const response = await UserService.createUser(body);
        console.info('User created:', response);
      } catch (error) {
        console.error(error);
      }
    },
    async recoverPassword(body: ForgotPasswordBody): Promise<void> {
      try {
        await forgotPassword(body);
      } catch (error) {
        console.error(error);
      }
    },
    async changePassword(body: ChangePasswordBody): Promise<void> {
      try {
        await changePassword(body);
      } catch (error) {
        console.error(error);
      }
    },
    setUserInfo(userInfo: SuccessAuthLogin | undefined): void {
      this.userInfo = userInfo;
      if (this.userInfo) {
        setSessionStorageUserInfo(
          this.userInfo.token,
          this.userInfo.tokenExpirationInstant
        );
      }
    },
    setTokenInfo(token: string, expirationInstant: number): void {
      this.token = token;
      this.tokenExpirationInstant = expirationInstant;
    },
    async logoutUser(): Promise<void> {
      clearSessionStorageUserInfo();
      this.token = '';
      this.tokenExpirationInstant = 0;
      this.userInfo = undefined;
    }
  }
});
