import { gatewayApi } from 'src/boot/axios';
import type {
  ChangePasswordBody,
  ForgotPasswordBody,
  FusionAuthLoginBody,
  FusionAuthLoginResponse
} from 'auth/models/fusion-auth.models';
import type { AxiosResponse } from 'axios';

export function authenticateUser(
  body: FusionAuthLoginBody
): Promise<AxiosResponse<FusionAuthLoginResponse>> {
  return gatewayApi.post<FusionAuthLoginResponse>('/api/login', body);
}

export function logoutUser(): Promise<AxiosResponse> {
  return gatewayApi.post('/api/logout');
}

export function changePassword(body: ChangePasswordBody): Promise<AxiosResponse> {
  return gatewayApi.post('/api/change-password', body);
}

export function forgotPassword(body: ForgotPasswordBody): Promise<AxiosResponse> {
  return gatewayApi.post('/api/forgot-password', body);
}
