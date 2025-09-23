import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getApiPath, buildApiPath } from '../api-path.utils';

describe('api-path utilities', () => {
  afterEach(() => {
    // Restore original environment
    vi.unstubAllEnvs();
  });

  describe('getApiPath', () => {
    describe('when VITE_PRISM_MODE is false or undefined', () => {
      beforeEach(() => {
        vi.stubEnv('VITE_PRISM_MODE', 'false');
      });

      it('should return original path unchanged for audits paths', () => {
        expect(getApiPath('api/audits/admin')).toBe('api/audits/admin');
        expect(getApiPath('api/audits/framework')).toBe('api/audits/framework');
      });

      it('should return original path unchanged for core paths', () => {
        expect(getApiPath('/api/core/users')).toBe('/api/core/users');
        expect(getApiPath('/api/core/hosts')).toBe('/api/core/hosts');
        expect(getApiPath('/api/core/scans')).toBe('/api/core/scans');
      });

      it('should return original path unchanged for general api paths', () => {
        expect(getApiPath('/api/other')).toBe('/api/other');
        expect(getApiPath('api/something')).toBe('api/something');
      });
    });

    describe('when VITE_PRISM_MODE is true', () => {
      beforeEach(() => {
        vi.stubEnv('VITE_PRISM_MODE', 'true');
      });

      it('should strip audits gateway prefix', () => {
        expect(getApiPath('api/audits/admin')).toBe('admin');
        expect(getApiPath('api/audits/framework')).toBe('framework');
        expect(getApiPath('api/audits/something/else')).toBe('something/else');
      });

      it('should strip core gateway prefix', () => {
        expect(getApiPath('/api/core/users')).toBe('/users');
        expect(getApiPath('/api/core/hosts')).toBe('/hosts');
        expect(getApiPath('/api/core/scans')).toBe('/scans');
        expect(getApiPath('/api/core/vulnerabilities')).toBe('/vulnerabilities');
      });

      it('should strip general api prefix', () => {
        expect(getApiPath('/api/other')).toBe('/other');
        // Note: 'api/something' doesn't start with '/api/' so it remains unchanged
        expect(getApiPath('api/something')).toBe('api/something');
      });

      it('should handle complex paths correctly', () => {
        expect(getApiPath('api/audits/admin/audits/123/assign')).toBe('admin/audits/123/assign');
        expect(getApiPath('/api/core/scans/456/vulnerabilities')).toBe('/scans/456/vulnerabilities');
      });
    });

    describe('edge cases', () => {
      beforeEach(() => {
        vi.stubEnv('VITE_PRISM_MODE', 'true');
      });

      it('should handle empty strings', () => {
        expect(getApiPath('')).toBe('');
      });

      it('should handle paths that do not match patterns', () => {
        expect(getApiPath('some/random/path')).toBe('some/random/path');
        expect(getApiPath('/v1/endpoint')).toBe('/v1/endpoint');
      });

      it('should handle paths with multiple api segments', () => {
        // First '/api/core/' gets replaced with '/', then '/api/' gets replaced with '/'
        expect(getApiPath('/api/core/api/nested')).toBe('/nested');
      });
    });
  });

  describe('buildApiPath', () => {
    describe('when VITE_PRISM_MODE is false', () => {
      beforeEach(() => {
        vi.stubEnv('VITE_PRISM_MODE', 'false');
      });

      it('should return base path when no segments provided', () => {
        expect(buildApiPath('api/audits/admin')).toBe('api/audits/admin');
        expect(buildApiPath('/api/core/users')).toBe('/api/core/users');
      });

      it('should join base path with segments', () => {
        expect(buildApiPath('api/audits/admin', 'audits', '123', 'assign'))
          .toBe('api/audits/admin/audits/123/assign');

        expect(buildApiPath('/api/core/hosts', 'validate-host'))
          .toBe('/api/core/hosts/validate-host');

        expect(buildApiPath('api/audits/framework', 'subcategories', 'sub-123'))
          .toBe('api/audits/framework/subcategories/sub-123');
      });
    });

    describe('when VITE_PRISM_MODE is true', () => {
      beforeEach(() => {
        vi.stubEnv('VITE_PRISM_MODE', 'true');
      });

      it('should return transformed base path when no segments provided', () => {
        expect(buildApiPath('api/audits/admin')).toBe('admin');
        expect(buildApiPath('/api/core/users')).toBe('/users');
      });

      it('should join transformed base path with segments', () => {
        expect(buildApiPath('api/audits/admin', 'audits', '123', 'assign'))
          .toBe('admin/audits/123/assign');

        expect(buildApiPath('/api/core/hosts', 'validate-host'))
          .toBe('/hosts/validate-host');

        expect(buildApiPath('api/audits/framework', 'subcategories', 'sub-123'))
          .toBe('framework/subcategories/sub-123');
      });

      it('should handle complex real-world examples', () => {
        // Examples from actual service usage
        expect(buildApiPath('api/audits/framework', 'maturity-levels'))
          .toBe('framework/maturity-levels');

        expect(buildApiPath('/api/core/scans', 'scan-123', 'operating-system', 'vulnerabilities'))
          .toBe('/scans/scan-123/operating-system/vulnerabilities');

        expect(buildApiPath('/api/core/vulnerabilities', 'vuln-456', 'comment'))
          .toBe('/vulnerabilities/vuln-456/comment');
      });
    });

    describe('edge cases', () => {
      beforeEach(() => {
        vi.stubEnv('VITE_PRISM_MODE', 'true');
      });

      it('should handle empty segments', () => {
        expect(buildApiPath('api/audits/admin', '')).toBe('admin/');
        expect(buildApiPath('api/audits/admin', 'audits', '', 'assign')).toBe('admin/audits//assign');
      });

      it('should handle single segment', () => {
        expect(buildApiPath('/api/core/hosts', 'validate')).toBe('/hosts/validate');
      });

      it('should handle many segments', () => {
        expect(buildApiPath('api/audits/admin', 'a', 'b', 'c', 'd', 'e'))
          .toBe('admin/a/b/c/d/e');
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work correctly for real service patterns in normal mode', () => {
      vi.stubEnv('VITE_PRISM_MODE', 'false');

      // Simulate AdminService.getAllAudits call pattern
      const adminPath = buildApiPath('api/audits/admin', 'audits');
      expect(adminPath).toBe('api/audits/admin/audits');

      // Simulate FrameworkService.getSubcategoryById call pattern
      const frameworkPath = buildApiPath('api/audits/framework', 'subcategories', 'test-id');
      expect(frameworkPath).toBe('api/audits/framework/subcategories/test-id');

      // Simulate HOST_ENDPOINTS.GET_BY_ID call pattern
      const hostPath = buildApiPath('/api/core/hosts', 'host-123');
      expect(hostPath).toBe('/api/core/hosts/host-123');
    });

    it('should work correctly for real service patterns in Prism mode', () => {
      vi.stubEnv('VITE_PRISM_MODE', 'true');

      // Same patterns should now be transformed for Prism compatibility
      const adminPath = buildApiPath('api/audits/admin', 'audits');
      expect(adminPath).toBe('admin/audits');

      const frameworkPath = buildApiPath('api/audits/framework', 'subcategories', 'test-id');
      expect(frameworkPath).toBe('framework/subcategories/test-id');

      const hostPath = buildApiPath('/api/core/hosts', 'host-123');
      expect(hostPath).toBe('/hosts/host-123');
    });
  });
});
