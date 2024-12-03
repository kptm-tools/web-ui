<template>
  <div class="content-container">
    <div class="q-px-md q-py-md q-mx-auto" style="max-width: 400px">
      <auth-form @login-submit="onSubmit" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import AuthForm from 'components/auth/AuthForm.vue';
  import { useFusionAuthStore } from 'stores/auth-store';
  import { FusionAuthLoginBody } from 'src/models/fusion-auth.models';

  const fusionAuthStore = useFusionAuthStore();

  async function onSubmit(loginUserBody: FusionAuthLoginBody) {
    try {
      await fusionAuthStore.loginUser(loginUserBody);
    } catch (error) {
      console.error('Login User : ', error);
    }
  }
</script>
