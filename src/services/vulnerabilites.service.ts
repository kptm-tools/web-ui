import { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';

export class VulnerabilitesService {
  private static readonly BASE_PATH = '/api/vulnerabilities';

  static async getVulnerabilitesById(id: string): Promise<AxiosResponse> {
    return await fusionAuthApi.get(`${this.BASE_PATH}/${id}`);
  }
}
