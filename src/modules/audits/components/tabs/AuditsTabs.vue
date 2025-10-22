<template>
  <q-tabs
    dense
    active-color="primary"
    indicator-color="primary"
    align="justify"
    narrow-indicator
    v-model="tab"
  >
    <q-tab label="Evaluacion de Alcance" name="form" />
    <q-tab label="Funciones" name="funciones" />
    <q-tab label="Reporte" />
  </q-tabs>
</template>
<script setup lang="ts">
  const props = defineProps({
    step: {
      type: String,
      default: () => 'funciones'
    }
  });
  const tab = props.step;
</script>
