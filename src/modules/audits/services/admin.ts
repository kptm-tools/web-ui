import type { AxiosResponse } from 'axios';
import { gatewayApi } from 'src/boot/axios';
import type {
  AssignAnalystAuditRequest,
  AssignAnalystAuditResponse,
  AvailableAnalystsResponse,
  UnassignedAuditsResponse
} from '../models/admin';

export class AdminService {
  static readonly BASE_PATH = 'api/audits/admin';

  static async postAssignAnalystAudit(
    id: string,
    body: AssignAnalystAuditRequest
  ): Promise<AxiosResponse<AssignAnalystAuditResponse>> {
    return await gatewayApi.post(`${this.BASE_PATH}/audits/${id}/assign`, body);
  }

  static async putUnassignAnalystAudit(
    id: string
  ): Promise<AxiosResponse<AssignAnalystAuditResponse>> {
    return await gatewayApi.put(`${this.BASE_PATH}/audits/${id}/assign`);
  }

  static async getAssignmentDetail(id: string): Promise<AxiosResponse<AssignAnalystAuditResponse>> {
    return await gatewayApi.get(`${this.BASE_PATH}/audits/${id}/assignment`);
  }

  static async getUnassignedAudits(
    page: number = 1,
    pageSize: number = 20
  ): Promise<AxiosResponse<UnassignedAuditsResponse>> {
    const baseUrl = `${this.BASE_PATH}/audits/unassigned?page=${page}&pageSize=${pageSize}`;
    return await gatewayApi.get(baseUrl);
  }

  static async postClearCache(): Promise<AxiosResponse> {
    return await gatewayApi.post(`${this.BASE_PATH}/cache/clear`);
  }

  static async getAvailableAnalysts(): Promise<AxiosResponse<AvailableAnalystsResponse>> {
    return await gatewayApi.get(`${this.BASE_PATH}/users/analysts`);
  }
}
