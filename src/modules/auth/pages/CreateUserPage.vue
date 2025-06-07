<template>
  <form-regular
    :form-body="inputForms.registerForm"
    @submit="registerHandler"
    @secondary-button="goLogin"
  />
</template>

<script setup lang="ts">
  import FormRegular from 'src/components/Form/FormRegular.vue';
  import { inputForms } from 'src/constants/form.constants';
  import type { BodyForm } from 'src/models/form.models';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'auth/store/auth-store';
  import type { CreateUserBody } from 'src/models/fusion-auth.models';
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
