/**
 * Decodes a JSON Web Token (JWT) and returns its payload.
 *
 * This function takes a JWT string, splits it into its three parts (header, payload, and signature),
 * and then decodes and parses the payload. The payload is expected to be Base64Url encoded JSON.
 *
 * @param {string} token - The JWT string to decode.
 * @returns {object} The decoded and parsed payload of the JWT.
 * @throws {Error} If the token is invalid (empty or null), malformed (not 3 parts),
 * or if the payload cannot be decoded or parsed.
 */
export function decodeJwt(token: string) {
  if (!token) {
    throw new Error('Invalid token');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed token');
  }

  const payload = parts[1];

  try {
    const decodedPayload = base64UrlDecode(String(payload));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Failed to decode and parse JWT payload:', error);
    throw new Error('Failed to decode and parse JWT payload');
  }
}

/**
 * Decodes a Base64Url encoded string.
 *
 * This helper function converts a Base64Url string into a regular Base64 string
 * by replacing '-' with '+' and '_' with '/', and then uses `atob` to decode it.
 * Finally, it decodes any URI components to handle UTF-8 characters correctly.
 *
 * @param {string} str - The Base64Url encoded string to decode.
 * @returns {string} The decoded string.
 */
export function base64UrlDecode(str: string) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(
    atob(base64)
      .split('')
      .map(c => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('')
  );
}
