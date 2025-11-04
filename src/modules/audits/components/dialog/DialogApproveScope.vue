<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" class="dialog-select-analyst">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h5">Aprobar Auditoria {{ audit }}</div>
      </q-card-section>

      <q-card-section>
        <div class="q-gutter-sm">
          <q-checkbox
            v-model="selection"
            :val="AuditFunction.ALCANCE_FUNCIONAL_GOBERNAR"
            label="Gobernar"
            color="primary"
          />
          <q-checkbox
            v-model="selection"
            :val="AuditFunction.ALCANCE_FUNCIONAL_IDENTIFICAR"
            label="Identificar"
            color="primary"
          />
          <q-checkbox
            v-model="selection"
            :val="AuditFunction.ALCANCE_FUNCIONAL_PROTEGER"
            label="Proteger"
            color="primary"
          />
          <q-checkbox
            v-model="selection"
            :val="AuditFunction.ALCANCE_FUNCIONAL_DETECTAR"
            label="Detectar"
            color="primary"
          />
          <q-checkbox
            v-model="selection"
            :val="AuditFunction.ALCANCE_FUNCIONAL_RESPONDER"
            label="Responder"
            color="primary"
          />
          <q-checkbox
            v-model="selection"
            :val="AuditFunction.ALCANCE_FUNCIONAL_RECUPERAR"
            label="Recuperar"
            color="green"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Cancelar" flat @click="onDialogCancel" />
        <q-btn color="primary" label="Asignar" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent, useQuasar } from 'quasar';
  import { ref } from 'vue';
  import { errorQuasarNotify } from 'src/utils';
  import { AuditFunction } from '../../enums/audits';

  defineProps({
    audit: {
      type: String
    }
  });

  defineEmits([...useDialogPluginComponent.emits]);

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
  const $q = useQuasar();

  const selection = ref<string[]>([]);

  function onOKClick() {
    try {
      $q.loading.show();
      onDialogOK(selection.value);
    } catch (err) {
      errorQuasarNotify(String(err));
    } finally {
      $q.loading.hide();
    }
  }
</script>

<style lang="scss">
  .dialog-select-analyst {
    .list-container {
      max-height: 200px;
      overflow-y: auto;
    }
  }
</style>
