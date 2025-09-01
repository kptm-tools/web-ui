import { authenticateUser, changePassword, forgotPassword } from 'auth/services/auth';
import { UserService } from 'shared/services/user';
import { defineStore } from 'pinia';
import type {
  ChangePasswordBody,
  CreateUserBody,
  ForgotPasswordBody,
  FusionAuthLoginBody,
  SuccessAuthLogin,
  SuccessAuthLoginChangePassword,
  SuccessAuthLoginTwoFactor,
  SuccessAuthLoginUser
} from 'auth/models/fusion-auth.models';
import type { sessionStorageKeys } from 'auth/models/sessionStorage';
import { setSessionStorageValues, clearSessionStorageValues } from 'auth/helpers/sessionStorage';
import { isTimestampExpired } from 'shared/helpers/date';
import { AUTH_STATUS_CODES } from 'src/constants/fusion-auth.constants';
import { errorQuasarNotify } from 'src/utils';
import { type Router } from 'vue-router';
import { SHARED_ROUTES } from 'src/modules/shared/routes/route-names';

type AuthStore = {
  userKeys: sessionStorageKeys | undefined;
  userInfo: SuccessAuthLoginUser | undefined;
};

export const useAuthStore = defineStore('auth-store', {
  state: () =>
    ({
      userKeys: undefined,
      userInfo: undefined
    }) as AuthStore,

  getters: {
    isAuthenticated(state): boolean {
      return !isTimestampExpired(Number(state.userKeys?.tokenExpirationInstant));
    },
    getUserInfo(state): SuccessAuthLoginUser {
      return state.userInfo || ({ user: { lastname: '', name: '' } } as SuccessAuthLoginUser);
    }
  },

  actions: {
    async loginUser(loginBody: FusionAuthLoginBody, router: Router): Promise<void> {
      try {
        const response = await authenticateUser(loginBody);
        if (AUTH_STATUS_CODES.LOGIN.SUCCESS_CODES.includes(response.status)) {
          const updatedResponse: SuccessAuthLogin = response.data as SuccessAuthLogin;
          const sessionStorage: sessionStorageKeys = {
            accessToken: updatedResponse.token,
            otp: updatedResponse.otp,
            tenantId: updatedResponse.tenantId,
            tokenExpirationInstant: updatedResponse.tokenExpirationInstant,
            audits: updatedResponse.audits
          };
          this.setUserInfo(sessionStorage);
          await router.push({ name: SHARED_ROUTES.selectModule.name });
        } else if (response.status === AUTH_STATUS_CODES.LOGIN.CHANGE_PASSWORD_CODE) {
          console.log('Need to change password', response.data as SuccessAuthLoginChangePassword);
        } else if (response.status === AUTH_STATUS_CODES.LOGIN.TWO_FACTOR_CODE) {
          console.log('Need to validate two factor', response.data as SuccessAuthLoginTwoFactor);
        }
      } catch (error) {
        errorQuasarNotify(error as string);
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
    setUserInfo(
      userKeys: sessionStorageKeys | undefined,
      userInfo: SuccessAuthLoginUser | undefined = undefined
    ): void {
      this.userKeys = userKeys;
      this.userInfo = userInfo;
      if (this.userKeys) {
        setSessionStorageValues(this.userKeys);
      }
    },
    setTokenInfo(data: sessionStorageKeys): void {
      this.userKeys = data;
    },
    logoutUser(): void {
      clearSessionStorageValues();
      this.userInfo = undefined;
    }
  }
});
