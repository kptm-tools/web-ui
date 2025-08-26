<template>
  <div class="row q-col-gutter-xl q-pa-lg flex items-center module-selector bg-grey-8">
    <img src="../../../assets/logos/kriptone-logo.svg" alt="" class="logo" />
    <div class="col-6">
      <q-card class="card-selection" @click="vulnerabilityHandler">
        <q-card-title> Kriptome Tools </q-card-title>
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
  const accessAudits = computed(() => sessionStorage.getItem(AUTH_TOKEN_NAMES.AUDITS) || false);

  async function vulnerabilityHandler() {
    await router.push({ name: VULNERABILITY_ROUTES.home.name });
  }

  function auditsHandler() {
    if (accessAudits.value !== 'undefined') {
      console.info('AUDITS MODULE');
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

<style lang="scss" scoped>
  .module-selector {
    height: calc(100vh + 50px);
  }

  .logo {
    position: absolute;
    top: 10%;
    width: 300px;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
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
