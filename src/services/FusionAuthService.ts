import { fusionAuthApi } from 'src/boot/axios';
import {
  FusionAuthLoginBody,
  FusionAuthLoginHeaders,
  FusionAuthLoginResponse,
  FusionAuthLogout,
  FusionAuthLogoutHeaders,
} from 'src/models/fusion-auth.models';
import { AxiosResponse } from 'axios';

export function authenticateUser(
  body: FusionAuthLoginBody,
  headers?: FusionAuthLoginHeaders
): Promise<AxiosResponse<FusionAuthLoginResponse>> {
  return fusionAuthApi.post<FusionAuthLoginResponse>('/api/login', body, {
    headers,
  });
}

export function logoutUser(
  body?: FusionAuthLogout,
  headers?: FusionAuthLogoutHeaders
): Promise<AxiosResponse<void>> {
  return fusionAuthApi.post<void>('/api/logout', body, { headers });
}
