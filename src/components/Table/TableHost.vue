<template>
  <q-btn label="New Host" color="primary" class="q-mb-md" @click="addHost"></q-btn>
  <div class="table-container">
    <table-regular
      :actions="HOST_TABLE_ACTIONS"
      :columns="HOST_TABLE_COLUMNS"
      :rows="rows"
      @action="handlerEmitter($event)"
    />
  </div>
</template>

<script setup lang="ts">
  import { useQuasar } from 'quasar';
  import { TableRegular, DialogEditHost, DialogHost } from 'src/components';
  import { HostService } from 'src/services';
  import { type HostCreateBody } from 'src/models';
  import { HOST_TABLE_ACTIONS, HOST_TABLE_COLUMNS } from 'src/constants/table.constants';

  const props = defineProps<{
    rows: Record<string, unknown>[];
  }>();

  const emits = defineEmits(['refreshTable', 'action']);

  const $q = useQuasar();

  function addHost(): void {
    $q.dialog({
      component: DialogHost,
      componentProps: {
        hosts: props.rows
      }
    }).onOk(() => {
      emits('refreshTable');
    });
  }

  async function editHostHandler(col: unknown): Promise<void> {
    const hostId = (col as { id: string }).id;
    const host = (await HostService.getHostById(hostId)).data;
    $q.dialog({
      component: DialogEditHost,
      componentProps: {
        host
      }
    }).onOk((hostForm: HostCreateBody) => {
      HostService.editHost(hostId, hostForm)
        .then(() => {
          emits('refreshTable');
        })
        .catch(err => new Error(err));
    });
  }

  async function handlerEmitter(action: unknown): Promise<void> {
    const actionType = action as { action: string; col: unknown };
    if (actionType.action === 'edit') {
      await editHostHandler(actionType.col);
    } else {
      emits('action', action);
    }
  }
</script>

<style lang="scss" scoped>
  .table-container {
    height: 80vh;
    overflow-y: auto;
  }
</style>
