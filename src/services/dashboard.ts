import { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';

export class DashboardService {
  private static readonly BASE_PATH = '/api/dashboard';

  static async getDashboard(): Promise<AxiosResponse> {
    return await fusionAuthApi.get(`${this.BASE_PATH}`);
  }
}
