<template>
  <template v-if="isMounted">
    <Teleport :to="HEADER_ID">Auditor </Teleport>
  </template>

  <q-page>
    <template v-if="isFirstAudit">
      <div class="q-px-xl text-center">
        <h5 class="text-weight-medium text-center">PROCESO DE AUDITORIA</h5>
        <p class="q-px-xl text-justify">
          "Al iniciar el proceso de auditoría se solicitará información de su organización, tanto
          administrativa como tecnológica, por lo que es necesario tenga toda la información a la
          mano para completar un formulario de alcance que se le presentará a continuación si inicia
          el proceso de auditoría. Además, deberá también adjuntar un NDA para que Kriptome y su
          organización estén protegidos legalmente en cualquier caso de fuga de información"
        </p>

        <q-btn color="primary" no-caps label="Iniciar Auditoría"></q-btn>
      </div>
    </template>

    <template v-else>
      <div class="q-pa-md">
        <div class="row items-center q-mb-md">
          <q-btn disable label="Iniciar Auditoria" color="grey-5" text-color="black"></q-btn>
          <q-icon size="md" name="info" color="grey-5" v-ripple class="info-icon">
            <q-tooltip class="bg-white text-black" style="width: 180px; font-size: 0.8em">
              Para iniciar una auditoria debes contactarte a : <a>ejemplo@kriptome.com</a>
            </q-tooltip>
          </q-icon>
        </div>

        <q-table :rows="rows" :columns="columns" row-key="organizacion" />
      </div>
    </template>
  </q-page>
</template>

<script setup>
  import { HEADER_ID } from 'src/constants/idHtmlReference.constants';
  import { onMounted, ref } from 'vue';

  const isMounted = ref(false);
  const isFirstAudit = ref(true);

  const columns = [
    {
      name: 'organizacion',
      required: true,
      label: 'ORGANIZACION',
      align: 'left',
      field: 'organizacion',
      sortable: true
    },
    {
      name: 'area_auditada',
      align: 'center',
      label: 'AREA AUDITADA',
      field: 'area_auditada',
      sortable: true
    },
    {
      name: 'alcance_temporal',
      label: 'ALCANCE TEMPORAL',
      field: 'alcance_temporal',
      sortable: true
    },
    { name: 'estado', label: 'ESTADO', field: 'estado' },
    { name: 'actions', label: '', field: 'actions' }
  ];

  const rows = [
    {
      name: 'Frozen Yogurt',
      calories: 159,
      fat: 6.0,
      carbs: 24,
      protein: 4.0,
      sodium: 87,
      calcium: '14%',
      iron: '1%'
    }
  ];

  onMounted(() => {
    isMounted.value = true;
  });
</script>

<style lang="scss" scoped>
  .info-icon {
    cursor: pointer;
  }
</style>
