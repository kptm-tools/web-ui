<template>
  <base-form
    :form-body="inputForms.resetPasswordForm"
    @submit="changePasswordHandler"
    @secondary-button="goLogin"
  />
</template>

<script lang="ts" setup>
  import BaseForm from 'shared/components/form/BaseForm.vue';
  import { inputForms } from 'src/constants/form.constants';
  import type { BodyForm } from 'shared/models/form';
  import type { ChangePasswordBody } from 'auth/models/fusion-auth.models';
  import { useAuthStore } from 'src/modules/auth/stores/auth-store';
  import { useRouter } from 'vue-router';
  import { AUTH_ROUTES } from 'auth/routes/route-names';

  const router = useRouter();
  const store = useAuthStore();

  function changePasswordHandler(body: BodyForm): void {
    store.changePassword(body as unknown as ChangePasswordBody).catch(err => new Error(err));
  }

  async function goLogin(): Promise<void> {
    await router.push({ name: AUTH_ROUTES.login.name });
  }
</script>

<style scoped></style>
