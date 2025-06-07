<template>
  <form-regular
    :form-body="inputForms.forgotPasswordForm"
    @submit="changePasswordHandler"
    @secondary-button="goLogin"
  />
</template>

<script setup lang="ts">
  import { inputForms } from 'src/constants/form.constants';
  import type { BodyForm } from 'src/models/form.models';
  import type { ChangePasswordBody } from 'src/models/fusion-auth.models';
  import { useAuthStore } from 'auth/store/auth-store';
  import FormRegular from 'src/components/Form/FormRegular.vue';
  import { useRouter } from 'vue-router';
  import { AUTH_ROUTES } from 'auth/routes/route-names';

  const authStore = useAuthStore();
  const router = useRouter();

  async function changePasswordHandler(body: BodyForm): Promise<void> {
    await authStore.recoverPassword(body as unknown as ChangePasswordBody);
  }

  async function goLogin(): Promise<void> {
    await router.push({ name: AUTH_ROUTES.login.name });
  }
</script>

<style scoped></style>
