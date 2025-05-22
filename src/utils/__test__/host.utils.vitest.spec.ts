/* eslint-disable @typescript-eslint/unbound-method */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import {
  formatHostForTable,
  getHostFromService,
  getHostByIdFromService,
  getInitalDataForHostTable,
  getPrincipalRapporteur,
  deleteHostById
} from '../host.utils';
import type { Host, Rapporteur } from 'src/models/hosts.models';
import { HostService } from 'src/services/host.service';
import { useHostStore } from 'src/stores/host-store';

// Mock the HostService
vi.mock('src/services/host.service', () => ({
  HostService: {
    getHosts: vi.fn(),
    getHostById: vi.fn(),
    deleteHostById: vi.fn()
  }
}));

// Mock the host store
vi.mock('src/stores/host-store', () => ({
  useHostStore: vi.fn(() => ({
    setInitialList: vi.fn()
  }))
}));

describe('host.utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('formatHostForTable', () => {
    it('should correctly format an array of Hosts for a table', () => {
      const mockHosts: Host[] = [
        {
          id: '1',
          name: 'Server A',
          created_at: '2023-01-15T10:00:00Z',
          rapporteurs: [
            { email: 'secondary@example.com', is_principal: false, name: 'test' },
            { email: 'primary@example.com', is_principal: true, name: 'test' }
          ],
          credentials: []
        },
        {
          id: '2',
          name: 'Database B',
          created_at: '2023-02-20T14:30:00Z',
          rapporteurs: [{ email: 'single@test.com', is_principal: true, name: 'test' }],
          credentials: []
        },
        {
          id: '3',
          name: 'API Gateway C',
          created_at: '2023-03-01T08:00:00Z',
          rapporteurs: [],
          credentials: []
        }
      ];

      const expectedFormattedHosts = [
        {
          id: '1',
          name: 'Server A',
          created_at: '2023-01-15T10:00:00Z',
          rapporteurs: [
            { email: 'secondary@example.com', is_principal: false, name: 'test' },
            { email: 'primary@example.com', is_principal: true, name: 'test' }
          ],
          credentials: [],
          hostName: 'Server A',
          creationDate: '2023-01-15T10:00:00Z',
          email: 'primary@example.com'
        },
        {
          id: '2',
          name: 'Database B',
          created_at: '2023-02-20T14:30:00Z',
          rapporteurs: [{ email: 'single@test.com', is_principal: true, name: 'test' }],
          credentials: [],
          hostName: 'Database B',
          creationDate: '2023-02-20T14:30:00Z',
          email: 'single@test.com'
        },
        {
          id: '3',
          name: 'API Gateway C',
          created_at: '2023-03-01T08:00:00Z',
          rapporteurs: [],
          credentials: [],
          hostName: 'API Gateway C',
          creationDate: '2023-03-01T08:00:00Z',
          email: ''
        }
      ];

      expect(formatHostForTable(mockHosts)).toEqual(expectedFormattedHosts);
    });

    it('should return an empty array if the input array is empty', () => {
      expect(formatHostForTable([])).toEqual([]);
    });
  });

  describe('getHostFromService', () => {
    it('should call HostService.getHosts and return the data', async () => {
      const mockHostData: Host[] = [
        {
          id: '4',
          name: 'Test Host',
          created_at: '2023-04-01T12:00:00Z',
          rapporteurs: [],
          credentials: []
        }
      ];
      (HostService.getHosts as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockHostData });

      const result = await getHostFromService();
      expect(HostService.getHosts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockHostData);
    });
  });

  describe('getHostByIdFromService', () => {
    it('should call HostService.getHostById with the provided hostId and return the data', async () => {
      const mockHost: Host = {
        credentials: [],
        id: '5',
        name: 'Specific Host',
        created_at: '2023-05-05T18:00:00Z',
        rapporteurs: [{ email: 'specific@host.com', is_principal: true, name: 'test' }]
      };
      (HostService.getHostById as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockHost });
      const hostId = 'test-host-id';

      const result = await getHostByIdFromService(hostId);
      expect(HostService.getHostById).toHaveBeenCalledWith(hostId);
      expect(result).toEqual(mockHost);
    });
  });

  describe('getInitalDataForHostTable', () => {
    it('should call HostService.getHosts and format the data for the table', async () => {
      const mockHostDataFromService: Host[] = [
        {
          id: '6',
          name: 'Service Host A',
          created_at: '2023-06-10T09:00:00Z',
          rapporteurs: [],
          credentials: []
        }
      ];
      (HostService.getHosts as ReturnType<typeof vi.fn>).mockResolvedValue({
        data: mockHostDataFromService
      });

      const expectedFormattedData = [
        {
          id: '6',
          name: 'Service Host A',
          created_at: '2023-06-10T09:00:00Z',
          rapporteurs: [],
          credentials: [],
          hostName: 'Service Host A',
          creationDate: '2023-06-10T09:00:00Z',
          email: ''
        }
      ];

      const result = await getInitalDataForHostTable();
      expect(HostService.getHosts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedFormattedData);
    });
  });

  describe('getPrincipalRapporteur', () => {
    it('should return the email of the principal rapporteur if one exists', () => {
      const rapporteurs: Rapporteur[] = [
        { email: 'secondary@example.com', is_principal: false, name: 'test' },
        { email: 'primary@example.com', is_principal: true, name: 'test' },
        { email: 'another@test.com', is_principal: false, name: 'test' }
      ];
      expect(getPrincipalRapporteur(rapporteurs)).toBe('primary@example.com');
    });

    it('should return an empty string if no principal rapporteur exists', () => {
      const rapporteurs: Rapporteur[] = [
        { email: 'secondary@example.com', is_principal: false, name: 'test' },
        { email: 'another@test.com', is_principal: false, name: 'test' }
      ];
      expect(getPrincipalRapporteur(rapporteurs)).toBe('');
    });

    it('should return an empty string if the rapporteurs array is empty', () => {
      expect(getPrincipalRapporteur([])).toBe('');
    });
  });

  describe('deleteHostById', () => {
    it('should call HostService.deleteHostById and then setInitialDataToStore on success', async () => {
      const hostIdToDelete = 'delete-me';
      (HostService.deleteHostById as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      (HostService.getHosts as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [] }); // Mock getHosts for setInitialDataToStore

      await deleteHostById(hostIdToDelete);
      expect(HostService.deleteHostById).toHaveBeenCalledWith(hostIdToDelete);
      expect(useHostStore).toHaveBeenCalledTimes(1);
    });

    it('should log an error to the console if HostService.deleteHostById throws an error', async () => {
      const hostIdToDelete = 'error-host';
      const mockError = new Error('Failed to delete host');
      (HostService.deleteHostById as ReturnType<typeof vi.fn>).mockRejectedValue(mockError);
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await deleteHostById(hostIdToDelete);
      expect(HostService.deleteHostById).toHaveBeenCalledWith(hostIdToDelete);
      expect(consoleLogSpy).toHaveBeenCalledWith(mockError);
      expect(useHostStore).not.toHaveBeenCalled(); // Ensure store is not updated on error

      consoleLogSpy.mockRestore(); // Clean up the spy
    });
  });
});
