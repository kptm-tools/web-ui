<template>
  <q-card-section>
    <div class="row">
      <q-select
        v-model="pickedHost"
        outlined
        dense
        :options="hostPickedOptions"
        option-label="domain"
        class="col-6"
      />
    </div>
    <div class="row">
      <div class="text-weight-bold q-mt-md">Start Scan</div>
    </div>

    <div class="row q-col-gutter-md items-center flex full-width">
      <q-radio
        v-model="shouldStartScanNow"
        name="shape"
        :val="true"
        label="Right now"
        class="col-4"
      />
    </div>
    <div class="row q-col-gutter-md items-center flex full-width">
      <q-radio
        v-model="shouldStartScanNow"
        name="shape"
        :val="false"
        label="Schedule for"
        class="col-4"
      />
      <q-input
        v-model="scanDateTime.date"
        outlined
        dense
        mask="date"
        :disable="shouldStartScanNow"
        :rules="['date']"
        class="col-4"
      >
        <template #append>
          <q-icon
            name="event"
            class="cursor-pointer"
            :disable="shouldStartScanNow"
          >
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="scanDateTime.date">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-input
        v-model="scanDateTime.time"
        outlined
        dense
        mask="time"
        :rules="['time']"
        :disable="shouldStartScanNow"
        class="col-4"
      >
        <template #append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-time v-model="scanDateTime.time" :disable="shouldStartScanNow">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <div class="row">
      <div class="text-weight-bold q-mt-md">Scheduled Scan</div>
    </div>
    <div class="row q-col-gutter-md items-center flex full-width">
      <q-radio
        v-model="shouldRunOnce"
        name="shape"
        :val="true"
        label="Run once"
        class="col-4"
      />
    </div>
    <div class="row q-col-gutter-md items-center flex q-mb-md full-width">
      <q-radio
        v-model="shouldRunOnce"
        name="shape"
        :val="false"
        label="Repeat every"
        class="col-4"
      />

      <q-input
        v-model.number="timeValue"
        type="number"
        outlined
        dense
        style="max-width: 200px"
        class="col-4"
      />

      <q-select
        v-model="timePeriodPicked"
        outlined
        dense
        :options="timePeriodOptions"
        class="col-4"
      />
    </div>
  </q-card-section>

  <q-card-actions align="right">
    <q-btn
      type="submit"
      label="Next"
      color="primary"
      size="md"
      @click="submitTime"
    />
  </q-card-actions>
</template>

<script setup lang="ts">
  import { Host } from 'src/models';
  import { computed, Ref, ref } from 'vue';

  const emit = defineEmits(['submitTime']);

  const props = defineProps({
    hosts: {
      type: Array as () => Host[],
      required: true
    }
  });

  const allOptionHost = {
    credentials: [],
    rapporteurs: [],
    domain: 'All',
    hostName: 'All'
  };
  const pickedHost: Ref<Host> = ref(allOptionHost as Host);
  const shouldStartScanNow = ref(true);
  const shouldRunOnce = ref(true);
  const scanDateTime = ref({
    date: '',
    time: ''
  });
  const timePeriodOptions = ['Day', 'Week', 'Month', 'Year'];
  const timePeriodPicked = ref('Day');
  const timeValue = ref(1);

  const hostPickedOptions = computed(() => {
    let hostsAux: Host[] = [...props.hosts];
    hostsAux.unshift(allOptionHost);
    return hostsAux;
  });

  function submitTime(): void {
    emit('submitTime');
  }
</script>
