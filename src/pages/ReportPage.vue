<template>
  <Teleport v-if="isMounted" to="#header">
    <div>Reports</div>
  </Teleport>

  <template v-if="showDetail">
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
                Total Vulnerabilities : {{ detailInitialResponse.global_total_vulnerabilities }}
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
              <q-card-section class="text-center text-weight-bold"> Anticipated </q-card-section>
              <q-card-section
                class="text-center"
                :class="`card-${cardColor(totalUpdated.expected_global_cvss_score)}`"
              >
                CVSS : {{ totalUpdated.expected_global_cvss_score }}
              </q-card-section>
              <q-card-section class="text-center">
                Total Vulnerabilities : {{ totalUpdated.expected_global_total_vulnerabilities }}
              </q-card-section>
            </q-card>
          </div>
        </div>

        <q-card v-if="showData">
          <q-card-actions align="right">
            <q-btn icon="close" flat dense @click="closeDetail()"></q-btn>
          </q-card-actions>
          <q-card-section>
            <div>
              {{ vectorData.name }}
            </div>
            <div><q-slider v-model="currentCvss" marker-labels :min="0" :max="10" disable /></div>
            <div>
              <span>Type : </span><span>{{ vectorData.type }}</span>
            </div>
            <div>
              <span>Severity : </span><span>{{ vectorData.severity }}</span>
            </div>
            <div>
              <span>Description : </span><span>{{ vectorData.description }}</span>
            </div>
            <div>
              <span>Privileges Required : </span><span>{{ vectorData.privileges_required }}</span>
            </div>
            <div>
              <span>Attack Vector Classification : </span
              ><span>{{ vectorData.classification }}</span>
            </div>
            <div>
              <span>Integrity Impact : </span><span>{{ vectorData.integrity }}</span>
            </div>
            <div>
              <span>Availability Impact : </span><span>{{ vectorData.availability }}</span>
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn label="Apply" color="primary" @click="updateVector()"></q-btn>
          </q-card-actions>
        </q-card>

        <div class="row">
          <q-btn label="Next" color="primary" @click="confirmVector()"></q-btn>
        </div>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="q-pa-md">
      <q-btn
        label="Scoredcard Trends"
        color="primary"
        class="q-mb-md"
        @click="openScoredcardTrends"
      ></q-btn>

      <table-reports :rows="reportsRow" @action="handleTableAction" />
    </div>
  </template>
</template>

<script setup lang="js">
  import { ReportService } from 'src/services';
  import { onMounted, ref } from 'vue';
  import { ReportSummaryTimeRange } from 'src/models';
  import { TableReports, DialogReportInsight } from 'src/components';
  import { useQuasar } from 'quasar';
  import { ROUTES_NAMES } from 'src/router/routes-names';
  import { useRouter } from 'vue-router';
  import ScoredcardTrendsDialog from 'src/components/report/ScoredcardTrendsDialog.vue';
  import WebSocketReports from 'src/services/wss-reports.service';
  // import { SCAN_INSIGHT_VULNERABILITY_OPTIONS } from 'src/constants/apexcharts.constants';
  import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  } from 'chart.js';
  import dragData from 'chartjs-plugin-dragdata';
  import { AUTH_TOKEN_NAMES } from 'src/constants/fusion-auth.constants';
  import { WebSocketMessageRequest, WebSocketMessageType } from 'src/models/wss-reports.models';
  import { Radar } from 'vue-chartjs';
  import { errorQuasarNotify } from 'src/utils';

  const reports = ref([]);
  const router = useRouter();
  const reportsRow = ref([]);
  const isMounted = ref(false);
  const $q = useQuasar();
  const wssConnection = ref(null);
  const showDetail = ref(false);
  const detailInitialResponse = ref({});
  const vectorData = ref({});
  const showData = ref(false);
  const filteredResponse = ref([]);
  const currentCvss = ref(0);
  // const sliderValue = ref();
  const applyClicked = ref(true);
  const lastValue = ref([0, 0]);
  const radarKey = ref(0);

  const auxValue = ref({});
  const totalUpdated = ref({
    expected_global_cvss_score: 0,
    expected_global_total_vulnerabilities: 0
  });

  function openScoredcardTrends() {
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
      showDetail.value = true;
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
          applyClicked.value = false;
          if (lastValue.value[1] !== index) {
            restartLastValue();
          }
          lastValue.value = [val, index];
          showData.value = true;
          wssConnection.value?.send({
            type: WebSocketMessageRequest.VECTOR_SELECT_REQUEST,
            payload: {
              vulnerability_type_name: filteredResponse.value[index]?.name || ''
            }
          });
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

  ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, dragData, Legend);

  onMounted(async () => {
    const otp = sessionStorage.getItem(AUTH_TOKEN_NAMES.OTP);
    const tenantId = sessionStorage.getItem(AUTH_TOKEN_NAMES.TENANT_ID);
    // setChart();
    await ReportService.getReports().then(response => {
      reports.value = response.data;
      reportsRow.value = response.data.map(data => ({
        ...data
      }));
    });
    isMounted.value = true;
    wssConnection.value = new WebSocketReports(
      `${process.env.BE_SERVER_WSS}/ws/report/?tenantId=${tenantId}&otp=${otp}`
    );

    wssConnection.value.connect();

    wssConnection.value.onMessage(data => {
      if (data.type === WebSocketMessageType.INITIAL_DATA_RESPONSE) {
        detailInitialResponse.value = data.payload;
        auxValue.value = data;
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

      if (data.type === WebSocketMessageType.VECTOR_DETAILS_RESPONSE) {
        applyClicked.value = true;
        vectorData.value = data.payload.vulnerability_details;
      }

      if (data.type === WebSocketMessageType.VECTOR_UPDATE_RESPONSE) {
        totalUpdated.value = data.payload;
      }

      if (data.type === WebSocketMessageRequest.ERROR) {
        errorQuasarNotify(data.payload.message || 'Error');
        showData.value = false;
      }
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
</style>
