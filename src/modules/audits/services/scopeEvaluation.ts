import type { AxiosResponse } from 'axios';
import { gatewayApi } from 'src/boot/axios';
import { buildApiPath } from 'src/utils/api-path.utils';
import type {
  ScopeEvaluationFormDraftRequest,
  ScopeEvaluationFormDraftResponse,
  ScopeEvaluationFormResponse,
  ScopeEvaluationFormReviewRequest,
  ScopeEvaluationFormReviewResponse,
  ScopeEvaluationUploadFileRequest,
  ScopeEvaluationUploadFileResponse
} from '../models/scopeEvaluation';

export class ScopeEvaluationService {
  private static readonly GATEWAY_PATH = 'api/audits/audits';

  static async getScopeEvaluationForm(
    id: string
  ): Promise<AxiosResponse<ScopeEvaluationFormResponse>> {
    return await gatewayApi.get(buildApiPath(this.GATEWAY_PATH, id, 'scope'));
  }

  static async putDraftScopeEvaluationForm(
    id: string,
    body: ScopeEvaluationFormDraftRequest
  ): Promise<AxiosResponse<ScopeEvaluationFormDraftResponse>> {
    return await gatewayApi.put(buildApiPath(this.GATEWAY_PATH, id, 'scope', 'answers'), body);
  }

  static async postScopeEvaluationFormReview(
    id: string,
    body: ScopeEvaluationFormReviewRequest
  ): Promise<AxiosResponse<ScopeEvaluationFormReviewResponse>> {
    return await gatewayApi.post(buildApiPath(this.GATEWAY_PATH, id, 'scope', 'review'), body);
  }

  static async submitScopeEvaluationFormReview(
    id: string
  ): Promise<AxiosResponse<ScopeEvaluationFormReviewResponse>> {
    return await gatewayApi.post(buildApiPath(this.GATEWAY_PATH, id, 'scope', 'submit'));
  }

  static async postUploadFileRequest(
    id: string,
    body: ScopeEvaluationUploadFileRequest
  ): Promise<AxiosResponse<ScopeEvaluationUploadFileResponse>> {
    return await gatewayApi.post(
      buildApiPath(this.GATEWAY_PATH, id, 'scope', 'files', 'upload-request'),
      body
    );
  }

  static async postConfirmFileUpload(
    id: string,
    fileId: string
  ): Promise<AxiosResponse<ScopeEvaluationUploadFileResponse>> {
    return await gatewayApi.post(
      buildApiPath(this.GATEWAY_PATH, id, 'scope', 'files', fileId, 'confirm')
    );
  }
}
