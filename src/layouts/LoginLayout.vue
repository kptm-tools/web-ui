<template>
  <div class="q-px-md q-py-md q-mx-auto fullscreen login-container">
    <div class="row full-height q-pa-xl justify-center">
      <div
        class="gt-md col-8 login-left text-white flex column justify-center d-"
      >
        <div class="text q-mb-xl">
          <p class="title">
            {{ $route.meta.title }}
          </p>
          <p class="subtitle">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </p>
        </div>

        <div class="flex items-center full-width">
          <span class="q-mr-md">Powered by</span>
          <img
            alt="Aynitech Logo"
            class="logo"
            src="../assets/logos/aynitech-logo.svg"
          />
        </div>
      </div>
      <div class="col-12 col-md-8 col-lg-4 flex column justify-center q-pl-lg">
        <q-card class="login-card">
          <q-card-section class="text-center">
            <img
              alt="Aynitech Logo"
              class="logo"
              src="../assets/logos/kriptone-logo.svg"
            />
          </q-card-section>

          <q-card-section class="q-mt-lg">
            <router-view />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
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
