<template>
  <base-form
    :form-body="inputForms.registerForm"
    @submit="registerHandler"
    @secondary-button="goLogin"
  />
</template>

<script setup lang="ts">
  import BaseForm from 'shared/components/form/BaseForm.vue';
  import { inputForms } from 'auth/constants/form';
  import type { BodyForm } from 'shared/models/form';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'src/modules/auth/stores/auth-store';
  import type { CreateUserBody } from 'auth/models/fusion-auth.models';
  import { AUTH_ROUTES } from 'auth/routes/route-names';

  const router = useRouter();
  const store = useAuthStore();

  function registerHandler(body: BodyForm): void {
    store.registerUser(body as unknown as CreateUserBody).catch(err => new Error(err));
  }

  async function goLogin(): Promise<void> {
    await router.push({ name: AUTH_ROUTES.login.name });
  }
</script>

<style scoped></style>
