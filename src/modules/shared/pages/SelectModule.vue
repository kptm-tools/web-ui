<template>
  <div class="row q-col-gutter-xl q-pa-lg flex items-center module-selector bg-grey-8">
    <img src="../../../assets/logos/kriptome-logo.svg" alt="" class="logo" />
    <div class="col-6">
      <q-card class="card-selection" @click="vulnerabilityHandler">
        <q-card-title> Vulnerability Scanner </q-card-title>
      </q-card>
    </div>
    <div class="col-6">
      <q-card class="card-selection border" @click="auditsHandler">
        <q-card-title> Cybersecurity Framework Assessment </q-card-title>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { VULNERABILITY_ROUTES } from 'vulnerability/routes/route-names';
import { AUDITS_ROUTES } from 'src/modules/audits/routes/route-names';
import { SHARED_ROUTES } from '../routes/route-names';

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

// Watch for query param changes to show notification when router guard blocks access
watch(
  () => route.query.reason,
  async (reason) => {
    if (reason === 'feature-disabled') {
      $q.notify({
        type: 'warning',
        message: 'Acceso no disponible',
        caption: 'El módulo de auditoría está actualmente deshabilitado.',
        icon: 'lock',
        position: 'top',
        timeout: 3000
      });

      // Clean up query param
      await router.replace({
        name: SHARED_ROUTES.selectModule.name,
        query: {}
      });
    }
  },
  { immediate: true } // Run on mount as well as when query changes
);

async function vulnerabilityHandler() {
  await router.push({ name: VULNERABILITY_ROUTES.home.name });
}

async function auditsHandler() {
  // Always attempt navigation - router guard will block and show notify if needed
  await router.push({ name: AUDITS_ROUTES.home.name });
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
