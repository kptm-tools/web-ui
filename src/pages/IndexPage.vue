<template>
  <div class="column-container">
    <div class="content-container">
      <div>
        <h1>Welcome to Changebank</h1>
        <p>Login or create a new account to get started</p>
        <button
          className="button-lg"
          style="cursor: pointer"
          @click="fusionAuth.login()"
        >
          Login
        </button>
        <br />
        <button
          className="button-redirect"
          style="cursor: pointer"
          @click="fusionAuth.register()"
        >
          Create a new account.
        </button>

        <a
          class="button-lg"
          style="cursor: pointer"
          @click="fusionAuth.logout()"
          >Logout</a
        >

        {{ userInfo }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFusionAuth, UserInfo } from '@fusionauth/vue-sdk';
import { onMounted, Ref, ref } from 'vue';

const fusionAuth = useFusionAuth();

const userInfo: Ref<UserInfo | undefined> = ref(undefined);

onMounted(async () => {
  userInfo.value = await fusionAuth.getUserInfo();
});
</script>
