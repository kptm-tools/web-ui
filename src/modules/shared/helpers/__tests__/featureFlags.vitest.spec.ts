import { describe, it, expect } from 'vitest';
import { isFeatureFlagEnabled, routeRequiresFeatureFlag } from '../featureFlags';


describe('Feature Flag Utilities', () => {
  describe('isFeatureFlagEnabled', () => {
    it('should return true only for exact string "true"', () => {
      expect(isFeatureFlagEnabled('true')).toBe(true);
    })
    it('should return false only for exact string "false"', () => {
      expect(isFeatureFlagEnabled('false')).toBe(false)
    })
    it('should return false for undefined', () => {
      expect(isFeatureFlagEnabled(undefined)).toBe(false)
    })
    it('should return false for empty string', () => {
      expect(isFeatureFlagEnabled('')).toBe(false)
    })
    it('should return false for empty string', () => {
      expect(isFeatureFlagEnabled('')).toBe(false)
    })
    it('should be case-sensitive', () => {
      expect(isFeatureFlagEnabled('TRUE')).toBe(false)
      expect(isFeatureFlagEnabled('True')).toBe(false)
    })
    it('should reject truthy strings', () => {
      expect(isFeatureFlagEnabled('1')).toBe(false)
      expect(isFeatureFlagEnabled('yes')).toBe(false)
      expect(isFeatureFlagEnabled('on')).toBe(false)
    })
  });
  describe('routeRequiresFeatureFlag', () => {
    it('should return true when route has matching feature flag', () => {
      const mockRoute = {
        matched: [
          { meta: { requiresFeatureFlag: 'compliance-framework' } }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      expect(routeRequiresFeatureFlag(mockRoute, 'compliance-framework')).toBe(true);
    });

    it('should return false when route has different feature flag', () => {
      const mockRoute = {
        matched: [
          { meta: { requiresFeatureFlag: 'other-feature' } }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      expect(routeRequiresFeatureFlag(mockRoute, 'compliance-framework')).toBe(false);

    })

    it('should return false when route has no feature flag', () => {
      const mockRoute = {
        matched: [
          { meta: { requiresAuth: true } }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      expect(routeRequiresFeatureFlag(mockRoute, 'compliance-framework')).toBe(false);
    })

    it('should check all matched routes', () => {
      const mockRoute = {
        matched: [
          { meta: { requiresAuth: true } },
          { meta: {} },
          { meta: {} },
          { meta: { requiresFeatureFlag: 'compliance-framework' } }
        ]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      expect(routeRequiresFeatureFlag(mockRoute, 'compliance-framework')).toBe(true)
    })


  });
})
