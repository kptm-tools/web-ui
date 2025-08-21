// Application theme configuration for consistent styling
export const APP_CHART_THEME = {
  fontFamily: 'Rubik, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  colors: {
    primary: '#313541',
    secondary: '#5c7288',
    success: '#97B951',
    warning: '#FBBF65',
    danger: '#E5494D',
    muted: '#9ca3af'
  },
  severity: {
    critical: '#ED273D',
    high: '#F3A488', 
    medium: '#F6BE63',
    low: '#97B951',
    none: '#42B188',
    unknown: '#A2B188'
  }
};

export const SCAN_INSIGHT_VULNERABILITY_OPTIONS = {
  chart: {
    type: 'donut',
    fontFamily: APP_CHART_THEME.fontFamily,
    background: 'transparent',
    dropShadow: {
      enabled: false
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (
      value: number,
      { seriesIndex, w }: { seriesIndex: number; w: { config: { series: [] } } }
    ) {
      return w.config.series[seriesIndex];
    },
    style: {
      fontSize: '14px',
      fontFamily: APP_CHART_THEME.fontFamily,
      fontWeight: '600',
      colors: [APP_CHART_THEME.colors.primary]
    }
  },
  plotOptions: {
    pie: {
      dataLabels: {
        offset: 15
      },
      donut: {
        size: '65%'
      }
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '13px',
    fontFamily: APP_CHART_THEME.fontFamily,
    fontWeight: '500',
    labels: {
      colors: APP_CHART_THEME.colors.secondary
    },
    markers: {
      width: 12,
      height: 12,
      radius: 3
    }
  },
  tooltip: {
    style: {
      fontSize: '13px',
      fontFamily: APP_CHART_THEME.fontFamily
    }
  },
  labels: ['Critical', 'High', 'Medium', 'Low', 'None', 'Unknown'],
  colors: [
    APP_CHART_THEME.severity.critical,
    APP_CHART_THEME.severity.high,
    APP_CHART_THEME.severity.medium,
    APP_CHART_THEME.severity.low,
    APP_CHART_THEME.severity.none,
    APP_CHART_THEME.severity.unknown
  ]
};

export const SCAN_INSIGHT_PROTECTION_SCORE_OPTIONS = {
  chart: {
    type: 'donut',
    fontFamily: APP_CHART_THEME.fontFamily,
    background: 'transparent'
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  colors: [APP_CHART_THEME.colors.danger, APP_CHART_THEME.colors.warning, APP_CHART_THEME.colors.success],
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: 10,
      donut: {
        size: '75%'
      }
    }
  },
  stroke: {
    show: false
  }
};

export const SCANT_INSIGHT_EXPECTED_SCORE_OPTIONS = {
  chart: {
    height: '100%',
    type: 'donut'
  },
  dataLabels: {
    enabled: false,
    offsetX: 500,
    offsetY: 200
  },
  legend: {
    show: true,
    fontSize: '0px',
    markers: {
      size: 0
    }
  },
  colors: ['#E5494D', '#FBBF65', '#46A758'],
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: 10
    }
  }
};

export const HEATMAP_CHART_OPTIONS = {
  chart: {
    height: 320,
    type: 'heatmap',
    fontFamily: APP_CHART_THEME.fontFamily,
    background: 'transparent',
    toolbar: {
      show: false
    }
  },
  xaxis: {
    type: 'category',
    categories: [] as string[],
    labels: {
      style: {
        fontSize: '12px',
        fontFamily: APP_CHART_THEME.fontFamily,
        colors: APP_CHART_THEME.colors.secondary
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12px',
        fontFamily: APP_CHART_THEME.fontFamily,
        colors: APP_CHART_THEME.colors.secondary
      }
    }
  },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      radius: 6,
      useFillColorAsStroke: false,
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 0.25,
            name: 'Low Risk',
            color: '#97B951'
          },
          {
            from: 0.26,
            to: 0.5,
            name: 'Medium Risk',
            color: '#F6BE63'
          },
          {
            from: 0.51,
            to: 0.75,
            name: 'High Risk',
            color: '#F3A488'
          },
          {
            from: 0.76,
            to: 1,
            name: 'Critical Risk',
            color: '#ED273D'
          }
        ]
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 2,
    colors: ['#ffffff']
  },
  title: {
    text: 'Vulnerability Heat Map',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: '700',
      fontFamily: APP_CHART_THEME.fontFamily,
      color: APP_CHART_THEME.colors.primary
    }
  },
  legend: {
    show: true,
    position: 'bottom',
    fontSize: '12px',
    fontFamily: APP_CHART_THEME.fontFamily,
    labels: {
      colors: APP_CHART_THEME.colors.secondary
    }
  },
  tooltip: {
    style: {
      fontSize: '12px',
      fontFamily: APP_CHART_THEME.fontFamily
    }
  }
};

export const OVERALL_DONUT_OPTIONS = {
  chart: {
    type: 'donut',
    width: '100%',
    fontFamily: APP_CHART_THEME.fontFamily,
    background: 'transparent'
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  colors: [APP_CHART_THEME.colors.danger, APP_CHART_THEME.colors.warning, APP_CHART_THEME.colors.success],
  plotOptions: {
    pie: {
      startAngle: -90,
      endAngle: 90,
      offsetY: 10,
      donut: {
        size: '75%'
      }
    }
  },
  stroke: {
    show: false
  }
};

export const OVERALL_DONUT_OPTIONS_PERCENTAGE = {
  chart: {
    type: 'radialBar',
    height: 20,
    fontFamily: APP_CHART_THEME.fontFamily
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  colors: [APP_CHART_THEME.colors.danger, APP_CHART_THEME.colors.warning, APP_CHART_THEME.colors.success]
};

// New ApexCharts configuration for Vulnerability Trend Chart
export const VULNERABILITY_TREND_OPTIONS = {
  chart: {
    type: 'area',
    height: 320,
    fontFamily: APP_CHART_THEME.fontFamily,
    background: 'transparent',
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3,
    colors: [APP_CHART_THEME.severity.critical]
  },
  markers: {
    size: 4,
    colors: [APP_CHART_THEME.severity.critical],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: {
      size: 6
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.6,
      opacityTo: 0.1,
      stops: [0, 100],
      colorStops: [
        {
          offset: 0,
          color: APP_CHART_THEME.severity.critical,
          opacity: 0.6
        },
        {
          offset: 100,
          color: APP_CHART_THEME.severity.critical,
          opacity: 0.1
        }
      ]
    }
  },
  grid: {
    show: true,
    borderColor: '#f1f5f9',
    strokeDashArray: 2,
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  xaxis: {
    type: 'category',
    labels: {
      style: {
        fontSize: '12px',
        fontFamily: APP_CHART_THEME.fontFamily,
        colors: APP_CHART_THEME.colors.secondary
      }
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '12px',
        fontFamily: APP_CHART_THEME.fontFamily,
        colors: APP_CHART_THEME.colors.secondary
      }
    }
  },
  title: {
    text: 'Vulnerability Trends',
    align: 'left',
    style: {
      fontSize: '16px',
      fontWeight: '700',
      fontFamily: APP_CHART_THEME.fontFamily,
      color: APP_CHART_THEME.colors.primary
    }
  },
  tooltip: {
    theme: 'light',
    style: {
      fontSize: '12px',
      fontFamily: APP_CHART_THEME.fontFamily
    },
    x: {
      show: true
    },
    y: {
      title: {
        formatter: () => 'Vulnerabilities: '
      },
      formatter: (value: number | null) => {
        if (value === null) {
          return 'No scan data';
        }
        return value.toString();
      }
    }
  },
  noData: {
    text: 'No vulnerability trend data available',
    align: 'center',
    verticalAlign: 'middle',
    style: {
      color: APP_CHART_THEME.colors.secondary,
      fontSize: '14px',
      fontFamily: APP_CHART_THEME.fontFamily
    }
  },
  legend: {
    show: false
  }
};
