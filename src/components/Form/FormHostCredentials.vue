<template>
  <q-form greedy @submit="submitHandler">
    <div v-if="!edit" class="row q-mb-md q-col-gutter-md">
      <div class="col-5">
        <q-select
          v-model="pickedHost"
          outlined
          :options="hosts"
          label="Host"
          option-label="alias"
          emit-value
          dense
        />
      </div>
      <div class="col-5">
        <q-input
          v-model="pickedHost.hostname"
          outlined
          label="IP/Hostname"
          stack-label
          :dense="true"
          readonly
        />
      </div>
    </div>

    <q-form
      ref="credentialFormComponent"
      class="row q-col-gutter-md"
      @submit="addCredentialToHost"
    >
      <div class="col-5">
        <q-input
          v-model="credentialForm.username"
          outlined
          label="Username"
          stack-label
          dense
          class="input-text"
          :rules="requiredRules('')"
        />
      </div>
      <div class="col-5">
        <q-input
          v-model="credentialForm.password"
          label="Password"
          outlined
          dense
          class="input-text"
          :type="isPwd ? 'password' : 'text'"
          :rules="requiredRules('')"
        >
          <template #append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <div class="col-2">
        <q-btn square color="primary" icon="add" dense type="submit" />
      </div>
    </q-form>

    <q-separator v-if="validateHostAuth.credentials?.length" class="q-mb-md" />

    <template
      v-for="(credential, index) in validateHostAuth.credentials"
      :key="credential.username"
    >
      <div class="row q-col-gutter-sm q-mb-sm">
        <div class="col-5">
          <q-input
            v-model="credential.username"
            outlined
            class="input-text"
            label="Username"
            readonly
            dense
          />
        </div>
        <div class="col-5">
          <q-input
            v-model="credential.password"
            outlined
            dense
            square
            class="input-text"
            :type="!credential.visible ? 'password' : 'text'"
            label="Password"
            readonly
          >
            <template v-if="!edit" #append>
              <q-icon
                :name="!credential.visible ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="credential.visible = !credential.visible"
              />
            </template>
          </q-input>
        </div>
        <div class="col-2">
          <q-btn
            icon="fas fa-trash"
            dense
            flat
            color="grey"
            @click="removeCredentialToHost(index)"
          />
        </div>
      </div>
    </template>

    <div v-if="!edit" class="row flex justify-end q-mt-md">
      <q-btn color="primary" label="Next" type="submit" class="col-2" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
  import {
    ValidatedHost,
    ValidateHostAuth,
    Credential
  } from 'src/models/hosts.models';
  import { ref, Ref, ComputedRef, computed, onMounted } from 'vue';
  import { requiredRules } from 'src/utils/auth.utils';
  import { QForm } from 'quasar';

  defineExpose({ submitHandler });

  const props = defineProps({
    hosts: {
      type: Array as () => ValidatedHost[],
      required: true
    },
    credentials: {
      type: Array as () => Credential[],
      required: false,
      default: () => []
    },
    edit: {
      type: Boolean,
      required: false,
      default: false
    }
  });

  const emits = defineEmits(['hostCredentials']);
  const credentialForm = ref({ username: '', password: '' });
  const credentialFormComponent: Ref<QForm> = ref({} as QForm);

  const pickedHost: Ref<ValidatedHost> = ref(props.hosts[0] as ValidatedHost);
  const rawHosts: Ref<ValidateHostAuth[]> = ref([]);

  const validateHostAuth: ComputedRef<ValidateHostAuth> = computed(
    () =>
      (rawHosts.value.find(
        ({ alias }) => alias === pickedHost.value.alias
      ) as ValidateHostAuth) || []
  );

  const isPwd = ref(true);

  function submitHandler() {
    emits(
      'hostCredentials',
      rawHosts.value.map(value => {
        return {
          ...value,
          credentials: value.credentials?.map(({ username, password }) => {
            return { username, password };
          })
        };
      })
    );
  }

  function addCredentialToHost(): void {
    const indexHost = rawHosts.value.findIndex(
      ({ alias }) => alias === pickedHost.value.alias
    );

    if (!rawHosts.value[indexHost].credentials) {
      rawHosts.value[indexHost].credentials = [];
    }
    rawHosts.value[indexHost].credentials.push({
      username: credentialForm.value.username,
      password: credentialForm.value.password
    });
    credentialForm.value.username = '';
    credentialForm.value.password = '';
    credentialFormComponent.value.reset();
  }

  function removeCredentialToHost(index: number): void {
    const indexHost = rawHosts.value.findIndex(
      ({ alias }) => alias === pickedHost.value.alias
    );
    rawHosts.value[indexHost].credentials.splice(index, 1);
  }

  onMounted(() => {
    rawHosts.value = props.hosts.map(host => ({ ...host, credentials: [] }));
    if (props.credentials) {
      rawHosts.value[0].credentials = props.credentials;
    }
  });
</script>

<style scoped></style>
