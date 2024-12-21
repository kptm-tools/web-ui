<template>
  <div class="q-px-md q-py-md q-mx-auto fullscreen login-container">
    <div class="row full-height q-pa-xl justify-center">
      <div
        class="gt-md col-8 login-left text-white flex column justify-center d-"
      >
        <div class="text q-mb-xl">
          <p class="title">
            {{
              isRecoverForm
                ? $t('auth.login.form.recoverPasswordTitle')
                : $t('auth.login.form.loginTitle')
            }}
          </p>
          <p class="subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </p>
        </div>

        <div class="flex items-center full-width">
          <span class="q-mr-md">Powered by</span>
          <img
            src="../../assets/logos/aynitech-logo.svg"
            alt="Aynitech Logo"
            class="logo"
          />
        </div>
      </div>
      <div class="col-12 col-md-8 col-lg-4 flex column justify-center q-pl-lg">
        <q-card class="login-card">
          <q-card-section class="text-center">
            <img
              src="../../assets/logos/kriptone-logo.svg"
              alt="Aynitech Logo"
              class="logo"
            />
          </q-card-section>

          <q-card-section class="q-mt-lg">
            <form-regular
              v-if="isRecoverForm"
              :form-body="inputForms.forgotPasswordForm"
              @submit="recoverHandler"
              @secondary-button="goCancelRecoverHandler"
            />

            <form-regular
              v-else
              :form-body="inputForms.loginForm"
              @submit="loginHandler"
              @secondary-button="goRecoverHandler"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import FormRegular from 'src/components/Form/FormRegular.vue';
  import { inputForms } from 'src/constants/form.constants';
  import { useFusionAuthStore } from 'stores/auth-store';
  import {
    ForgotPasswordBody,
    FusionAuthLoginBody
  } from 'src/models/fusion-auth.models';
  import { useRoute, useRouter } from 'vue-router';
  import { computed, ComputedRef, watch } from 'vue';
  import { BodyForm } from 'src/models/form.models';

  const fusionAuthStore = useFusionAuthStore();
  const router = useRouter();
  const route = useRoute();
  const isRecoverForm: ComputedRef<boolean> = computed(
    () => route.query.recover === 'true'
  );

  async function loginHandler(body: BodyForm): Promise<void> {
    await fusionAuthStore.loginUser(body as unknown as FusionAuthLoginBody);
    await router.push({ name: 'Home' });
  }

  async function recoverHandler(body: BodyForm): Promise<void> {
    await fusionAuthStore.recoverPassword(
      body as unknown as ForgotPasswordBody
    );
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
