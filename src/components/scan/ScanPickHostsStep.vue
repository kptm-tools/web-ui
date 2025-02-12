<template>
  <template v-if="showTable">
    <q-card-section>
      <q-table
        v-model:selected="pickedHosts"
        flat
        bordered
        :rows="hosts"
        :columns="columns"
        row-key="name"
        selection="multiple"
      />
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        type="submit"
        label="Save"
        color="primary"
        size="md"
        @click="showTable = false"
      />
    </q-card-actions>
  </template>
  <template v-else>
    <q-card-section>
      <div class="row">
        <div class="col-auto flex items-center q-pr-md">HOST</div>
        <div class="col">
          <q-select
            v-model="pickedHosts"
            filled
            multiple
            dense
            :options="hosts"
            use-chips
            stack-label
            option-label="domain"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn
        label="Select host"
        color="primary"
        size="md"
        flat
        @click="showTable = true"
      />

      <q-btn
        type="submit"
        label="Next"
        color="primary"
        size="md"
        @click="submitHosts"
      />
    </q-card-actions>
  </template>
</template>

<script setup lang="ts">
  import { QTableColumn } from 'quasar';
  import { Host } from 'src/models';
  import { Ref, ref, toValue } from 'vue';

  defineProps({
    hosts: {
      type: Array as () => Host[],
      required: true
    }
  });

  const emit = defineEmits(['submitHosts']);

  const columns: QTableColumn[] = [
    {
      name: 'name',
      align: 'center',
      label: 'Name',
      field: 'name',
      sortable: true
    },
    {
      name: 'domain',
      align: 'left',
      label: 'Domain',
      field: 'domain',
      sortable: true
    }
  ];

  const pickedHosts: Ref<Array<Host>> = ref([]);
  const showTable: Ref<boolean> = ref(false);

  function submitHosts(): void {
    emit('submitHosts', toValue(pickedHosts));
  }
</script>
