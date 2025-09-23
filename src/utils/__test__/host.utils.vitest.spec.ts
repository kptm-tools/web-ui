import { describe, expect, it, vi, beforeEach } from 'vitest';
import { formatHostForTable, getPrincipalRapporteur } from '../host.utils';
import type { Host, Rapporteur } from 'vulnerability/models/hosts';
import { formatHostDate } from '../date.utils';

// Mock the HostService
vi.mock('src/services/host.service', () => ({
  HostService: {
    getHosts: vi.fn(),
    getHostById: vi.fn(),
    deleteHostById: vi.fn()
  }
}));

// Mock the host store
vi.mock('vulnerability/stores/host', () => ({
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
          creationDate: formatHostDate('2023-01-15T10:00:00Z'),
          originalCreationDate: '2023-01-15T10:00:00Z',
          email: 'primary@example.com'
        },
        {
          id: '2',
          name: 'Database B',
          created_at: '2023-02-20T14:30:00Z',
          rapporteurs: [{ email: 'single@test.com', is_principal: true, name: 'test' }],
          credentials: [],
          hostName: 'Database B',
          creationDate: formatHostDate('2023-02-20T14:30:00Z'),
          originalCreationDate: '2023-02-20T14:30:00Z',
          email: 'single@test.com'
        },
        {
          id: '3',
          name: 'API Gateway C',
          created_at: '2023-03-01T08:00:00Z',
          rapporteurs: [],
          credentials: [],
          hostName: 'API Gateway C',
          creationDate: formatHostDate('2023-03-01T08:00:00Z'),
          originalCreationDate: '2023-03-01T08:00:00Z',
          email: ''
        }
      ];

      expect(formatHostForTable(mockHosts)).toEqual(expectedFormattedHosts);
    });

    it('should return an empty array if the input array is empty', () => {
      expect(formatHostForTable([])).toEqual([]);
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
});
