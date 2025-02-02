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
