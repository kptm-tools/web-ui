<template>
  <q-chip
    v-if="severity.critical"
    :label="severity.critical"
    color="red"
    square
    text-color="white"
  />
  <q-chip
    v-if="severity.high"
    color="amber-10"
    :label="severity.high"
    square
    text-color="white"
  />
  <q-chip
    v-if="severity.medium"
    color="warning"
    :label="severity.medium"
    square
    text-color="white"
  />
  <q-chip
    v-if="severity.low"
    color="positive"
    :label="severity.low"
    square
    text-color="white"
  />
</template>

<script setup lang="ts">

defineProps({
  severity: {
    type: Object,
    required: true
  }
})


</script>
