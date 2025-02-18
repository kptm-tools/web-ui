<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin full-width"
      style="max-width: 700px; width: 100%"
    >
      <q-card-section>
        <q-card-title class="text-h6">New Scan</q-card-title>
      </q-card-section>
      <template v-if="step === 0">
        <scan-pick-hosts-step
          :hosts="hosts"
          @submit-hosts="scanPickHostHandler($event)"
        />
      </template>

      <template v-if="step === 1">
        <scan-schedule-step
          :hosts="pickedHosts"
          @submit-time="scanSetTimeHandler()"
        />
      </template>

      <template v-if="step === 2">
        <q-card-section>
          <form-host-emails :hosts="validatedHost" />
        </q-card-section>
      </template>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from 'quasar';
  import { Host, ValidateHostAuth } from 'src/models/hosts.models';
  import { onMounted, Ref, ref } from 'vue';
  import {
    ScanPickHostsStep,
    ScanScheduleStep,
    FormHostEmails
  } from 'src/components';

  defineEmits([...useDialogPluginComponent.emits]);

  const props = defineProps({
    hosts: {
      type: Array as () => Host[],
      required: true
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const pickedHosts: Ref<Host[]> = ref([]);
  const validatedHost: Ref<ValidateHostAuth[]> = ref([]);
  const step: Ref<number> = ref(0);

  function scanPickHostHandler(hosts: Host[]): void {
    pickedHosts.value = hosts;
    validatedHost.value = hosts.map(host => ({
      alias: host.name || '',
      credentials: [],
      hostname: host.hostName || '',
      ip: host.domain || ''
    }));
    step.value++;
  }

  function scanSetTimeHandler(): void {
    step.value++;
  }

  // function submit() {
  //   onDialogOK(pickedHosts.value);
  // }

  onMounted(() => {
    props.hosts.map((host: Host) => {
      host.picked = false;
    });
  });
</script>
