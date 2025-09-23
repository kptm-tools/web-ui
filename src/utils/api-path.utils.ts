/**
 * Utility for handling API path rewriting based on environment configuration.
 * When VITE_PRISM_MODE is enabled, strips gateway prefixes to allow direct
 * communication with Prism mock servers.
 */

/**
 * Transforms API paths based on the current environment configuration.
 * In Prism mode, removes gateway prefixes to match Prism's expected paths.
 *
 * @param servicePath - The original service path with gateway prefix
 * @returns The transformed path suitable for the current environment
 *
 * @example
 * // Normal mode (VITE_PRISM_MODE=false or undefined):
 * getApiPath('api/audits/admin') // returns 'api/audits/admin'
 *
 * // Prism mode (VITE_PRISM_MODE=true):
 * getApiPath('api/audits/admin') // returns 'admin'
 * getApiPath('/api/core/users') // returns '/users'
 */
export function getApiPath(servicePath: string): string {
  if (import.meta.env.VITE_PRISM_MODE === 'true') {
    // Strip gateway prefixes for Prism mock server
    return servicePath
      .replace('api/audits/', '') // Remove audits gateway prefix
      .replace('/api/core/', '/') // Remove core gateway prefix
      .replace('/api/', '/'); // Remove general api prefix
  }
  return servicePath;
}

/**
 * Helper to construct full API URLs with dynamic path rewriting.
 * Useful for building URLs with path parameters.
 *
 * @param basePath - The base service path
 * @param segments - Additional path segments to append
 * @returns The complete API path
 *
 * @example
 * buildApiPath('api/audits/admin', 'audits', '123', 'assign')
 * // Normal: 'api/audits/admin/audits/123/assign'
 * // Prism: 'admin/audits/123/assign'
 */
export function buildApiPath(basePath: string, ...segments: string[]): string {
  const transformedBase = getApiPath(basePath);
  if (segments.length === 0) {
    return transformedBase;
  }
  const joinedSegments = segments.join('/');
  return `${transformedBase}/${joinedSegments}`;
}