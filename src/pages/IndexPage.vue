<template>
  <div class="content-container q-pa-md">
    <div class="text-center q-mb-md">
      <q-btn color="primary" @click="logout">Logout</q-btn>
    </div>

    <table
      v-if="userInformation"
      border="1"
      cellpadding="8"
      style="max-width: 800px; margin: 0 auto; overflow: hidden"
    >
      <thead>
        <tr>
          <th>Field</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value, key) in userInformation" :key="key">
          <td>{{ key }}</td>
          <td>
            <pre v-if="typeof value === 'object'">{{
              JSON.stringify(value, null, 2)
            }}</pre>
            <span
              v-else
              style="
                max-width: 200px;
                white-space: pre-wrap;
                word-break: break-word;
              "
              >{{ value }}</span
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { useFusionAuthStore } from 'stores/auth-store';
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';

  const fusionAuthStore = useFusionAuthStore();
  const userInformation = computed(() => fusionAuthStore.getUserInfo);
  const router = useRouter();

  async function logout(): Promise<void> {
    await fusionAuthStore.logoutUser();
    await router.push('/login');
  }
</script>
