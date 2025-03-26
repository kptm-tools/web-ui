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
              :options="heatMapOptions"
              :series="heatMapSeries"
            ></apexchart>
          </div>

          <div class="col-12">
            <div style="max-width: 700px">
              <apexchart
                type="area"
                :options="vulnerabilityTrendsOptions"
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
              :series="donutSeverityCountsSeries"
            ></apexchart>
          </div>
        </div>
        <div class="row flex items-center q-mb-md protection">
          <div
            class="col-6 flex items-center justify-center text-weight-bold protection-score"
          >
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
            <q-item-section class="text-weight-bold label-table"
              >TOP 5</q-item-section
            >
            <q-item-section class="text-weight-bold label-table">
              # OF VULNERABILITIES</q-item-section
            >
          </q-item>
          <template v-for="i in hostVulnerabilites" :key="i">
            <q-item v-ripple clickable>
              <q-item-section avatar>
                <i
                  class="fa-solid fa-square q-mx-sm"
                  :style="`color:${i.color};font-size:2em`"
                ></i>
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
  import { computed, ref, onMounted, Ref, ComputedRef } from 'vue';
  import { DashboardService, MainDashboard } from 'src/services/dashboard';
  import {
    SCAN_INSIGHT_VULNERABILITY_OPTIONS,
    HEATMAP_CHART_OPTIONS,
    OVERALL_DONUT_OPTIONS
  } from 'src/constants/apexcharts.constants';
  import { getVariationIcon } from 'src/utils';
  import {
    HostVulnerability,
    iMainDashboard,
    iSerieDashboard
  } from 'src/models/dashboard.models';

  const dashboardData: Ref<iMainDashboard> = ref({} as iMainDashboard);
  const hostVulnerabilites: Ref<HostVulnerability[]> = ref([]);
  const trendSeries: Ref<iSerieDashboard[]> = ref([]);
  const donutSeverityCountsSeries: Ref<number[]> = ref([]);
  const actualRotation: Ref<number> = ref(0);
  const heatMapSeries: Ref<iSerieDashboard[]> = ref([]);
  const heatMapOptions = ref({ ...HEATMAP_CHART_OPTIONS });
  const vulnerabilityTrendsOptions = ref({
    xaxis: {
      categories: [] as string[]
    },
    title: {
      text: 'Vulnerability Trends'
    }
  });

  const variationIcon: ComputedRef<string> = computed(() =>
    getVariationIcon(
      dashboardData.value?.overall_security_posture?.variation || 0
    )
  );

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
    vulnerabilityTrendsOptions.value = {
      ...vulnerabilityTrendsOptions.value,
      xaxis: {
        categories: dashboard.trendVulnerabilityCategories
      }
    };
    trendSeries.value = [
      {
        name: 'serie',
        data: dashboard.trendVulnerabilitySeries
      }
    ];
  }

  onMounted(() => {
    DashboardService.getDashboard().then(res => setDashboardData(res.data));
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

  .label-table {
    color: var(--text, #313541);
    font-size: 0.8em;
  }
</style>
