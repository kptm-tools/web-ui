<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" class="dialog-select-analyst">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h5">Asignar Analista a {{ audit }}</div>
      </q-card-section>

      <q-card-section>
        <p>Seleccionar Analista</p>
        <q-list bordered separator class="list-container">
          <template v-for="analyst in analysts" :key="analyst.id">
            <q-item
              class="analyst-item"
              clickable
              v-ripple
              @click="selectAnalyst(analyst.id)"
              :active="analyst.id == pickedAnalyst"
            >
              <q-item-section>
                {{ analyst.display_name }} (
                {{ analyst.workload.active_audits }} Auditorias)</q-item-section
              >
            </q-item>
          </template>
        </q-list>
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
  import { type PropType, type Ref, ref } from 'vue';
  import { AdminService } from '../../services/admin';
  import { errorQuasarNotify } from 'src/utils';
  import type { AvailableAnalyst } from '../../models/admin';

  const props = defineProps({
    audit: {
      type: String
    },
    id: {
      type: String,
      required: true
    },
    analysts: {
      type: Array as PropType<AvailableAnalyst[]>
    }
  });

  defineEmits([...useDialogPluginComponent.emits]);

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
  const pickedAnalyst: Ref<string> = ref('');
  const $q = useQuasar();

  function selectAnalyst(id: string) {
    pickedAnalyst.value = id;
  }

  async function onOKClick() {
    try {
      $q.loading.show();
      await AdminService.postAssignAnalystAudit(props.id, { analyst_user_id: pickedAnalyst.value });
      onDialogOK();
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
