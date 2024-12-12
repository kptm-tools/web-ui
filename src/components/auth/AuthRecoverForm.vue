<script lang="ts" setup>
  import { QForm } from 'quasar';
  import { ref, Ref } from 'vue';
  import { requiredRules } from 'src/utils/auth.utils';

  const userName: Ref<string> = ref('analyst@example.com');
  const recoverForm: Ref<QForm> = ref({} as QForm);

  const emit = defineEmits<{
    submit: [userName: string];
    cancel: [void];
  }>();

  async function onSubmit() {
    const valid = await recoverForm.value.validate();
    if (valid) {
      emit('submit', userName.value);
    }
  }
</script>

<template>
  <q-form ref="recoverForm" class="q-gutter-md" greedy @submit="onSubmit">
    <p class="text-h5">Recover Password</p>
    <q-input
      v-model="userName"
      :label="$t('auth.login.form.username.label')"
      :rules="requiredRules($t('auth.login.form.username.required'))"
      filled
      type="email"
    />

    <div class="flex justify-between">
      <q-btn
        :label="$t('auth.login.form.submit')"
        color="primary"
        type="submit"
      />

      <q-btn
        :label="$t('auth.login.form.cancel')"
        color="primary"
        flat
        @click="$emit('cancel')"
      />
    </div>
  </q-form>
</template>

<style scoped></style>
