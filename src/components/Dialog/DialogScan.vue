<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin full-width"
      style="max-width: 700px; width: 100%"
    >
      <q-card-section>
        <q-card-title class="text-h6">New Scan</q-card-title>
      </q-card-section>

      <q-card-section>
        <template v-for="host in hosts" :key="host.name">
          <div class="row">
            <div class="col-1">
              <q-checkbox v-model="host.picked" />
            </div>
            <div class="col-3">{{ host.domain }}</div>
            <div class="col-4">{{ host.ip }}</div>
            <div class="col-3">{{ host.name }}</div>
          </div>
        </template>
      </q-card-section>

      <q-card-actions>
        <q-btn type="submit" label="Scan" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from 'quasar';
  import { Host } from 'src/models/hosts.models';
  import { onMounted } from 'vue';

  defineEmits([...useDialogPluginComponent.emits]);

  const props = defineProps({
    hosts: {
      type: Array as () => Host[],
      required: true
    }
  });

  const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

  function submit() {
    onDialogOK(props.hosts.filter(host => host.picked));
  }

  onMounted(() => {
    props.hosts.map((host: Host) => {
      host.picked = false;
    });
  });
</script>
