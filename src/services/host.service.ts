import { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';
import { Host, HostCreateBody } from 'src/models/hosts.models';

const BASE_PATH = '/api/hosts';

export function validateDomainOrIp(
  domainOrIp: string,
  hostname: string
): Promise<AxiosResponse<string>> {
  return fusionAuthApi.post(`${BASE_PATH}/validate`, {
    value: domainOrIp,
    hostname
  });
}

export async function getHosts(): Promise<AxiosResponse<Host[]>> {
  return await fusionAuthApi.get(`${BASE_PATH}`);
}

export async function deleteHost(
  hostId: string
): Promise<AxiosResponse<Host[]>> {
  return await fusionAuthApi.delete(`${BASE_PATH}/${hostId}`);
}

export async function registerHosts(
  body: HostCreateBody
): Promise<AxiosResponse> {
  return await fusionAuthApi.post(`${BASE_PATH}`, body);
}
