import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Loading, Notify } from 'quasar';
import {
  AUTH_TOKEN_NAMES,
  UNPROTECTED_PATHS
} from 'src/constants/fusion-auth.constants';
import { getErrorMessage } from 'src/utils/axios.utils';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const fusionAuthApi = axios.create({ baseURL: process.env.FUSION_SERVER_URL });

const isUnprotected = (url: string): boolean => {
  return UNPROTECTED_PATHS.some(endpoint => url.includes(endpoint));
};

fusionAuthApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    Loading.show();
    if (!isUnprotected(config.url || '')) {
      const token = sessionStorage.getItem(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add a response interceptor
fusionAuthApi.interceptors.response.use(
  response => {
    Loading.hide();
    return response;
  },
  error => {
    Loading.hide();
    if (
      error.config &&
      (error.config.method === 'post' || error.config.method === 'delete')
    ) {
      Notify.create({
        message:
          error.response?.data.error ||
          getErrorMessage(error.response?.status || 500),
        color: 'negative'
      });
    }
    return Promise.reject(error);
  }
);

export { fusionAuthApi };
