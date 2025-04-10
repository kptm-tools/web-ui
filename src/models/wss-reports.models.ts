export type WebSocketReportMessageRequest =
  | {
      type: WebSocketMessageRequest.INITIAL_DATA_REQUEST;
      payload: {
        scan_id: string;
      };
    }
  | {
      type: WebSocketMessageRequest.VECTOR_UPDATE_REQUEST;
      payload: {
        vulnerability_type_name: string;
        new_value: number;
      };
    }
  | {
      type: WebSocketMessageRequest.VECTOR_SELECT_REQUEST;
      payload: {
        vulnerability_type_name: string;
      };
    }
  | {
      type: WebSocketMessageRequest.VECTOR_APPLY_REQUEST;
      payload: object;
    };

export type WebSocketReportIncomingMessage =
  | {
      type: WebSocketMessageType.INITIAL_DATA_RESPONSE;
      payload: {
        vulnerability_types: {
          name: string;
          highest_cvss: number;
          count: number;
          percentage: number;
          available_cvss_values: number[]; // assuming it's a list of numbers
        }[];
        global_cvss_score: number;
        global_total_vulnerabilities: number;
      };
    }
  | {
      type: WebSocketMessageType.VECTOR_UPDATE_RESPONSE;
      payload: {
        expected_global_cvss_score: number;
        expected_global_total_vulnerabilities: number;
      };
    }
  | {
      type: WebSocketMessageType.VECTOR_DETAILS_RESPONSE;
      payload: {
        vulnerability_details: {
          id: string;
          type: string;
          cvss: number;
          description: string;
          [key: string]: unknown; // for optional additional fields
        };
      };
    }
  | {
      type: WebSocketMessageType.REPORT_DATA_RESPONSE;
      payload: {
        solved_vulnerabilities: unknown[]; // You can define exact structure if needed
        unattended_vulnerabilities: unknown[];
        expected_security_posture: string;
      };
    }
  | {
      type: WebSocketMessageType.ERROR;
      payload: {
        message: string;
      };
    };

export type WssMessageHandler = (data: WebSocketReportIncomingMessage) => void;

export enum WebSocketMessageType {
  INITIAL_DATA_RESPONSE = 'initial_data_response',
  VECTOR_UPDATE_RESPONSE = 'vector_update_response',
  VECTOR_DETAILS_RESPONSE = 'vector_details_response',
  REPORT_DATA_RESPONSE = 'report_data_response',
  ERROR = 'error'
}

export enum WebSocketMessageRequest {
  INITIAL_DATA_REQUEST = 'initial_data_request',
  VECTOR_UPDATE_REQUEST = 'vector_update',
  VECTOR_SELECT_REQUEST = 'select_vector',
  VECTOR_APPLY_REQUEST = 'apply_vectors_request'
}
