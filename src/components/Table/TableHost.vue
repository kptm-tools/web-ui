<template>
  <q-btn
    label="New Host"
    color="primary"
    class="q-mb-md"
    @click="addHost"
  ></q-btn>
  <div style="height: 80vh; overflow-y: auto">
    <table-regular
      :actions="['edit', 'delete']"
      :columns="columns"
      :rows="rows"
      @action="handlerEmitter($event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { QTableColumn, useQuasar } from 'quasar';
  import TableRegular from './TableRegular.vue';
  import DialogHost from '../Dialog/DialogHost.vue';
  import DialogEditHost from '../Dialog/DialogEditHost.vue';

  const props = defineProps<{
    rows: Record<string, unknown>[];
  }>();

  const emits = defineEmits(['refreshTable', 'action']);

  const $q = useQuasar();

  const columns: QTableColumn[] = [
    {
      name: 'Domain',
      label: 'Domain',
      align: 'left',
      field: 'domain'
    },
    {
      name: 'IP',
      label: 'Ip',
      align: 'left',
      field: 'ip'
    },
    {
      name: 'Host Name',
      label: 'HostName',
      align: 'left',
      field: 'hostName'
    },
    {
      name: 'Creation Date',
      label: 'CreationDate',
      align: 'left',
      field: 'creationDate'
    },
    {
      name: 'Email',
      label: 'Email',
      align: 'left',
      field: 'email'
    }
  ];

  function addHost(): void {
    $q.dialog({
      component: DialogHost,
      componentProps: {
        hosts: props.rows
      }
    })
      .onOk(() => {
        emits('refreshTable');
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        console.log('Called on OK or Cancel');
      });
  }

  function editHost(col: unknown): void {
    $q.dialog({
      component: DialogEditHost,
      componentProps: {
        host: col
      }
    })
      .onOk(() => {
        emits('refreshTable');
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        console.log('Called on OK or Cancel');
      });
  }

  function handlerEmitter(action: unknown): void {
    const actionType = action as { action: string; col: unknown };
    if (actionType.action === 'edit') {
      console.log(props.rows);
      editHost(actionType.col);
    } else {
      emits('action', action);
    }
  }
</script>

<style scoped></style>
