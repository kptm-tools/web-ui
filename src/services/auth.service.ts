import { fusionAuthApi } from 'src/boot/axios';
import type {
  ChangePasswordBody,
  ForgotPasswordBody,
  FusionAuthLoginBody,
  FusionAuthLoginResponse
} from 'src/models/fusion-auth.models';
import type { AxiosResponse } from 'axios';

export function authenticateUser(
  body: FusionAuthLoginBody
): Promise<AxiosResponse<FusionAuthLoginResponse>> {
  return fusionAuthApi.post<FusionAuthLoginResponse>('/api/login', body);
}

export function logoutUser(): Promise<AxiosResponse> {
  return fusionAuthApi.post('/api/logout');
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
