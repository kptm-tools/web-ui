<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin full-width" style="max-width: 800px">
      <q-card-section class="text-h6">
        <p class="text-h6 q-mb-none">Edit Host</p>
      </q-card-section>
      <q-card-section>
        <q-form class="q-mb-md">
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-5">
              <q-input
                v-model="hostForm.name"
                outlined
                dense
                label="Hostname"
              ></q-input>
            </div>
          </div>

          <div class="row items-center">
            <q-toggle
              v-model="valueType"
              :label="valueType"
              color="pink"
              false-value="Domain"
              true-value="IP"
            />
          </div>

          <div class="row q-col-gutter-md">
            <div v-if="valueType === 'Domain'" class="col-5">
              <q-input
                v-model="hostForm.domain"
                outlined
                dense
                label="Domain"
              ></q-input>
            </div>
            <div v-if="valueType === 'IP'" class="col-5">
              <q-input
                v-model="hostForm.ip"
                outlined
                dense
                label="Ip"
              ></q-input>
            </div>
          </div>
        </q-form>

        <p>Credentials</p>
        <form-host-credentials
          ref="formCredentials"
          :hosts="hostCredentials"
          :credentials="host.credentials"
          :edit="true"
          @host-credentials="hostCredentialsHandler"
        />

        <p class="q-mt-md q-mb-none">Rapporteurs</p>
        <form-host-emails
          ref="formEmails"
          :hosts="hostEmails"
          :rapporteurs="host.rapporteurs"
          :edit="true"
          @register-host="hostEmailsHandler"
        />

        <q-btn
          class="q-mt-md"
          color="primary"
          label="Submit"
          @click="submitEdit"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { AxiosError } from 'axios';
  import { useDialogPluginComponent } from 'quasar';
  import {
    ValidatedHost,
    Host,
    ValidateHostAuth,
    HostCreateBody
  } from 'src/models/hosts.models';
  import FormHostCredentials from 'components/Form/FormHostCredentials.vue';
  import FormHostEmails from 'components/Form/FormHostEmails.vue';
  import { validateHost } from 'src/services/host.service';
  import { errorQuasarNotify } from 'src/utils';

  defineEmits([...useDialogPluginComponent.emits]);

  const props = defineProps({
    host: {
      type: Object as () => Host,
      required: true
    }
  });

  const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
  const hostForm = ref({} as Host);
  const hostCredentials = ref([] as ValidatedHost[]);
  const hostEmails = ref([] as ValidateHostAuth[]);
  const formCredentials = ref<InstanceType<typeof FormHostCredentials> | null>(
    null
  );
  const formEmails = ref<InstanceType<typeof FormHostEmails> | null>(null);
  const valueType = ref<'Domain' | 'IP'>('Domain');

  async function submitEdit(): Promise<void> {
    if (!formCredentials.value || !formEmails.value) return;
    try {
      const { domain, ip, name, credentials, rapporteurs } = hostForm.value;
      const value = (valueType.value === 'Domain' ? domain : ip) || '';

      formCredentials.value.submitHandler();
      formEmails.value.registerHosts();

      await validateHost(value || '');

      const body: HostCreateBody = {
        value,
        name,
        value_type: valueType.value,
        credentials,
        rapporteurs
      };

      onDialogOK(body);
    } catch (error) {
      const errorAxios = error as AxiosError;
      const errorMessage = errorAxios.response?.data as { error: string };

      if (errorMessage && errorMessage.error) {
        errorQuasarNotify(errorMessage.error);
      } else {
        errorQuasarNotify('An unexpected error occurred.');
        console.error('Error details:', error);
      }
    }
  }

  function hostEmailsHandler(hostsList: Host[]) {
    hostForm.value.rapporteurs = hostsList[0].rapporteurs;
  }

  function hostCredentialsHandler(hostsList: ValidateHostAuth[]) {
    hostForm.value.credentials = hostsList[0].credentials;
  }

  function setInitialData(): void {
    const { name = '', domain = '', ip = '', credentials = [] } = props.host;
    const commonData = { alias: name, hostname: domain, ip };
    hostForm.value = props.host;
    hostCredentials.value = [commonData];
    hostEmails.value = [
      {
        ...commonData,
        credentials
      }
    ];
  }

  onMounted(() => {
    setInitialData();
  });
</script>
