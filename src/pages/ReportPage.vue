<template>
  <header-report-page v-if="isMounted" :show-title="isFirstStep" @go-back="reportPageStep--" />

  <template v-if="isFirstStep">
    <table-view
      :reportRows="reportsRow"
      @open-score-card="openScoredCardTrends"
      @table-action="handleTableAction"
    />
  </template>
  <template v-else>
    <q-stepper v-model="reportPageStep" color="primary" animated>
      <q-step :name="0" :title="$t('report.steps.list.title')"> </q-step>
      <q-step :name="1" :title="$t('report.steps.dynamicVector.title')">
        <div class="row q-col-gutter-md flex items-stretch q-pa-md">
          <template v-for="type in detailInitialResponse.vulnerability_types" :key="type">
            <div class="col-2 flex">
              <q-card style="flex: 1">
                <q-card-section style="font-size: 12px; display: flex; height: 100%">
                  <div class="row" style="flex: 1">
                    <div class="col-10 flex column">
                      <div style="flex: 1" class="text-weight-semibold">{{ type.name }}</div>
                      <div>
                        CVSS:
                        <span
                          :class="`card-${cardColor(type.highest_cvss)}`"
                          style="padding: 0 20px; margin-left: 5px"
                        >
                          {{ type.highest_cvss }}
                        </span>
                      </div>
                    </div>
                    <div class="col-2 text-center text-weight-bold">
                      {{ type.count }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </div>
        <div class="row q-col-gutter-md q-pa-md">
          <div class="col-6" style="max-height: 550px">
            <Radar :data="dataRadar" :options="options" :key="radarKey" />
          </div>
          <div class="col-6">
            <div class="row">
              <p class="text-weight-bold">CVSS Global Score</p>
            </div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-6">
                <q-card>
                  <q-card-section class="text-center text-weight-bold"> Actual </q-card-section>
                  <q-card-section
                    class="text-center"
                    :class="`card-${cardColor(detailInitialResponse.global_cvss_score)}`"
                  >
                    CVSS : {{ detailInitialResponse.global_cvss_score }}
                  </q-card-section>
                  <q-card-section class="text-center">
                    Total Vulnerabilities :
                    {{ detailInitialResponse.global_total_vulnerabilities }}
                  </q-card-section>
                </q-card>
              </div>
              <div
                class="col-6"
                v-if="
                  totalUpdated.expected_global_cvss_score !== 0 &&
                  totalUpdated.expected_global_total_vulnerabilities !== 0
                "
              >
                <q-card>
                  <q-card-section class="text-center text-weight-bold">
                    Anticipated
                  </q-card-section>
                  <q-card-section
                    class="text-center"
                    :class="`card-${cardColor(totalUpdated.expected_global_cvss_score)}`"
                  >
                    CVSS : {{ totalUpdated.expected_global_cvss_score }}
                  </q-card-section>
                  <q-card-section class="text-center">
                    Total Vulnerabilities :
                    {{ totalUpdated.expected_global_total_vulnerabilities }}
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <q-card v-if="showData">
              <q-card-actions align="right">
                <q-btn icon="close" flat dense @click="closeDetail()"></q-btn>
              </q-card-actions>
              <div style="height: 200px; overflow-y: auto; overflow-x: hidden; padding: 1em">
                <div class="text-weight-bold">
                  {{ vectorData.name }}
                </div>
                <div>
                  <q-slider v-model="currentCvss" marker-labels :min="0" :max="10" disable />
                </div>
                <div>
                  <span class="text-weight-bold">Type : </span
                  ><span class="overflow-content">{{ vectorData.type }}</span>
                </div>
                <div>
                  <span class="text-weight-bold">Severity : </span
                  ><span class="overflow-content">{{ vectorData.severity }}</span>
                </div>
                <div>
                  <span class="text-weight-bold">Description : </span>
                  <span class="overflow-content">{{ vectorData.description }}</span>
                </div>
                <div>
                  <span class="text-weight-bold">Privileges Required : </span
                  ><span class="overflow-content">{{ vectorData.privileges_required }}</span>
                </div>
                <div>
                  <span class="text-weight-bold">Attack Vector Classification : </span
                  ><span class="overflow-content">{{ vectorData.classification }}</span>
                </div>
                <div>
                  <span class="text-weight-bold">Integrity Impact : </span
                  ><span class="overflow-content">{{ vectorData.integrity }}</span>
                </div>
                <div>
                  <span class="text-weight-bold">Availability Impact : </span
                  ><span class="overflow-content">{{ vectorData.availability }}</span>
                </div>
              </div>

              <q-card-actions align="right">
                <q-btn label="Apply" color="primary" @click="updateVector()"></q-btn>
              </q-card-actions>
            </q-card>

            <div class="row" v-if="!showData">
              <q-btn label="Next" color="primary" @click="confirmVector()"></q-btn>
            </div>
          </div>
        </div>
      </q-step>
      <q-step :name="2" :title="$t('report.steps.expectedResults.title')">
        <div class="row q-col-gutter-sm justify-around" style="max-height: 400px">
          <div class="col-4">
            <div style="height: 300px">
              <div class="row justify-center items-center">
                <p class="text-h5 text-weight-bold">Vulnerability Chart</p>
                <div class="col-6">
                  <div class="row q-my-md justify-center">
                    <q-btn class="col-auto q-px-md q-mr-md" @click="showActual = true" dense
                      >Actual</q-btn
                    >
                    <q-btn class="col-auto q-px-md" @click="showActual = false" dense
                      >Expected</q-btn
                    >
                  </div>
                </div>
              </div>
              <template v-if="showActual">
                <Line
                  :data="chartSerieDataActual"
                  :options="{
                    responsive: true,
                    maintainAspectRatio: false
                  }"
                />
              </template>
              <template v-if="!showActual">
                <Line
                  :data="chartSerieDataExpected"
                  :options="{
                    responsive: true,
                    maintainAspectRatio: false
                  }"
                />
              </template>
            </div>
          </div>
          <div class="col-4">
            <div style="position: relative">
              <p class="text-h5 text-weight-bold">Expected Security Posture</p>
              <apexchart
                :options="SCAN_INSIGHT_PROTECTION_SCORE_OPTIONS"
                :series="vulnerabilitySeries"
              ></apexchart>
              <img
                src="../assets/needle.svg"
                width="80"
                alt="needle"
                class="needle"
                :style="{ transform: `rotate(${actualRotation}deg)` }"
              />
              <div class="porcentaje">{{ ((actualRotation * 100) / 180).toFixed(0) }}%</div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-pa-md" style="overflow-y: auto; max-height: 350px">
          <div class="row">
            <p class="text-h5 text-weight-bold q-mb-none" style="width: 100%">
              Vulnerability Types
            </p>
          </div>
          <div class="row q-col-gutter-md justify-center" style="width: 100%">
            <template v-for="type in vulnerabilityType" :key="type">
              <div class="col-auto">
                <q-btn
                  :label="type"
                  dense
                  @click="handlePickType(type)"
                  :class="{ 'bg-primary text-white': pickedType.some(val => val == type) }"
                ></q-btn>
              </div>
            </template>
          </div>
          <div class="row">
            <template v-for="vulnerability in vulnerabilityList" :key="vulnerability">
              <div class="col-12">
                <VulnerabilityCard :vul="vulnerability" />
              </div>
            </template>
          </div>
        </div>
      </q-step>
    </q-stepper>
  </template>
</template>

<script setup lang="js">
  import { ReportService } from 'src/services';
  import { computed, onMounted, ref } from 'vue';
  import { ReportSummaryTimeRange } from 'src/models';
  import { DialogReportInsight } from 'src/components';
  import { useQuasar } from 'quasar';
  import { ROUTES_NAMES } from 'src/router/routes-names';
  import { useRouter } from 'vue-router';
  import ScoredcardTrendsDialog from 'src/components/report/ScoredcardTrendsDialog.vue';
  import WebSocketReports from 'src/services/wss-reports.service';
  import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    Title
  } from 'chart.js';
  import dragData from 'chartjs-plugin-dragdata';
  import { AUTH_TOKEN_NAMES } from 'src/constants/fusion-auth.constants';
  import { WebSocketMessageRequest, WebSocketMessageType } from 'src/models/wss-reports.models';
  import { Radar, Line } from 'vue-chartjs';
  import { errorQuasarNotify } from 'src/utils';
  import { SCAN_INSIGHT_PROTECTION_SCORE_OPTIONS } from 'src/constants/apexcharts.constants';
  import HeaderReportPage from 'src/components/header/HeaderReportPage.vue';
  import VulnerabilityCard from 'src/components/report/VulnerabilityCard.vue';
  import TableView from 'src/components/report/TableView.vue';

  const reports = ref([]);
  const router = useRouter();
  const reportsRow = ref([]);
  const isMounted = ref(false);
  const $q = useQuasar();
  const wssConnection = ref(null);
  const reportPageStep = ref(0);
  const detailInitialResponse = ref({});
  const vectorData = ref({});
  const showData = ref(false);
  const filteredResponse = ref([]);
  const currentCvss = ref(0);
  // const sliderValue = ref();
  const applyClicked = ref(true);
  const lastValue = ref([0, 0]);
  const radarKey = ref(0);
  const reportDataResponse = ref();
  const chartSerieDataActual = ref();
  const chartSerieDataExpected = ref();
  const showActual = ref(false);
  const vulnerabilitySeries = ref([30, 30, 30]);
  const actualRotation = ref(0);
  const vulnerabilityType = ref([]);
  const pickedType = ref([]);

  const isFirstStep = computed(() => reportPageStep.value === 0);

  const vulnerabilityList = computed(() => {
    let list = [];
    if (pickedType.value.length == 0) {
      list = reportDataResponse.value.solved_vulnerabilities;
    } else {
      list = reportDataResponse.value.solved_vulnerabilities.filter(({ type }) =>
        pickedType.value.includes(type)
      );
    }
    return list;
  });

  const auxValue = ref({});
  const totalUpdated = ref({
    expected_global_cvss_score: 0,
    expected_global_total_vulnerabilities: 0
  });

  function openScoredCardTrends() {
    $q.dialog({
      component: ScoredcardTrendsDialog
    });
  }

  async function handleTableAction(action) {
    if (action.action === 'insight') {
      ReportService.getReportsVulnerabilitiesSummary(
        action.col.scan_id,
        '',
        ReportSummaryTimeRange.MONTH
      )
        .then(response => {
          $q.dialog({
            component: DialogReportInsight,
            componentProps: {
              insight: response.data
            },
            fullHeight: true,
            fullWidth: true
          });
        })
        .catch(err => new Error(err));
    } else if (action.action === 'search') {
      await router.push({
        name: ROUTES_NAMES.reportsDetail,
        params: { id: action.col.scan_id }
      });
    } else if (action.action === 'detail') {
      wssConnection.value?.send({
        type: WebSocketMessageRequest.INITIAL_DATA_REQUEST,
        payload: {
          scan_id: action.col.scan_id
        }
      });
      reportPageStep.value = 1;
    }
  }

  const dataRadar = ref({
    labels: [],
    datasets: []
  });

  const options = {
    label: false,
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      dragData: {
        round: 1,
        showTooltip: false,
        onDragStart: function (e, element, index, val) {
          onDragStartEventHandler(index, val);
        },
        onDrag: function (e, datasetIndex, index, value) {
          if (!filteredResponse.value[index].available_cvss_values.includes(value)) {
            return false;
          }
        },
        onDragEnd: function (e, datasetIndex, index, value) {
          currentCvss.value = value;
        }
      }
    }
  };

  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    dragData,
    Legend,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  onMounted(async () => {
    const otp = sessionStorage.getItem(AUTH_TOKEN_NAMES.OTP);
    const tenantId = sessionStorage.getItem(AUTH_TOKEN_NAMES.TENANT_ID);
    isMounted.value = true;

    await fillReportData();

    wssConnection.value = new WebSocketReports(
      `${process.env.BE_SERVER_WSS}/ws/report/?tenantId=${tenantId}&otp=${otp}`
    );

    wssConnection.value.connect();

    wssConnection.value.onMessage(data => {
      onMessageHandler(data);
    });
  });

  function updateVector() {
    wssConnection.value?.send({
      type: WebSocketMessageRequest.VECTOR_UPDATE_REQUEST,
      payload: {
        new_value: currentCvss.value,
        vulnerability_type_name: vectorData.value.type || ''
      }
    });
  }

  function confirmVector() {
    wssConnection.value?.send({
      type: WebSocketMessageRequest.VECTOR_APPLY_REQUEST,
      payload: {}
    });
  }

  const cardColor = cvss => {
    let color = '';
    if (cvss >= 0 && cvss < 3.9) color = 'green';
    else if (cvss > 3.9 && cvss < 6.9) color = 'yellow';
    else if (cvss > 6.9 && cvss < 9) color = 'orange';
    else if (cvss >= 9) color = 'red';
    return color;
  };

  function closeDetail() {
    showData.value = false;
    if (!applyClicked.value) {
      restartLastValue();
    }
  }

  function restartLastValue() {
    const index = lastValue.value[1];
    const originalValue = dataRadar.value.datasets[0].data[index];
    const aux = { ...dataRadar.value };
    aux.datasets[1].data[index] = originalValue;
    dataRadar.value = { ...aux };
    radarKey.value++;
  }

  async function fillReportData() {
    await ReportService.getReports().then(response => {
      reports.value = response.data;
      reportsRow.value = response.data.map(data => ({
        ...data
      }));
    });
  }

  function handlePickType(type) {
    const indexType = pickedType.value.findIndex(val => val == type);
    if (indexType == -1) {
      pickedType.value.push(type);
    } else {
      pickedType.value.splice(indexType, 1);
    }
  }

  function onMessageHandler(event) {
    switch (event.type) {
      case WebSocketMessageType.INITIAL_DATA_RESPONSE:
        setInitialDataWss(event);
        break;
      case WebSocketMessageType.VECTOR_DETAILS_RESPONSE:
        vectorData.value = event.payload.vulnerability_details;
        break;
      case WebSocketMessageType.VECTOR_UPDATE_RESPONSE:
        applyClicked.value = true;
        totalUpdated.value = event.payload;
        break;
      case WebSocketMessageType.ERROR:
        errorQuasarNotify(event.payload.message || 'Error');
        showData.value = false;
        break;
      case WebSocketMessageType.REPORT_DATA_RESPONSE:
        reportDataResponse.value = event.payload;
        reportDataResponse.value.solved_vulnerabilities =
          reportDataResponse.value.solved_vulnerabilities.sort((a, b) => b.max_cvss - a.max_cvss);
        vulnerabilityType.value = reportDataResponse.value.vulnerability_graph.series[1].data.map(
          val => val.x
        );
        actualRotation.value =
          Number(reportDataResponse.value.expected_security_posture).toFixed(2) * 180;

        chartSerieDataActual.value = {
          labels: event.payload.vulnerability_graph.series[0].data.map(({ x }) => x),
          datasets: [
            {
              label: 'Actual',
              backgroundColor: '#0047AB',
              data: event.payload.vulnerability_graph.series[0].data.map(({ y }) => y)
            },
            {
              label: 'Average',
              backgroundColor: '#FF5733',
              data: event.payload.vulnerability_graph.series[0].data.map(
                () => event.payload.vulnerability_graph.series[0].average
              )
            }
          ]
        };

        chartSerieDataExpected.value = {
          labels: event.payload.vulnerability_graph.series[1].data.map(({ x }) => x),
          datasets: [
            {
              label: 'Expected',
              backgroundColor: '#50C878',
              data: event.payload.vulnerability_graph.series[1].data.map(({ y }) => y)
            },
            {
              label: 'Average',
              backgroundColor: '#FF5733',
              data: event.payload.vulnerability_graph.series[1].data.map(
                () => event.payload.vulnerability_graph.series[1].average
              )
            }
          ]
        };

        reportPageStep.value = 2;
        break;
    }
  }

  function setInitialDataWss(event) {
    detailInitialResponse.value = event.payload;
    auxValue.value = event;
    const vulTypes = detailInitialResponse.value.vulnerability_types;
    filteredResponse.value = vulTypes.filter(({ highest_cvss }) => highest_cvss > 0);
    dataRadar.value = {
      labels: filteredResponse.value.map(({ name }) => name),
      datasets: [
        {
          label: 'Original',
          backgroundColor: 'rgba(179,181,198,0.2)',
          borderColor: 'rgba(179,181,198,1)',
          pointBackgroundColor: 'rgba(179,181,198,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(179,181,198,1)',
          data: filteredResponse.value.map(({ highest_cvss }) => highest_cvss),
          dragData: false,
          pointRadius: 0
        },
        {
          label: 'Updated',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          pointBackgroundColor: 'rgba(255,99,132,1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(255,99,132,1)',
          data: filteredResponse.value.map(({ highest_cvss }) => highest_cvss),
          dragData: true,
          pointRadius: 8
        }
      ]
    };
  }

  function onDragStartEventHandler(index, val) {
    if (!applyClicked.value && lastValue.value[1] !== index) {
      restartLastValue();
    }
    applyClicked.value = false;
    lastValue.value = [val, index];
    showData.value = true;
    wssConnection.value?.send({
      type: WebSocketMessageRequest.VECTOR_SELECT_REQUEST,
      payload: {
        vulnerability_type_name: filteredResponse.value[index]?.name || ''
      }
    });
  }
</script>

<style lang="scss">
  .card {
    &-yellow {
      background-color: #fbbf65;
      color: white;
    }

    &-red {
      background-color: #e5494d;
      color: white;
    }

    &-green {
      background-color: #97b951;
      color: white;
    }

    &-orange {
      background-color: #f3a488;
      color: white;
    }
  }

  .overflow-content {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-wrap: break-word;
    word-wrap: break-word;
    white-space: normal;
  }

  .needle {
    position: absolute;
    bottom: 220px;
    left: 180px;
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
    bottom: 270px;
    margin-left: auto;
    margin-right: auto;
    left: -40px;
    right: 0;
  }
</style>
