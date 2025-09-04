import { useAuthStore } from 'auth/stores/auth-store';
import type { NavigationGuardNext, RouteLocationNormalizedGeneric } from 'vue-router';
import { AUTH_ROUTES } from 'auth/routes/route-names';
import { getSessionStorageValues } from 'auth/helpers/sessionStorage';

/**
 * @function handlerRouterAuth
 * @description
 * Vue Router navigation guard for handling authentication. It checks if a route
 * requires authentication and validates user session.
 * Redirects to the login page if the user isn't authenticated.
 *
 * @param {RouteLocationNormalizedGeneric} to - The target route.
 * @param {NavigationGuardNext} next - Function to resolve navigation.
 * @returns {void}
 */
export function handlerRouterAuth(
  to: RouteLocationNormalizedGeneric,
  next: NavigationGuardNext
): void {
  const authStore = useAuthStore();
  const { accessToken, tokenExpirationInstant, tenantId, audits } = getSessionStorageValues();

  // Save session storage information in store
  authStore.setTokenInfo({ accessToken, tokenExpirationInstant, tenantId, audits });

  if (!routeRequiresAuth(to)) {
    next();
    return;
  }

  if (!authStore.isAuthenticated || !accessToken) {
    next({ name: AUTH_ROUTES.login.name });
    return;
  }

  // If user data is missing after page refresh, redirect to login
  // This ensures a clean auth flow - user data comes from login response only
  if (!authStore.hasUserData) {
    next({ name: AUTH_ROUTES.login.name });
    return;
  }

  next();
}

function routeRequiresAuth(to: RouteLocationNormalizedGeneric): boolean {
  return to.matched.some(record => record.meta.requiresAuth);
}
