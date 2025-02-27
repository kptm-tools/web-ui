<template>
  <q-dialog ref="dialogRef" class="dialog-scan-insight" @hide="onDialogHide">
    <q-card class="q-dialog-plugin full-width">
      <q-card-section class="q-mb-md row q-col-gutter-sm">
        <div class="title q-mb-md col-6">Domain : {{ insight.domain }}</div>
        <div class="col-3">
          <q-select
            v-model="severityPicked"
            outlined
            multiple
            dense
            :options="severityOptions"
            label="Severity"
            @update:model-value="handlerSelect"
          />
        </div>
        <div class="col-3">
          <q-select
            v-model="timePicked"
            outlined
            dense
            :options="timeOptions"
            label="Time Range"
            @update:model-value="handlerSelect"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-lg">
          <div class="col-6">
            <div class="row q-mb-md">
              <div class="title">General Summary of Vulnerabilities</div>

              <div class="full-width">
                <apexchart
                  :options="SCAN_INSIGHT_VULNERABILITY_OPTIONS"
                  :series="generalSummaryValues"
                ></apexchart>
              </div>
            </div>
          </div>
          <div v-if="showGraph" class="col-6">
            <div class="title">Vulnerabilities by Category</div>
            <apexchart
              :options="vulnerabiltyOptions"
              :series="vulnerabilitiesValues"
              :height="300"
            ></apexchart>
          </div>
        </div>

        <div class="row">
          <apexchart
            type="line"
            height="300"
            :options="vulnerabilityTrendOptions"
            :series="vulnerabilitiesTrendValues"
            width="650"
          ></apexchart>
        </div>
      </q-card-section> </q-card
  ></q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from 'quasar';
  import { computed, onMounted, PropType, ref } from 'vue';
  import { SCAN_INSIGHT_VULNERABILITY_OPTIONS } from 'src/constants/apexcharts.constants';
  import {
    ReportSummary,
    ReportSummarySeverity,
    ReportSummaryTimeRange
  } from 'src/models';
  import { ReportService } from 'src/services';

  const props = defineProps({
    insight: {
      type: Object as PropType<ReportSummary>,
      required: true
    }
  });

  defineEmits([...useDialogPluginComponent.emits]);

  const insightInformation = ref(props.insight);
  const showGraph = ref(true);

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const generalSummaryValues = computed(() =>
    Object.values(insightInformation.value.general_summary.severity_counts)
  );
  const severityOptions = [
    ReportSummarySeverity.CRITICAL,
    ReportSummarySeverity.HIGH,
    ReportSummarySeverity.LOW,
    ReportSummarySeverity.MEDIUM
  ];
  const timeOptions = [
    ReportSummaryTimeRange.MONTH,
    ReportSummaryTimeRange.QUARTER,
    ReportSummaryTimeRange.SEMESTER
  ];

  const severityPicked = ref([]);
  const timePicked = ref('' as ReportSummaryTimeRange);

  const vulnerabiltyOptions = computed(() => {
    const categories =
      insightInformation.value.vulnerabilities_by_category.category_data.map(
        category => category.category
      );
    return {
      chart: {
        height: 200,
        type: 'radar'
      },
      yaxis: {
        stepSize: 5
      },
      xaxis: {
        categories: categories
      }
    };
  });

  const vulnerabilityTrendOptions = computed(() => {
    return {
      chart: {
        height: 350,
        type: 'line'
      },
      stroke: {
        curve: 'smooth'
      },
      fill: {
        type: 'solid',
        opacity: [0.35, 1]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0]
      },
      labels: insightInformation.value.vulnerability_trends.time_periods.map(
        period => period.time_period
      ),
      markers: {
        size: 0
      },
      yaxis: [
        {
          title: {
            text: 'Vulnerabilites'
          }
        }
      ]
    };
  });

  const vulnerabilitiesValues = computed(() => [
    {
      name: 'Serie',
      data: insightInformation.value.vulnerabilities_by_category.category_data.map(
        category => category.count
      )
    }
  ]);

  const vulnerabilitiesTrendValues = computed(() => [
    {
      name: 'Count',
      type: 'line',
      data: insightInformation.value.vulnerability_trends.time_periods.map(
        period => period.vulnerability_count.toFixed(2)
      )
    },
    {
      name: 'Average',
      type: 'line',
      data: insightInformation.value.vulnerability_trends.time_periods.map(() =>
        insightInformation.value.vulnerability_trends.average_vulnerability_count.toFixed(
          0
        )
      )
    }
  ]);

  function handlerSelect(): void {
    showGraph.value = false;
    ReportService.getReportsVulnerabilitiesSummary(
      insightInformation.value.scan_id,
      severityPicked.value.join(','),
      timePicked.value
    ).then(response => {
      showGraph.value = true;
      insightInformation.value = response.data;
    });
  }

  onMounted(() => {});
</script>

<style lang="scss">
  .dialog-scan-insight {
    color: #313541;

    .q-dialog-plugin {
      max-width: 750px;
      width: 100%;
      overflow: hidden;
      height: 750px;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }

    .scan-date {
      color: var(--text, #313541);
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: -0.2px;
      text-transform: uppercase;
    }

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
  }
</style>
