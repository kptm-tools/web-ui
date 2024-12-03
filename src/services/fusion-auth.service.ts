import { fusionAuthApi } from 'src/boot/axios';
import {
  FusionAuthLoginBody,
  FusionAuthLoginResponse,
  FusionAuthLogout,
  FusionAuthLogoutHeaders
} from 'src/models/fusion-auth.models';
import { AxiosResponse } from 'axios';

export function authenticateUser(
  body: FusionAuthLoginBody
): Promise<AxiosResponse<FusionAuthLoginResponse>> {
  return fusionAuthApi.post<FusionAuthLoginResponse>('/api/login', body);
}

export function logoutUser(
  body?: FusionAuthLogout,
  headers?: FusionAuthLogoutHeaders
): Promise<AxiosResponse<void>> {
  return fusionAuthApi.post<void>('/api/logout', body, { headers });
}
