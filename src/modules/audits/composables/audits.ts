import { isAxiosError } from 'axios';
import { ref, type Ref } from 'vue';
import { useQuasar, type QTableColumn } from 'quasar';
import { AuditService } from 'audits/services/audits';
import { errorQuasarNotify, successQuasarNotify } from 'src/utils';
import { AUDITS_COLUMNS as AUDITS_TABLE_COLUMNS } from 'audits/constants/table';
import type { AuditGeneralResponse, AuditResponse } from 'audits/models/audits';

interface UseAuditsComposable {
  auditsList: Ref<AuditResponse[]>;
  fetchAuditsData: () => Promise<AuditGeneralResponse>;
  createAudit: (name: string) => Promise<AuditResponse>;
  showCreateAuditDialog: () => void;
  AUDITS_TABLE_COLUMNS: QTableColumn[];
}

/**
 * Composable function for managing audit-related operations, including fetching, creation,
 * and presenting user dialogs using Quasar.
 *
 * It provides a reactive list of audits and functions to interact with the audit API.
 *
 * @returns {UseAuditsComposable} An object containing reactive data and methods for audit management.
 *
 * @example
 * // In a Vue component's setup function:
 * import { useAudits } from './useAudits';
 *
 * const { auditsList, fetchAuditsData, showCreateAuditDialog } = useAudits();
 *
 * // Fetch data on component mount
 * onMounted(() => {
 * void fetchAuditsData();
 * });
 *
 * <button @click="showCreateAuditDialog()">New Audit</button>
 */
export function useAudits(): UseAuditsComposable {
  const $q = useQuasar();

  /**
   * Reactive reference holding the list of fetched audits.
   * @type {Ref<AuditResponse[]>}
   */
  const auditsList: Ref<AuditResponse[]> = ref([]);

  /**
   * Creates a new audit on the server with the given name.
   * Displays a success or error notification using Quasar.
   *
   * @async
   * @param {string} name - The name for the new audit.
   * @returns {Promise<AuditResponse>} A promise that resolves with the created audit object.
   * @throws {Error} Throws the original error if the API call fails.
   */
  async function createAudit(name: string): Promise<AuditResponse> {
    try {
      const response = (await AuditService.postAudit({ name })).data;
      successQuasarNotify(`Auditoria ${name} creada`);
      return response;
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error;
        const serverMessage = axiosError.response?.data?.message;
        const userMessage = serverMessage
          ? `Error al crear la auditoria: ${serverMessage}`
          : `Network Error: Could not connect to the audit service.`;
        errorQuasarNotify(userMessage);
      } else {
        errorQuasarNotify('An unexpected error occurred during audit creation.');
      }
      throw error;
    }
  }

  /**
   * Fetches the list of audits from the server and updates the `auditsList` reactive reference.
   * Displays an error notification using Quasar if the request fails.
   *
   * @async
   * @returns {Promise<AuditGeneralResponse>} A promise that resolves with the general audit response data.
   * @throws {Error} Throws the original error if the API call fails.
   */
  async function fetchAuditsData(): Promise<AuditGeneralResponse> {
    try {
      const response = await AuditService.getAudits();
      auditsList.value = response.data.audits;
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const axiosError = error;
        const serverMessage = axiosError.response?.data?.message;
        const userMessage = serverMessage
          ? `Error al obtener las auditorias`
          : `Network Error: Could not connect to the audit service.`;
        errorQuasarNotify(userMessage);
      } else {
        errorQuasarNotify('An unexpected error occurred during audit fetch.');
      }
      throw error;
    }
  }

  /**
   * Shows a Quasar dialog prompting the user to enter a name for a new audit.
   * If the user confirms and provides a valid name, it calls `createAudit` to create the audit
   * and then re-fetches the audit list.
   *
   * @returns {void}
   */
  function showCreateAuditDialog(): void {
    $q.dialog({
      title: 'Iniciar Auditoria',
      message: 'Elige el nombre de tu auditoria',
      prompt: {
        model: '',
        type: 'text',
        isValid: (val: string) => val.trim() !== '' // Check if the input is not empty or just whitespace
      },
      cancel: true,
      persistent: true
    }).onOk((auditName: string) => {
      // Create the audit, then re-fetch the list on success
      void createAudit(auditName).then(() => {
        void fetchAuditsData();
      });
    });
  }

  return {
    auditsList,
    AUDITS_TABLE_COLUMNS,
    fetchAuditsData,
    createAudit,
    showCreateAuditDialog
  };
}
