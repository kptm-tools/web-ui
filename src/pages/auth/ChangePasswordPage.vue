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

  const fusionAuthStore = useFusionAuthStore();
  const router = useRouter();

  async function changePasswordHandler(body: BodyForm): Promise<void> {
    await fusionAuthStore.changePassword(body as unknown as ChangePasswordBody);
  }

  function goLogin(): void {
    router.push({ name: 'Login' });
  }
</script>

<style scoped></style>
