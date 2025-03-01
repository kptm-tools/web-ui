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
