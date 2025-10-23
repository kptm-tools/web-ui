import { useAuthStore } from 'auth/stores/auth-store';
import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteLocationNormalizedGeneric
} from 'vue-router';
import { AUTH_ROUTES } from 'auth/routes/route-names';
import { getSessionStorageValues } from 'auth/helpers/sessionStorage';
import { SHARED_ROUTES } from '../routes/route-names';
import type { SuccessAuthLoginUser } from 'auth/models/fusion-auth.models';

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
  const { accessToken, tokenExpirationInstant, audits } = getSessionStorageValues();

  // Save session storage information in store
  authStore.setTokenInfo({ accessToken, tokenExpirationInstant, audits });

  // QA Testing bypass - skip auth when VITE_BYPASS_AUTH is set to 'true'
  if (import.meta.env.VITE_BYPASS_AUTH === 'true') {
    // Set mock user data for QA testing
    if (!authStore.hasUserData) {
      const mockUser: SuccessAuthLoginUser = {
        id: 'qa-test-user',
        email: 'qa@test.com',
        fullName: 'QA Test User',
        tenantId: 'qa-tenant',
        active: true,
        connectorId: '',
        data: {},
        insertInstant: Date.now(),
        lastLoginInstant: Date.now(),
        lastUpdateInstant: Date.now(),
        memberships: [],
        passwordChangeRequired: false,
        passwordLastUpdateInstant: Date.now(),
        preferredLanguages: ['en'],
        registrations: [
          {
            applicationId: 'qa-app',
            data: {},
            id: 'qa-registration',
            insertInstant: Date.now(),
            lastLoginInstant: Date.now(),
            lastUpdateInstant: Date.now(),
            preferredLanguages: ['en'],
            roles: ['super-admin'],
            tokens: {},
            usernameStatus: 'ACTIVE',
            verified: true,
            verifiedInstant: Date.now()
          }
        ],
        twoFactor: {
          methods: [],
          recoveryCodes: []
        },
        usernameStatus: 'ACTIVE',
        verified: true,
        verifiedInstant: Date.now()
      };

      authStore.setUserInfo(
        {
          accessToken: 'qa-testing-token',
          tokenExpirationInstant: Date.now() + 86400000, // 24 hours from now
          audits: 'qa-testing'
        },
        mockUser
      );
    }

    // Even with auth bypassed, still check feature flags
    if (!allowAudits(to)) {
      next({
        name: SHARED_ROUTES.selectModule.name,
        query: { reason: 'feature-disabled' }
      });
      return;
    }

    next();
    return;
  }

  if (!routeRequiresAuth(to)) {
    next();
    return;
  }

  if (routeRequiresSuperAdmin(to) && !authStore.isSuperAdmin) {
    next({ name: SHARED_ROUTES.selectModule.name });
    return;
  }

  if (!allowAudits(to)) {
    next({
      name: SHARED_ROUTES.selectModule.name,
      query: { reason: 'feature-disabled' }
    });
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

function allowAudits(to: RouteLocationNormalized): boolean {
  // Check if route requires compliance framework feature flag
  const requiresComplianceFlag = to.matched.some(record =>
    record.meta.requiresFeatureFlag === 'compliance-framework'
  );


  if (!requiresComplianceFlag) {
    return true; // Route doesn't need the feature flag
  }

  // Check runtime config (window.APP_CONFIG) for feature flag value
  if (typeof window !== 'undefined' && window.APP_CONFIG) {
    const result = window.APP_CONFIG.FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true';
    return result;
  }

  return false;
}

function routeRequiresSuperAdmin(to: RouteLocationNormalizedGeneric): boolean {
  return to.matched.some(record => record.meta.superAdmin);
}
