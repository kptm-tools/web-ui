<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-8">
        <div class="row">
          <div class="col-6">
            <div class="relative-position" style="width: 350px">
              <div class="title">Overall Security Posture</div>
              <div class="subtitle" style="color: #5c7288">
                General security status of the clients environment
              </div>
              <apexchart
                :options="OVERALL_DONUT_OPTIONS"
                :series="[33, 33, 33]"
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
                {{ (dashboardData?.overall_security_posture?.score * 100).toFixed(0) }}%
              </div>

              <div class="protection-score-variation">
                <span class="q-ma-none text">
                  {{ (dashboardData?.overall_security_posture?.variation * 100).toFixed(0) }}%
                  <i class="fa-solid fa-caret-up q-mx-sm text-red"></i>
                  Variation
                </span>
              </div>
            </div>
          </div>
          <div class="col-6">
            <apexchart type="heatmap" :options="heatMapOptions" :series="heatMapSeries"></apexchart>
          </div>

          <div class="col-12">
            <div style="max-width: 800px; position: relative">
              <div class="button-time flex">
                <q-select
                  dense
                  outlined
                  :options="severityOptions"
                  v-model="severitySelect"
                  multiple
                  class="q-mr-md"
                  style="width: 150px"
                  @update:model-value="fetchDashboardData"
                />
                <template v-for="time in timePeriodOptions" :key="time">
                  <q-btn
                    :label="time"
                    @click="setTimePeriod(time)"
                    dense
                    flat
                    :class="{ 'time-selected': timePeriodSelect == time }"
                  ></q-btn>
                </template>
              </div>

              <div style="width: 100%"><canvas id="acquisitions"></canvas></div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="row q-mb-md">
          <div class="col-12">
            <div class="title">Latest Scan</div>
            <div class="subtitle" style="color: #5c7288">Vulnerability Count</div>
            <div class="subtitle" style="color: #5c7288">
              <span style="font-weight: 500"> Date :</span>
              {{ dashboardData.last_scan?.scan_date.slice(0, 10) || '' }}
            </div>
          </div>

          <div class="full-width">
            <template v-if="lastScanEmpty">
              <div class="subtitle" style="color: #5c7288">
                No scan data to display. Please run a scan to see details.
              </div>
            </template>
            <template v-else>
              <apexchart
                :options="SCAN_INSIGHT_VULNERABILITY_OPTIONS"
                :series="donutSeverityCountsSeries"
              ></apexchart>
            </template>
          </div>
        </div>
        <div class="row flex items-center q-mb-md protection">
          <div class="col-6 flex items-center justify-center text-weight-bold protection-score">
            {{ dashboardData?.last_scan?.total_vulnerabilities }}
          </div>
          <div class="col-6">
            <p class="q-ma-none protection-host">
              {{ dashboardData?.last_scan?.host_alias }}
            </p>
            <p class="q-ma-none protection-variation">
              {{ dashboardData?.last_scan?.total_vulnerabilities_variation }}
              <i :class="variationIcon"></i>
              Variation
            </p>
          </div>
        </div>

        <div class="title">Hosts with the most vulnerabilities</div>

        <q-list>
          <q-item>
            <q-item-section avatar></q-item-section>
            <q-item-section class="text-weight-bold label-table">TOP 5</q-item-section>
            <q-item-section class="text-weight-bold label-table">
              # OF VULNERABILITIES</q-item-section
            >
          </q-item>
          <template v-for="i in hostVulnerabilites" :key="i">
            <q-item v-ripple clickable>
              <q-item-section avatar>
                <i class="fa-solid fa-square q-mx-sm" :style="`color:${i.color};font-size:2em`"></i>
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
  import type { Ref, ComputedRef } from 'vue';
  import { computed, ref, onMounted, watchEffect } from 'vue';
  import { DashboardService, MainDashboard } from 'src/services/dashboard';
  import {
    SCAN_INSIGHT_VULNERABILITY_OPTIONS,
    HEATMAP_CHART_OPTIONS,
    OVERALL_DONUT_OPTIONS
  } from 'src/constants/apexcharts.constants';
  import { getVariationIcon } from 'src/utils';
  import type {
    HostVulnerability,
    iMainDashboard,
    iSerieDashboard
  } from 'src/models/dashboard.models';
  import Chart from 'chart.js/auto';

  const dashboardData: Ref<iMainDashboard> = ref({} as iMainDashboard);
  const hostVulnerabilites: Ref<HostVulnerability[]> = ref([]);
  const donutSeverityCountsSeries: Ref<number[]> = ref([]);
  const actualRotation: Ref<number> = ref(0);
  const heatMapSeries: Ref<iSerieDashboard[]> = ref([]);
  const heatMapOptions = ref({ ...HEATMAP_CHART_OPTIONS });

  const variationIcon: ComputedRef<string> = computed(() =>
    getVariationIcon(dashboardData.value?.overall_security_posture?.variation || 0)
  );

  const lastScanEmpty = computed(() => donutSeverityCountsSeries.value.every(val => val === 0));

  const timePeriodSelect = ref('Month');
  const timePeriodOptions = ['Month', 'Quarter', 'Semester'];
  const severitySelect = ref(['Low', 'Medium', 'High', 'Critical']);
  const severityOptions = ['Low', 'Medium', 'High', 'Critical'];

  function setDashboardData(data: iMainDashboard): void {
    const dashboard = new MainDashboard(data);

    dashboardData.value = data;
    heatMapSeries.value = dashboard.heatmapSeries;
    heatMapOptions.value = {
      ...heatMapOptions.value,
      xaxis: { categories: dashboard.heatmapCategories, type: 'category' }
    };
    hostVulnerabilites.value = dashboard.listHostsWithGreatestVulnerabilities;
    donutSeverityCountsSeries.value = dashboard.donutSeverityCountsSeries;

    const trendData: { year: string; count: number | null | undefined }[] =
      dashboard.trendVulnerabilityCategories.map((category, index) => ({
        year: category,
        count: dashboard.trendVulnerabilitySeries[index]
      })) as unknown as { year: string; count: number | null | undefined }[];

    const existingChart = Chart.getChart('acquisitions');
    if (existingChart) {
      existingChart.destroy();
    }
    const item = document.getElementById('acquisitions');

    if (item) {
      const aux = item as HTMLCanvasElement;
      new Chart(aux, {
        type: 'line',
        data: {
          labels: trendData.map(row => row.year.slice(0, 3)),
          datasets: [
            {
              label: 'Vulnerabilities',
              data: trendData.map(row => row.count),
              fill: true,
              backgroundColor: 'rgba(229, 73, 77, 0.7)'
            }
          ]
        },
        options: {
          spanGaps: true,
          plugins: {
            title: {
              display: true,
              text: 'Vulnerability Trends',
              align: 'start',
              font: {
                size: 20
              },
              padding: 30,
              color: '#313541'
            },
            legend: {
              align: 'end',
              position: 'bottom'
            },
            filler: {
              propagate: false
            }
          },
          elements: {
            line: {
              tension: 0.4
            }
          }
        }
      });
    }
  }

  async function setTimePeriod(time: string): Promise<void> {
    timePeriodSelect.value = time;
    await fetchDashboardData();
  }

  async function fetchDashboardData(): Promise<void> {
    await DashboardService.getDashboard(
      timePeriodSelect.value,
      severitySelect.value.join(',')
    ).then(res => setDashboardData(res.data));
  }

  watchEffect(() => {
    actualRotation.value = dashboardData.value?.overall_security_posture?.score * 180;
  });

  onMounted(async () => {
    await fetchDashboardData();
  });
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
    bottom: 150px;
    left: 130px;
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

  .label-table {
    color: var(--text, #313541);
    font-size: 0.8em;
  }

  .time-selected {
    .block {
      color: rgb(237, 39, 61);
      border-bottom: 2px solid rgb(237, 39, 61);
    }
  }

  .button-time {
    position: absolute;
    right: 0;
    top: 25px;
  }
</style>
