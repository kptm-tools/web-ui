<template>
  <div class="content-container">
    <div class="q-px-md q-py-md q-mx-auto" style="max-width: 400px">
      <q-form ref="loginForm" class="q-gutter-md" greedy @submit="onSubmit">
        <q-input
          v-model="userName"
          :rules="[(val) => !!val || 'Field is required']"
          filled
          label="Your username"
        />

        <q-input
          v-model="password"
          :rules="[(val) => !!val || 'Field is required']"
          filled
          label="Your Password"
        />

        <q-input
          v-model="appId"
          :rules="[(val) => !!val || 'Field is required']"
          filled
          label="Your App Id"
        />

        <q-input v-model="tenantId" filled label="Your Tenant Id" />

        <div>
          <q-btn color="primary" label="Submit" type="submit" />
        </div>
      </q-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useFusionAuthStore } from 'stores/auth-store';
import { FusionAuthLoginBody } from 'src/models/fusion-auth.models';

const fusionAuthStore = useFusionAuthStore();

const userName: Ref<string> = ref('analyst@example.com');
const password: Ref<string> = ref('password');
const appId: Ref<string> = ref('31dd1baa-fc82-42ff-8e0b-5c522bb3d70c');
const tenantId: Ref<string> = ref('');

async function onSubmit() {
  const loginUserBody: FusionAuthLoginBody = {
    loginId: userName.value,
    password: password.value,
    applicationId: appId.value,
  };
  await fusionAuthStore.loginUser(loginUserBody);
}
</script>
