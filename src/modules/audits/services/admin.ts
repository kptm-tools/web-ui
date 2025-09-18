import type { AxiosResponse } from 'axios';
import { gatewayApi } from 'src/boot/axios';
import { buildApiPath } from 'src/utils/api-path.utils';
import type {
  AssignAnalystAuditRequest,
  AssignAnalystAuditResponse,
  AuditsResponse,
  AvailableAnalystsResponse,
  UnassignedAuditsResponse
} from '../models/admin';

export class AdminService {
  private static readonly GATEWAY_PATH = 'api/audits/admin';

  static async postAssignAnalystAudit(
    id: string,
    body: AssignAnalystAuditRequest
  ): Promise<AxiosResponse<AssignAnalystAuditResponse>> {
    return await gatewayApi.post(buildApiPath(this.GATEWAY_PATH, 'audits', id, 'assign'), body);
  }

  static async putUnassignAnalystAudit(
    id: string
  ): Promise<AxiosResponse<AssignAnalystAuditResponse>> {
    return await gatewayApi.put(buildApiPath(this.GATEWAY_PATH, 'audits', id, 'assign'));
  }

  static async getAssignmentDetail(id: string): Promise<AxiosResponse<AssignAnalystAuditResponse>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, 'audits', id, 'assignment'));
  }

  static async getAllAudits(
    page: number = 1,
    pageSize: number = 20
  ): Promise<AxiosResponse<AuditsResponse>> {
    const baseUrl = `${buildApiPath(this.GATEWAY_PATH, 'audits')}?page=${page}&pageSize=${pageSize}`;
    return await gatewayApi.get(baseUrl);
  }

  static async getUnassignedAudits(
    page: number = 1,
    pageSize: number = 20
  ): Promise<AxiosResponse<UnassignedAuditsResponse>> {
    const baseUrl = `${buildApiPath(this.GATEWAY_PATH, 'audits', 'unassigned')}?page=${page}&pageSize=${pageSize}`;
    return await gatewayApi.get(baseUrl);
  }

  static async postClearCache(): Promise<AxiosResponse> {
    return await gatewayApi.post(buildApiPath(this.GATEWAY_PATH, 'cache', 'clear'));
  }

  static async getAvailableAnalysts(): Promise<AxiosResponse<AvailableAnalystsResponse>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, 'users', 'analysts'));
  }
}
