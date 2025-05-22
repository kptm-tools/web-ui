import { describe, expect, it, vi } from 'vitest';
import { getErrorMessage } from '../axios.utils'; // Adjust the import path as needed
import { i18n } from 'src/boot/i18n';

// Mock the i18n object
vi.mock('src/boot/i18n', () => ({
  i18n: {
    global: {
      t: vi.fn((key: string) => `Translated: ${key}`) // Simple translation mock
    }
  }
}));

describe('getErrorMessage', () => {
  it('should return the translated message for status code 400', () => {
    expect(getErrorMessage(400)).toBe('Translated: api.error.messages.400');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.400');
  });

  it('should return the translated message for status code 401', () => {
    expect(getErrorMessage(401)).toBe('Translated: api.error.messages.401');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.401');
  });

  it('should return the translated message for status code 403', () => {
    expect(getErrorMessage(403)).toBe('Translated: api.error.messages.403');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.403');
  });

  it('should return the translated message for status code 404', () => {
    expect(getErrorMessage(404)).toBe('Translated: api.error.messages.404');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.404');
  });

  it('should return the translated message for status code 405', () => {
    expect(getErrorMessage(405)).toBe('Translated: api.error.messages.405');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.405');
  });

  it('should return the translated message for status code 409', () => {
    expect(getErrorMessage(409)).toBe('Translated: api.error.messages.409');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.409');
  });

  it('should return the translated message for status code 429', () => {
    expect(getErrorMessage(429)).toBe('Translated: api.error.messages.429');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.429');
  });

  it('should return the translated message for status code 500', () => {
    expect(getErrorMessage(500)).toBe('Translated: api.error.messages.500');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.500');
  });

  it('should return the translated message for status code 502', () => {
    expect(getErrorMessage(502)).toBe('Translated: api.error.messages.502');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.502');
  });

  it('should return the translated message for status code 503', () => {
    expect(getErrorMessage(503)).toBe('Translated: api.error.messages.503');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.503');
  });

  it('should return the translated message for status code 504', () => {
    expect(getErrorMessage(504)).toBe('Translated: api.error.messages.504');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.504');
  });

  it('should return the default translated message for an unknown status code', () => {
    expect(getErrorMessage(999)).toBe('Translated: api.error.messages.default');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.default');
  });

  it('should still return a translation even if the specific key is missing (mock behavior)', () => {
    (i18n.global.t as ReturnType<typeof vi.fn>).mockImplementation(
      (key: string) => `Missing: ${key}`
    );
    expect(getErrorMessage(400)).toBe('Missing: api.error.messages.400');
    expect(i18n.global.t).toHaveBeenCalledWith('api.error.messages.400');
  });
});
