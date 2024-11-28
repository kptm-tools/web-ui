import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  AUTH_TOKEN_NAMES,
  UNPROTECTED_PATHS,
} from 'src/constants/fusion-auth.constants';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const fusionAuthApi = axios.create({ baseURL: process.env.FUSION_SERVER_URL });

const isUnprotected = (url: string): boolean => {
  return UNPROTECTED_PATHS.some((endpoint) => url.includes(endpoint));
};

fusionAuthApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!isUnprotected(config.url || '')) {
      const token = sessionStorage.getItem(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      console.warn('No token found for protected endpoint.');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export { fusionAuthApi };
