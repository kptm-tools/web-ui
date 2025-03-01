import { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';
import {
  Report,
  ReportSummary,
  ReportSummaryTimeRange,
  ReportSummaryTimeRangeTypes,
  ScanVulnerabilitesResponse
} from 'src/models';

export class ReportService {
  private static readonly BASE_PATH = '/api/reports';
  private static readonly BASE_PATH_SCANS = '/api/scans';

  static async getReports(): Promise<AxiosResponse<Report[]>> {
    return await fusionAuthApi.get(`${this.BASE_PATH}`);
  }

  static async getReportsVulnerabilities(
    scanId: string
  ): Promise<AxiosResponse<ScanVulnerabilitesResponse>> {
    return await fusionAuthApi.get(
      `${this.BASE_PATH_SCANS}/${scanId}/vulnerabilities`
    );
  }

  static async getReportsVulnerabilitiesSummary(
    scanId: string,
    severity: string,
    time_range: ReportSummaryTimeRangeTypes
  ): Promise<AxiosResponse<ReportSummary>> {
    let url: string = `${this.BASE_PATH_SCANS}/${scanId}/vulnerabilities/summary?`;
    const params: URLSearchParams = new URLSearchParams();

    if (severity !== '') {
      params.append('severity', severity);
    }

    if (Object.values(ReportSummaryTimeRange).includes(time_range)) {
      params.append('time_period', time_range);
    }
    url = `${url}${params.toString()}`;

    return await fusionAuthApi.get(url.toString());
  }
}
