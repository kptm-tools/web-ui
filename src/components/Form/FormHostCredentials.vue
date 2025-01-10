<template>
  <q-form greedy @submit="submitHandler">
    <div class="row q-col-gutter-sm q-mb-md">
      <div class="col-3">Domain</div>
      <div class="col-3">Ip</div>
      <div class="col-3">Username</div>
      <div class="col-3">Password</div>
    </div>
    <template v-for="host in validateHostAuth" :key="host.alias">
      <div class="row q-col-gutter-sm">
        <div class="col-3">{{ host.hostname }}</div>
        <div class="col-3">{{ host.ip }}</div>
        <div class="col-3">
          <q-input
            v-model="host.username"
            outlined
            dense
            class="input-text"
            :rules="requiredRules('')"
          />
        </div>
        <div class="col-3">
          <q-input
            v-model="host.password"
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
      </div>
    </template>

    <div class="row flex justify-end">
      <q-btn color="primary" label="Next" type="submit" />
    </div>
  </q-form>
</template>

<script setup lang="ts">
  import { ValidatedHost, ValidateHostAuth } from 'src/models/hosts.models';
  import { ref, Ref } from 'vue';
  import { requiredRules } from 'src/utils/auth.utils';

  const props = defineProps<{
    hosts: ValidatedHost[];
  }>();

  const emits = defineEmits(['hostCredentials']);

  const validateHostAuth: Ref<ValidateHostAuth[]> = ref(
    props.hosts as ValidateHostAuth[]
  );

  const isPwd = ref(true);

  function submitHandler() {
    emits('hostCredentials', validateHostAuth.value);
  }
</script>

<style scoped></style>
