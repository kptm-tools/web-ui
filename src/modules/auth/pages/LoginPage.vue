<template>
  <base-form
    :form-body="inputForms.loginForm"
    @submit="loginHandler"
    @secondary-button="goRegisterUserHandler"
  >
    <template #aux-buttons>
      <div class="flex justify-between">
        <div>
          <q-checkbox v-model="remember" color="grey-7" dense label="Remember" />
        </div>
        <div>
          <q-btn flat label="Forgot your password?" @click="goRecoverHandler" />
        </div>
      </div>
    </template>
  </base-form>
</template>

<script lang="ts" setup>
  import BaseForm from 'shared/components/form/BaseForm.vue';
  import { inputForms } from 'src/constants/form.constants';
  import { useAuthStore } from 'src/modules/auth/stores/auth-store';
  import type { FusionAuthLoginBody } from 'auth/models/fusion-auth.models';
  import { useRouter } from 'vue-router';
  import type { Ref } from 'vue';
  import { ref } from 'vue';
  import type { BodyForm } from 'shared/models/form';
  import { VULNERABILITY_ROUTES } from 'vulnerability/routes/route-names';
  import { AUTH_ROUTES } from 'auth/routes/route-names';

  const authStore = useAuthStore();
  const router = useRouter();

  const remember: Ref<boolean> = ref(false);

  async function loginHandler(body: BodyForm): Promise<void> {
    await authStore.loginUser(body as unknown as FusionAuthLoginBody);
    await router.push({ name: VULNERABILITY_ROUTES.home.name });
  }

  async function goRecoverHandler() {
    await router.push({ name: AUTH_ROUTES.recoverPassword.name });
  }

  async function goRegisterUserHandler() {
    await router.push({ name: AUTH_ROUTES.registerUser.name });
  }
</script>

<style scoped lang="scss">
  .login {
    &-container {
      background-image: url('assets/images/login-background.png');
      background-size: cover;

      .login-card {
        padding: 5em 4em 7em 4em;
        border-radius: 1rem;
      }
    }

    &-left {
      .text {
        .title {
          font-size: 3em;
          font-weight: 800;
          text-align: left;
        }

        .subtitle {
          font-size: 0.8125em;
          font-weight: 400;
          letter-spacing: -0.02em;
        }
      }
    }
  }
</style>
