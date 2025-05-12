import { describe, expect, it } from 'vitest';
import { getVariationIcon, getVulnerabilityList } from './insight.utils';
import type { SeverityPerType, VulnerabilityItem } from 'src/models/scans.model';

describe('getVariationIcon', () => {
  it('should return the grey up arrow icon class for a variation of 0', () => {
    expect(getVariationIcon(0)).toBe('fa-solid q-mx-sm text-grey fa-caret-up');
  });

  it('should return the green up arrow icon class for a positive variation', () => {
    expect(getVariationIcon(5)).toBe('fa-solid q-mx-sm text-green fa-caret-up');
  });

  it('should return the red down arrow icon class for a negative variation', () => {
    expect(getVariationIcon(-3)).toBe('fa-solid q-mx-sm text-red fa-caret-down');
  });
});

describe('getVulnerabilityList', () => {
  it('should transform a SeverityPerType object into an array of VulnerabilityItem', () => {
    const vulnerabilities: SeverityPerType = {
      Critical: '3',
      High: '5',
      Medium: '2',
      Low: '1'
    };
    const expectedList: VulnerabilityItem[] = [
      { id: 0, name: 'Critical', type: '3' },
      { id: 1, name: 'High', type: '5' },
      { id: 2, name: 'Medium', type: '2' },
      { id: 3, name: 'Low', type: '1' }
    ];
    expect(getVulnerabilityList(vulnerabilities)).toEqual(expectedList);
  });

  it('should handle an empty SeverityPerType object', () => {
    const vulnerabilities: SeverityPerType = {};
    expect(getVulnerabilityList(vulnerabilities)).toEqual([]);
  });

  it('should handle SeverityPerType with zero values', () => {
    const vulnerabilities: SeverityPerType = {
      Critical: '0',
      High: '0'
    };
    const expectedList: VulnerabilityItem[] = [
      { id: 0, name: 'Critical', type: '0' },
      { id: 1, name: 'High', type: '0' }
    ];
    expect(getVulnerabilityList(vulnerabilities)).toEqual(expectedList);
  });

  it('should use "None" as the type if the value is undefined', () => {
    const vulnerabilities: SeverityPerType = {
      Critical: '2',
      Unknown: ''
    } as SeverityPerType; // Type assertion to allow undefined
    const expectedList: VulnerabilityItem[] = [
      { id: 0, name: 'Critical', type: '2' },
      { id: 1, name: 'Unknown', type: 'None' }
    ];
    expect(getVulnerabilityList(vulnerabilities)).toEqual(expectedList);
  });
});
