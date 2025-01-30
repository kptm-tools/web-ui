<template>
  <q-dialog ref="dialogRef" class="dialog-scan-insight" @hide="onDialogHide">
    <q-card class="q-dialog-plugin full-width">
      <q-card-section class="q-mb-md">
        <div class="title q-mb-md">
          Domain : {{ insight.metadata?.host_alias }}
        </div>
        <div class="scan-date">SCAN DATE {{ dateFormated }}</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-lg">
          <div class="col-6">
            <div class="row q-mb-md">
              <div class="title">Vulnerability Count</div>

              <div class="full-width">
                <apexchart :options="options" :series="series"></apexchart>
              </div>
            </div>
            <div class="row flex items-center q-mb-md protection">
              <div
                class="col-6 flex items-center justify-center text-weight-bold protection-score"
              >
                {{ (insight.protection_score * 100).toFixed(0) }}
              </div>
              <div class="col-6">
                <p class="q-ma-none protection-host">
                  {{ insight.metadata.host_alias }}
                </p>
                <p class="q-ma-none protection-variation">
                  {{ insight.vulnerability_variation }}
                  <i :class="variationIcon"></i>
                  Variation
                </p>
              </div>
            </div>
            <div class="row">
              <div class="title">Protection Score</div>
              <div class="relative-position">
                <apexchart
                  :options="protectionScoreOptions"
                  :series="protecion"
                ></apexchart>
                <img
                  src="../../assets/needle.svg"
                  width="40"
                  alt="needle"
                  class="needle"
                  :style="{ transform: `rotate(${actualRotation}deg)` }"
                />

                <div class="porcentaje">
                  {{ (insight.protection_score * 100).toFixed(0) }}%
                </div>

                <div class="protection-score-variation">
                  <span class="q-ma-none text">
                    5%
                    <i class="fa-solid fa-caret-up q-mx-sm text-red"></i>
                    Variation
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="title">List of vulnerabilities</div>
            <table-vulnerabilities
              :vulnerabilities="insight.severity_per_type"
            />
          </div>
        </div>
      </q-card-section> </q-card
  ></q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from 'quasar';
  import { ScanInsight } from 'src/models/scans.model';
  import { computed, onMounted, PropType, watchEffect } from 'vue';
  import TableVulnerabilities from 'src/components/insight/TableVulnerabilities.vue';
  import { ref } from 'vue';

  defineEmits([...useDialogPluginComponent.emits]);

  const props = defineProps({
    insight: {
      type: Object as PropType<ScanInsight>,
      required: true
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  let series: number[] = [];
  const protecion = [1, 1, 1];

  const options = {
    chart: {
      type: 'donut'
    },
    dataLabels: {
      enabled: true,
      formatter: function (
        value: number,
        {
          seriesIndex,
          w
        }: { seriesIndex: number; w: { config: { series: [] } } }
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
          offset: 20
        }
      }
    },
    labels: ['Critical', 'High', 'Medium', 'Low'],
    colors: ['#ED273D', '#F3A488', '#F6BE63', '#97B951']
  };

  const protectionScoreOptions = {
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
  const actualRotation = ref(0);
  const variation = computed(() => props.insight.vulnerability_variation);
  const dateFormated = computed(() => {
    const date = new Date(props.insight.metadata.scan_date);
    return date.toLocaleDateString();
  });

  const variationIcon = computed(() => {
    let iconClass = 'fa-solid q-mx-sm ';

    if (variation.value === 0) {
      iconClass += 'text-grey fa-caret-up';
    } else if (variation.value > 0) {
      iconClass += 'text-green fa-caret-up';
    } else {
      iconClass += 'text-red fa-caret-down';
    }

    return iconClass;
  });

  watchEffect(() => {
    setTimeout(() => {
      actualRotation.value = props.insight.protection_score * 180;
    }, 300);
  });

  onMounted(() => {
    series = [
      props.insight.severity_counts?.critical || 0,
      props.insight.severity_counts?.high || 0,
      props.insight.severity_counts?.medium || 0,
      props.insight.severity_counts?.low || 0
    ];
  });
</script>

<style lang="scss">
  .dialog-scan-insight {
    color: #313541;

    .q-dialog-plugin {
      max-width: 750px;
      width: 100%;
      overflow: hidden;
      height: 700px;
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
      line-height: 33.356px; /* 208.475% */
      position: absolute;
      bottom: 160px;
      margin-left: auto;
      margin-right: auto;
      left: -40px;
      right: 0;
    }
  }
</style>
