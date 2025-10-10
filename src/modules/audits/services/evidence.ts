import type { AxiosResponse } from 'axios';
import { gatewayApi } from 'src/boot/axios';
import { buildApiPath } from 'src/utils/api-path.utils';
import type {
  EvidenceConfirmRequest,
  EvidenceDownloadUrlResponse,
  EvidenceFileDetail,
  EvidenceMetadataResponse,
  EvidenceUploadRequest,
  EvidenceUploadRequestResponse,
  GetAllEvidencesResponse
} from '../models/evidence';

export class EvidenceService {
  private static readonly GATEWAY_PATH = 'api/audits/evidence';

  static async getAllEvidences(
    auditId: string,
    page: number,
    pageSize: number
  ): Promise<AxiosResponse<GetAllEvidencesResponse>> {
    const url = `${buildApiPath(this.GATEWAY_PATH)}?audit_id=${auditId}&page=${page}&pageSize=${pageSize}`;
    return await gatewayApi.get(url);
  }

  static async getEvidenceById(id: string): Promise<AxiosResponse<EvidenceFileDetail>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, id));
  }

  static async postConfirmEvidenceUploaded(
    id: string,
    body: EvidenceConfirmRequest
  ): Promise<AxiosResponse<EvidenceFileDetail>> {
    return await gatewayApi.post(buildApiPath(this.GATEWAY_PATH, id, 'confirm'), body);
  }

  static async postEvidenceUploadRequest(
    id: string,
    body: EvidenceUploadRequest
  ): Promise<AxiosResponse<EvidenceUploadRequestResponse>> {
    return await gatewayApi.post(buildApiPath(this.GATEWAY_PATH, id, 'upload-request'), body);
  }

  static async deleteEvidenceById(id: string): Promise<AxiosResponse<void>> {
    return await gatewayApi.delete(buildApiPath(this.GATEWAY_PATH, id));
  }

  static async getEvidenceDownloadUrl(
    id: string
  ): Promise<AxiosResponse<EvidenceDownloadUrlResponse>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, id, 'download-url'));
  }

  static async getEvidenceMetadata(id: string): Promise<AxiosResponse<EvidenceMetadataResponse>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, id, 'download-url'));
  }
}
