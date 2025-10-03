<template>
  <div class="container q-pa-md">
    <audits-tabs></audits-tabs>
    <template v-if="pickedView === ViewOptions.FUNCTION">
      <q-table
        flat
        title="Funciones"
        :rows="functionsRows"
        row-key="code"
        @row-click="selectCategoryView"
      />
    </template>

    <template v-else-if="pickedView === ViewOptions.CATEGORY">
      <q-table
        flat
        title="Categorias"
        :rows="categoryRows"
        row-key="code"
        @row-click="selectSubCategoryView"
      />
      <q-btn label="Atras" color="primary" class="q-my-md" @click="selectFunctionView"></q-btn>
    </template>

    <template v-else-if="pickedView === ViewOptions.SUBCATEGORY">
      <q-table flat title="Subcategorias" :rows="subCategoryRows" row-key="code" class="q-my-md" />
      <q-btn
        label="Atras"
        color="primary"
        class="q-my-md"
        @click="selectCategoryView(null, null, pickedCategoryIndex)"
      ></q-btn>
    </template>
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

  function selectCategoryView(event: Event | null, row: null, index: number): void {
    frameworkStore.pickFunctionIndex(index);
    pickedView.value = ViewOptions.CATEGORY;
  }

  function selectSubCategoryView(event: Event | null, row: null, index: number): void {
    frameworkStore.pickCategoryIndex(index);
    pickedView.value = ViewOptions.SUBCATEGORY;
  }

  onMounted(async () => {
    await frameworkStore.fetchStructure();
  });
</script>
