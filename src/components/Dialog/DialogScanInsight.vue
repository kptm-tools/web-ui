<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin full-width"
      style="max-height: 580px; overflow: hidden"
    >
      <q-card-section>
        <div class="text-h6" style="color: #313541">
          Domain : {{ insight.metadata.host_alias }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-lg">
          <div class="col-6">
            <div class="row q-mb-md">
              <div class="text-h6" style="color: #313541">
                Vulnerability Count
              </div>

              <div class="full-width">
                <apexchart :options="options" :series="series"></apexchart>
              </div>
            </div>
            <div
              class="row flex items-center q-mb-md"
              style="background-color: #f6f7fc"
            >
              <div
                class="col-6 flex items-center justify-center text-weight-bold"
                style="font-size: 45px; color: #313541"
              >
                50
              </div>
              <div class="col-6">
                <p class="q-ma-none" tyle="font-size: 24px; color: #313541">
                  Google.com
                </p>
                <p class="q-ma-none" style="color: #5c7288">
                  5
                  <i class="fa-solid fa-caret-up q-mx-sm text-red"></i>
                  Variation
                </p>
              </div>
            </div>
            <div class="row">
              <div class="text-h6" style="color: #313541">Protection Score</div>

              <div class="relative" style="position: relative">
                <apexchart
                  :options="protectionScoreOptions"
                  :series="protecion"
                ></apexchart>

                <div
                  style="
                    position: absolute;
                    bottom: 70px;
                    margin-left: auto;
                    margin-right: auto;
                    left: -20px;
                    right: 0;
                    width: fit-content;
                  "
                >
                  <span class="q-ma-none" style="color: #5c7288">
                    5%
                    <i class="fa-solid fa-caret-up q-mx-sm text-red"></i>
                    Variation
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="text-h6" style="color: #313541">
              List of vulnerabilities
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card></q-dialog
  >
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from 'quasar';
  import { ScanInsight } from 'src/models/scans.model';
  import { onMounted, PropType } from 'vue';

  defineEmits([...useDialogPluginComponent.emits]);

  const props = defineProps({
    insight: {
      type: Object as PropType<ScanInsight>,
      required: true
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  // dialogRef      - Vue ref to be applied to QDialog
  // onDialogHide   - Function to be used as handler for @hide on QDialog
  // onDialogOK     - Function to call to settle dialog with "ok" outcome
  //                    example: onDialogOK() - no payload
  //                    example: onDialogOK({ /*...*/ }) - with payload
  // onDialogCancel - Function to call to settle dialog with "cancel" outcome

  // this is part of our example (so not required)
  // function onOKClick() {
  //   // on OK, it is REQUIRED to
  //   // call onDialogOK (with optional payload)
  //   onDialogOK();
  //   // or with payload: onDialogOK({ ... })
  //   // ...and it will also hide the dialog automatically
  // }

  let series: number[] = [];
  const protecion = [1, 1, 1];

  const options = {
    chart: {
      type: 'donut'
    },
    dataLabels: {
      enabled: false
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

  onMounted(() => {
    series = [
      props.insight.severity_counts.critical,
      props.insight.severity_counts.high,
      props.insight.severity_counts.medium,
      props.insight.severity_counts.low
    ];
  });
</script>
