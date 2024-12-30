import { i18n } from 'src/boot/i18n';

export function getErrorMessage(statusCode: number): string {
  const { t } = i18n.global;

  switch (statusCode) {
    case 400:
      return t('api.error.messages.400');
    case 401:
      return t('api.error.messages.401');
    case 403:
      return t('api.error.messages.403');
    case 404:
      return t('api.error.messages.404');
    case 405:
      return t('api.error.messages.405');
    case 409:
      return t('api.error.messages.409');
    case 429:
      return t('api.error.messages.429');
    case 500:
      return t('api.error.messages.500');
    case 502:
      return t('api.error.messages.502');
    case 503:
      return t('api.error.messages.503');
    case 504:
      return t('api.error.messages.504');
    default:
      return t('api.error.messages.default');
  }
}
