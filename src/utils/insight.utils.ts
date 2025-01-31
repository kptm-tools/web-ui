import { SeverityPerType, VulnerabilityItem } from 'src/models/scans.model';

export function getVariationIcon(variation: number): string {
  let iconClass = 'fa-solid q-mx-sm ';

  if (variation === 0) {
    iconClass += 'text-grey fa-caret-up';
  } else if (variation > 0) {
    iconClass += 'text-green fa-caret-up';
  } else {
    iconClass += 'text-red fa-caret-down';
  }

  return iconClass;
}

export function getVulnerabilityList(
  vulnerabilities: SeverityPerType
): VulnerabilityItem[] {
  return Object.keys(vulnerabilities).map((key, index) => ({
    id: index,
    name: key,
    count: vulnerabilities[key]
  }));
}
