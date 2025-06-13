import { describe, expect, it, vi, beforeEach } from 'vitest';
import { Notify } from 'quasar';
import { errorQuasarNotify, successQuasarNotify } from '../notify.utils'; // Adjust the import path as needed
import type { QNotifyPosition } from 'shared/models/notify';

// Mock the Quasar Notify object
vi.mock('quasar', () => ({
  Notify: {
    create: vi.fn()
  }
}));

describe('errorQuasarNotify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call Notify.create with the correct error configuration', () => {
    const message = 'An error occurred.';
    const icon = 'warning';
    const position: QNotifyPosition = 'bottom';

    errorQuasarNotify(message, icon, position);

    expect(Notify.create).toHaveBeenCalledTimes(1);
    expect(Notify.create).toHaveBeenCalledWith({
      message,
      color: 'negative',
      icon,
      position
    });
  });

  it('should use the default icon and position if not provided', () => {
    const message = 'Another error.';
    errorQuasarNotify(message);

    expect(Notify.create).toHaveBeenCalledTimes(1);
    expect(Notify.create).toHaveBeenCalledWith({
      message,
      color: 'negative',
      icon: 'error',
      position: 'top-right'
    });
  });

  it('should call Notify.create even if icon is not provided but position is', () => {
    const message = 'Error with custom position.';
    const position: QNotifyPosition = 'bottom-left';
    errorQuasarNotify(message, undefined, position);

    expect(Notify.create).toHaveBeenCalledTimes(1);
    expect(Notify.create).toHaveBeenCalledWith({
      message,
      color: 'negative',
      icon: 'error',
      position
    });
  });
});

describe('successQuasarNotify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call Notify.create with the correct success configuration', () => {
    const message = 'Operation successful!';
    const icon = 'done';
    const position: QNotifyPosition = 'bottom-right';

    successQuasarNotify(message, icon, position);

    expect(Notify.create).toHaveBeenCalledTimes(1);
    expect(Notify.create).toHaveBeenCalledWith({
      message,
      color: 'positive',
      icon,
      position
    });
  });

  it('should use the default icon and position if not provided', () => {
    const message = 'Success message.';
    successQuasarNotify(message);

    expect(Notify.create).toHaveBeenCalledTimes(1);
    expect(Notify.create).toHaveBeenCalledWith({
      message,
      color: 'positive',
      icon: 'check_circle',
      position: 'top-right'
    });
  });

  it('should call Notify.create even if icon is not provided but position is', () => {
    const message = 'Success with custom position.';
    const position: QNotifyPosition = 'bottom-left';
    successQuasarNotify(message, undefined, position);

    expect(Notify.create).toHaveBeenCalledTimes(1);
    expect(Notify.create).toHaveBeenCalledWith({
      message,
      color: 'positive',
      icon: 'check_circle',
      position
    });
  });
});
