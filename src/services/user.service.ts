import { AxiosResponse } from 'axios';
import {
  CreateUserBody,
  SuccessAuthLoginUser,
  VerifyEmailBody
} from 'src/models/fusion-auth.models';
import { fusionAuthApi } from 'boot/axios';

export class UserService {
  private static readonly BASE_PATH = '/api/users';

  static async getUser(
    userId: string
  ): Promise<AxiosResponse<SuccessAuthLoginUser>> {
    return fusionAuthApi.get<SuccessAuthLoginUser>(
      `${this.BASE_PATH}/${userId}`
    );
  }

  static async createUser(body: CreateUserBody): Promise<AxiosResponse> {
    return fusionAuthApi.post(`${this.BASE_PATH}`, body);
  }

  static async verifyEmail(
    userId: string,
    tenantId: string,
    body: VerifyEmailBody
  ): Promise<AxiosResponse> {
    return fusionAuthApi.post(
      `${this.BASE_PATH}/${userId}/verify-email`,
      body,
      {
        headers: { 'X-TenantId': tenantId }
      }
    );
  }
}
