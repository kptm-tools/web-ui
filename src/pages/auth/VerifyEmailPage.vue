<template>
  <div>
    <p v-if="loading">Verifying your email...</p>
    <p v-else-if="errorMessage" style="color: red;">{{errorMessage}}</p>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { AxiosError } from 'axios';
import { useRouter, useRoute } from 'vue-router';
import { UserService } from 'src/services/user.service';
import { errorQuasarNotify, successQuasarNotify } from 'src/utils';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const errorMessage = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;
  const verificationId = route.query.verificationId as string | undefined;
  const tenantId = route.query.tenantId as string | undefined;

  if (!verificationId || !tenantId) {
    errorMessage.value = 'Invalid verification link. Missing parameters.'
    loading.value = false;
    return
  }

  try {
    await UserService.verifyEmail(verificationId, tenantId);

    successQuasarNotify('Email was verified successfully.')
    await new Promise(resolve => setTimeout(resolve, 1000));
    loading.value = false;
    router.push({ name: 'Login' });
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorData = axiosError.response?.data as {error?: string } | undefined;
    if (errorData?.error) {
      errorMessage.value = errorData.error;
      errorQuasarNotify(errorData.error);
    } else {
      errorQuasarNotify('An unexpected error occurred.');
      console.error('Error details:', error);
    }

  }
})

</script>
