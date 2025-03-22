import { AxiosResponse } from 'axios';
import { fusionAuthApi } from 'boot/axios';
import {
  HostSeverity,
  HostVulnerability,
  iMainDashboard,
  SeverityCountLevels,
  VulnerabilityTrend
} from 'src/models/dashboard.models';

export class DashboardService {
  private static readonly BASE_PATH = '/api/dashboard';

  static async getDashboard(): Promise<AxiosResponse<iMainDashboard>> {
    return await fusionAuthApi.get(`${this.BASE_PATH}`);
  }
}

export class MainDashboard {
  constructor(private readonly _dashboard: iMainDashboard) {
    this._dashboard = _dashboard;
  }

  get heatmapTotalLowValues(): number {
    return this.getTotalValuesHeatmap('low');
  }

  get heatmapListLowValues(): number[] {
    return this.getListValuesHeatmap('low');
  }

  get heatmapTotalMediumValues(): number {
    return this.getTotalValuesHeatmap('medium');
  }

  get heatmapListMediumValues(): number[] {
    return this.getListValuesHeatmap('medium');
  }

  get heatmapTotalHighValues(): number {
    return this.getTotalValuesHeatmap('high');
  }

  get heatmapListHighValues(): number[] {
    return this.getListValuesHeatmap('high');
  }

  get heatmapTotalCriticalValues(): number {
    return this.getTotalValuesHeatmap('critical');
  }

  get heatmapListCriticalValues(): number[] {
    return this.getListValuesHeatmap('critical');
  }

  get heatmapTotalVulnerabilities(): number {
    return (
      this.heatmapTotalLowValues +
      this.heatmapTotalMediumValues +
      this.heatmapTotalHighValues +
      this.heatmapTotalCriticalValues
    );
  }

  get heatmapSeries(): { name: string; data: number[] }[] {
    return [
      {
        name: 'Low',
        data: this.heatmapListLowValues
      },
      {
        name: 'Medium',
        data: this.heatmapListMediumValues
      },
      {
        name: 'High',
        data: this.heatmapListHighValues
      },
      {
        name: 'Critical',
        data: this.heatmapListCriticalValues
      }
    ];
  }

  get heatmapCategories(): string[] {
    return this._dashboard.host_severity_heat_map.map(val => val.alias);
  }

  get donutSeverityCountsSeries(): number[] {
    return Object.values(this._dashboard.last_scan.severity_counts);
  }

  get listHostsWithGreatestVulnerabilities(): HostVulnerability[] {
    return this._dashboard.hosts_with_greatest_vulnerabilities;
  }

  get trendVulnerabilityCategories(): string[] {
    return this._dashboard.vulnerability_trends.map(
      (val: VulnerabilityTrend) => val.time_period
    );
  }

  get trendVulnerabilitySeries(): number[] {
    return this._dashboard.vulnerability_trends.map(
      (val: VulnerabilityTrend) => val.vulnerability_count
    );
  }

  get totalByAliasVulnerabilities(): number[] {
    return this._dashboard.host_severity_heat_map.map(val =>
      Object.values(val.severity_count).reduce((acc, val) => acc + val)
    );
  }

  private getTotalValuesHeatmap(level: SeverityCountLevels): number {
    return this._dashboard.host_severity_heat_map.reduce(
      (acc: number, val: HostSeverity) => acc + val.severity_count[level],
      0
    );
  }

  private getListValuesHeatmap(level: SeverityCountLevels): number[] {
    return this._dashboard.host_severity_heat_map.map(
      (val: HostSeverity, index: number) => {
        const value = this.totalByAliasVulnerabilities[index];
        const divider = value === 0 ? 1 : value;
        return Number((val.severity_count[level] / divider).toFixed(2));
      },
      0
    );
  }
}
