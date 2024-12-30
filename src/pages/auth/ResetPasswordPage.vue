<template>
  <form-regular
    :form-body="inputForms.resetPasswordForm"
    @submit="changePasswordHandler"
    @secondary-button="goLogin"
  />
</template>

<script lang="ts" setup>
  import FormRegular from 'src/components/Form/FormRegular.vue';
  import { inputForms } from 'src/constants/form.constants';
  import { BodyForm } from 'src/models/form.models';
  import { ChangePasswordBody } from 'src/models/fusion-auth.models';
  import { useFusionAuthStore } from 'src/stores/auth-store';
  import { useRouter } from 'vue-router';
  import { ROUTES_NAMES } from 'src/router/routes-names';

  const router = useRouter();
  const store = useFusionAuthStore();

  function changePasswordHandler(body: BodyForm): void {
    store.changePassword(body as unknown as ChangePasswordBody);
  }

  function goLogin(): void {
    router.push({ name: ROUTES_NAMES.login });
  }
</script>

<style scoped></style>
