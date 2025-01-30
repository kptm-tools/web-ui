import { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';
import { Scan, ScanInsight } from 'src/models/scans.model';

const BASE_PATH = '/api/scans';

export async function getScans(): Promise<AxiosResponse<Scan[]>> {
  return await fusionAuthApi.get(`${BASE_PATH}`);
}

export async function getScanInsights(
  id: string
): Promise<AxiosResponse<ScanInsight>> {
  return await fusionAuthApi.get(`${BASE_PATH}/${id}/insights`);
}

export async function createScans(
  hostIds: string[]
): Promise<AxiosResponse<Scan>> {
  return await fusionAuthApi.post(`${BASE_PATH}`, { host_ids: hostIds });
}
