import { fusionAuthApi } from 'src/boot/axios';
import {
  ChangePasswordBody,
  ForgotPasswordBody,
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

export function changePassword(
  body: ChangePasswordBody
): Promise<AxiosResponse> {
  return fusionAuthApi.post('/api/change-password', body);
}

export function forgotPassword(
  body: ForgotPasswordBody
): Promise<AxiosResponse> {
  return fusionAuthApi.post('/api/forgot-password', body);
}
