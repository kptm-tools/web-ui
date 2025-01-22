<template>
  <q-form @submit.prevent="registerHosts">
    <div class="row q-col-gutter-md flex items-center">
      <div class="col-5">
        <q-select
          v-model="pickedHost"
          outlined
          :options="hostOptions"
          option-label="alias"
          label="Host"
          dense
        />
      </div>
      <div class="col-1">
        <q-btn
          square
          color="primary"
          icon="add"
          dense
          :disable="disabledAdd"
          @click="addReporterToHost"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-xs">
      <div class="col-5">
        <q-input v-model="name" outlined label="Name" dense />
      </div>
      <div class="col-5">
        <q-input v-model="email" outlined label="Email" dense />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <template v-for="host in hostsWithEmails" :key="host.host">
        <template v-for="rep in host.rapporteurs" :key="rep.name">
          <div class="col-5">
            <q-input v-model="rep.name" outlined label="Name" dense readonly />
          </div>
          <div class="col-5">
            <q-input
              v-model="rep.email"
              outlined
              label="Email"
              dense
              readonly
            />
          </div>
          <div class="col-2">
            <q-btn
              :icon="rep.is_principal ? 'fas fa-heart' : 'far fa-heart'"
              dense
              flat
              color="grey"
              @click="
                host.rapporteurs.map(val => (val.is_principal = false));
                rep.is_principal = !rep.is_principal;
              "
            ></q-btn>
            <q-btn icon="fas fa-pen-to-square" dense flat color="grey"></q-btn>
            <q-btn icon="fas fa-trash" dense flat color="grey"></q-btn>
          </div>
        </template>
      </template>
    </div>

    <div class="row q-pt-md justify-end">
      <q-btn
        :disabled="!hostsWithEmails.length"
        color="primary"
        label="Save"
        type="submit"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
  import { computed, ComputedRef, onMounted, ref, Ref } from 'vue';
  import { Host, ValidateHostAuth } from 'src/models/hosts.models';

  const props = defineProps<{
    hosts: ValidateHostAuth[];
  }>();

  const emits = defineEmits(['registerHost']);

  const pickedHost = ref();
  const name = ref('');
  const email = ref('');
  const hostOptions: Ref<ValidateHostAuth[]> = ref([] as ValidateHostAuth[]);
  const hostsRegister: Ref<Host[]> = ref([] as Host[]);

  const hostsWithEmails: ComputedRef<Host[]> = computed(() => {
    return hostsRegister.value.filter(
      host =>
        host.rapporteurs.length > 0 &&
        (host.alias === pickedHost.value.alias ||
          pickedHost.value.alias === 'All')
    );
  });

  const disabledAdd = computed(() => {
    return !name.value || !email.value;
  });

  function addReporterToHost() {
    if (pickedHost.value.alias === 'All') {
      hostsRegister.value.forEach((val, i) => {
        hostsRegister.value[i].rapporteurs.push({
          name: name.value,
          email: email.value,
          is_principal: false
        });
      });
    } else {
      const index = hostsRegister.value.findIndex(
        host => host.alias === pickedHost.value.alias
      );
      hostsRegister.value[index].rapporteurs.push({
        name: name.value,
        email: email.value,
        is_principal: false
      });
    }

    name.value = '';
    email.value = '';
  }

  function registerHosts() {
    console.log('body form', hostsRegister.value);
    emits('registerHost', hostsRegister.value);
  }

  onMounted(async () => {
    hostOptions.value = await props.hosts;
    hostsRegister.value = await hostOptions.value.map(host => {
      return {
        alias: host.alias,
        host: host.hostname,
        credentials: host.credentials,
        rapporteurs: []
      };
    });
    await hostOptions.value.unshift({
      alias: 'All',
      hostname: 'All',
      ip: 'All',
      credentials: []
    });
    pickedHost.value = hostOptions.value[0];
  });
</script>

<style scoped></style>
