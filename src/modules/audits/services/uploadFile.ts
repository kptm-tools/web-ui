interface UploadResult {
  success: boolean;
  message: string;
}

export class UploadFileService {
  /**
   * Uploads a file (Blob or File object) to the presigned URL endpoint.
   * This is a PUT request designed to handle direct binary file upload.
   * * @param presignedUrlSegment The unique part of the URL (e.g., '{presignedURL}' from the cURL).
   * @param file The File or Blob object containing the binary data.
   * @param contentType The MIME type of the file, typically 'application/pdf'.
   * @returns A promise that resolves to an UploadResult object.
   */
  static async uploadEvidence(
    presignedUrl: string,
    file: File | Blob,
    contentType: string = 'application/pdf'
  ): Promise<UploadResult> {
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      body: file
    };

    try {
      const response = await fetch(presignedUrl, options);

      if (!response.ok) {
        const errorDetail = await response.text();

        return {
          success: false,
          message: `Upload failed: ${response.status} ${response.statusText}. Detail: ${errorDetail.substring(0, 100)}`
        };
      }

      return {
        success: true,
        message: 'Evidence document uploaded successfully.'
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown network error occurred.';

      throw new Error(`Network error during file upload: ${errorMessage}`);
    }
  }
}
