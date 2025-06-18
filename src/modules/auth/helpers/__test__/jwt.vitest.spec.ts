import { describe, it, expect } from 'vitest';
import { decodeJwt, base64UrlDecode } from 'auth/helpers/jwt'; // Assuming your functions are in decodeJwt.ts

describe('base64UrlDecode', () => {
  it('should correctly decode a standard Base64Url string', () => {
    const encoded = 'SGVsbG8gV29ybGQ'; // "Hello World"
    expect(base64UrlDecode(encoded)).toBe('Hello World');
  });

  it('should correctly decode a Base64Url string with URL-safe characters', () => {
    // Corrected encoding for "foobar_is"
    const encodedWithSafeChars = 'Zm9vYmFyX2lz'; // This is the correct base64url for "foobar_is"
    expect(base64UrlDecode(encodedWithSafeChars)).toBe('foobar_is');

    const encodedWithDash = 'Zm9vYmFyLWlz'; // "foobar-is"
    expect(base64UrlDecode(encodedWithDash)).toBe('foobar-is');
  });

  it('should handle strings with padding (though base64url often omits it)', () => {
    const encoded = 'Zm9v'; // "foo"
    expect(base64UrlDecode(encoded)).toBe('foo');
  });

  it('should decode an empty string', () => {
    expect(base64UrlDecode('')).toBe('');
  });
});

describe('decodeJwt', () => {
  it('should successfully decode a valid JWT', () => {
    const validJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkpvaG4gRG9lIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const expectedPayload = { userId: 123, name: 'John Doe' };
    expect(decodeJwt(validJwt)).toEqual(expectedPayload);
  });

  it('should successfully decode a JWT with a different valid payload', () => {
    const validJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NzgyODQwMDAsInJvbGUiOiJhZG1pbiJ9.someSignature';
    const expectedPayload = { exp: 1678284000, role: 'admin' };
    expect(decodeJwt(validJwt)).toEqual(expectedPayload);
  });

  it('should throw an error for an empty token', () => {
    expect(() => decodeJwt('')).toThrow('Invalid token');
  });

  it('should throw an error for a null token', () => {
    // @ts-expect-error - Intentionally testing null to ensure type safety doesn't prevent runtime check
    expect(() => decodeJwt(null)).toThrow('Invalid token');
  });

  it('should throw an error for an undefined token', () => {
    // @ts-expect-error - Intentionally testing undefined
    expect(() => decodeJwt(undefined)).toThrow('Invalid token');
  });

  it('should throw an error for a malformed token (less than 3 parts)', () => {
    const malformedJwt = 'header.payload';
    expect(() => decodeJwt(malformedJwt)).toThrow('Malformed token');
  });

  it('should throw an error for a malformed token (more than 3 parts)', () => {
    const malformedJwt = 'header.payload.signature.extra';
    expect(() => decodeJwt(malformedJwt)).toThrow('Malformed token');
  });

  it('should throw an error if the payload is not valid Base64Url', () => {
    // Invalid Base64Url characters in payload
    const invalidPayloadJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.not-valid!.signature';
    expect(() => decodeJwt(invalidPayloadJwt)).toThrow('Failed to decode and parse JWT payload');
  });

  it('should throw an error if the decoded payload is not valid JSON', () => {
    // Base64Url of "this is not json"
    const nonJsonPayload = 'dGhpcyBpcyBub3QganNvbg';
    const invalidJsonJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${nonJsonPayload}.signature`;
    expect(() => decodeJwt(invalidJsonJwt)).toThrow('Failed to decode and parse JWT payload');
  });

  it('should handle a JWT with an empty object payload', () => {
    // Base64Url of "{}" is "e30"
    const emptyObjectPayloadJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.signature';
    expect(decodeJwt(emptyObjectPayloadJwt)).toEqual({});
  });

  it('should handle a JWT with a complex payload', () => {
    const complexPayload = {
      user: {
        id: 'abc-123',
        username: 'testuser',
        roles: ['admin', 'viewer']
      },
      iat: 1678886400,
      exp: 1678890000
    };
    // Base64Url encode complexPayload
    const encodedComplexPayload = base64UrlEncode(JSON.stringify(complexPayload));
    const complexJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedComplexPayload}.signature`;
    expect(decodeJwt(complexJwt)).toEqual(complexPayload);
  });
});

// Helper function for the complex payload test (if you need it, otherwise remove)
// This function would typically be in a utils file or similar.
function base64UrlEncode(str: string): string {
  const base64 = btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function toSolidBytes(match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
