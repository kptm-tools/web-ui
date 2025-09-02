<template>
  <q-layout view="lHh lpR lFf" class="bg-grey-2">
    <q-header class="bg-transparent text-black">
      <q-toolbar class="q-px-lg">
        <q-toolbar-title class="title">
          <div id="header"></div>
        </q-toolbar-title>

        <q-separator />

        <div id="header-filters"></div>

        <q-btn dense flat icon="far fa-bell" size="md" color="primary" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above side="left" class="flex column" :width="showSecondDrawer ? 500 : 300">
      <main-drawer @logout="logout" is-audits />
      <div v-if="showSecondDrawer" class="second-drawer">
        <div id="aux-sidebar"></div>
      </div>
    </q-drawer>

    <q-page-container>
      <div class="row">
        <div class="col">
          <div class="bg-white q-ma-sm page-container">
            <router-view />
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useAuthStore } from 'auth/stores/auth-store';
  import { AUTH_ROUTES } from 'auth/routes/route-names';
  import { useMiscStore } from 'vulnerability/stores/misc';
  import MainDrawer from 'vulnerability/components/drawer/MainDrawer.vue';
  import { computed } from 'vue';

  const router = useRouter();
  const authStore = useAuthStore();
  const miscStore = useMiscStore();

  const showSecondDrawer = computed(() => miscStore.isSecondDrawerVisible);

  async function logout(): Promise<void> {
    authStore.logoutUser();
    await router.push({ name: AUTH_ROUTES.login.name });
  }
</script>

<style lang="scss">
  .title {
    font-size: 1.5em;
    font-weight: 700;
    line-height: 32px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #313541;
  }

  .second-drawer {
    width: 200px;
    height: 100%;
    overflow: hidden;

    #aux-sidebar {
      width: 200px;
      height: 100%;
    }
  }

  .page-container {
    min-height: calc(100vh - 85px);
    max-height: calc(100vh - 85px);
    border-radius: 1em;
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>
