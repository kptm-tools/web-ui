<template>
  <q-form ref="loginForm" class="q-gutter-md" greedy @submit="onSubmit">
    <p class="text-h5">Login</p>
    <q-input
      v-model="appId"
      :label="$t('auth.login.form.applicationId.label')"
      :rules="requiredRules($t('auth.login.form.applicationId.required'))"
      filled
      ty
    />
    <q-input
      v-model="userName"
      type="email"
      :label="$t('auth.login.form.username.label')"
      :rules="requiredRules($t('auth.login.form.username.required'))"
      filled
    />

    <q-input
      v-model="password"
      type="password"
      :label="$t('auth.login.form.password.label')"
      :rules="requiredRules($t('auth.login.form.password.required'))"
      filled
    />

    <div class="flex justify-between">
      <q-btn
        :label="$t('auth.login.form.submit')"
        color="primary"
        type="submit"
      />
      <q-btn
        :label="$t('auth.login.form.forgotPassword')"
        color="primary"
        flat
        @click="$emit('go-recover')"
      />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
  import { QForm } from 'quasar';
  import { ref, Ref } from 'vue';
  import { FusionAuthLoginBody } from 'src/models/fusion-auth.models';
  import { requiredRules } from 'src/utils/auth.utils';

  const emit = defineEmits<{
    submit: [body: FusionAuthLoginBody];
    'go-recover': [void];
  }>();
  const userName: Ref<string> = ref('analyst@example.com');
  const password: Ref<string> = ref('password');
  const appId: Ref<string> = ref('34001826-67e6-4d18-bad4-2c01ff17d1ec');
  const loginForm: Ref<QForm> = ref({} as QForm);

  async function onSubmit() {
    const valid = await loginForm.value.validate();
    let loginUserBody: FusionAuthLoginBody = {} as FusionAuthLoginBody;
    if (valid) {
      loginUserBody = {
        loginId: userName.value,
        password: password.value,
        applicationId: appId.value
      };
      emit('submit', loginUserBody);
    }
  }
</script>

<style scoped></style>
