import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { AUTH_TOKEN_NAMES, UNPROTECTED_PATHS } from 'src/constants/fusion-auth.constants';
import { Loading } from 'quasar';
import { clearSessionStorageValues } from 'src/modules/auth/helpers/sessionStorage';
import { useRouter } from 'vue-router';
import { AUTH_ROUTES } from 'src/modules/auth/routes/route-names';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const isUnprotected = (url: string): boolean => {
  return UNPROTECTED_PATHS.some(endpoint => url.includes(endpoint));
};

const gatewayApi = axios.create({
  baseURL: process.env.AUDITS_SERVER_URL || 'http://localhost:8000'
});

gatewayApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!isUnprotected(config.url || '')) {
      const token = sessionStorage.getItem(AUTH_TOKEN_NAMES.ACCESS_TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(new Error(error))
);

gatewayApi.interceptors.response.use(
  response => {
    Loading.hide();
    return response;
  },
  async error => {
    Loading.hide();
    if (error.response && error.response.status === 401) {
      const router = useRouter();
      clearSessionStorageValues();
      await router.push({ name: AUTH_ROUTES.login.name });
    }
    return Promise.reject(new Error(error));
  }
);

export { gatewayApi };
