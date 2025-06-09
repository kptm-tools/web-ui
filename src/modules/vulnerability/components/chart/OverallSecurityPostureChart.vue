<template>
  <div class="relative-position" style="width: 350px">
    <div class="title">Overall Security Posture</div>
    <div class="subtitle" style="color: #5c7288">
      General security status of the clients environment
    </div>
    <apexchart :options="OVERALL_DONUT_OPTIONS" :series="[33, 33, 33]" type="donut"></apexchart>
    <img
      src="../../assets/needle.svg"
      width="40"
      alt="needle"
      class="needle"
      :style="{ transform: `rotate(${actualRotation}deg)` }"
    />
    <div class="porcentaje">
      {{ (dashboard?.overall_security_posture?.score * 100).toFixed(0) }}%
    </div>

    <div class="protection-score-variation">
      <span class="q-ma-none text">
        {{ (dashboard?.overall_security_posture?.variation * 100).toFixed(0) }}%
        <i class="fa-solid fa-caret-up q-mx-sm text-red"></i>
        Variation
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { iMainDashboard } from 'src/models/dashboard.models';
  import { ref, type Ref, watchEffect, type PropType } from 'vue';
  import { OVERALL_DONUT_OPTIONS } from 'src/constants/apexcharts.constants';

  const props = defineProps({
    dashboard: {
      type: Object as PropType<iMainDashboard>,
      required: true
    }
  });

  const actualRotation: Ref<number> = ref(0);

  watchEffect(() => {
    actualRotation.value = props.dashboard?.overall_security_posture?.score * 180;
  });
</script>

<style lang="scss" scoped>
  .protection {
    border-radius: 8px;
    background: #f6f7fc;
    padding: 0.5em 0em;

    &-score {
      font-size: 32px;
      font-weight: 800;
      line-height: 37.92px;
      letter-spacing: -0.02em;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }

    &-host {
      font-size: 16px;
      font-weight: 700;
      line-height: 24px;
      text-align: left;
      text-underline-position: from-font;
      text-decoration-skip-ink: none;
    }

    &-variation {
      color: #5c7288;
    }
  }

  .protection-score-variation {
    position: absolute;
    bottom: 70px;
    margin-left: auto;
    margin-right: auto;
    left: -20px;
    right: 0;
    width: fit-content;

    .text {
      color: #5c7288;
    }
  }

  .needle {
    position: absolute;
    bottom: 150px;
    left: 130px;
    transform-origin: center;
    transition: transform 0.5s ease-in-out;
  }

  .porcentaje {
    color: var(--text, #313541);
    text-align: center;
    font-family: Rubik;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 33.356px;
    /* 208.475% */
    position: absolute;
    bottom: 160px;
    margin-left: auto;
    margin-right: auto;
    left: -40px;
    right: 0;
  }

  .label-table {
    color: var(--text, #313541);
    font-size: 0.8em;
  }
</style>
