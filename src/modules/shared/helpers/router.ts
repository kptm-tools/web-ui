import { useAuthStore } from 'auth/stores/auth-store';
import type { NavigationGuardNext, RouteLocationNormalizedGeneric } from 'vue-router';
import type { AxiosError } from 'axios';
import { UserService } from 'shared/services/user';
import { decodeJwt } from 'auth/helpers/jwt';
import { AUTH_ROUTES } from 'auth/routes/route-names';
import { getSessionStorageValues } from 'auth/helpers/sessionStorage';

/**
 * @async
 * @function handlerRouterAuth
 * @description
 * Vue Router navigation guard for handling authentication. It checks if a route
 * requires authentication, validates user status, and retrieves user data.
 * Redirects to the login page if the user isn't authenticated or if an error occurs.
 *
 * @param {RouteLocationNormalizedGeneric} to - The target route.
 * @param {NavigationGuardNext} next - Function to resolve navigation.
 * @returns {Promise<void>}
 */
export async function handlerRouterAuth(
  to: RouteLocationNormalizedGeneric,
  next: NavigationGuardNext
): Promise<void> {
  const authStore = useAuthStore();
  const { accessToken, otp, tokenExpirationInstant, tenantId } = getSessionStorageValues();

  //Save session storage information in store
  authStore.setTokenInfo({ accessToken, tokenExpirationInstant, otp, tenantId });

  if (!routeRequiresAuth(to)) {
    next();
    return;
  }
  if (!authStore.isAuthenticated) {
    next({ name: AUTH_ROUTES.login.name });
    return;
  }
  try {
    if (!accessToken) {
      next({ name: AUTH_ROUTES.login.name });
      return;
    }

    const decodedToken = decodeJwt(accessToken);
    if (!decodedToken || !decodedToken.sub) {
      next({ name: AUTH_ROUTES.login.name });
      return;
    }

    const { data } = await UserService.getUser(decodedToken.sub);

    authStore.setUserInfo(
      {
        accessToken,
        tokenExpirationInstant,
        otp,
        tenantId
      },
      data
    );
    next();
  } catch (error) {
    const errorAxios = error as AxiosError;
    if (errorAxios.status === 401) {
      next({ name: AUTH_ROUTES.login.name });
    } else {
      next(false);
    }
  }
}

function routeRequiresAuth(to: RouteLocationNormalizedGeneric): boolean {
  return to.matched.some(record => record.meta.requiresAuth);
}
