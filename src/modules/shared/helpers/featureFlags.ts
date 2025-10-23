import type { RouteLocationNormalized } from "vue-router";

/**
 * Checks if a feature flag is enabled
 * @param flagValue - The string value from config ('true', 'false', undefined, etc)
 * @returns true only if flagValue is exactly the string 'true'
 */
export function isFeatureFlagEnabled(flagValue: string | undefined): boolean {
  return flagValue === 'true';
}

/**
 * Checks if a route requires a specific feature flag
 * @param route - Vue router route object
 * @param featureFlagName - Name of the feature flag to check
 * @returns true if route requires this feature flag
 */
export function routeRequiresFeatureFlag(
  route: RouteLocationNormalized,
  featureFlagName: string
): boolean {
  return route.matched.some(
    record => record.meta.requiresFeatureFlag === featureFlagName
  )
}
