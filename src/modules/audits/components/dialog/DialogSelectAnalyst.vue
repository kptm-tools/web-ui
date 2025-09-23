<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h5">Asignar Analista a {{ audit }}</div>
      </q-card-section>

      <q-card-section>
        <p>Seleccionar Analista</p>
        <q-list bordered separator style="max-height: 200px; overflow-y: auto">
          <template v-for="analyst in analysts" :key="analyst.id">
            <q-item
              clickable
              v-ripple
              @click="selectAnalyst(analyst.id)"
              :active="analyst.id == pickedAnalyst"
            >
              <q-item-section> {{ analyst.display_name }} Auditorias</q-item-section>
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

<script setup>
  import { useDialogPluginComponent, useQuasar } from 'quasar';
  import { ref } from 'vue';
  import { AdminService } from '../../services/admin';
  import { errorQuasarNotify } from 'src/utils';

  const props = defineProps({
    audit: {
      type: String
    },
    id: {
      type: String
    },
    analysts: {
      type: Array
    }
  });

  defineEmits([...useDialogPluginComponent.emits]);

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
  const pickedAnalyst = ref(0);
  const $q = useQuasar();

  function selectAnalyst(id) {
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
