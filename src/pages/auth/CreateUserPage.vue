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
  import { BodyForm } from 'src/models/form.models';
  import { useRouter } from 'vue-router';
  import { useFusionAuthStore } from 'src/stores/auth-store';
  import { CreateUserBody } from 'src/models/fusion-auth.models';

  const router = useRouter();
  const store = useFusionAuthStore();

  function registerHandler(body: BodyForm): void {
    store.registerUser(body as unknown as CreateUserBody);
  }

  function goLogin(): void {
    router.push({ name: 'Login' });
  }
</script>

<style scoped></style>
