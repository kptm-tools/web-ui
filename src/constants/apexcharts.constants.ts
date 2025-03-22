export const SCAN_INSIGHT_VULNERABILITY_OPTIONS = {
  chart: {
    type: 'donut'
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
      fontSize: '16px',
      fontWeight: 'regular',
      colors: ['#313541', '#313541', '#313541', '#313541']
    }
  },
  plotOptions: {
    pie: {
      dataLabels: {
        offset: 15
      }
    }
  },
  labels: ['Critical', 'High', 'Medium', 'Low', 'None', 'Unknown'],
  colors: ['#ED273D', '#F3A488', '#F6BE63', '#97B951', '#42B188', '#A2B188']
};

export const SCAN_INSIGHT_PROTECTION_SCORE_OPTIONS = {
  chart: {
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
    height: 350,
    type: 'heatmap'
  },
  xaxis: {
    type: 'category',
    categories: [] as string[]
  },
  plotOptions: {
    heatmap: {
      shadeIntensity: 0.5,
      radius: 0,
      useFillColorAsStroke: true,
      colorScale: {
        ranges: [
          {
            from: 0,
            to: 0.25,
            name: 'Low Proportion',
            color: '#4CAF50'
          },
          {
            from: 0.26,
            to: 0.5,
            name: 'Medium Proportion',
            color: '#FFC107'
          },
          {
            from: 0.51,
            to: 0.75,
            name: 'High Proportion',
            color: '#FF9800'
          },
          {
            from: 0.76,
            to: 1,
            name: 'Very High Proportion',
            color: '#F44336'
          }
        ],
        inverse: true
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 1
  },
  title: {
    text: 'Vulnerability Heat Map'
  }
};

export const OVERALL_DONUT_OPTIONS = {
  chart: {
    type: 'donut',
    width: '100%'
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
