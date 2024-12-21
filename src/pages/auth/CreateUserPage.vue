<template>
  <form-regular
    :form-body="inputForms.registerForm"
    @submit="registerHandler"
  />
</template>

<script setup lang="ts">
  import FormRegular from 'src/components/Form/FormRegular.vue';
  import { inputForms } from 'src/constants/form.constants';
  import { BodyForm } from 'src/models/form.models';

  function registerHandler(body: BodyForm): void {
    console.log(body);
  }
</script>

<style scoped></style>
