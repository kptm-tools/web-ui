import { authenticateUser } from 'src/services/fusion-auth.service';
import { defineStore } from 'pinia';
import {
  ErrorAuthLoginPrevent,
  FusionAuthErrorResponse,
  FusionAuthLoginBody,
  SuccessAuthLogin,
  SuccessAuthLoginChangePassword,
  SuccessAuthLoginTwoFactor,
} from 'src/models/fusion-auth.models';
import {
  AUTH_STATUS_CODES,
  AUTH_TOKEN_NAMES,
} from 'src/constants/fusion-auth.constants';

type AuthStore = {
  userInfo: SuccessAuthLogin | undefined;
};

export const useFusionAuthStore = defineStore('fusion-auth', {
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
    async loginUser(
      loginBody: FusionAuthLoginBody,
    ): Promise<void> {
      const response = await authenticateUser(loginBody);
      if (AUTH_STATUS_CODES.LOGIN.SUCCESS_CODES.includes(response.status)) {
        const successResponse = response.data as SuccessAuthLogin;
        this.setUserInfo(successResponse);
      } else if (
        response.status === AUTH_STATUS_CODES.LOGIN.CHANGE_PASSWORD_CODE
      ) {
        const successChangePassword =
          response.data as SuccessAuthLoginChangePassword;
        console.log('Need to change password', successChangePassword);
      } else if (response.status === AUTH_STATUS_CODES.LOGIN.TWO_FACTOR_CODE) {
        const successTwoFactor = response.data as SuccessAuthLoginTwoFactor;
        console.log('Need to validate two factor', successTwoFactor);
      } else if (
        response.status === AUTH_STATUS_CODES.LOGIN.PREVENT_LOGIN_CODE
      ) {
        const errorLoginPrevent = response.data as ErrorAuthLoginPrevent;
        console.log('Login was prevented', errorLoginPrevent);
      } else if (response.status === AUTH_STATUS_CODES.LOGIN.MALFORMED_CODE) {
        const errorLoginMalformed = response.data as FusionAuthErrorResponse;
        console.log('Login was malformed', errorLoginMalformed);
      }
    },
    setUserInfo(userInfo: SuccessAuthLogin | undefined): void {
      this.userInfo = userInfo;
      if (this.userInfo) {
        sessionStorage.setItem(
          AUTH_TOKEN_NAMES.ACCESS_TOKEN,
          JSON.stringify(this.userInfo.token)
        );
        sessionStorage.setItem(
          AUTH_TOKEN_NAMES.TOKEN_EXPIRATION_INSTANT,
          JSON.stringify(this.userInfo.tokenExpirationInstant)
        );
      }
    },
  },
});
