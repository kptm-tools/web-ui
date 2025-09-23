export const HOST_ENDPOINTS = {
  BASE: '/api/core/hosts',
  GET_ALL: () => HOST_ENDPOINTS.BASE,
  CREATE: () => HOST_ENDPOINTS.BASE,
  GET_BY_ID: (hostId: string) => `${HOST_ENDPOINTS.BASE}/${hostId}`,
  EDIT_BY_ID: (hostId: string) => `${HOST_ENDPOINTS.BASE}/${hostId}`,
  DELETE_BY_ID: (hostId: string) => `${HOST_ENDPOINTS.BASE}/${hostId}`,
  VALIDATE_HOST: () => `${HOST_ENDPOINTS.BASE}/validate-host`
};
