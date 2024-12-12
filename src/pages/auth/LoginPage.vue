<script lang="ts" setup>
  import AuthLoginForm from 'components/auth/AuthLoginForm.vue';
  import AuthRecoverForm from 'components/auth/AuthRecoverForm.vue';
  import { useFusionAuthStore } from 'stores/auth-store';
  import { FusionAuthLoginBody } from 'src/models/fusion-auth.models';
  import { useRoute, useRouter } from 'vue-router';
  import { computed, ComputedRef, watch } from 'vue';

  const fusionAuthStore = useFusionAuthStore();
  const router = useRouter();
  const route = useRoute();
  const isRecoverForm: ComputedRef<boolean> = computed(
    () => route.query.recover === 'true'
  );

  async function loginHandler(body: FusionAuthLoginBody): Promise<void> {
    await fusionAuthStore.loginUser(body);
    await router.push({ name: 'Home' });
  }

  async function recoverHandler(body: string): Promise<void> {
    console.log(body);
  }

  async function goRecoverHandler() {
    await router.replace({ query: { recover: 'true' } });
  }

  async function goCancelRecoverHandler() {
    await router.replace({ query: undefined });
  }

  watch(
    () => route.query.recover,
    newValue => {
      if (newValue !== 'true') {
        goCancelRecoverHandler();
      }
    }
  );
</script>

<template>
  <div class="q-px-md q-py-md q-mx-auto" style="max-width: 400px">
    <auth-recover-form
      v-if="isRecoverForm"
      @cancel="goCancelRecoverHandler"
      @submit="recoverHandler"
    />
    <auth-login-form
      v-else
      @submit="loginHandler"
      @go-recover="goRecoverHandler"
    />
  </div>
</template>

<style scoped></style>
