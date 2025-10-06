<template>
  <div class="container q-pa-md">
    <audits-tabs></audits-tabs>
    <div class="table-container q-mt-md">
      <template v-if="pickedView === ViewOptions.FUNCTION">
        <div class="row q-pa-md text-weight-bold border-bottom border-red">
          <div class="col-3 flex items-center">Codigo</div>
          <div class="col-3 flex items-center">Nombre</div>
          <div class="col-3 flex items-center">Descripcion</div>
          <div class="col-3"></div>
        </div>

        <q-card
          v-for="(row, index) in functionsRows"
          :key="row.code"
          class="row q-pa-md table-function-card q-my-md bg-grey-2 cursor-pointer"
          @click="selectCategoryView(index)"
        >
          <div class="col-3 flex items-center">{{ row.code }}</div>
          <div class="col-3 flex items-center">{{ row.name }}</div>
          <div class="col-3 flex items-center">{{ row.description }}</div>
          <div class="col-3 flex items-center justify-center">
            <q-btn icon="chevron_right" flat></q-btn>
          </div>
        </q-card>
      </template>

      <template v-else-if="pickedView === ViewOptions.CATEGORY">
        <div class="row q-pa-md text-weight-bold border-bottom border-red">
          <div class="col-3 flex items-center">Codigo</div>
          <div class="col-3 flex items-center">Nombre</div>
          <div class="col-3 flex items-center">Descripcion</div>
          <div class="col-3"></div>
        </div>

        <q-card
          v-for="(row, index) in categoryRows"
          :key="row.code"
          class="row q-pa-md table-function-card q-my-md bg-grey-2 cursor-pointer"
          @click="selectSubCategoryView(index)"
        >
          <div class="col-3 flex items-center">{{ row.code }}</div>
          <div class="col-3 flex items-center">{{ row.name }}</div>
          <div class="col-3 flex items-center">{{ row.description }}</div>
          <div class="col-3 flex items-center justify-center">
            <q-btn icon="chevron_right" flat></q-btn>
          </div>
        </q-card>
        <q-btn label="Atras" color="primary" class="q-my-md" @click="selectFunctionView"></q-btn>
      </template>

      <template v-else-if="pickedView === ViewOptions.SUBCATEGORY">
        <div class="row q-pa-md text-weight-bold border-bottom border-red">
          <div class="col-3 flex items-center">ID</div>
          <div class="col-3 flex items-center">Codigo</div>
          <div class="col-3 flex items-center">Descripcion</div>
          <div class="col-3 flex items-center"></div>
        </div>

        <q-card
          v-for="row in subCategoryRows"
          :key="row.code"
          class="row q-pa-md table-function-card q-my-md bg-grey-2 cursor-pointer"
        >
          <div class="col-3 flex items-center">{{ row.id }}</div>
          <div class="col-3 flex items-center">{{ row.code }}</div>
          <div class="col-3 flex items-center">{{ row.description }}</div>
          <div class="col-3 flex items-center justify-center">
            <q-btn icon="chevron_right" flat></q-btn>
          </div>
        </q-card>

        <q-btn
          label="Atras"
          color="primary"
          class="q-my-md"
          @click="selectCategoryView(pickedCategoryIndex)"
        ></q-btn>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, type Ref } from 'vue';
  import { useFrameworkStore } from '../stores/framework';
  import AuditsTabs from '../components/tabs/AuditsTabs.vue';

  enum ViewOptions {
    FUNCTION = 'function',
    CATEGORY = 'category',
    SUBCATEGORY = 'subcategory'
  }

  const frameworkStore = useFrameworkStore();
  const pickedView: Ref<ViewOptions> = ref(ViewOptions.FUNCTION);
  const functionsRows = computed(() => frameworkStore.currentStructureFunctions);
  const categoryRows = computed(() => frameworkStore.currentStructureCategories);
  const subCategoryRows = computed(() => frameworkStore.currentStructureSubcategories);
  const pickedCategoryIndex = computed(() => frameworkStore.currentCategoryIndex);

  function selectFunctionView(): void {
    frameworkStore.clearPickedFunctionAndCategoryIndex();
    pickedView.value = ViewOptions.FUNCTION;
  }

  function selectCategoryView(index: number): void {
    frameworkStore.pickFunctionIndex(index);
    pickedView.value = ViewOptions.CATEGORY;
  }

  function selectSubCategoryView(index: number): void {
    frameworkStore.pickCategoryIndex(index);
    pickedView.value = ViewOptions.SUBCATEGORY;
  }

  onMounted(async () => {
    await frameworkStore.fetchStructure();
  });
</script>

<style lang="scss">
  .table-function-card {
    border: 1px solid rgba(30, 30, 48, 0.397);
  }
</style>
