import type { AxiosResponse } from 'axios';
import type { CreateUserBody, SuccessAuthLoginUser } from 'auth/models/fusion-auth.models';
import { gatewayApi } from 'boot/axios';
import type { DenyActionsResponse } from 'vulnerability/models/deny-actions.model';

export class UserService {
  private static readonly BASE_PATH = '/api/core/users';

  static async getUser(userId: string): Promise<AxiosResponse<SuccessAuthLoginUser>> {
    return gatewayApi.get<SuccessAuthLoginUser>(`${this.BASE_PATH}/${userId}`);
  }

  static async createUser(body: CreateUserBody): Promise<AxiosResponse> {
    return gatewayApi.post(`${this.BASE_PATH}`, body);
  }

  static async verifyEmail(verificationId: string, tenantId: string): Promise<AxiosResponse> {
    return gatewayApi.get(
      `${this.BASE_PATH}/verify?verificationId=${verificationId}&tenantId=${tenantId}`
    );
  }

  static async getPermissions(): Promise<AxiosResponse<DenyActionsResponse>> {
    return gatewayApi.get(`${this.BASE_PATH}/permissions`);
  }
}
