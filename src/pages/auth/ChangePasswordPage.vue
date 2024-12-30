<template>
  <form-regular
    :form-body="inputForms.forgotPasswordForm"
    @submit="changePasswordHandler"
    @secondary-button="goLogin"
  />
</template>

<script setup lang="ts">
  import { inputForms } from 'src/constants/form.constants';
  import { BodyForm } from 'src/models/form.models';
  import { ChangePasswordBody } from 'src/models/fusion-auth.models';
  import { useFusionAuthStore } from 'src/stores/auth-store';
  import FormRegular from 'src/components/Form/FormRegular.vue';
  import { useRouter } from 'vue-router';
  import { ROUTES_NAMES } from 'src/router/routes-names';

  const fusionAuthStore = useFusionAuthStore();
  const router = useRouter();

  async function changePasswordHandler(body: BodyForm): Promise<void> {
    await fusionAuthStore.recoverPassword(
      body as unknown as ChangePasswordBody
    );
  }

  function goLogin(): void {
    router.push({ name: ROUTES_NAMES.login });
  }
</script>

<style scoped></style>
