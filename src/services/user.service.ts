import { AxiosResponse } from 'axios';
import {
  CreateUserBody,
  SuccessAuthLoginUser,
  VerifyEmailBody
} from 'src/models/fusion-auth.models';
import { fusionAuthApi } from 'boot/axios';

const BASE_PATH = '/api/users';

export function getUser(
  userId: string
): Promise<AxiosResponse<SuccessAuthLoginUser>> {
  return fusionAuthApi.get<SuccessAuthLoginUser>(`${BASE_PATH}/${userId}`);
}

export function createUser(body: CreateUserBody): Promise<AxiosResponse> {
  return fusionAuthApi.post(`${BASE_PATH}`, body);
}

export function verifyEmail(
  userId: string,
  tenantId: string,
  body: VerifyEmailBody
): Promise<AxiosResponse> {
  return fusionAuthApi.post(`${BASE_PATH}/${userId}/verify-email`, body, {
    headers: { 'X-TenantId': tenantId }
  });
}
