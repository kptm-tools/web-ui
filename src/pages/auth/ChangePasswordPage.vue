<template>
  <div>
    <auth-change-password-form @submit="changePasswordHandler" />
  </div>
</template>

<script setup lang="ts">
  import AuthChangePasswordForm from 'src/components/auth/AuthChangePasswordForm.vue';
  import { ChangePasswordBody } from 'src/models/fusion-auth.models';
  import { useFusionAuthStore } from 'stores/auth-store';

  const fusionAuthStore = useFusionAuthStore();

  function changePasswordHandler(body: ChangePasswordBody): void {
    fusionAuthStore.changePassword(body);
  }
</script>

<style scoped></style>
