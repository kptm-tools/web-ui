import { buildApiPath } from 'src/utils/api-path.utils';

export const HOST_ENDPOINTS = {
  BASE: '/api/core/hosts',
  GET_ALL: () => buildApiPath(HOST_ENDPOINTS.BASE),
  CREATE: () => buildApiPath(HOST_ENDPOINTS.BASE),
  GET_BY_ID: (hostId: string) => buildApiPath(HOST_ENDPOINTS.BASE, hostId),
  EDIT_BY_ID: (hostId: string) => buildApiPath(HOST_ENDPOINTS.BASE, hostId),
  DELETE_BY_ID: (hostId: string) => buildApiPath(HOST_ENDPOINTS.BASE, hostId),
  VALIDATE_HOST: () => buildApiPath(HOST_ENDPOINTS.BASE, 'validate-host')
};
