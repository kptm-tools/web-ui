<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin full-width">
      <q-card-section class="text-h6">
        <q-card-title class="text-h6">Edit Host</q-card-title>
      </q-card-section>
      <q-card-section> 'editForm'</q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
  import { useDialogPluginComponent } from 'quasar';
  import { Host } from 'src/models/hosts.models';
  import { onMounted } from 'vue';

  defineEmits([...useDialogPluginComponent.emits]);

  const props = defineProps({
    host: {
      type: Object as () => Host,
      required: true
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  // dialogRef      - Vue ref to be applied to QDialog
  // onDialogHide   - Function to be used as handler for @hide on QDialog
  // onDialogOK     - Function to call to settle dialog with "ok" outcome
  //                    example: onDialogOK() - no payload
  //                    example: onDialogOK({ /*...*/ }) - with payload
  // onDialogCancel - Function to call to settle dialog with "cancel" outcome

  // this is part of our example (so not required)
  // function onOKClick() {
  //   // on OK, it is REQUIRED to
  //   // call onDialogOK (with optional payload)
  //   onDialogOK();
  //   // or with payload: onDialogOK({ ... })
  //   // ...and it will also hide the dialog automatically
  // }

  onMounted(() => {
    console.log(props.host);
  });
</script>
