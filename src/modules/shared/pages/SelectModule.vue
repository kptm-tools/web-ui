<template>
  <div class="row q-col-gutter-xl q-pa-lg flex items-center module-selector bg-grey-8">
    <div class="col-6">
      <q-card class="card-selection" @click="vulnerabilityHandler">
        <q-card-title> Kriptone Tools </q-card-title>
      </q-card>
    </div>
    <div class="col-6">
      <q-card class="card-selection border" @click="auditsHandler">
        <q-card-title> Audits </q-card-title>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useQuasar } from 'quasar';
  import { AUTH_TOKEN_NAMES } from 'src/constants/fusion-auth.constants';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { VULNERABILITY_ROUTES } from 'vulnerability/routes/route-names';

  const $q = useQuasar();
  const router = useRouter();
  const accessAudits = computed(() => sessionStorage.getItem(AUTH_TOKEN_NAMES.AUDITS));

  async function vulnerabilityHandler() {
    await router.push({ name: VULNERABILITY_ROUTES.home.name });
  }

  async function auditsHandler() {
    if (accessAudits.value) {
      await router.push({ name: VULNERABILITY_ROUTES.home.name });
    } else {
      $q.dialog({
        html: true,
        message:
          'Para acceder al modulo de auditoria debe contactarse con <a href="url">test@kriptone.com</a>',
        ok: false
      });
    }
  }
</script>

<style lang="scss">
  .module-selector {
    height: calc(100vh + 50px);
  }

  .card-selection {
    min-height: 200px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 2em;
    transition:
      box-shadow 0.3s ease-in-out,
      transform 0.3s ease-in-out;
    border: 1px solid transparent;

    &:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.8);
      transform: translateY(-5px);
    }
  }
</style>
