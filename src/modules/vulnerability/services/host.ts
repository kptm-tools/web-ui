import type { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';
import type { Host, HostCreateBody } from 'vulnerability/models/hosts';
import { HOST_ENDPOINTS } from 'src/constants/api.constants';

export class HostService {
  static async createHost(body: HostCreateBody): Promise<AxiosResponse> {
    return await fusionAuthApi.post(HOST_ENDPOINTS.CREATE(), body);
  }

  static async getHosts(): Promise<AxiosResponse<Host[]>> {
    return await fusionAuthApi.get(HOST_ENDPOINTS.GET_ALL());
  }

  static async deleteHostById(hostId: string): Promise<AxiosResponse<Host[]>> {
    return await fusionAuthApi.delete(HOST_ENDPOINTS.DELETE_BY_ID(hostId));
  }

  static async getHostById(hostId: string): Promise<AxiosResponse<Host>> {
    return await fusionAuthApi.get(HOST_ENDPOINTS.GET_BY_ID(hostId));
  }

  static async editHost(hostId: string, body: HostCreateBody): Promise<AxiosResponse> {
    return await fusionAuthApi.patch(HOST_ENDPOINTS.EDIT_BY_ID(hostId), body);
  }

  static async validateHost(value: string): Promise<AxiosResponse<string>> {
    return fusionAuthApi.post(HOST_ENDPOINTS.VALIDATE_HOST(), { value });
  }
}
