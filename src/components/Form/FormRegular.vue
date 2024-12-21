<template>
  <q-form ref="form" class="q-gutter-md" greedy @submit="onSubmit">
    <p v-if="props.formBody.title" class="text-h5">
      {{ $t(props.formBody.title) }}
    </p>

    <template v-for="input in props.formBody.inputs" :key="input.key">
      <q-input
        v-model="bodyForm[input.key]"
        :label="$t(input.label)"
        :rules="
          input.required ? requiredRules($t(input.requiredMessage || '')) : []
        "
        :type="input.type || 'text'"
        filled
        dense
      />
    </template>

    <div class="flex justify-between">
      <template v-if="props.formBody.secondaryText">
        <q-btn
          :label="$t(props.formBody.secondaryText || '')"
          color="primary"
          flat
          @click="$emit('secondary-button')"
        />
      </template>

      <q-btn
        :label="$t(props.formBody.submitText)"
        color="primary"
        type="submit"
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
  import { QForm } from 'quasar';
  import { reactive, Reactive, ref, Ref } from 'vue';
  import { requiredRules } from 'src/utils/auth.utils';
  import { BodyForm, FormContainerBody } from 'src/models/form.models';

  const props = defineProps<{
    formBody: FormContainerBody;
  }>();

  const emit = defineEmits<{
    submit: [body: BodyForm];
    'secondary-button': [void];
  }>();

  const bodyForm: Reactive<BodyForm> = reactive({} as BodyForm);
  const form: Ref<QForm> = ref({} as QForm);

  async function onSubmit() {
    const valid = await form.value.validate();
    if (valid) {
      emit('submit', bodyForm);
    }
  }
</script>

<style scoped></style>
