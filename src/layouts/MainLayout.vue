<template>
  <q-layout view="lHh lpR lFf" class="bg-grey-2">
    <q-header class="bg-transparent text-black">
      <q-toolbar class="q-px-lg">
        <q-toolbar-title class="title">
          {{ $route.meta.title }}
        </q-toolbar-title>

        <q-separator />

        <q-btn dense flat icon="far fa-bell" size="md" color="primary" />

        <!-- <q-toggle v-model="language" size="lg" val="lg" label="EN" /> -->
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above side="left" class="flex column">
      <div class="text-center q-pt-lg">
        <img
          alt="Aynitech Logo"
          class="logo"
          src="../assets/logos/kriptone-logo.svg"
        />
      </div>

      <q-list
        style="height: calc(100% - 90px)"
        class="flex column justify-between"
      >
        <div style="margin-top: 40%">
          <q-item
            v-ripple
            clickable
            to="/"
            class="nav-item"
            :active="route.name === 'Home'"
          >
            <q-item-section avatar class="q-px-none items-center">
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Overview</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-ripple
            clickable
            to="/hosts"
            class="nav-item"
            :active="route.name === 'Hosts'"
          >
            <q-item-section avatar class="q-px-none items-center">
              <q-icon name="fas fa-sitemap" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Host Details</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-ripple
            clickable
            to="scans"
            class="nav-item"
            :active="route.name === 'Scans'"
          >
            <q-item-section avatar class="q-px-none items-center">
              <q-icon name="search" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Scans</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-ripple
            clickable
            to="#"
            class="nav-item"
            :active="route.name === 'Reports'"
          >
            <q-item-section avatar class="q-px-none items-center">
              <q-icon name="warning" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Reports</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div>
          <q-item>
            <q-item-section avatar class="q-px-none items-center">
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label
                >{{ userInformation?.user.firstName }}
                {{ userInformation?.user.lastName }}</q-item-label
              >
              <!-- <q-item-label>{{
                userInformation.user.memberships
              }}</q-item-label> -->
            </q-item-section>
          </q-item>
          <q-item v-ripple clickable to="/settings" class="nav-item">
            <q-item-section avatar class="q-px-none items-center">
              <q-icon name="settings" />
            </q-item-section>
            <q-item-section>
              <q-item-label>CONFIG</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-ripple clickable class="nav-item" @click="logout">
            <q-item-section avatar class="q-px-none items-center">
              <q-icon name="power_settings_new" />
            </q-item-section>
            <q-item-section>
              <q-item-label>LOG OUT</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container style="overflow: hidden">
      <div
        class="bg-white q-ma-md"
        style="height: calc(100vh - 85px); border-radius: 1em"
      >
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
  import { useFusionAuthStore } from 'stores/auth-store';
  import { computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  const router = useRouter();
  const route = useRoute();
  const fusionAuthStore = useFusionAuthStore();
  const userInformation = computed(() => fusionAuthStore.getUserInfo);
  // const language = ref(true);

  async function logout(): Promise<void> {
    await fusionAuthStore.logoutUser();
    await router.push({ name: 'Login' });
  }
</script>

<style lang="scss">
  .nav-item {
    color: #5c7288;
    font-weight: 700;
    line-height: 16px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;

    &:hover {
      color: $primary;
    }
  }

  .title {
    font-size: 1.5em;
    font-weight: 700;
    line-height: 32px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    color: #313541;
  }
</style>
