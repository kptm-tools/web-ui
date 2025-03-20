<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-8">
        <div class="row">
          <div class="col-6">
            <div class="relative-position" style="width: 350px">
              <apexchart
                :options="donutOptions"
                :series="donut"
                type="donut"
              ></apexchart>
              <img
                src="../assets/needle.svg"
                width="40"
                alt="needle"
                class="needle"
                :style="{ transform: `rotate(${actualRotation}deg)` }"
              />
              <div class="porcentaje">
                {{
                  (
                    dashboardData?.overall_security_posture?.score * 100
                  ).toFixed(0)
                }}%
              </div>

              <div class="protection-score-variation">
                <span class="q-ma-none text">
                  {{
                    (
                      dashboardData?.overall_security_posture?.variation * 100
                    ).toFixed(0)
                  }}%
                  <i class="fa-solid fa-caret-up q-mx-sm text-red"></i>
                  Variation
                </span>
              </div>
            </div>
          </div>
          <div class="col-6">
            <apexchart
              type="heatmap"
              :options="heatmapOptions"
              :series="heatMapSeries"
            ></apexchart>
          </div>

          <div class="col-12">
            <div style="max-width: 700px">
              <apexchart
                type="area"
                :options="vulenrabilityTrendsOptions"
                :series="trendSeries"
              ></apexchart>
            </div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="row q-mb-md">
          <div class="title">Vulnerability Count</div>

          <div class="full-width">
            <apexchart
              :options="SCAN_INSIGHT_VULNERABILITY_OPTIONS"
              :series="donutCountSeries"
            ></apexchart>
          </div>
        </div>
        <div class="row flex items-center q-mb-md protection">
          <div
            class="col-6 flex items-center justify-center text-weight-bold protection-score"
          >
            {{ dashboardData?.last_scan.total_vulnerabilities }}
          </div>
          <div class="col-6">
            <p class="q-ma-none protection-host">
              {{ dashboardData?.last_scan.host_alias }}
            </p>
            <p class="q-ma-none protection-variation">
              {{ dashboardData?.last_scan.total_vulnerabilities_variation }}
              <i :class="variationIcon"></i>
              Variation
            </p>
          </div>
        </div>

        <div class="title">Host with the greates vulnerabilities</div>

        <q-list bordered>
          <template v-for="i in hostVulnerabilites" :key="i">
            <q-item v-ripple clickable>
              <q-item-section avatar>
                <i class="fa-solid fa-square q-mx-sm text-red"></i>
              </q-item-section>

              <q-item-section>{{ i.alias }}</q-item-section>
              <q-item-section>{{ i.vulnerability_count }}</q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { DashboardService } from 'src/services/dashboard';
  import { onMounted } from 'vue';
  import { SCAN_INSIGHT_VULNERABILITY_OPTIONS } from 'src/constants/apexcharts.constants';
  import { getVariationIcon } from 'src/utils';

  const dashboardData = ref();
  const heatMapSeries = ref(
    [] as { name: string; data: (number | null | undefined)[] }[]
  );
  const vulenrabilityTrendsOptions = ref({
    xaxis: {
      categories: []
    },
    title: {
      text: 'Vulnerability Trends'
    }
  });
  const hostVulnerabilites = ref(
    [] as { alias: string; vulnerability_count: number }[]
  );
  const trendSeries = ref([{ name: 'serie', data: [] }]);
  const donutCountSeries = ref([]);

  const heatmapOptions = ref({
    chart: {
      height: 350,
      type: 'heatmap'
    },
    xaxis: {
      type: 'category',
      categories: []
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
              to: 1,
              name: 'low',
              color: '#00A100'
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
  });

  const donut = [44, 55, 41, 17, 15];

  const donutOptions = {
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

  const actualRotation = ref(0);

  onMounted(() => {
    DashboardService.getDashboard().then(res => {
      dashboardData.value = res.data;
      const totalLow = dashboardData.value.host_severit_heat_map.reduce(
        (acc: number, val: { severity_count: { low: number } }) =>
          acc + val.severity_count.low,
        0
      );
      const totalMedium = dashboardData.value.host_severit_heat_map.reduce(
        (acc: number, val: { severity_count: { medium: number } }) =>
          acc + val.severity_count.medium,
        0
      );
      const totalHigh = dashboardData.value.host_severit_heat_map.reduce(
        (acc: number, val: { severity_count: { high: number } }) =>
          acc + val.severity_count.high,
        0
      );
      const totalCritical = dashboardData.value.host_severit_heat_map.reduce(
        (acc: number, val: { severity_count: { critical: number } }) =>
          acc + val.severity_count.critical,
        0
      );
      const totalVulnerabilities =
        totalLow + totalMedium + totalHigh + totalCritical;
      const listTotal = [
        { value: totalLow, name: 'low', color: '#4CAF50' },
        { value: totalMedium, name: 'medium', color: '#FFC107' },
        { value: totalHigh, name: 'high', color: '#FF5722' },
        { value: totalCritical, name: 'critical', color: '#D32F2F' }
      ];
      const step = totalVulnerabilities / 4;
      const rangeColor = listTotal.map(
        (
          val: { value: number; name: string; color: string },
          index: number
        ) => ({
          from: 1 + step * index,
          to: 1 + step * index + step,
          name: val.name,
          color: val.color
        })
      );
      heatmapOptions.value = {
        ...heatmapOptions.value,
        xaxis: {
          type: 'category',
          categories: res.data.host_severit_heat_map.map(
            (val: { alias: string }) => val.alias
          )
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            radius: 0,
            useFillColorAsStroke: true,
            colorScale: {
              ranges: rangeColor,
              inverse: true
            }
          }
        }
      };
      heatMapSeries.value = [
        {
          name: 'Low',
          data: res.data.host_severit_heat_map.map(
            (val: { severity_count: { low: number } }) => val.severity_count.low
          )
        },
        {
          name: 'Medium',
          data: res.data.host_severit_heat_map.map(
            (val: { severity_count: { medium: number } }) =>
              val.severity_count.medium
          )
        },
        {
          name: 'High',
          data: res.data.host_severit_heat_map.map(
            (val: { severity_count: { high: number } }) =>
              val.severity_count.high
          )
        },
        {
          name: 'Critical',
          data: res.data.host_severit_heat_map.map(
            (val: { severity_count: { critical: number } }) =>
              val.severity_count.critical
          )
        }
      ];

      // res.data.host_severit_heat_map.map(
      //   (val: { alias: string; severity_count: Record<string, number> }) => ({
      //     name: val.alias,
      //     data: Object.values(val.severity_count)
      //   })
      // );
      vulenrabilityTrendsOptions.value = {
        ...vulenrabilityTrendsOptions.value,
        xaxis: {
          categories: res.data.vulnerability_trends.map(
            (val: { time_period: string }) => val.time_period
          )
        }
      };

      hostVulnerabilites.value = res.data.hosts_with_greatest_vulnerabilities;
      trendSeries.value = [
        {
          name: 'serie',
          data: res.data.vulnerability_trends.map(
            (val: { vulnerability_count: number }) => val.vulnerability_count
          )
        }
      ];
      donutCountSeries.value = Object.values(
        res.data.last_scan.severity_counts
      );
    });
  });

  const variationIcon = computed(() =>
    getVariationIcon(dashboardData.value?.total_vulnerabilities_variation || 0)
  );
</script>

<style lang="scss">
  .protection {
    border-radius: 8px;
    background: #f6f7fc;
    padding: 0.5em 0em;

    &-score {
      font-size: 32px;
      font-weight: 800;
      line-height: 37.92px;
      letter-spacing: -0.02em;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }

    &-host {
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }

    &-variation {
      color: #5c7288;
    }
  }

  .protection-score-variation {
    position: absolute;
    bottom: 70px;
    margin-left: auto;
    margin-right: auto;
    left: -20px;
    right: 0;
    width: fit-content;

    .text {
      color: #5c7288;
    }
  }

  .needle {
    position: absolute;
    bottom: 130px;
    left: 110px;
    transform-origin: center;
    transition: transform 0.5s ease-in-out;
  }

  .porcentaje {
    color: var(--text, #313541);
    text-align: center;
    font-family: Rubik;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 33.356px;
    /* 208.475% */
    position: absolute;
    bottom: 160px;
    margin-left: auto;
    margin-right: auto;
    left: -40px;
    right: 0;
  }
</style>
