<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin full-width dialog-container">
      <q-card-section>
        <q-card-title class="text-h6">{{ title }}</q-card-title>
      </q-card-section>
      <q-card-section>
        <form-validate-host
          v-if="step == DiALOG_STEPS.VALIDATE"
          :hosts="hosts"
          @validated-hosts="hostValidationHandler"
        />

        <form-host-credentials
          v-if="step == DiALOG_STEPS.AUTH"
          :edit="false"
          :hosts="validatedHosts"
          @host-credentials="hostCredentialsHandler"
        />

        <form-host-emails
          v-if="step == DiALOG_STEPS.EMAIL"
          :hosts="validateHostsAuth"
          @register-host="hostCreationHandler"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { computed, ref, type Ref } from 'vue';
  import { useDialogPluginComponent } from 'quasar';
  import { i18n } from 'src/boot/i18n';
  import { FormValidateHost, FormHostCredentials, FormHostEmails } from 'src/components';
  import {
    type Host,
    type HostCreateBody,
    type ValidatedHost,
    type ValidateHostAuth,
    DiALOG_STEPS
  } from 'src/models';
  import { HostService } from 'src/services';
  import {
    formatHostToRequestServiceBody,
    errorQuasarNotify,
    successQuasarNotify
  } from 'src/utils';

  defineEmits([...useDialogPluginComponent.emits]);

  defineProps({
    hosts: {
      type: Array as () => Host[],
      required: true
    }
  });

  const { t } = i18n.global;
  const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();
  const step: Ref<DiALOG_STEPS> = ref(DiALOG_STEPS.VALIDATE);
  const validatedHosts: Ref<ValidatedHost[]> = ref([] as ValidatedHost[]);
  const validateHostsAuth: Ref<ValidateHostAuth[]> = ref([]);

  const title = computed(() => {
    return step.value === DiALOG_STEPS.VALIDATE
      ? t('hosts.creation.steps.validation.title')
      : step.value === DiALOG_STEPS.AUTH
        ? t('hosts.creation.steps.auth.title')
        : t('hosts.creation.steps.email.title');
  });

  function hostValidationHandler(hosts: ValidatedHost[]): void {
    step.value = DiALOG_STEPS.AUTH;
    validatedHosts.value = hosts;
  }

  function hostCredentialsHandler(hosts: ValidateHostAuth[]): void {
    step.value = DiALOG_STEPS.EMAIL;
    validateHostsAuth.value = hosts;
  }

  async function hostCreationHandler(hostsList: Host[]): Promise<void> {
    await registerHosts(formatHostToRequestServiceBody(hostsList));
    onDialogOK();
  }

  async function registerHosts(hostsBody: HostCreateBody[]) {
    for (const hostBody of hostsBody) {
      const name = hostBody.name;
      try {
        await HostService.createHost(hostBody);
        successQuasarNotify(t('hosts.creation.message.ok', { name }));
      } catch (error) {
        errorQuasarNotify(t('hosts.creation.message.error', { name }));
        new Error(error as string);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-container {
    max-width: 700px;
    width: 100%;
  }
</style>
