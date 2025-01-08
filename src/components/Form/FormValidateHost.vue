<template>
  <q-form @submit="validateHost">
    <div class="row">
      <div class="col-3 flex">
        <q-radio v-model="isDomain" :val="true" label="Domain" dense />
      </div>
      <div class="col-9 flex justify-between">
        <q-input
          v-model="domain"
          outlined
          dense
          :disable="!isDomain"
          class="input-text"
        />
        <q-btn
          square
          color="primary"
          icon="add"
          :disable="!isValidated || (isValidated && !isDomain)"
          @click="addHostValidated(domain, hostname, isDomain)"
        />
      </div>
    </div>
    <div class="row q-mb-md">
      <template
        v-for="validatedDomain in validatedDomains"
        :key="validatedDomain.value"
      >
        <q-chip
          clickable
          color="grey"
          text-color="white"
          icon-right="close"
          dense
          :label="validatedDomain.hostname"
          @click="removeHostValidated(validatedDomain.value)"
        ></q-chip>
      </template>
    </div>
    <div class="row">
      <div class="col-3 flex">
        <q-radio v-model="isDomain" :val="false" label="Ip" dense />
      </div>
      <div class="col-9 flex justify-between">
        <q-input
          v-model="ip"
          outlined
          dense
          :disable="isDomain"
          class="input-text"
        />
        <q-btn
          square
          color="primary"
          icon="add"
          :disable="!isValidated || (isValidated && isDomain)"
          @click="addHostValidated(ip, hostname, isDomain)"
        />
      </div>
    </div>

    <div class="row q-mb-md">
      <template v-for="validatedIp in validatedIps" :key="validatedIp.value">
        <q-chip
          clickable
          color="grey"
          text-color="white"
          icon-right="close"
          :label="validatedIp.hostname"
          dense
          @click="removeHostValidated(validatedIp.value)"
        ></q-chip>
      </template>
    </div>

    <div class="row q-mb-md">
      <q-input v-model="hostname" outlined dense>
        <template #before>
          <label class="input-label">Hostname</label></template
        ></q-input
      >
    </div>

    <div class="row justify-center">
      <q-btn
        v-if="validateIsEnable"
        color="primary"
        label="Validation"
        type="submit"
      />

      <q-btn v-else color="grey" label="Next" @click="submitValidatedHosts" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { validateDomainOrIp } from 'src/services/host.service';
  import { ValidatedHost } from 'src/models/hosts.models';

  const emits = defineEmits(['validatedHosts']);

  const isDomain = ref(true);
  const domain = ref('');
  const ip = ref('');
  const hostname = ref('');
  const isValidated = ref(false);

  const hostnameValidates = ref(
    [] as { value: string; hostname: string; isDomain: boolean }[]
  );

  const validateIsEnable = computed(
    () =>
      (domain.value.length > 0 || ip.value.length > 0) &&
      hostname.value.length > 0
  );

  const validatedDomains = computed(() =>
    hostnameValidates.value.filter(host => host.isDomain)
  );

  const validatedIps = computed(() =>
    hostnameValidates.value.filter(host => !host.isDomain)
  );

  async function validateHost() {
    if (validateIsEnable.value) {
      let domainOrIp = '';
      if (isDomain.value) {
        domainOrIp = domain.value;
      } else {
        domainOrIp = ip.value;
      }
      try {
        // isValidated.value =
        //   (await validateDomainOrIp(domainOrIp)).data === 'Verified';
        await validateDomainOrIp(domainOrIp);
        isValidated.value = true;
      } catch (e) {
        isValidated.value = true;
      }
    }
  }

  function addHostValidated(
    value: string,
    hostname: string,
    isDomain: boolean
  ) {
    hostnameValidates.value.push({ value, hostname, isDomain });
    resetValues();
  }

  function resetValues() {
    domain.value = '';
    ip.value = '';
    hostname.value = '';
    isValidated.value = false;
  }

  function removeHostValidated(value: string) {
    hostnameValidates.value = hostnameValidates.value.filter(
      host => host.value !== value
    );
  }

  function submitValidatedHosts() {
    emits(
      'validatedHosts',
      hostnameValidates.value.map(host => ({
        hostname: host.isDomain ? host.value : '',
        ip: host.isDomain ? '' : host.value,
        alias: host.hostname
      })) as ValidatedHost[]
    );
  }

  watch(isDomain, () => {
    domain.value = '';
    ip.value = '';
    isValidated.value = false;
  });

  watch([domain, ip], () => {
    if (isValidated.value) {
      isValidated.value = false;
    }
  });
</script>

<style scoped>
  .input-text {
    width: inherit;
  }

  .input-label {
    color: black;
    font-size: 1rem;
    margin-right: 1em;
  }
</style>
