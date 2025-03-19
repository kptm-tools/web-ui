import { Notify } from 'quasar';
import { QNotifyPosition } from 'src/models/notify.models';

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
) : void {
  Notify.create({
    message,
    color: 'positive',
    icon,
    position
  });
}
