import type { AppConfig } from 'src/types/window';
import { describe, vi, it, afterEach, beforeEach, expect } from 'vitest';

// Mock i18n
vi.mock('src/boot/i18n.ts', () => ({
  default: () => { }
}));

describe('SelectModule - Feature Flag Logic', () => {
  let originalAppConfig: AppConfig | undefined;

  beforeEach(() => {
    originalAppConfig = window.APP_CONFIG;
  });

  afterEach(() => {
    // @ts-expect-error - For typescript type mast***** shenanigans
    window.APP_CONFIG = originalAppConfig;
  });


  describe('window.APP_CONFIG feature flag behavior', () => {
    it('should return true when feature flag is "true" string', () => {
      window.APP_CONFIG = {
        API_BASE_URL: 'http://localhost:8000',
        WS_BASE_URL: 'ws://localhost:8000/api/core',
        FEATURE_COMPLIANCE_FRAMEWORK_ENABLED: 'true'
      };

      const isEnabled = window.APP_CONFIG.FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true';
      expect(isEnabled).toBe(true);
    });

    it('should return false when feature flag is "false" string', () => {
      window.APP_CONFIG = {
        API_BASE_URL: 'http://localhost:8000',
        WS_BASE_URL: 'ws://localhost:8000/api/core',
        FEATURE_COMPLIANCE_FRAMEWORK_ENABLED: 'false'
      };

      const isEnabled = window.APP_CONFIG.FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true';
      expect(isEnabled).toBe(false);
    });

    it('should handle missing APP_CONFIG gracefully', () => {
      delete (window as Window).APP_CONFIG;

      const isEnabled = window.APP_CONFIG?.FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true';
      expect(isEnabled).toBe(false)
    });

    it('should return false when feature flag is empty string', () => {
      window.APP_CONFIG = {
        API_BASE_URL: 'http://localhost:8000',
        WS_BASE_URL: 'ws://localhost:8000/api/core',
        FEATURE_COMPLIANCE_FRAMEWORK_ENABLED: ''
      };

      const isEnabled = window.APP_CONFIG.FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true';
      expect(isEnabled).toBe(false);

    })

  })


});
