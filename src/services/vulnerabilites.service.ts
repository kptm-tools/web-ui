import type { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';
import type { ScanVulnerability } from 'src/models';

export class VulnerabilitesService {
  private static readonly BASE_PATH = '/api/vulnerabilities';

  static async getVulnerabilitesById(
    id: string
  ): Promise<AxiosResponse<ScanVulnerability>> {
    return await fusionAuthApi.get(`${this.BASE_PATH}/${id}`);
  }

  static async postVulnerabilityComment(
    id: string,
    comment: string
  ): Promise<AxiosResponse> {
    return await fusionAuthApi.post(`${this.BASE_PATH}/${id}/comment`, {
      comment
    });
  }

  static async patchVulnerabilityComment(
    id: string,
    comment: string
  ): Promise<AxiosResponse> {
    return await fusionAuthApi.patch(`${this.BASE_PATH}/${id}/comment`, {
      comment
    });
  }

  static async deleteVulnerabilityComment(id: string): Promise<AxiosResponse> {
    return await fusionAuthApi.delete(`${this.BASE_PATH}/${id}/comment`);
  }
}
