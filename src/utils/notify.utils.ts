import { Notify } from 'quasar';
import type { QNotifyPosition } from 'shared/models/notify';

export function errorQuasarNotify(
  message: string,
  icon = 'error',
  position: QNotifyPosition = 'top-right'
): void {
  Notify.create({
    message,
    color: 'negative',
    icon,
    position
  });
}

export function successQuasarNotify(
  message: string,
  icon = 'check_circle',
  position: QNotifyPosition = 'top-right'
): void {
  Notify.create({
    message,
    color: 'positive',
    icon,
    position
  });
}
