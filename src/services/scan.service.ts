import { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';
import { Scan, ScanInsight, ScanScoreTrend } from 'src/models/scans.model';

export class ScanService {
  private static readonly BASE_PATH = '/api/scans';
  private static readonly BASE_PATH_SCORECARD = '/api/scorecard-trends';

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

  static async cancelScan(scanId: string): Promise<AxiosResponse> {
    return await fusionAuthApi.post(`${this.BASE_PATH}/${scanId}/cancel`);
  }

  static async getScorecardTrends(
    fromDate?: string,
    toDate?: string
  ): Promise<AxiosResponse<ScanScoreTrend[]>> {
    let url: string = `${this.BASE_PATH_SCORECARD}`;
    const params: URLSearchParams = new URLSearchParams();

    if (fromDate) {
      params.append('from_date', fromDate);
    }

    if (toDate) {
      params.append('to_date', toDate);
    }

    url = `${url}?${params.toString()}`;

    return await fusionAuthApi.get(url.toString());
  }
}
