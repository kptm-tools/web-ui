<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin full-width"
      style="max-width: 700px; width: 100%"
    >
      <q-card-section>
        <q-card-title class="text-h6">{{ title }}</q-card-title>
      </q-card-section>
      <q-card-section>
        <form-validate-host
          v-if="step == 'validate'"
          :hosts="hosts"
          @validated-hosts="hostValidationHandler"
        />
        <form-host-credentials
          v-if="step == 'auth'"
          :hosts="validatedHosts"
          @host-credentials="hostCredentialsHandler"
        />

        <form-host-emails
          v-if="step == 'email'"
          :hosts="validateHostsAuth"
          @register-host="registerHost"
        />
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="center">
        <!-- <q-btn color="primary" label="Validation" @click="onOKClick" /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from 'quasar';
  import FormValidateHost from 'src/components/Form/FormValidateHost.vue';
  import FormHostCredentials from 'src/components/Form/FormHostCredentials.vue';
  import FormHostEmails from 'src/components/Form/FormHostEmails.vue';
  import {
    Host,
    HostCreateBody,
    ValidatedHost,
    ValidateHostAuth
  } from 'src/models/hosts.models';
  import { computed, ref, Ref } from 'vue';
  import { registerHosts } from 'src/services/host.service';
  import { useQuasar } from 'quasar';

  defineEmits([...useDialogPluginComponent.emits]);

  defineProps({
    hosts: {
      type: Array as () => Host[],
      required: true
    }
  });

  const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
  const step = ref('validate');
  const $q = useQuasar();
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

  const validatedHosts: Ref<ValidatedHost[]> = ref([] as ValidatedHost[]);
  const validateHostsAuth: Ref<ValidateHostAuth[]> = ref([]);

  const title = computed(() => {
    return step.value === 'validate'
      ? 'Host Validation'
      : step.value === 'auth'
      ? 'Authentication '
      : 'Send email';
  });

  function hostValidationHandler(hosts: ValidatedHost[]): void {
    step.value = 'auth';
    validatedHosts.value = hosts;
  }

  function hostCredentialsHandler(hosts: ValidateHostAuth[]): void {
    step.value = 'email';
    validateHostsAuth.value = hosts;
  }

  async function registerHost(hostsList: Host[]): Promise<void> {
    const data: HostCreateBody[] = hostsList.map(h => ({
      name: h.alias,
      credentials: h.credentials,
      rapporteurs: h.rapporteurs,
      value: h.host,
      value_type: 'Domain'
    }));
    for (const host of data) {
      try {
        await registerHosts(host);
        $q.notify({
          type: 'positive',
          message: `Host created ${host.name}`
        });
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: `Failure for host ${host.name}`
        });
      }
    }
    await onDialogOK();
  }
</script>
