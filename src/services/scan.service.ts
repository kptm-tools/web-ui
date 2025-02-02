import { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';
import { Scan, ScanInsight } from 'src/models/scans.model';

export class ScanService {
  private static readonly BASE_PATH = '/api/scans';

  static async getScans(): Promise<AxiosResponse<Scan[]>> {
    return await fusionAuthApi.get(`${this.BASE_PATH}`);
  }

  static async getScanInsights(
    id: string
  ): Promise<AxiosResponse<ScanInsight>> {
    return await fusionAuthApi.get(`${this.BASE_PATH}/${id}/insights`);
  }

  static async createScans(host_ids: string[]): Promise<AxiosResponse<Scan>> {
    return await fusionAuthApi.post(`${this.BASE_PATH}`, { host_ids });
  }
}
