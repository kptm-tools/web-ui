import type { AxiosResponse } from 'axios';
import type { CreateUserBody } from 'auth/models/fusion-auth.models';
import { gatewayApi } from 'boot/axios';
import { buildApiPath } from 'src/utils/api-path.utils';
import type { DenyActionsResponse } from 'vulnerability/models/deny-actions.model';

export class UserService {
  private static readonly GATEWAY_PATH = '/api/core/users';

  static async createUser(body: CreateUserBody): Promise<AxiosResponse> {
    return gatewayApi.post(buildApiPath(this.GATEWAY_PATH), body);
  }

  static async verifyEmail(verificationId: string, tenantId: string): Promise<AxiosResponse> {
    return gatewayApi.get(
      `${buildApiPath(this.GATEWAY_PATH, 'verify')}?verificationId=${verificationId}&tenantId=${tenantId}`
    );
  }

  static async getPermissions(): Promise<AxiosResponse<DenyActionsResponse>> {
    return gatewayApi.get(buildApiPath(this.GATEWAY_PATH, 'permissions'));
  }
}
