import { UploadFileService } from '../services/uploadFile';
import { ScopeEvaluationService } from '../services/scopeEvaluation';
import type { ScopeEvaluationUploadFileRequest } from '../models/scopeEvaluation';

export function useScopeForm(): {
  uploadFileToAudit: (auditId: string, questionCode: string, file: File) => Promise<string>;
} {
  async function uploadFileToAudit(
    auditId: string,
    questionCode: string,
    file: File
  ): Promise<string> {
    try {
      const uploadRequestBody: ScopeEvaluationUploadFileRequest = {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        question_code: questionCode
      };

      const uploadRequestResponse = await ScopeEvaluationService.postUploadFileRequest(
        auditId,
        uploadRequestBody
      );

      if (!uploadRequestResponse.data || !uploadRequestResponse.data.upload_url) {
        throw new Error('API failed to return a valid upload URL.');
      }

      const presignedUrl: string = uploadRequestResponse.data.upload_url;

      await UploadFileService.uploadEvidence(presignedUrl, file, file.type);

      console.log(`Successfully uploaded file: ${file.name} for question: ${questionCode}`);

      return uploadRequestResponse.data.file_id.toString();
    } catch (error) {
      console.error(
        `Error uploading file to audit ${auditId} for question ${questionCode}:`,
        error
      );

      throw new Error(`File upload failed. Please try again. Details: ${(error as Error).message}`);
    }
  }

  return {
    uploadFileToAudit
  };
}
