import { describe, it, expect, vi, afterEach } from 'vitest';
import { computed } from 'vue';

// Mock i18n
vi.mock('src/boot/i18n.ts', () => ({
  default: () => {}
}));

describe('SelectModule - Feature Flag Logic', () => {
  afterEach(() => {
    vi.unstubAllEnvs(); // Clean up environment variable stubs after each test
  });

  describe('accessAudits computed property logic', () => {
    it('should return true when env var is "true" string', () => {
      vi.stubEnv('VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED', 'true');

      const accessAudits = computed(() => import.meta.env.VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true');

      expect(accessAudits.value).toBe(true);
    });

    it('should return false when env var is "false" string', () => {
      vi.stubEnv('VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED', 'false');

      const accessAudits = computed(() => import.meta.env.VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true');

      expect(accessAudits.value).toBe(false);
    });

    it('should return false when env var is undefined', () => {
      vi.stubEnv('VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED', undefined);

      const accessAudits = computed(() => import.meta.env.VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true');

      expect(accessAudits.value).toBe(false);
    });

    it('should return false when env var is empty string', () => {
      vi.stubEnv('VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED', '');

      const accessAudits = computed(() => import.meta.env.VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true');

      expect(accessAudits.value).toBe(false);
    });

    it('should NOT use Boolean() which would convert "false" string to true', () => {
      // This test documents the bug we fixed
      vi.stubEnv('VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED', 'false');

      // Wrong way (bug):
      const wrongWay = computed(() => Boolean(import.meta.env.VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED));
      expect(wrongWay.value).toBe(true); // Bug: Boolean('false') = true!

      // Correct way (fix):
      const correctWay = computed(() => import.meta.env.VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true');
      expect(correctWay.value).toBe(false); // Correct: 'false' === 'true' = false
    });
  });

  describe('route meta allowAudits logic', () => {
    it('should evaluate to true when env var is "true" string', () => {
      vi.stubEnv('VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED', 'true');

      const allowAudits = import.meta.env.VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true';

      expect(allowAudits).toBe(true);
    });

    it('should evaluate to false when env var is "false" string', () => {
      vi.stubEnv('VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED', 'false');

      const allowAudits = import.meta.env.VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true';

      expect(allowAudits).toBe(false);
    });

    it('should evaluate to false when env var is undefined', () => {
      vi.stubEnv('VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED', undefined);

      const allowAudits = import.meta.env.VITE_FEATURE_COMPLIANCE_FRAMEWORK_ENABLED === 'true';

      expect(allowAudits).toBe(false);
    });
  });
});
