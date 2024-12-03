<template>
  <q-form ref="loginForm" class="q-gutter-md" greedy @submit="onSubmit">
    <q-input
      v-model="userName"
      :label="$t('auth.login.form.username.label')"
      :rules="requiredRules($t('auth.login.form.username.required'))"
      filled
    />

    <q-input
      v-model="password"
      :label="$t('auth.login.form.password.label')"
      :rules="requiredRules($t('auth.login.form.password.required'))"
      filled
    />

    <q-input
      v-model="appId"
      :label="$t('auth.login.form.applicationId.label')"
      :rules="requiredRules($t('auth.login.form.applicationId.required'))"
      filled
    />

    <div>
      <q-btn color="primary" label="Submit" type="submit" />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
  import { QForm, ValidationRule } from 'quasar';
  import { ref, Ref } from 'vue';
  import { FusionAuthLoginBody } from 'src/models/fusion-auth.models';

  const emit = defineEmits<{
    'login-submit': [body: FusionAuthLoginBody];
  }>();

  const userName: Ref<string> = ref('analyst@example.com');
  const password: Ref<string> = ref('password');
  const appId: Ref<string> = ref('31dd1baa-fc82-42ff-8e0b-5c522bb3d70c');
  const loginForm: Ref<QForm> = ref({} as QForm);

  function requiredRules(message: string) {
    return [(val: ValidationRule) => !!val || message];
  }

  async function onSubmit() {
    const valid = await loginForm.value.validate();
    let loginUserBody: FusionAuthLoginBody = {} as FusionAuthLoginBody;
    if (valid) {
      loginUserBody = {
        loginId: userName.value,
        password: password.value,
        applicationId: appId.value
      };
      emit('login-submit', loginUserBody);
    }
  }
</script>

<style scoped></style>
