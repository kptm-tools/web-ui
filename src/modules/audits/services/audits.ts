import type { AxiosResponse } from 'axios';
import { gatewayApi } from 'src/boot/axios';
import { buildApiPath } from 'src/utils/api-path.utils';
import type { AuditGeneralResponse, AuditRequest, AuditResponse } from '../models/audits';

export class AuditService {
  private static readonly GATEWAY_PATH = '/api/audits/audits';

  static async getAudits(): Promise<AxiosResponse<AuditGeneralResponse[]>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH));
  }

  static async postAudit(body: AuditRequest): Promise<AxiosResponse<AuditResponse>> {
    return await gatewayApi.post(buildApiPath(this.GATEWAY_PATH), body);
  }
}
