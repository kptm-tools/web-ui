<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="max-width: 80vw; width: 100%">
      <q-card-section class="q-my-md">
        <div class="text-h5">{{ subCategoryDetail?.code }} : {{ subCategoryDetail?.name }}</div>
        <div>{{ subCategoryDetail?.description }}</div>
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-7">
            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
            >
              <q-tab name="implement" label="Implementacion" />
              <q-tab name="evidence" label="Evidencia" />
            </q-tabs>

            <q-separator />

            <q-tab-panels v-model="tab" animated>
              <q-tab-panel name="implement">
                <table class="evidence-table">
                  <thead>
                    <tr>
                      <th>Detalles de Implementacion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(implement, index) in subCategoryDetail?.implementation_details"
                      :key="implement || index"
                    >
                      <td class="evidence-name-cell">{{ implement }}</td>
                    </tr>
                  </tbody>
                </table>
              </q-tab-panel>

              <q-tab-panel name="evidence">
                <table class="evidence-table">
                  <thead>
                    <tr>
                      <th>Ejemplo de Evidencia</th>
                      <th>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(evidence, index) in subCategoryDetail?.evidence_examples"
                      :key="evidence.name || index"
                    >
                      <td class="evidence-name-cell">{{ evidence.name }}</td>
                      <td>{{ evidence.detail }}</td>
                    </tr>
                  </tbody>
                </table>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <q-separator vertical class="q-mx-md"></q-separator>
          <div class="col-4">
            <q-btn color="primary" label="Adjuntar Evidencia"></q-btn>

            <div class="q-my-md">
              <div class="q-mb-md text-weight-bold">Observaciones</div>
              <q-input v-model="comment" type="textarea" outlined rounded />
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="Guardar" flat @click="onDialogCancel" />
        <q-btn color="primary" label="Finalizar" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from 'quasar';
  import { ref, type PropType } from 'vue';
  import { type SubCategoryDetail } from '../../models/framework';

  defineProps({
    subCategoryDetail: {
      type: Object as PropType<SubCategoryDetail>
    }
  });

  defineEmits([...useDialogPluginComponent.emits]);

  const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
  const tab = ref('implement');
  const comment = ref('');

  function onOKClick() {
    onDialogOK();
  }
</script>

<style lang="scss" scoped>
  .evidence-table {
    width: 100%;
    border-collapse: collapse;
    font-family: sans-serif;
    color: #333;
    border: 1px solid #ccc;

    th,
    td {
      padding: 10px 15px;
      text-align: left;
      border: 1px solid #ddd;
    }
  }

  .evidence-table thead {
    background-color: #f5f5f5;
    border-bottom: 2px solid #ddd;
  }

  .evidence-table tbody tr:nth-child(even) {
    background-color: #fafafa;
  }

  .evidence-name-cell {
    font-weight: 500;
    color: #2c3e50;
  }
</style>
