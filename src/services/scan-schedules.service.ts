import { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';

export class ScanSchedulesService {
  private static readonly BASE_PATH = '/api/scan-schedules';

  static async getScanSchedules(): Promise<AxiosResponse> {
    return await fusionAuthApi.get(`${this.BASE_PATH}`);
  }

  static async patchScanScheduleById(id: string): Promise<AxiosResponse> {
    return await fusionAuthApi.patch(`${this.BASE_PATH}/${id}`);
  }

  static async deleteScanScheduleById(id: string): Promise<AxiosResponse> {
    return await fusionAuthApi.delete(`${this.BASE_PATH}/${id}`);
  }
}
